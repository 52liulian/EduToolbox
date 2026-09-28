/* ============================================================
 * quiet-meter.js
 * 课堂安静值检测器 - 核心逻辑
 * 纯前端 IIFE 模块，无外部依赖，file:// 协议兼容
 * 主要能力：
 *   1. getUserMedia + Web Audio API 实时采集麦克风音量
 *   2. 将 RMS 音量换算为 dB 与 0-100 安静值
 *   3. SVG 圆环可视化（绿→黄→红 渐变）
 *   4. 状态文字：非常安静 / 较为安静 / 有些吵闹 / 非常吵闹
 *   5. 每 5 秒自动采样记录到表格
 *   6. CSV 导出
 *   7. Fullscreen API 沉浸投影模式
 * ============================================================ */
(function () {
    "use strict";

    /* ---------- 1. 常量与配置 ---------- */

    /**
     * 圆环周长（半径 98 的圆周长，与 CSS 中保持一致）
     * @type {number}
     */
    var RING_CIRCUMFERENCE = 2 * Math.PI * 98;

    /**
     * 每 5 秒进行一次采样记录（与原版一致）
     * @type {number}
     */
    var SAMPLE_INTERVAL_MS = 5000;

    /**
     * 安静值分档阈值（数值越大越安静）
     * quietLevel >= 80 : 非常安静
     * 60 <= quietLevel < 80 : 较为安静
     * 40 <= quietLevel < 60 : 有些吵闹
     * quietLevel < 40 : 非常吵闹
     * @enum {Object.<string, {min:number, label:string, cls:string, color:string}>}
     */
    var LEVEL_MAP = [
        { min: 80, label: "非常安静", cls: "quiet", color: "#10b981" },
        { min: 60, label: "较为安静", cls: "calm", color: "#84cc16" },
        { min: 40, label: "有些吵闹", cls: "loud", color: "#f59e0b" },
        { min: 0, label: "非常吵闹", cls: "noisy", color: "#ef4444" }
    ];

    /* ---------- 2. DOM 元素引用 ---------- */

    /**
     * 缓存所有需要操作的 DOM 节点
     * @type {Object.<string, HTMLElement>}
     */
    var dom = {
        sensitivity: document.getElementById("sensitivity"),
        sensitivityValue: document.getElementById("sensitivityValue"),
        threshold: document.getElementById("threshold"),
        thresholdValue: document.getElementById("thresholdValue"),
        toggleBtn: document.getElementById("toggleBtn"),
        toggleIcon: document.getElementById("toggleIcon"),
        toggleText: document.getElementById("toggleText"),
        exportBtn: document.getElementById("exportBtn"),
        toolBox: document.getElementById("toolBox"),
        ringProgress: document.getElementById("ringProgress"),
        meterNumber: document.getElementById("meterNumber"),
        meterDb: document.getElementById("meterDb"),
        meterStatus: document.getElementById("meterStatus"),
        meterHint: document.getElementById("meterHint"),
        recordsBody: document.getElementById("recordsBody"),
        recordsEmpty: document.getElementById("recordsEmpty"),
        recordsCount: document.getElementById("recordsCount")
    };

    /* ---------- 3. 运行时状态 ---------- */

    /**
     * 全局运行时状态
     * @type {{
     *   isRunning: boolean,        是否正在检测
     *   audioContext: AudioContext|null,  Web Audio 上下文
     *   analyser: AnalyserNode|null,      频率分析节点
     *   mediaStream: MediaStream|null,    麦克风媒体流
     *   freqData: Uint8Array|null,        频域数据缓冲
     *   rafId: number,                    requestAnimationFrame 句柄
     *   sampleTimerId: number,            5 秒采样定时器句柄
     *   records: Array<Object>,           历史采样记录
     *   currentDb: number,                当前实时 dB
     *   currentQuiet: number,             当前实时安静值
     *   sampleAccum: {sum:number, max:number, count:number}  当前 5 秒窗口累加器
     * }}
     */
    var state = {
        isRunning: false,
        audioContext: null,
        analyser: null,
        mediaStream: null,
        freqData: null,
        rafId: 0,
        sampleTimerId: 0,
        records: [],
        currentDb: 0,
        currentQuiet: 100,
        sampleAccum: { sum: 0, max: 0, count: 0 }
    };

    /* ---------- 4. 工具函数 ---------- */

    /**
     * 根据安静值返回对应的状态档位
     * @param {number} quietLevel - 0-100 安静值
     * @returns {{min:number,label:string,cls:string,color:string}}
     */
    function getLevel(quietLevel) {
        var i;
        for (i = 0; i < LEVEL_MAP.length; i++) {
            if (quietLevel >= LEVEL_MAP[i].min) {
                return LEVEL_MAP[i];
            }
        }
        // 兜底返回最低档
        return LEVEL_MAP[LEVEL_MAP.length - 1];
    }

    /**
     * 根据安静值在绿→黄→红之间插值颜色
     * 100 -> #10b981(绿) ；50 -> #f59e0b(橙) ；0 -> #ef4444(红)
     * @param {number} quietLevel - 0-100
     * @returns {string} hex 颜色字符串
     */
    function lerpColor(quietLevel) {
        var q = Math.max(0, Math.min(100, quietLevel));
        var c1, c2, t;
        // 100 -> 50：绿(#10b981) -> 橙(#f59e0b)
        var green = [16, 185, 129];
        var orange = [245, 158, 11];
        var red = [239, 68, 68];
        var r, g, b;
        if (q >= 50) {
            t = (100 - q) / 50; // 0 -> 绿；1 -> 橙
            c1 = green;
            c2 = orange;
        } else {
            t = (50 - q) / 50; // 0 -> 橙；1 -> 红
            c1 = orange;
            c2 = red;
        }
        r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
        g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
        b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    /**
     * 将 RMS（0~1）换算为 dB（约 0~100，简化模型）
     * @param {number} rms - 音量 RMS，范围 0-1
     * @param {number} sensitivity - 灵敏度 1-10
     * @returns {number} dB 数值（0-100 区间）
     */
    function rmsToDb(rms, sensitivity) {
        if (rms <= 0) {
            return 0;
        }
        // 标准 dBFS 转 SPL 简化：20 * log10(rms) + 90 + 灵敏度增益
        var db = 20 * Math.log10(rms) + 90 + (sensitivity - 5) * 3;
        return Math.max(0, Math.min(100, db));
    }

    /**
     * 将 dB 转换为 0-100 安静值（dB 越高表示越吵，安静值越低）
     * @param {number} db - 0-100 dB 值
     * @param {number} sensitivity - 灵敏度 1-10，越大对噪声越敏感
     * @returns {number} 安静值 0-100
     */
    function dbToQuietValue(db, sensitivity) {
        // 安静值 = 100 - db
        // 灵敏度越高，对噪声越敏感（同 db 下安静值更低）
        var adjusted = db + (sensitivity - 5) * 2;
        return Math.max(0, Math.min(100, 100 - adjusted));
    }

    /**
     * 格式化当前时间为 HH:MM:SS
     * @param {Date} date - 时间对象
     * @returns {string}
     */
    function formatTime(date) {
        var pad = function (n) {
            return n < 10 ? "0" + n : "" + n;
        };
        return pad(date.getHours()) + ":" +
            pad(date.getMinutes()) + ":" +
            pad(date.getSeconds());
    }

    /* ---------- 5. 麦克风与音频处理 ---------- */

    /**
     * 请求麦克风权限并初始化 Web Audio 链路
     * 失败时给出友好提示
     * @returns {Promise<boolean>} 是否成功启动
     */
    function initAudio() {
        return new Promise(function (resolve) {
            // 1. 兼容性检测
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                dom.meterStatus.textContent = "浏览器不支持麦克风";
                dom.meterHint.textContent = "请使用 Chrome / Edge / Safari 等现代浏览器，且在 https 或 file 协议下访问";
                resolve(false);
                return;
            }

            // 2. 请求麦克风权限
            navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
                .then(function (stream) {
                    state.mediaStream = stream;

                    // 3. 创建 AudioContext（兼容 webkit 前缀）
                    var AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (!AudioCtx) {
                        dom.meterStatus.textContent = "浏览器不支持 Web Audio";
                        resolve(false);
                        return;
                    }
                    state.audioContext = new AudioCtx();

                    // 4. 创建音频源与分析节点
                    var source = state.audioContext.createMediaStreamSource(stream);
                    var analyser = state.audioContext.createAnalyser();
                    analyser.fftSize = 1024;
                    analyser.smoothingTimeConstant = 0.7;
                    source.connect(analyser);
                    state.analyser = analyser;
                    state.freqData = new Uint8Array(analyser.frequencyBinCount);

                    resolve(true);
                })
                .catch(function (err) {
                    var msg = "无法访问麦克风";
                    if (err && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
                        msg = "麦克风权限被拒绝";
                        dom.meterHint.textContent = "请在浏览器地址栏点击锁形图标，允许麦克风权限后重试";
                    } else if (err && err.name === "NotFoundError") {
                        msg = "未检测到麦克风设备";
                    } else if (err && err.name === "NotReadableError") {
                        msg = "麦克风被其他程序占用";
                    }
                    dom.meterStatus.textContent = msg;
                    console.error("[quiet-meter] initAudio error:", err);
                    resolve(false);
                });
        });
    }

    /**
     * 从 AnalyserNode 中读取 RMS 音量
     * 使用时域数据计算均方根，反映平均音量强度
     * @returns {number} RMS 音量 0-1
     */
    function readRms() {
        if (!state.analyser) {
            return 0;
        }
        var buffer = new Float32Array(state.analyser.fftSize);
        state.analyser.getFloatTimeDomainData(buffer);

        var sum = 0;
        var i;
        for (i = 0; i < buffer.length; i++) {
            var v = buffer[i];
            sum += v * v;
        }
        var rms = Math.sqrt(sum / buffer.length);
        return rms;
    }

    /* ---------- 6. 可视化更新 ---------- */

    /**
     * 根据 dB 与安静值刷新圆环、数值、状态文字
     * @param {number} db - 当前 dB 值
     * @param {number} quietLevel - 当前安静值 0-100
     */
    function updateVisual(db, quietLevel) {
        var level = getLevel(quietLevel);
        var color = lerpColor(quietLevel);

        // 1. 圆环 stroke-dashoffset：安静值越大，填充越满
        // offset = 周长 * (1 - quiet/100)
        var offset = RING_CIRCUMFERENCE * (1 - quietLevel / 100);
        dom.ringProgress.setAttribute("stroke-dashoffset", offset.toFixed(2));
        dom.ringProgress.style.stroke = color;
        dom.ringProgress.style.filter = "drop-shadow(0 0 6px " + color + "40)";

        // 2. 中心数字
        dom.meterNumber.textContent = Math.round(quietLevel);
        dom.meterNumber.style.color = color;

        // 3. dB 显示
        dom.meterDb.textContent = db.toFixed(1) + " dB";

        // 4. 状态文字（含警告阈值提示）
        dom.meterStatus.textContent = level.label;
        dom.meterStatus.style.color = color;

        // 5. 超过警告阈值时，在 hint 提醒
        var threshold = parseInt(dom.threshold.value, 10);
        // 注意：阈值是「安静值警告阈值」，安静值低于阈值视为吵闹
        if (quietLevel < threshold) {
            dom.meterHint.textContent = "⚠️ 已低于警告阈值 " + threshold + "，请保持安静";
            dom.meterHint.style.color = color;
        } else {
            dom.meterHint.textContent = "实时检测中...";
            dom.meterHint.style.color = "";
        }
    }

    /* ---------- 7. 采样与记录 ---------- */

    /**
     * 每个 requestAnimationFrame 中累加当前帧的 dB
     * 用于 5 秒窗口的平均与最高统计
     * @param {number} db - 当前帧 dB
     */
    function accumulateSample(db) {
        state.sampleAccum.sum += db;
        if (db > state.sampleAccum.max) {
            state.sampleAccum.max = db;
        }
        state.sampleAccum.count++;
    }

    /**
     * 5 秒采样周期到达时，计算平均值并写入记录表格
     */
    function flushSample() {
        // 1. 计算 5 秒窗口内的平均 dB
        var acc = state.sampleAccum;
        if (acc.count === 0) {
            return; // 没有数据则跳过
        }
        var avgDb = acc.sum / acc.count;
        var maxDb = acc.max;
        // 2. 用平均 dB 计算窗口平均安静值
        var sensitivity = parseInt(dom.sensitivity.value, 10);
        var avgQuiet = dbToQuietValue(avgDb, sensitivity);
        var level = getLevel(avgQuiet);

        // 3. 构造记录对象
        var record = {
            time: formatTime(new Date()),
            avgDb: avgDb,
            maxDb: maxDb,
            quietLevel: avgQuiet,
            level: level
        };
        state.records.push(record);

        // 4. 写入表格行
        appendRecordRow(record);

        // 5. 重置累加器
        state.sampleAccum = { sum: 0, max: 0, count: 0 };

        // 6. 启用导出按钮
        if (!dom.exportBtn.disabled) {
            return;
        }
        dom.exportBtn.disabled = false;
    }

    /**
     * 在表格末尾追加一行记录
     * @param {{time:string,avgDb:number,maxDb:number,quietLevel:number,level:Object}} record
     */
    function appendRecordRow(record) {
        // 1. 隐藏空状态行
        if (dom.recordsEmpty) {
            dom.recordsEmpty.style.display = "none";
        }

        // 2. 构造行 HTML
        var tr = document.createElement("tr");
        var tagCls = "tag tag--" + record.level.cls;

        tr.innerHTML =
            "<td>" + record.time + "</td>" +
            "<td>" + record.avgDb.toFixed(1) + " dB</td>" +
            "<td>" + record.maxDb.toFixed(1) + " dB</td>" +
            "<td><span class=\"" + tagCls + "\">" + record.level.label + "</span></td>";

        dom.recordsBody.appendChild(tr);

        // 3. 更新计数
        dom.recordsCount.textContent = state.records.length;
    }

    /* ---------- 8. 主循环 ---------- */

    /**
     * requestAnimationFrame 回调，每次刷新读取音量并刷新可视化
     */
    function tick() {
        if (!state.isRunning) {
            return;
        }
        // 1. 读取 RMS 并换算
        var rms = readRms();
        var sensitivity = parseInt(dom.sensitivity.value, 10);
        var db = rmsToDb(rms, sensitivity);
        var quietLevel = dbToQuietValue(db, sensitivity);

        // 2. 平滑过渡（避免数字跳变）
        state.currentDb = state.currentDb * 0.7 + db * 0.3;
        state.currentQuiet = state.currentQuiet * 0.7 + quietLevel * 0.3;

        // 3. 刷新可视化
        updateVisual(state.currentDb, state.currentQuiet);

        // 4. 累加到 5 秒采样窗口
        accumulateSample(db);

        // 5. 继续下一帧
        state.rafId = requestAnimationFrame(tick);
    }

    /* ---------- 9. 开始/停止控制 ---------- */

    /**
     * 切换检测状态：开始或停止
     */
    function toggleDetection() {
        if (state.isRunning) {
            stopDetection();
        } else {
            startDetection();
        }
    }

    /**
     * 启动检测：初始化音频链路、UI 切换、启动 RAF 与采样定时器
     */
    function startDetection() {
        initAudio().then(function (ok) {
            if (!ok) {
                return;
            }
            state.isRunning = true;
            state.currentDb = 0;
            state.currentQuiet = 100;
            state.sampleAccum = { sum: 0, max: 0, count: 0 };

            // 1. 按钮文案切换
            dom.toggleBtn.classList.add("is-active");
            dom.toggleIcon.textContent = "■";
            dom.toggleText.textContent = "停止检测";
            dom.meterHint.textContent = "实时检测中...";

            // 2. 启动主循环
            state.rafId = requestAnimationFrame(tick);

            // 3. 启动 5 秒采样定时器
            state.sampleTimerId = setInterval(flushSample, SAMPLE_INTERVAL_MS);
        });
    }

    /**
     * 停止检测：释放音频资源、清理定时器、UI 切换
     */
    function stopDetection() {
        state.isRunning = false;

        // 1. 取消动画帧与定时器
        if (state.rafId) {
            cancelAnimationFrame(state.rafId);
            state.rafId = 0;
        }
        if (state.sampleTimerId) {
            clearInterval(state.sampleTimerId);
            state.sampleTimerId = 0;
        }

        // 2. 刷新最后一次采样（防止丢失窗口数据）
        if (state.sampleAccum.count > 0) {
            flushSample();
        }

        // 3. 释放麦克风与 AudioContext
        if (state.mediaStream) {
            state.mediaStream.getTracks().forEach(function (t) {
                t.stop();
            });
            state.mediaStream = null;
        }
        if (state.audioContext) {
            try {
                state.audioContext.close();
            } catch (e) {
                /* 忽略关闭错误 */
            }
            state.audioContext = null;
        }
        state.analyser = null;
        state.freqData = null;

        // 4. UI 切换
        dom.toggleBtn.classList.remove("is-active");
        dom.toggleIcon.textContent = "▶";
        dom.toggleText.textContent = "开始检测";
        dom.meterStatus.textContent = "已停止";
        dom.meterStatus.style.color = "";
        dom.meterHint.textContent = "点击「开始检测」继续";
        dom.meterHint.style.color = "";
    }

    /* ---------- 10. CSV 导出 ---------- */

    /**
     * 将历史记录导出为 CSV 文件并触发下载
     * 编码加 BOM 头，保证 Excel 直接打开中文不乱码
     */
    function exportCsv() {
        if (state.records.length === 0) {
            return;
        }
        // 1. 构造 CSV 文本
        var rows = ["时间,平均分贝,最高分贝,安静值,状态"];
        state.records.forEach(function (r) {
            rows.push(
                r.time + "," +
                r.avgDb.toFixed(1) + "," +
                r.maxDb.toFixed(1) + "," +
                r.quietLevel.toFixed(1) + "," +
                r.level.label
            );
        });
        var csv = rows.join("\n");

        // 2. 加 UTF-8 BOM 头，防止 Excel 中文乱码
        var bom = "\uFEFF";
        var blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });

        // 3. 触发下载
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        var stamp = formatTime(new Date()).replace(/:/g, "-");
        a.download = "安静值检测记录_" + stamp + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* ---------- 11. 全屏模式 ---------- */

    /**
     * 全屏状态变化：同步 .is-fullscreen 类，保证按 ESC 退出时 UI 状态一致。
     * 进入 / 退出全屏的动作由共享模块 tool-stage-toolbar.js 接管（目标为 #toolBox）。
     */
    function handleFullscreenChange() {
        var isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
        if (isFs) {
            dom.toolBox.classList.add("is-fullscreen");
        } else {
            dom.toolBox.classList.remove("is-fullscreen");
        }
    }

    /* ---------- 12. 事件绑定 ---------- */

    /**
     * 绑定所有 UI 事件
     */
    function bindEvents() {
        // 1. 灵敏度滑块：实时显示数值并即时刷新当前可视化
        dom.sensitivity.addEventListener("input", function () {
            dom.sensitivityValue.textContent = dom.sensitivity.value;
            if (state.isRunning) {
                var sensitivity = parseInt(dom.sensitivity.value, 10);
                var q = dbToQuietValue(state.currentDb, sensitivity);
                updateVisual(state.currentDb, q);
            }
        });

        // 2. 警告阈值滑块：实时显示数值
        dom.threshold.addEventListener("input", function () {
            dom.thresholdValue.textContent = dom.threshold.value;
            if (state.isRunning) {
                updateVisual(state.currentDb, state.currentQuiet);
            }
        });

        // 3. 开始/停止按钮
        dom.toggleBtn.addEventListener("click", toggleDetection);

        // 4. 导出按钮
        dom.exportBtn.addEventListener("click", exportCsv);

        // 5. 全屏状态变化（兼容多前缀）。进入 / 退出全屏由 tool-stage-toolbar.js 接管
        var fsChange = "fullscreenchange";
        if (document.webkitFullscreenEnabled) {
            document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        }
        document.addEventListener(fsChange, handleFullscreenChange);

        // 7. 页面卸载时清理资源
        window.addEventListener("beforeunload", function () {
            if (state.isRunning) {
                stopDetection();
            }
        });
    }

    /* ---------- 13. 初始化 ---------- */

    /**
     * 初始化圆环默认状态并绑定事件
     */
    function init() {
        // 1. 默认圆环填满（安静值 100）
        dom.ringProgress.style.strokeDasharray = RING_CIRCUMFERENCE;
        dom.ringProgress.style.strokeDashoffset = "0";

        // 2. 同步初始滑块数值
        dom.sensitivityValue.textContent = dom.sensitivity.value;
        dom.thresholdValue.textContent = dom.threshold.value;

        // 3. 绑定事件
        bindEvents();

        // 4. 舞台工具栏：⛶ 对 #toolBox 自身全屏（本工具无可隐藏设置栏，不接 ⚙）
        if (window.EduToolStageToolbar) {
            window.EduToolStageToolbar.init({ stage: "#toolBox", panelHost: null });
        }
    }

    // DOM 就绪后启动
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
