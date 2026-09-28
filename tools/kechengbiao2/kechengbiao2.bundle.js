/* 自动生成，请勿手改 —— 源：tools/kechengbiao2/  ·  构建：2026-09-28 11:07:05 */
/* 用途：file:// 离线场景下 fetch 被 CORS 拦截，站点改用 <script src> 加载本文件，
   拿到工具页面与本地 CSS/JS 文本后走与 http 相同的 Shadow DOM 组件化挂载。
   工具源码改动后请重跑：python .workbuddy/scripts/build_tool_bundles.py */
(function(){
  var g = window.EduToolboxToolBundles || (window.EduToolboxToolBundles = {});
  g["kechengbiao2"] = {
    html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>智能课程表工具 | 免费在线排课系统<\/title>
    <link rel="stylesheet" href="css/styles.css">
    <script src="../../assets/js/frame-bridge.js"><\/script>
<script src="js/html2canvas.min.js"><\/script>
<style>
/* ============================================================================
 * EduToolbox 组件化挂载兜底（自动追加）
 * ----------------------------------------------------------------------------
 * 本工具未引入 assets/css/tool-common.css，挂载进站点（Shadow DOM）后会缺少：
 *   1) 六色主题变量 --primary / --primary-soft / --primary-grad
 *   2) .container 的宽度约束（否则内容铺满并贴边）
 * 这里补齐最小等价集，保证「独立打开」与「站点内组件化挂载」视觉一致。
 * ========================================================================== */

:root,
:host,
body[data-theme="sky"]   { --primary:#0ea5e9; --primary-soft:#e0f2fe; --primary-soft-2:#ccecfc; --primary-grad:linear-gradient(135deg,#38bdf8,#0ea5e9,#0284c7); }
body[data-theme="violet"]{ --primary:#7c3aed; --primary-soft:#f0e9fe; --primary-soft-2:#e2d5fc; --primary-grad:linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9); }
body[data-theme="green"] { --primary:#16a34a; --primary-soft:#e7f6ec; --primary-soft-2:#d3f0dc; --primary-grad:linear-gradient(135deg,#22c55e,#16a34a,#15803d); }
body[data-theme="gold"]  { --primary:#d97706; --primary-soft:#fdf1dc; --primary-soft-2:#fbe3bc; --primary-grad:linear-gradient(135deg,#f59e0b,#d97706,#b45309); }
body[data-theme="orange"]{ --primary:#ea580c; --primary-soft:#ffefe4; --primary-soft-2:#ffdec9; --primary-grad:linear-gradient(135deg,#fb923c,#ea580c,#c2410c); }
body[data-theme="pink"]  { --primary:#db2777; --primary-soft:#fce7f0; --primary-soft-2:#f9cfe1; --primary-grad:linear-gradient(135deg,#f472b6,#db2777,#be185d); }

/* 容器宽度兜底：仅在工具自身未声明时生效（不覆盖已有 .container 规则） */
.container:not([data-no-fallback]) {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 24px 56px;
  box-sizing: border-box;
}
<\/style>
<\/head>
<body>
    <!-- 固定顶部区域 -->
    <div class="fixed-top-area">
        <header class="header">
            <!-- 手机端汉堡菜单按钮 倾企企业服务 -->
            <button id="hamburgerBtn" class="hamburger-btn">
                <span class="hamburger-line"><\/span>
                <span class="hamburger-line"><\/span>
                <span class="hamburger-line"><\/span>
            <\/button>
            <div class="title-section">
                <input type="text" id="timetableTitle" class="timetable-title" value="我的课程表" placeholder="请输入课程表名称" readonly style="cursor: default;">
            <\/div>
            <div class="controls">
                <button id="tutorialBtn" class="btn danger">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    <\/svg>
                    教程
                <\/button>
                <button id="resetBtn" class="btn secondary">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                    <\/svg>
                    重置课表
                <\/button>
                <div class="export-dropdown">
                    <button id="exportBtn" class="btn primary">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7,10 12,15 17,10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        <\/svg>
                        导出打印
                    <\/button>
                    <div class="export-menu" id="exportMenu">
                        <button id="saveImageBtn" class="export-item">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21,15 16,10 5,21"/>
                            <\/svg>
                            保存图片
                        <\/button>
                        <button id="exportWordBtn" class="export-item">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            <\/svg>
                            导出Word
                        <\/button>
                        <button id="exportExcelBtn" class="export-item">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            <\/svg>
                            导出Excel
                        <\/button>
                    <\/div>
                <\/div>
                <div class="backup-dropdown">
                    <button id="backupBtn" class="btn primary">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        <\/svg>
                        备份数据
                    <\/button>
                    <div class="backup-menu" id="backupMenu">
                        <button id="exportDataBtn" class="backup-item">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            <\/svg>
                            导出数据
                        <\/button>
                        <button id="importDataBtn" class="backup-item">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="17,8 12,3 7,8"/>
                                <line x1="12" y1="3" x2="12" y2="15"/>
                            <\/svg>
                            导入数据
                        <\/button>
                    <\/div>
                <\/div>
                <div class="font-dropdown">
                    <button id="fontBtn" class="btn primary">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 7V4h16v3"/>
                            <path d="M9 20h6"/>
                            <path d="M12 4v16"/>
                        <\/svg>
                        字体
                    <\/button>
                    <div class="font-menu" id="fontMenu">
                        <button class="font-item" data-font="system">系统默认<\/button>
                        <button class="font-item" data-font="microsoft-yahei">微软雅黑<\/button>
                        <button class="font-item" data-font="simsun">宋体<\/button>
                        <button class="font-item" data-font="heiti">黑体<\/button>
                        <button class="font-item" data-font="kaiti">楷体<\/button>
                        <button class="font-item" data-font="fangsong">仿宋<\/button>
                        <button class="font-item" data-font="xingkai">行楷字体<\/button>
                        <button class="font-item" data-font="lishu">隶书字体<\/button>
                        <button class="font-item" data-font="kaiti">楷体字体<\/button>
                        <button class="font-item" data-font="fangsong">仿宋字体<\/button>
                        <button class="font-item" data-font="youyuan">幼圆字体<\/button>
                        <button class="font-item" data-font="source-han-sans">思源黑体<\/button>
                        <button class="font-item" data-font="source-han-serif">思源宋体<\/button>
                        <button class="font-item" data-font="arial">Arial<\/button>
                        <button class="font-item" data-font="helvetica">Helvetica<\/button>
                        <button class="font-item" data-font="georgia">Georgia<\/button>
                        <button class="font-item" data-font="times-new-roman">Times New Roman<\/button>
                    <\/div>
                <\/div>
                <div class="theme-dropdown">
                    <button id="themeBtn" class="btn primary">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 1.54l4.24 4.24M20.46 20.46l-4.24-4.24M1.54 20.46l4.24-4.24"/>
                        <\/svg>
                        主题
                    <\/button>
                    <div class="theme-menu" id="themeMenu">
                        <button class="theme-item" data-theme="default">默认主题<\/button>
                        <button class="theme-item" data-theme="blue">蓝色主题<\/button>
                        <button class="theme-item" data-theme="purple">紫色主题<\/button>
                        <button class="theme-item" data-theme="pink">粉色主题<\/button>
                        <button class="theme-item" data-theme="orange">橙色主题<\/button>
                        <button class="theme-item" data-theme="dark">深色主题<\/button>
                        <div class="custom-color" style="padding: 10px; border-top: 1px solid var(--border-color); display: flex; align-items: center; gap: 8px;">
                            <input type="color" id="customColorPicker" value="#4a7c59" style="width: 32px; height: 32px; border: none; cursor: pointer; border-radius: 4px;">
                            <span style="font-size: 14px; color: var(--text-color);">自定义<\/span>
                        <\/div>
                    <\/div>
                <\/div>
                <button id="settingsBtn" class="btn primary">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    <\/svg>
                    设置
                <\/button>
            <\/div>
        <\/header>
        
        <div class="period-controls">
            <div class="period-control-line">
                <span>上午课时<\/span>
                <button id="addMorningBtn" class="btn small">增加<\/button>
                <button id="removeMorningBtn" class="btn small danger">减少<\/button>
            <\/div>
            <div class="period-control-line">
                <span>下午课时<\/span>
                <button id="addAfternoonBtn" class="btn small">增加<\/button>
                <button id="removeAfternoonBtn" class="btn small danger">减少<\/button>
            <\/div>
            <div class="period-control-line">
                <span>晚上课时<\/span>
                <button id="addEveningBtn" class="btn small">增加<\/button>
                <button id="removeEveningBtn" class="btn small danger">减少<\/button>
            <\/div>
        <\/div>
    <\/div>
    
    <!-- 主要内容区域 -->
    <div class="container">
        <main class="main-content">
            <!-- 左侧栏：课时控制和科目池 倾企版权所有-->
            <div class="left-sidebar">
                <!-- 课时设置主标题 -->
                <h3 class="section-title">课时设置<\/h3>
                
                <!-- PC端课时控制区域倾企企服 -->
                <div class="period-controls-desktop">
                    <div class="period-control-line">
                        <span>上午课时<\/span>
                        <button id="addMorningBtn2" class="btn small">增加<\/button>
                        <button id="removeMorningBtn2" class="btn small danger">减少<\/button>
                    <\/div>
                    <div class="period-control-line">
                        <span>下午课时<\/span>
                        <button id="addAfternoonBtn2" class="btn small">增加<\/button>
                        <button id="removeAfternoonBtn2" class="btn small danger">减少<\/button>
                    <\/div>
                    <div class="period-control-line">
                        <span>晚上课时<\/span>
                        <button id="addEveningBtn2" class="btn small">增加<\/button>
                        <button id="removeEveningBtn2" class="btn small danger">减少<\/button>
                    <\/div>
                <\/div>
                
                <div class="subject-pool">
                    <!-- 科目池主标题 -->
                    <h3 class="section-title">科目池<\/h3>
                    <div class="subject-pool-header">
                        <button id="importSubjectBtn" class="btn secondary">导入科目<\/button>
                        <button id="addSubjectBtn" class="btn primary">+ 科目<\/button>
                    <\/div>
                    <div id="subjectPool" class="subjects">
                        <!-- 科目卡片将在这里动态生成 -->
                    <\/div>
                <\/div>
            <\/div>
            
            <!-- 右侧栏：倾企课程表格 -->
            <div class="right-content">

            <div class="timetable-container">
                <div class="timetable-title-section">
                    <input type="text" id="tableTitle" class="table-title-input" value="周一到周五课程表" placeholder="请输入课程表名称">
                <\/div>
                <div class="timetable-wrapper">
                    <table class="timetable" id="timetable">
                        <thead>
                            <tr>
                                <th class="time-header">时间<\/th>
                                <th class="period-header">课时<\/th>
                                <th class="weekday-col">周一<\/th>
                                <th class="weekday-col">周二<\/th>
                                <th class="weekday-col">周三<\/th>
                                <th class="weekday-col">周四<\/th>
                                <th class="weekday-col">周五<\/th>
                                <th class="weekend-col" id="saturdayCol">周六<\/th>
                                <th class="weekend-col" id="sundayCol">周日<\/th>
                            <\/tr>
                        <\/thead>
                        <tbody id="timetableBody">
                            <!-- 动态生成的内容 -->
                        <\/tbody>
                    <\/table>
                <\/div>
            <\/div>
            <\/div> 
        <\/main>
    <\/div>

    <!-- 科目编辑弹窗 -->
    <div id="subjectModal" class="modal">
        <div class="modal-content">
            <h3>科目设置<\/h3>
            <form id="subjectForm">
                <div class="form-group">
                    <label>科目名称<\/label>
                    <input type="text" id="subjectName" required>
                <\/div>
                <div class="form-group">
                    <label>老师姓名<\/label>
                    <input type="text" id="teacherName" placeholder="可选">
                <\/div>
                <div class="form-group">
                    <label>颜色模式<\/label>
                    <div class="color-mode-selector">
                        <label class="color-mode-option">
                            <input type="radio" name="colorMode" value="both" checked>
                            <span>背景+字体<\/span>
                        <\/label>
                        <label class="color-mode-option">
                            <input type="radio" name="colorMode" value="textOnly">
                            <span>仅字体色<\/span>
                        <\/label>
                    <\/div>
                <\/div>
                <div class="form-group color-group" id="bgColorGroup">
                    <label>背景色<\/label>
                    <div class="color-options">
                        <div class="preset-colors" id="backgroundColors">
                            <!-- 18种背景色 -->
                            <div class="color-option bg-color" data-color="#3498DB" style="background: #3498DB" title="明亮蓝"><\/div>
                            <div class="color-option bg-color" data-color="#2ECC71" style="background: #2ECC71" title="鲜绿色"><\/div>
                            <div class="color-option bg-color" data-color="#E74C3C" style="background: #E74C3C" title="亮红色"><\/div>
                            <div class="color-option bg-color" data-color="#9B59B6" style="background: #9B59B6" title="紫罗兰"><\/div>
                            <div class="color-option bg-color" data-color="#F39C12" style="background: #F39C12" title="橙黄色"><\/div>
                            <div class="color-option bg-color" data-color="#1ABC9C" style="background: #1ABC9C" title="青绿色"><\/div>
                            <div class="color-option bg-color" data-color="#D35400" style="background: #D35400" title="南瓜橙"><\/div>
                            <div class="color-option bg-color" data-color="#C0392B" style="background: #C0392B" title="深红色"><\/div>
                            <div class="color-option bg-color" data-color="#8E44AD" style="background: #8E44AD" title="深紫色"><\/div>
                            <div class="color-option bg-color" data-color="#2980B9" style="background: #2980B9" title="天蓝色"><\/div>
                            <div class="color-option bg-color" data-color="#27AE60" style="background: #27AE60" title="森林绿"><\/div>
                            <div class="color-option bg-color" data-color="#E67E22" style="background: #E67E22" title="胡萝卜橙"><\/div>
                            <div class="color-option bg-color" data-color="#16A085" style="background: #16A085" title="海绿色"><\/div>
                            <div class="color-option bg-color" data-color="#D68910" style="background: #D68910" title="金黄橙"><\/div>
                            <div class="color-option bg-color" data-color="#A569BD" style="background: #A569BD" title="薰衣草紫"><\/div>
                            <div class="color-option bg-color" data-color="#5D6D7E" style="background: #5D6D7E" title="石板灰"><\/div>
                            <div class="color-option bg-color" data-color="#F7DC6F" style="background: #F7DC6F" title="淡黄色"><\/div>
                            <div class="color-option bg-color" data-color="#85C1E9" style="background: #85C1E9" title="浅蓝色"><\/div>
                        <\/div>
                        <div class="custom-color-inline">
                            <input type="color" id="bgColorPicker" value="#3498DB">
                            <input type="text" id="bgColorText" placeholder="#3498DB" maxlength="7">
                        <\/div>
                    <\/div>
                <\/div>
                <div class="form-group color-group" id="textColorGroup">
                    <label>字体色<\/label>
                    <div class="color-options">
                        <div class="preset-colors" id="textColors">
                            <!-- 18种字体色 -->
                            <div class="color-option text-color" data-color="#FFFFFF" style="background: #FFFFFF; border: 1px solid #ddd;" title="白色"><\/div>
                            <div class="color-option text-color" data-color="#000000" style="background: #000000" title="黑色"><\/div>
                            <div class="color-option text-color" data-color="#2C3E50" style="background: #2C3E50" title="深蓝灰"><\/div>
                            <div class="color-option text-color" data-color="#1B2631" style="background: #1B2631" title="墨黑色"><\/div>
                            <div class="color-option text-color" data-color="#154360" style="background: #154360" title="午夜蓝"><\/div>
                            <div class="color-option text-color" data-color="#1A5276" style="background: #1A5276" title="深海蓝"><\/div>
                            <div class="color-option text-color" data-color="#0E6251" style="background: #0E6251" title="深松绿"><\/div>
                            <div class="color-option text-color" data-color="#145A32" style="background: #145A32" title="墨绿色"><\/div>
                            <div class="color-option text-color" data-color="#186A3B" style="background: #186A3B" title="深林绿"><\/div>
                            <div class="color-option text-color" data-color="#4A235A" style="background: #4A235A" title="深紫色"><\/div>
                            <div class="color-option text-color" data-color="#512E5F" style="background: #512E5F" title="紫罗兰"><\/div>
                            <div class="color-option text-color" data-color="#6C3483" style="background: #6C3483" title="葡萄紫"><\/div>
                            <div class="color-option text-color" data-color="#78281F" style="background: #78281F" title="暗红色"><\/div>
                            <div class="color-option text-color" data-color="#641E16" style="background: #641E16" title="深酒红"><\/div>
                            <div class="color-option text-color" data-color="#7E5109" style="background: #7E5109" title="深土黄"><\/div>
                            <div class="color-option text-color" data-color="#E74C3C" style="background: #E74C3C" title="亮红色"><\/div>
                            <div class="color-option text-color" data-color="#3498DB" style="background: #3498DB" title="明亮蓝"><\/div>
                            <div class="color-option text-color" data-color="#27AE60" style="background: #27AE60" title="森林绿"><\/div>
                        <\/div>
                        <div class="custom-color-inline">
                            <input type="color" id="textColorPicker" value="#FFFFFF">
                            <input type="text" id="textColorText" placeholder="#FFFFFF" maxlength="7">
                        <\/div>
                    <\/div>
                <\/div>
                <div class="color-preview-section">
                    <label>预览效果<\/label>
                    <div class="color-preview" id="colorPreview">科目名称<\/div>
                <\/div>
                <div class="form-actions">
                    <button type="submit" class="btn primary">保存<\/button>
                    <button type="button" id="deleteSubjectBtn" class="btn danger" style="display: none;">删除<\/button>
                    <button type="button" id="cancelBtn" class="btn secondary">取消<\/button>
                <\/div>
            <\/form>
        <\/div>
    <\/div>

    <!-- 时间编辑弹窗 -->
    <div id="timeModal" class="modal">
        <div class="modal-content">
                <h3>修改课时<\/h3>
                <form id="timeForm">
                    <div class="form-group">
                        <label>课时名称<\/label>
                        <input type="text" id="periodName" required placeholder="第1课时">
                    <\/div>
                <div class="form-group">
                    <label>开始时间<\/label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <select id="startHour" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">时<\/option>
                        <\/select>
                        <span>:<\/span>
                        <select id="startMinute" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">分<\/option>
                        <\/select>
                    <\/div>
                <\/div>
                <div class="form-group">
                    <label>结束时间<\/label>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <select id="endHour" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">时<\/option>
                        <\/select>
                        <span>:<\/span>
                        <select id="endMinute" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="">分<\/option>
                        <\/select>
                    <\/div>
                <\/div>
                <div class="form-actions">
                    <button type="submit" class="btn primary">保存<\/button>
                    <button type="button" id="cancelTimeBtn" class="btn secondary">取消<\/button>
                <\/div>
            <\/form>
        <\/div>
    <\/div>

    <!-- 设置弹窗 -->
    <div id="settingsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>⚙️ 显示设置<\/h3>
                <button type="button" class="modal-close" onclick="app.closeSettingsModal()">&times;<\/button>
            <\/div>
            <form id="settingsForm">
                <div class="settings-content">
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" id="showEvening" class="setting-checkbox">
                            <span class="checkmark"><\/span>
                            <div class="setting-text">
                                <strong>显示晚上课时<\/strong>
                                <small>包含晚上的课程时间段<\/small>
                            <\/div>
                        <\/label>
                    <\/div>
                    
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" id="showSaturday" class="setting-checkbox">
                            <span class="checkmark"><\/span>
                            <div class="setting-text">
                                <strong>显示周六<\/strong>
                                <small>在课程表中添加周六列<\/small>
                            <\/div>
                        <\/label>
                    <\/div>
                    
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" id="showSunday" class="setting-checkbox">
                            <span class="checkmark"><\/span>
                            <div class="setting-text">
                                <strong>显示周日<\/strong>
                                <small>在课程表中添加周日列<\/small>
                            <\/div>
                        <\/label>
                    <\/div>
                    
                    <div class="setting-item">
                        <label class="setting-label">
                            <input type="checkbox" id="showPeriodTime" class="setting-checkbox">
                            <span class="checkmark"><\/span>
                            <div class="setting-text">
                                <strong>显示课时时间<\/strong>
                                <small>在课时列中显示开始和结束时间<\/small>
                            <\/div>
                        <\/label>
                    <\/div>
                <\/div>
                
                <div class="form-actions">
                    <button type="button" id="cancelSettingsBtn" class="btn secondary">取消<\/button>
                    <button type="submit" class="btn primary">保存设置<\/button>
                <\/div>
            <\/form>
        <\/div>
    <\/div>

    <!-- 教程弹窗 -->
    <div id="tutorialModal" class="modal tutorial-modal" onclick="if(event.target===this)app.closeTutorialModal()">
        <div class="modal-content tutorial-modal-content">
            <div class="tutorial-header">
                <div class="tutorial-header-icon">📚<\/div>
                <h3>课程表使用教程<\/h3>
                <button class="tutorial-close-btn" onclick="app.closeTutorialModal()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"><\/line>
                        <line x1="6" y1="6" x2="18" y2="18"><\/line>
                    <\/svg>
                <\/button>
            <\/div>
            <div id="tutorialContent" class="tutorial-content">
                <!-- 教程内容将由JavaScript动态生成 -->
            <\/div>
            <div class="tutorial-footer">
                <div class="tutorial-hint">
                    <span class="hint-icon">💡<\/span>
                    按 <kbd>ESC<\/kbd> 键也可以关闭
                <\/div>
                <div class="tutorial-actions">
                    <button type="button" onclick="app.closeTutorialModal()" class="btn secondary">关闭<\/button>
                    <button type="button" id="closeTutorialBtn" class="btn primary">我知道了<\/button>
                <\/div>
            <\/div>
        <\/div>
    <\/div>

    <!-- 隐藏的文件输入元素用于导入数据 -->
    <input type="file" id="importFileInput" accept=".json" style="display: none;">
    
    <!-- 自定义确认对话框 -->
    <div id="confirmModal" class="modal">
        <div class="modal-content">
            <h3>确认操作<\/h3>
            <div class="confirm-message">
                <!-- 确认消息将动态设置 -->
            <\/div>
            <div class="form-actions">
                <button type="button" id="confirmCancelBtn" class="btn secondary">取消<\/button>
                <button type="button" id="confirmOkBtn" class="btn danger">确定<\/button>
            <\/div>
        <\/div>
    <\/div>
    
    <!-- 导入科目模态框 -->
    <div id="importSubjectModal" class="modal">
        <div class="modal-content">
            <h3>导入科目<\/h3>
            <form id="importSubjectForm">
                <div class="form-group">
                    <label>选择学习阶段<\/label>
                    <select id="stageSelect" class="form-control" required>
                        <option value="">请选择学习阶段<\/option>
                        <option value="primary">小学<\/option>
                        <option value="junior">初中<\/option>
                        <option value="senior">高中<\/option>
                        <option value="university">大学<\/option>
                    <\/select>
                <\/div>
                <div class="form-actions">
                    <button type="button" id="cancelImportBtn" class="btn secondary">取消<\/button>
                    <button type="submit" class="btn primary">导入<\/button>
                <\/div>
            <\/form>
        <\/div>
    <\/div>

    <!-- 手机端侧边栏菜单 -->
    <div id="mobileSidebar" class="mobile-sidebar">
        <div class="sidebar-header">
            <h3>菜单<\/h3>
            <button id="closeSidebarBtn" class="close-sidebar-btn">×<\/button>
        <\/div>
        <div class="sidebar-content">
            <div class="sidebar-section">
                <h4>课程表操作<\/h4>
                <button class="sidebar-btn" data-action="tutorial">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    <\/svg>
                    查看教程
                <\/button>
                <button class="sidebar-btn" data-action="reset">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M3 21v-5h5"/>
                    <\/svg>
                    重置课表
                <\/button>
            <\/div>
            
            <div class="sidebar-section">
                <h4>导出功能<\/h4>
                <button class="sidebar-btn" data-action="saveImage">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    <\/svg>
                    保存图片
                <\/button>
                <button class="sidebar-btn" data-action="exportWord">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    <\/svg>
                    导出Word
                <\/button>
                <button class="sidebar-btn" data-action="exportExcel">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                    <\/svg>
                    导出Excel
                <\/button>
            <\/div>
            
            <div class="sidebar-section">
                <h4>数据管理<\/h4>
                <button class="sidebar-btn" data-action="exportData">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    <\/svg>
                    导出数据
                <\/button>
                <button class="sidebar-btn" data-action="importData">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17,8 12,3 7,8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    <\/svg>
                    导入数据
                <\/button>
            <\/div>
            
            <div class="sidebar-section">
                <h4>设置<\/h4>
                <button class="sidebar-btn" data-action="settings">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    <\/svg>
                    显示设置
                <\/button>
            <\/div>
            
            <div class="sidebar-section">
                <h4>主题切换<\/h4>
                <div class="sidebar-theme-grid">
                    <button class="sidebar-theme-btn" data-action="theme" data-theme="default">默认<\/button>
                    <button class="sidebar-theme-btn" data-action="theme" data-theme="blue">蓝色<\/button>
                    <button class="sidebar-theme-btn" data-action="theme" data-theme="purple">紫色<\/button>
                    <button class="sidebar-theme-btn" data-action="theme" data-theme="pink">粉色<\/button>
                    <button class="sidebar-theme-btn" data-action="theme" data-theme="orange">橙色<\/button>
                    <button class="sidebar-theme-btn" data-action="theme" data-theme="dark">深色<\/button>
                <\/div>
                <div class="sidebar-custom-color">
                    <input type="color" id="mobileCustomColorPicker" value="#4a7c59">
                    <span>自定义主题色<\/span>
                <\/div>
            <\/div>
            
            <div class="sidebar-section">
                <h4>字体切换<\/h4>
                <div class="sidebar-font-grid">
                    <button class="sidebar-font-btn" data-action="font" data-font="system">系统默认<\/button>
                    <button class="sidebar-font-btn" data-action="font" data-font="microsoft-yahei">微软雅黑<\/button>
                    <button class="sidebar-font-btn" data-action="font" data-font="simsun">宋体<\/button>
                    <button class="sidebar-font-btn" data-action="font" data-font="heiti">黑体<\/button>
                    <button class="sidebar-font-btn" data-action="font" data-font="kaiti">楷体<\/button>
                    <button class="sidebar-font-btn" data-action="font" data-font="fangsong">仿宋<\/button>
                <\/div>
            <\/div>
        <\/div>
    <\/div>
    
    <!-- 侧边栏倾企遮罩层 -->
    <div id="sidebarOverlay" class="sidebar-overlay"><\/div>
    <script src="js/script.js"><\/script>
<\/body>
<\/html>`,
    files: {
      "assets/js/frame-bridge.js": `/* ============================================================================
 * iframe 内工具桥 · frame-bridge.js
 * ============================================================================
 * 【背景】站点在 file://（离线双击 index.html）下无法用 fetch 读取工具页面
 * （Chromium 把 file:// 互相视为不透明源，fetch/XHR 一律被 CORS 拦截），于是
 * 所有自研工具回退为 <iframe> 兜底。跨源带来两个问题：
 *   ① 父页拿不到 iframe 的 contentDocument → 高度自适应失效，工具页被压成
 *      固定视口高度（"页面不能自动撑开"）；
 *   ② file:// 下 iframe 内的 requestFullscreen 被权限策略拒绝 → 工具右上角
 *      ⛶ 点了没反应（"全屏按钮不能用"）。
 *
 * 【方案】本脚本随工具页面一起被 iframe 加载（真实文档环境），通过
 * postMessage 向父页（站点外壳）上报：
 *   - height     ：工具内容实际高度（rAF 节流 + ResizeObserver 持续监听）；
 *   - fullscreen ：工具内部全屏请求被拒时，请父页对 <iframe> 本身发起全屏
 *                  （postMessage 会把 user activation 一并委托给父页；
 *                  父页若仍失败，再降级为父页侧 CSS 伪全屏）。
 *
 * 【安全阀】用 self !== top 判定「真实运行在 iframe 里」：
 *   - 独立双击打开工具页 → self === top → 本脚本整体空转；
 *   - 站点内嵌 Shadow DOM（http 适配器）路径下，脚本在 docShim/winShim 代理里
 *     执行，self/top 都落到真实顶层 window → self === top → 空转，
 *     不会向父页发任何消息；
 *   - 真实 iframe 内（含 file:// 跨源）→ self !== top → 激活。
 *   ⚠️ 不要用 window.frameElement 判定：跨源 iframe 里访问它会抛 SecurityError
 *     （实测），一旦 catch 成 null 桥就整体失效。
 *   ⚠️ self / top 属于跨源 WindowProxy 的「允许访问」属性（不会抛错），
 *     引用比较即可判定。
 * 消息一律带 __edutoolboxFrame 命名空间标记，父页校验 e.source 后才处理。
 * ========================================================================== */
(function () {
  "use strict";

  /* 只在真实 iframe 内激活 */
  var inFrame = false;
  try {
    var self = window.self, top = window.top;
    inFrame = !!(self && top && self !== top && window.parent && window.parent !== window);
  } catch (e) { inFrame = false; }
  if (!inFrame) return;

  var raf = 0;

  /** rAF 节流地把当前文档高度报给父页 */
  function reportHeight() {
    if (raf) return;
    raf = (window.requestAnimationFrame || function (f) { return setTimeout(f, 60); })(
      function () {
        raf = 0;
        try {
          var h = Math.max(
            document.documentElement ? document.documentElement.scrollHeight : 0,
            document.body ? document.body.scrollHeight : 0
          );
          window.parent.postMessage({
            __edutoolboxFrame: true,
            type: "height",
            h: h
          }, "*");
        } catch (e) { /* 父页不可达：静默 */ }
      }
    );
  }

  /** 工具内部全屏请求失败时，委托父页对 iframe 元素本身发起全屏 */
  function requestParentFullscreen() {
    try {
      window.parent.postMessage({
        __edutoolboxFrame: true,
        type: "fullscreen"
      }, "*");
    } catch (e) { /* 静默 */ }
  }

  /* 暴露给共享舞台模块（tool-stage-toolbar.js）在全屏失败分支调用 */
  window.EduToolFrameBridge = {
    reportHeight: reportHeight,
    requestParentFullscreen: requestParentFullscreen
  };

  /* 首帧 + load 后补报，防首报时内容未排完 */
  reportHeight();
  window.addEventListener("load", function () {
    reportHeight();
    setTimeout(reportHeight, 300);
  });

  /* 内容持续变化（点名记录增长、生成结果插入等）→ 宿主跟着长高 */
  if (typeof ResizeObserver === "function") {
    try {
      new ResizeObserver(reportHeight).observe(document.documentElement);
    } catch (e) { /* 老浏览器无此能力：靠 load 兜底 */ }
  }

  /* 父页通知重新测量（伪全屏退出后恢复常规高度） */
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (d && d.__edutoolboxFrame === true && d.type === "report") reportHeight();
  });
})();
`,
      "tools/kechengbiao2/css/styles.css": `/* 字体定义 - 使用系统字体 */
/* 这些字体在大多数Windows系统上都可用 */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* 豆沙绿主题配色方案 - 默认主题 */
    --primary-color: #93c572; /* 豆沙绿主色调 */
    --primary-hover-color: #7cb342; /* 豆沙绿悬停色 */
    --secondary-color: #6c757d;
    --secondary-hover-color: #5a6268; /* 次要色悬停色 */
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #f0f8f0; /* 浅豆沙绿背景 */
    --dark-color: #556b2f; /* 深豆沙绿 */
    --border-color: #a0c49d; /* 豆沙绿边框 */
    --background-color: #f5faf5; /* 豆沙绿背景 */
    --text-color: #455a64; /* 深豆沙绿文字 */
    --shadow-color: rgba(147, 197, 114, 0.2); /* 豆沙绿阴影 */
    --pattern-background: radial-gradient(circle at 10% 20%, rgba(147, 197, 114, 0.15) 0%, rgba(147, 197, 114, 0.08) 90%); /* 豆沙绿背景图案 */
}

/* 蓝色主题 */
body.theme-blue {
    --primary-color: #007bff;
    --primary-hover-color: #0056b3;
    --secondary-color: #6c757d;
    --secondary-hover-color: #5a6268;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #e3f2fd;
    --dark-color: #0056b3;
    --border-color: #90caf9;
    --background-color: #f0f8ff;
    --text-color: #0056b3;
    --shadow-color: rgba(0, 123, 255, 0.15);
    --pattern-background: radial-gradient(circle at 10% 20%, rgba(0, 123, 255, 0.1) 0%, rgba(0, 123, 255, 0.05) 90%);
}

/* 紫色主题 */
body.theme-purple {
    --primary-color: #6f42c1;
    --primary-hover-color: #5a3d8c;
    --secondary-hover-color: #5a6268;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #f3e5f5;
    --dark-color: #5a3d8c;
    --border-color: #ba68c8;
    --background-color: #f5f0ff;
    --text-color: #5a3d8c;
    --shadow-color: rgba(111, 66, 193, 0.15);
    --pattern-background: radial-gradient(circle at 10% 20%, rgba(111, 66, 193, 0.1) 0%, rgba(111, 66, 193, 0.05) 90%);
}

/* 粉色主题 */
body.theme-pink {
    --primary-color: #e91e63;
    --primary-hover-color: #ad1457;
    --secondary-hover-color: #5a6268;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #fce4ec;
    --dark-color: #c2185b;
    --border-color: #f48fb1;
    --background-color: #fff0f6;
    --text-color: #c2185b;
    --shadow-color: rgba(233, 30, 99, 0.15);
    --pattern-background: radial-gradient(circle at 10% 20%, rgba(233, 30, 99, 0.1) 0%, rgba(233, 30, 99, 0.05) 90%);
}

/* 橙色主题 */
body.theme-orange {
    --primary-color: #fd7e14;
    --primary-hover-color: #e65100;
    --secondary-hover-color: #5a6268;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #fff3e0;
    --dark-color: #e67e22;
    --border-color: #ffb74d;
    --background-color: #fff8f0;
    --text-color: #e67e22;
    --shadow-color: rgba(253, 126, 20, 0.15);
    --pattern-background: radial-gradient(circle at 10% 20%, rgba(253, 126, 20, 0.1) 0%, rgba(253, 126, 20, 0.05) 90%);
}

/* 深色主题 */
body.theme-dark {
    --primary-color: #20c997;
    --primary-hover-color: #1aa580;
    --secondary-color: #6c757d;
    --secondary-hover-color: #5a6268;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #1a1a1a;
    --dark-color: #17a673;
    --border-color: #17a673;
    --background-color: #121212;
    --text-color: #20c997;
    --shadow-color: rgba(32, 201, 151, 0.15);
    --pattern-background: radial-gradient(circle at 10% 20%, rgba(32, 201, 151, 0.1) 0%, rgba(32, 201, 151, 0.05) 90%);
}

body.theme-dark .timetable {
    background-color: var(--background-color);
    border-color: var(--border-color);
}

body.theme-dark .timetable-container {
    background-color: var(--background-color);
}

body.theme-dark .section-title {
    background-color: var(--primary-color);
    color: white;
}

body.theme-dark .section-controls {
    background-color: var(--light-color);
    border-color: var(--border-color);
}

body.theme-dark .section-controls button {
    background-color: var(--background-color);
    color: var(--text-color);
    border-color: var(--border-color);
}

body.theme-dark .section-controls button:hover {
    background-color: var(--primary-color);
    color: white;
}

body.theme-dark .cell {
    background-color: var(--background-color);
    border-color: var(--border-color);
    color: var(--text-color);
}

body.theme-dark .cell:hover {
    background-color: var(--light-color);
}

body.theme-dark .cell.occupied {
    background-color: var(--background-color);
}

/* 深色主题下cell-content的颜色由JavaScript控制 */
body.theme-dark .cell-content {
    /* 颜色继承自内联样式 */
}

body.theme-dark .period-cell {
    background-color: var(--light-color);
    color: var(--text-color);
}

body.theme-dark .time-cell {
    background-color: var(--light-color);
    color: var(--text-color);
}

body.theme-dark th {
    background-color: #333;
    color: var(--text-color);
}

body.theme-dark .header {
    background: var(--light-color);
    border-color: var(--border-color);
}

body.theme-dark .timetable-title {
    color: var(--primary-color);
}

body.theme-dark .btn {
    background: var(--light-color);
    color: var(--text-color);
    border-color: var(--border-color);
}

body.theme-dark .btn:hover {
    background: var(--dark-color);
    color: white;
}

body.theme-dark .btn.primary {
    background: var(--primary-color);
    color: white;
}

body.theme-dark .btn.primary:hover {
    background: var(--dark-color);
}

body.theme-dark .modal-content {
    background: var(--light-color);
    color: var(--text-color);
}

body.theme-dark .modal-header {
    background: var(--primary-color);
    color: white;
}

body.theme-dark .modal-footer {
    background: var(--light-color);
    border-top-color: var(--border-color);
}

body.theme-dark .form-group label {
    color: var(--text-color);
}

body.theme-dark .form-control {
    background: var(--background-color);
    color: var(--text-color);
    border-color: var(--border-color);
}

body.theme-dark .form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem var(--shadow-color);
}

body.theme-dark .subject-item {
    background: var(--background-color);
    border-color: var(--border-color);
}

body.theme-dark .subject-item:hover {
    background: var(--light-color);
}

body.theme-dark .color-picker {
    background: var(--background-color);
    border-color: var(--border-color);
}

body.theme-dark .color-options {
    background: var(--light-color);
    border-color: var(--border-color);
}

body.theme-dark .color-type-selector label {
    color: var(--text-color);
}

body.theme-dark .settings-panel {
    background: var(--light-color);
    border-color: var(--border-color);
}

body.theme-dark .settings-panel h3 {
    color: var(--primary-color);
}

body.theme-dark .settings-panel label {
    color: var(--text-color);
}

body.theme-dark .settings-panel .form-control {
    background: var(--background-color);
    color: var(--text-color);
    border-color: var(--border-color);
}

/* 深色主题下设置弹窗样式 */
body.theme-dark #settingsModal .modal-content {
    background: var(--light-color);
    color: var(--text-color);
}

/* 深色主题下设置弹窗标题 */
body.theme-dark #settingsModal .modal-content h3 {
    color: #ffffff !important;
}

body.theme-dark .setting-item {
    background: var(--background-color);
    border-color: var(--border-color);
}

body.theme-dark .setting-item:hover {
    background: rgba(32, 201, 151, 0.1);
}

body.theme-dark .setting-text strong {
    color: #ffffff !important;
}

body.theme-dark .setting-text small {
    color: #aaaaaa !important;
}

body.theme-dark .setting-label .checkmark {
    background: var(--background-color);
    border-color: var(--border-color);
}

/* 深色主题下科目弹窗样式 */
body.theme-dark #subjectModal .modal-content {
    background: var(--light-color);
    color: var(--text-color);
}

body.theme-dark #subjectModal .modal-content h3 {
    color: #ffffff !important;
}

body.theme-dark #subjectModal .form-group > label {
    color: #ffffff !important;
}

body.theme-dark .period-controls-desktop {
    background: var(--light-color);
    border-color: var(--border-color);
}

body.theme-dark .period-control-line span {
    color: var(--text-color);
}

body.theme-dark .period-control-line .btn {
    background: var(--background-color);
    color: var(--text-color);
    border-color: var(--border-color);
}

body.theme-dark .period-control-line .btn:hover {
    background: var(--primary-color);
    color: white;
}

body.theme-dark .period-control-line .btn.danger {
    background: var(--danger-color);
    color: white;
}

body.theme-dark .period-control-line .btn.danger:hover {
    background: #c82333;
}

body.theme-dark .subject-pool-header {
    background: var(--light-color);
    border-color: var(--border-color);
}

body.theme-dark .subject-pool-header h3 {
    color: var(--primary-color);
}

/* 深色主题下科目池中的科目名称样式 - 确保清晰可见 */
body.theme-dark .subject-card .subject-name {
    color: var(--text-color) !important;
    font-weight: 600 !important;
}

/* 深色主题下科目池中的老师姓名样式 - 确保清晰可见 */
body.theme-dark .subject-card .teacher-name {
    color: var(--text-color) !important;
    opacity: 0.8;
}

/* 深色主题下科目操作按钮样式 - 确保清晰可见 */
body.theme-dark .subject-actions .btn-text {
    color: var(--text-color) !important;
    background-color: transparent !important;
    border: 1px solid var(--border-color) !important;
    transition: all 0.3s ease !important;
}

body.theme-dark .subject-actions .btn-text:hover {
    background-color: var(--primary-color) !important;
    color: white !important;
    border-color: var(--primary-color) !important;
    box-shadow: 0 2px 8px rgba(32, 201, 151, 0.3) !important;
}

/* 深色主题下科目卡片内部信息样式 */
body.theme-dark .subject-info {
    color: var(--text-color) !important;
}

body.theme-dark .subject-pool {
    background-color: var(--background-color);
    border-color: var(--border-color);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

body.theme-dark .subjects {
    background-color: var(--background-color);
}

body.theme-dark .subject-card {
    background-color: var(--light-color);
    border-color: var(--border-color);
    color: var(--text-color);
}

body.theme-dark .subject-card:hover {
    background-color: var(--dark-color);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--background-color);
    background-image: var(--pattern-background);
    background-attachment: fixed;
    color: var(--text-color);
    line-height: 1.6;
    font-size: 16px;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* 标题和文本样式优化 */
h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 0.5em;
    color: var(--text-color);
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
}

h2 {
    font-size: 2rem;
}

h3 {
    font-size: 1.5rem;
}

h4 {
    font-size: 1.25rem;
}

h5 {
    font-size: 1.1rem;
}

h6 {
    font-size: 1rem;
}

/* 段落和文本样式 */
p {
    margin-bottom: 1em;
    line-height: 1.7;
}

/* 按钮文本优化 */
.btn {
    font-weight: 500;
    letter-spacing: 0.02em;
}

/* 输入框文本优化 */
input, textarea, select {
    font-family: inherit;
    font-size: 0.95em;
}

.header {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px var(--shadow-color);
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.title-section {
    flex: 1;
}

.timetable-title {
    font-size: 28px;
    font-weight: bold;
    color: var(--primary-color);
    border: none;
    background: transparent;
    padding: 5px 10px;
    border-bottom: 2px solid transparent;
    transition: border-color 0.3s;
    width: 300px;
}

.timetable-title:focus {
    outline: none;
    border-bottom-color: var(--primary-color);
}

.controls {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 36px;
    box-sizing: border-box;
}

.btn.small {
    padding: 8px 16px;
    font-size: 12px;
    height: 36px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 60px;
    box-sizing: border-box;
}

.btn.primary {
    background: var(--primary-color);
    color: white;
}

.btn.primary:hover {
    background: var(--dark-color);
}

.btn.secondary {
    background: var(--secondary-color);
    color: white;
}

.btn.secondary:hover {
    background: #545b62;
}

.btn.tertiary {
    background: var(--success-color);
    color: white;
}

.btn.tertiary:hover {
    background: #1e7e34;
}

.btn.danger {
    background: var(--danger-color);
    color: white;
}

/* 课时增减按钮现代化设计 */
.period-controls .btn.small,
.period-controls-desktop .btn.small {
    background: transparent;
    border: 1px solid rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    position: relative;
    overflow: hidden;
}

.period-controls .btn.small:hover,
.period-controls-desktop .btn.small:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #1d4ed8;
    border-color: rgba(59, 130, 246, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.period-controls .btn.small:active,
.period-controls-desktop .btn.small:active {
    transform: translateY(0);
    background: rgba(59, 130, 246, 0.15);
}

/* 减少按钮（危险操作）样式 */
.period-controls .btn.small.danger,
.period-controls-desktop .btn.small.danger {
    border-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
}

.period-controls .btn.small.danger:hover,
.period-controls-desktop .btn.small.danger:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
}

.period-controls .btn.small.danger:active,
.period-controls-desktop .btn.small.danger:active {
    background: rgba(239, 68, 68, 0.15);
}

.btn.danger:hover {
    background: #c82333;
}

/* 导出下拉菜单样式 */
.export-dropdown {
    position: relative;
    display: inline-block;
    z-index: 99998; /* 确保下拉按钮本身也有高z-index */
}

/* PC端下拉菜单基础样式 */
.export-menu,
.backup-menu {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--light-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    min-width: 150px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

/* 深色主题下的下拉菜单样式 */
body.theme-dark .export-menu,
body.theme-dark .backup-menu {
    background: var(--background-color);
    border-color: var(--border-color);
    color: var(--text-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 深色主题下的下拉菜单项样式 */
body.theme-dark .export-item,
body.theme-dark .backup-item {
    color: var(--text-color);
    background: transparent;
    border-bottom-color: var(--border-color);
}

body.theme-dark .export-item:hover,
body.theme-dark .backup-item:hover {
    background: var(--light-color);
    color: var(--primary-color);
}

/* 深色主题下的主题菜单样式 */
body.theme-dark #themeMenu {
    background: var(--background-color);
    border-color: var(--border-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

body.theme-dark .theme-item {
    color: var(--text-color);
    background: transparent;
}

body.theme-dark .theme-item:hover {
    background: var(--light-color);
    color: var(--primary-color);
}

/* 深色主题下的字体菜单样式 */
body.theme-dark #fontMenu {
    background: var(--background-color);
    border-color: var(--border-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

body.theme-dark .font-item {
    color: var(--text-color);
    background: transparent;
}

body.theme-dark .font-item:hover {
    background: var(--light-color);
    color: var(--primary-color);
}

/* 深色主题下自定义颜色区域样式 */
body.theme-dark .custom-color {
    background: var(--light-color);
    border-color: var(--border-color);
}

body.theme-dark .custom-color span {
    color: var(--text-color);
}

.export-menu.show,
.backup-menu.show {
    display: block;
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

/* 确保所有可能干扰下拉菜单的元素都有较低的z-index */
.fixed-top-area,
.period-controls,
.period-control-line,
.period-control-item,
.period-control-label,
.period-control-input,
.period-control-button {
    z-index: 1000 !important;
    position: relative !important;
}

/* 特别保护下拉按钮容器 */
.export-dropdown,
.backup-dropdown {
    z-index: 99998 !important;
    position: relative !important;
    isolation: isolate !important;
}

/* 创建新的层叠上下文，确保下拉菜单不被其他元素影响 */
.export-dropdown::before,
.backup-dropdown::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    pointer-events: none;
}

/* 手机端汉堡菜单按钮样式 */
@media (max-width: 768px) {
    /* 隐藏手机端的controls菜单栏 */
    .controls {
        display: none !important;
    }
    
    .hamburger-btn {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        width: 40px !important;
        height: 40px !important;
        background: none !important;
        border: none !important;
        cursor: pointer !important;
        padding: 0 !important;
        margin: 0 !important;
        z-index: 1000001 !important;
        position: relative !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important; /* 防止按钮被压缩 */
        order: 2 !important; /* 确保在右侧 */
    }
    
    .hamburger-line {
        width: 24px !important;
        height: 3px !important;
        background-color: var(--text-color) !important;
        margin: 2px 0 !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        border-radius: 2px !important;
        transform-origin: center !important;
    }
    
    /* 汉堡按钮激活状态 */
    .hamburger-btn.active .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px) !important;
    }
    
    .hamburger-btn.active .hamburger-line:nth-child(2) {
        opacity: 0 !important;
        transform: scaleX(0) !important;
    }
    
    .hamburger-btn.active .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px) !important;
    }
    
    /* 侧边栏样式 */
    .mobile-sidebar {
        position: fixed !important;
        top: 0 !important;
        right: 0 !important;
        width: 320px !important;
        max-width: 85vw !important;
        height: 100vh !important;
        background: var(--light-color) !important;
        box-shadow: -5px 0 20px rgba(0,0,0,0.15) !important;
        z-index: 1000000 !important;
        transform: translateX(100%) !important;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
    }
    
    .mobile-sidebar.show {
        transform: translateX(0) !important;
    }
    
    .sidebar-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 20px 25px 15px !important;
        border-bottom: 1px solid #eee !important;
        background: #f8f9fa !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 1 !important;
    }
    
    .sidebar-header h3 {
        margin: 0 !important;
        font-size: 20px !important;
        font-weight: 600 !important;
        color: #333 !important;
    }
    
    .close-sidebar-btn {
        background: none !important;
        border: none !important;
        font-size: 28px !important;
        cursor: pointer !important;
        color: #999 !important;
        padding: 0 !important;
        width: 30px !important;
        height: 30px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        transition: all 0.2s !important;
    }
    
    .close-sidebar-btn:hover {
        background: #f0f0f0 !important;
        color: #333 !important;
    }
    
    .sidebar-content {
        flex: 1 !important;
        padding: 20px 0 !important;
        overflow-y: auto !important;
    }
    
    .sidebar-section {
        margin-bottom: 25px !important;
        padding: 0 25px !important;
    }
    
    .sidebar-section h4 {
        margin: 0 0 15px 0 !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        color: #666 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
    }
    
    .sidebar-btn {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        padding: 15px 20px !important;
        margin-bottom: 8px !important;
        background: white !important;
        border: 1px solid #eee !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
        font-size: 15px !important;
        color: #333 !important;
        text-align: left !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    }
    
    .sidebar-btn:hover {
        background: #f8f9fa !important;
        border-color: #007bff !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15) !important;
    }
    
    .sidebar-btn:active {
        transform: translateY(0) !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
    }
    
    .sidebar-btn .icon {
        width: 20px !important;
        height: 20px !important;
        margin-right: 12px !important;
        flex-shrink: 0 !important;
    }
    
    /* 侧边栏主题网格 */
    .sidebar-theme-grid,
    .sidebar-font-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 8px !important;
        padding: 0 5px !important;
        margin-bottom: 10px !important;
    }
    
    .sidebar-theme-btn,
    .sidebar-font-btn {
        padding: 10px 8px !important;
        border: 1px solid #e0e0e0 !important;
        border-radius: 8px !important;
        background: white !important;
        color: #333 !important;
        font-size: 12px !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        text-align: center !important;
    }
    
    .sidebar-theme-btn:hover,
    .sidebar-font-btn:hover {
        background: var(--light-color) !important;
        border-color: var(--primary-color) !important;
    }
    
    .sidebar-theme-btn.active,
    .sidebar-font-btn.active {
        background: var(--primary-color) !important;
        color: white !important;
        border-color: var(--primary-color) !important;
    }
    
    /* 侧边栏自定义颜色 */
    .sidebar-custom-color {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        padding: 10px 5px !important;
        background: #f8f9fa !important;
        border-radius: 8px !important;
    }
    
    .sidebar-custom-color input[type="color"] {
        width: 36px !important;
        height: 36px !important;
        border: none !important;
        border-radius: 6px !important;
        cursor: pointer !important;
    }
    
    .sidebar-custom-color span {
        font-size: 13px !important;
        color: #666 !important;
    }
    
    /* 侧边栏遮罩层 */
    .sidebar-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.5) !important;
        z-index: 999999 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: all 0.3s ease !important;
        backdrop-filter: blur(2px) !important;
    }
    
    .sidebar-overlay.show {
        opacity: 1 !important;
        visibility: visible !important;
    }
}

/* PC端隐藏汉堡按钮 */
@media (min-width: 769px) {
    .hamburger-btn {
        display: none !important;
    }
    
    .mobile-sidebar {
        display: none !important;
    }
    
    .sidebar-overlay {
        display: none !important;
    }
}

/* 深色主题下的侧边栏样式 */
@media (max-width: 768px) {
    body.theme-dark .mobile-sidebar {
        background: var(--background-color) !important;
        border-left: 1px solid var(--border-color) !important;
    }
    
    body.theme-dark .sidebar-header {
        background: var(--light-color) !important;
        border-bottom-color: var(--border-color) !important;
    }
    
    body.theme-dark .sidebar-header h3 {
        color: var(--text-color) !important;
    }
    
    body.theme-dark .close-sidebar-btn {
        color: var(--text-color) !important;
    }
    
    body.theme-dark .close-sidebar-btn:hover {
        background: var(--background-color) !important;
    }
    
    body.theme-dark .sidebar-section h4 {
        color: var(--text-color) !important;
    }
    
    body.theme-dark .sidebar-btn {
        background: var(--light-color) !important;
        border-color: var(--border-color) !important;
        color: var(--text-color) !important;
    }
    
    body.theme-dark .sidebar-btn:hover {
        background: var(--primary-color) !important;
        color: white !important;
        border-color: var(--primary-color) !important;
    }
    
    body.theme-dark .sidebar-theme-btn,
    body.theme-dark .sidebar-font-btn {
        background: var(--light-color) !important;
        border-color: var(--border-color) !important;
        color: var(--text-color) !important;
    }
    
    body.theme-dark .sidebar-theme-btn:hover,
    body.theme-dark .sidebar-font-btn:hover {
        background: var(--background-color) !important;
        border-color: var(--primary-color) !important;
        color: var(--primary-color) !important;
    }
    
    body.theme-dark .sidebar-custom-color {
        background: var(--light-color) !important;
    }
    
    body.theme-dark .sidebar-custom-color span {
        color: var(--text-color) !important;
    }
    
    /* 深色主题下移动端下拉菜单样式 */
    body.theme-dark .export-menu,
    body.theme-dark .backup-menu {
        background: var(--background-color) !important;
        border-color: var(--border-color) !important;
    }
    
    body.theme-dark .export-item,
    body.theme-dark .backup-item {
        color: var(--text-color) !important;
    }
    
    body.theme-dark .export-item:hover,
    body.theme-dark .backup-item:hover {
        background: var(--light-color) !important;
        color: var(--primary-color) !important;
    }
}

/* 移动端下拉菜单样式 */
@media (max-width: 768px) {
    .export-menu,
    .backup-menu {
        position: fixed !important;
        top: auto !important;
        bottom: 20px !important;
        left: 20px !important;
        right: 20px !important;
        width: auto !important;
        min-width: auto !important;
        max-height: 50vh !important;
        overflow-y: auto !important;
        border-radius: 12px !important;
        box-shadow: 0 -8px 32px rgba(0,0,0,0.25) !important;
        z-index: 999999 !important;
        transform: translateY(120%) !important;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        /* 确保不会被键盘遮挡 */
        margin-bottom: env(keyboard-inset-height, 0px);
        /* 添加背景模糊效果 */
        backdrop-filter: blur(10px) !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        /* 确保菜单在最顶层 */
        isolation: isolate !important;
        contain: layout style paint !important;
        /* 强制创建新的层叠上下文 */
        will-change: transform !important;
        /* 确保菜单始终可见 */
        pointer-events: auto !important;
    }
    
    .export-menu.show,
    .backup-menu.show {
        transform: translateY(0) !important;
    }
    
    /* 确保保存图片按钮在移动端可见且易操作 */
    .export-item,
    .backup-item {
        padding: 18px 24px !important;
        font-size: 16px !important;
        min-height: 56px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        border-bottom: 1px solid rgba(0,0,0,0.05) !important;
        transition: background-color 0.2s ease !important;
        /* 增加触摸区域 */
        touch-action: manipulation !important;
        -webkit-tap-highlight-color: rgba(0,0,0,0.1) !important;
    }
    
    .export-item:last-child,
    .backup-item:last-child {
        border-bottom: none !important;
        border-radius: 0 0 12px 12px !important;
    }
    
    .export-item:first-child,
    .backup-item:first-child {
        border-radius: 12px 12px 0 0 !important;
    }
    
    .export-item:active,
    .backup-item:active {
        background-color: rgba(0,0,0,0.05) !important;
        transform: scale(0.98) !important;
    }
    
    /* 确保下拉按钮在移动端也有足够的层级 */
    .export-dropdown,
    .backup-dropdown {
        z-index: 999999 !important;
        position: relative !important;
        /* 确保按钮容器不会影响菜单的层级 */
        isolation: isolate !important;
    }
    
    /* 移动端菜单遮罩层 */
    .dropdown-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: rgba(0, 0, 0, 0.3) !important;
        z-index: 999997 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.3s ease, visibility 0.3s ease !important;
        backdrop-filter: blur(2px) !important;
    }
    
    .dropdown-overlay.show {
        opacity: 1 !important;
        visibility: visible !important;
    }
}


.export-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 15px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-color);
    transition: background-color 0.2s ease;
    border-bottom: 1px solid #f0f0f0;
}

.export-item:last-child {
    border-bottom: none;
}

.export-item:hover {
    background-color: var(--light-color);
}

.export-item .icon {
    width: 16px;
    height: 16px;
    stroke: currentColor;
}

/* SVG图标通用样式 */
.icon {
    width: 18px;
    height: 18px;
    stroke: currentColor;
    stroke-width: 2;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
}

/* 备份数据下拉菜单样式 */
.backup-dropdown {
    position: relative;
    display: inline-block;
    z-index: 99998; /* 确保下拉按钮本身也有高z-index */
}


.backup-item {
    display: block;
    width: 100%;
    padding: 10px 15px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: background-color 0.2s ease;
    border-radius: 0;
}

.backup-item:first-child {
    border-radius: 6px 6px 0 0;
}

.backup-item:last-child {
    border-radius: 0 0 6px 6px;
}

.backup-item:hover {
    background: #f8f9fa;
    color: #007bff;
}

.backup-item:active {
    background: #e9ecef;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 通知动画 */
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100%);
    }
}



/* PC端左右两栏布局 */
@media (min-width: 769px) {
    .main-content {
        display: flex;
        gap: 30px;
        align-items: flex-start;
    }
    
    /* 左侧栏：课时控制和科目池 */
    .left-sidebar {
        flex: 0 0 300px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    /* 右侧栏：课程表格 */
    .right-content {
        flex: 1;
        min-width: 0;
    }
    
    /* PC端课时控制区域 */
    .period-controls-desktop {
        display: block;
        padding: 20px;
        background-color: var(--background-color);
        border-radius: 8px;
        border: 1px solid var(--border-color);
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    /* 统一科目池模块样式 */
/* 科目池样式 - 确保使用主题色变量 */
.subject-pool {
    background-color: var(--background-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 8px var(--shadow-color);
    overflow: hidden;
}

.subject-pool-header {
    background-color: var(--background-color);
    border-bottom: 1px solid var(--border-color);
}

.subjects {
    background-color: var(--background-color);
}

.subject-card {
    background-color: var(--light-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    transition: all 0.3s ease;
}

.subject-card:hover {
    box-shadow: 0 4px 12px var(--shadow-color);
    transform: translateY(-1px);
}

/* 编辑和删除按钮样式 */
.subject-actions .btn-text {
    color: var(--text-color);
    background-color: transparent;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.subject-actions .btn-text:hover {
    background-color: var(--primary-color);
    color: white;
}

/* 深色主题下的科目卡片样式 */
body.theme-dark .subject-card {
    background-color: var(--light-color) !important;
    border: 1px solid var(--border-color) !important;
    color: var(--text-color) !important;
}

body.theme-dark .subject-card:hover {
    background-color: rgba(32, 201, 151, 0.1) !important;
    box-shadow: 0 4px 12px var(--shadow-color) !important;
}

body.theme-dark .subject-actions .btn-text {
    color: var(--text-color) !important;
    background-color: transparent !important;
    border: 1px solid var(--border-color) !important;
}

body.theme-dark .subject-actions .btn-text:hover {
    background-color: var(--primary-color) !important;
    color: white !important;
}

/* 为所有主题添加科目池样式 */
.theme-blue .subject-card:hover {
    background-color: rgba(0, 123, 255, 0.1);
}

.theme-purple .subject-card:hover {
    background-color: rgba(111, 66, 193, 0.1);
}

.theme-pink .subject-card:hover {
    background-color: rgba(233, 30, 99, 0.1);
}

.theme-orange .subject-card:hover {
    background-color: rgba(253, 126, 20, 0.1);
}

.theme-dark .subject-card:hover {
    background-color: rgba(32, 201, 151, 0.1);
}
    
    .period-controls-desktop .period-control-line {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 15px;
        margin-bottom: 12px;
        padding: 8px 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .period-controls-desktop .period-control-line:last-child {
        margin-bottom: 0;
        border-bottom: none;
    }
    
    .period-controls-desktop span {
        font-weight: 500;
        color: var(--text-color);
        min-width: 80px;
        font-size: 14px;
    }
    
    /* 优化按钮样式 */
    .period-controls-desktop .btn {
        margin-left: 0;
        margin-right: 0;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 6px;
    }
    
    .period-controls-desktop .btn.danger {
        margin-left: 8px;
    }
    
    /* 调整科目池内部间距 */
    .subject-pool-header {
        margin-bottom: 8px;
    }
    
    .subjects {
        padding: 0 20px 20px 20px;
    }
    
    /* PC端科目池样式调整 */
    .subject-pool {
        width: 100%;
        max-height: 700px;
        min-height: 500px;
    }
    
    /* PC端隐藏fixed-top-area中的period-controls */
    .fixed-top-area .period-controls {
        display: none;
    }
}

/* 微信浏览器特殊优化 */
@supports (-webkit-touch-callout: none) {
    /* iOS Safari 和微信浏览器 */
    body {
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        -webkit-overflow-scrolling: touch;
    }
    
    .fixed-top-area {
        padding-top: env(safe-area-inset-top);
    }
    
    /* 微信浏览器科目池特殊优化 */
    .subject-pool {
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
    
    .subjects {
        -webkit-overflow-scrolling: touch;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
    
    /* 微信浏览器课时控制按钮优化 */
    .fixed-top-area .period-controls .period-control-line .btn.small {
        -webkit-appearance: none !important; /* 移除默认样式 */
        -webkit-tap-highlight-color: transparent !important; /* 移除触摸高亮 */
        -webkit-user-select: none !important; /* 防止文本选择 */
        user-select: none !important;
        -webkit-touch-callout: none !important; /* 防止长按菜单 */
    }
    
    /* 确保在微信浏览器中按钮内容居中 */
    @supports (-webkit-touch-callout: none) {
        .fixed-top-area .period-controls .period-control-line .btn.small {
            display: -webkit-flex !important;
            -webkit-align-items: center !important;
            -webkit-justify-content: center !important;
        }
    }
}

/* 移动端保持原有布局 */
@media (max-width: 768px) {
    /* 微信浏览器viewport优化 */
    @supports (-webkit-touch-callout: none) {
        .container {
            padding-top: 220px !important; /* 增加顶部间距防止被遮挡 */
        }
    }
    
    .main-content {
        display: flex;
        flex-direction: column;
        gap: 0;
    }
    
    .left-sidebar {
        display: block;
        width: 100%;
    }
    
    .right-content {
        display: block;
        width: 100%;
    }
    
    .period-controls-desktop {
        display: none !important;
    }
    
    /* 隐藏移动端左侧栏的课时设置标题 */
    .left-sidebar .section-title:nth-child(1) {
        display: none !important;
    }
}

/* PC端样式 - 保持原有布局 */
.fixed-top-area {
    position: static;
    background: transparent;
    box-shadow: none;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* 移动端顶部固定区域优化 */
@media (max-width: 768px) {
    .fixed-top-area {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 1000 !important;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
        box-shadow: 0 2px 15px rgba(0,0,0,0.08) !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        max-width: 100vw !important;
        width: 100vw !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
        transform: translateX(0) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
    }
    
    /* 微信浏览器安全区域适配 */
    @supports (-webkit-touch-callout: none) {
        .fixed-top-area {
            padding-top: env(safe-area-inset-top) !important;
        }
    }
}

/* PC端header保持原有样式 */
.fixed-top-area .header {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    min-height: 60px;
}

/* 标题区域优化 */
.fixed-top-area .header .title-section {
    flex: 0 0 auto;
    min-width: 200px;
    margin-right: 20px;
}

/* 控制按钮区域优化 */
.fixed-top-area .header .controls {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: nowrap;
    justify-content: flex-end;
    flex: 1;
    min-width: 0;
}

/* 按钮样式优化 */
.fixed-top-area .header .btn {
    white-space: nowrap;
    flex-shrink: 0;
}

/* 移动端header优化 */
@media (max-width: 768px) {
    .fixed-top-area .header {
        background: transparent !important;
        border-radius: 0 !important;
        padding: 15px 20px !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-bottom: 1px solid rgba(0,0,0,0.1) !important;
        backdrop-filter: blur(5px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
        display: flex !important;
        justify-content: space-between !important; /* 左右分布：标题在左，汉堡按钮在右 */
        align-items: center !important;
        flex-wrap: nowrap !important;
        min-height: 50px !important;
    }
    
    /* 确保标题在左侧 */
    .fixed-top-area .header h1 {
        margin: 0 !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        color: #333 !important;
        flex: 1 !important;
        text-align: left !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
    }
}

/* PC端period-controls保持原有样式 */
.fixed-top-area .period-controls {
    margin-bottom: 15px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    text-align: center;
}

/* 移动端课时控制优化 */
@media (max-width: 768px) {
    .fixed-top-area .period-controls {
        background: rgba(255,255,255,0.9) !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 12px 15px !important; /* 减少垂直内边距 */
        box-shadow: none !important;
        border-bottom: 1px solid rgba(0,0,0,0.1) !important;
        backdrop-filter: blur(5px) !important;
        -webkit-backdrop-filter: blur(5px) !important;
        display: flex !important;
        flex-direction: row !important; /* 改为水平布局 */
        justify-content: space-around !important;
        align-items: center !important;
        gap: 8px !important; /* 减少间距 */
        z-index: 1000 !important; /* 确保课时控制区域层级低于下拉菜单 */
        position: relative !important;
    }
    
    .fixed-top-area .period-controls .period-control-line {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        margin-bottom: 0 !important;
        font-size: 14px !important;
        color: #333 !important;
    }
    
    .fixed-top-area .period-controls .btn {
        padding: 8px 12px !important;
        font-size: 14px !important;
        border-radius: 20px !important;
        background: rgba(74, 124, 89, 0.1) !important;
        color: #4a7c59 !important;
        border: 1px solid rgba(74, 124, 89, 0.2) !important;
        transition: all 0.3s ease !important;
    }
    
    .fixed-top-area .period-controls .btn:hover {
        background: rgba(74, 124, 89, 0.2) !important;
        transform: translateY(-1px) !important;
    }
    
    .fixed-top-area .period-controls .btn.danger {
        background: rgba(220, 53, 69, 0.1) !important;
        color: #dc3545 !important;
        border-color: rgba(220, 53, 69, 0.2) !important;
    }
    
    .fixed-top-area .period-controls .btn.danger:hover {
        background: rgba(220, 53, 69, 0.2) !important;
    }
}

/* PC端容器保持原有样式 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

    /* 移动端容器优化 */
    @media (max-width: 768px) {
        .container {
            padding-top: 280px !important; /* 增加顶部间距，确保科目池不被遮挡 */
            padding-left: 15px !important;
            padding-right: 15px !important;
            padding-bottom: 20px !important;
            max-width: none !important;
            width: auto !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }
        
        /* 微信浏览器特殊优化 */
        @supports (-webkit-touch-callout: none) {
            .container {
                padding-top: 320px !important; /* 微信浏览器需要更多间距 */
            }
        }
    }

@media (max-width: 768px) {
    /* 移动端表格样式优化 */
    .timetable th,
    .timetable td {
        min-width: 70px; /* 设置最小宽度确保内容可读 */
        max-width: 100px; /* 设置最大宽度防止过宽 */
        font-size: 12px; /* 减小字体大小 */
        padding: 8px 4px; /* 减小内边距 */
    }
    
    .timetable .time-header,
    .timetable .period-header {
        min-width: 60px; /* 时间和课时列更窄 */
        max-width: 80px;
    }
    
    .timetable .weekday-col,
    .timetable .weekend-col {
        min-width: 75px; /* 周一到周日列宽度 */
        max-width: 90px;
    }
    
    /* 移动端固定顶部区域 */
    .fixed-top-area {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 1000 !important;
        background: white !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        width: 100% !important;
        max-width: 100% !important;
    }
    
    /* 移动端header样式 */
    .fixed-top-area .header {
        padding: 10px 15px !important;
        margin: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border-bottom: 1px solid #e9ecef !important;
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 8px !important;
        min-height: 50px !important;
    }
    
    .fixed-top-area .title-section {
        flex: 1 !important;
        text-align: left !important;
    }
    
    .fixed-top-area .title-section h1 {
        margin: 0 !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        color: #333 !important;
        text-align: left !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
    }
    
    .fixed-top-area .timetable-title {
        font-size: 18px !important;
        width: 100% !important;
        text-align: center !important;
        padding: 5px !important;
    }
    
    .fixed-top-area .controls {
        display: none !important; /* 在手机端隐藏controls */
    }
    
    /* 手机端controls已隐藏，不需要按钮样式 */
    /*
    .fixed-top-area .controls .btn {
        padding: 8px 12px !important;
        font-size: 12px !important;
        white-space: nowrap !important;
        min-width: auto !important;
        flex: 0 0 auto !important;
    }
    */
    
    /* 移动端period-controls样式 */
    .fixed-top-area .period-controls {
        margin: 0 !important;
        padding: 10px 15px !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border-bottom: 1px solid #e9ecef !important;
        background: #f8f9fa !important;
        display: flex !important;
        justify-content: space-around !important;
        align-items: center !important;
    }
    
    .fixed-top-area .period-controls .period-control-line {
        display: flex !important;
        flex-direction: column !important; /* 改为垂直布局，文字在上，按钮在下 */
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important; /* 减少间距 */
        margin-bottom: 0 !important;
        font-size: 13px !important; /* 减少字体大小 */
        text-align: center !important;
        flex-wrap: nowrap !important;
        min-width: 80px !important; /* 设置最小宽度 */
    }
    
    .fixed-top-area .period-controls .period-control-line span {
        flex: 0 0 auto !important; /* 防止文字被压缩 */
        white-space: nowrap !important; /* 防止文字换行 */
        font-weight: 600 !important;
        color: #333 !important;
        font-size: 12px !important; /* 减少字体大小 */
        line-height: 1.2 !important; /* 减少行高 */
        margin-bottom: 2px !important; /* 减少底部间距 */
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small {
        flex: 0 0 auto !important; /* 防止按钮被压缩 */
        display: flex !important;
        align-items: center !important;
        justify-content: center !important; /* 按钮内容居中 */
        min-width: 50px !important; /* 增加按钮宽度适应文字 */
        height: 36px !important; /* 增加按钮高度 */
        padding: 8px 12px !important; /* 恢复内边距 */
        font-size: 11px !important; /* 适合文字的字体大小 */
        font-weight: 500 !important; /* 适中的字重 */
        border-radius: 8px !important; /* 圆角矩形，更现代 */
        margin: 0 3px !important; /* 增加按钮间距 */
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; /* 更流畅的动画 */
        text-transform: uppercase !important; /* 大写字母 */
        letter-spacing: 0.5px !important; /* 字母间距 */
        border: 1px solid rgba(59, 130, 246, 0.2) !important; /* 恢复边框 */
        background: transparent !important; /* 透明背景 */
        color: #3b82f6 !important; /* 蓝色文字 */
        text-align: center !important; /* 文本居中 */
        line-height: 1 !important; /* 行高为1 */
        vertical-align: middle !important; /* 垂直居中 */
        position: relative !important; /* 为伪元素定位 */
        overflow: hidden !important; /* 隐藏溢出内容 */
        box-sizing: border-box !important; /* 盒模型 */
    }
    
    /* 增加按钮现代化样式 */
    .fixed-top-area .period-controls .period-control-line .btn.small:not(.danger) {
        background: transparent !important; /* 透明背景 */
        color: #3b82f6 !important; /* 蓝色文字 */
        border: 1px solid rgba(59, 130, 246, 0.2) !important; /* 蓝色边框 */
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small:not(.danger):hover,
    .fixed-top-area .period-controls .period-control-line .btn.small:not(.danger):focus {
        background: rgba(59, 130, 246, 0.1) !important; /* 悬停背景 */
        color: #1d4ed8 !important; /* 深蓝色文字 */
        border-color: rgba(59, 130, 246, 0.4) !important; /* 深蓝色边框 */
        transform: translateY(-1px) !important; /* 轻微上移 */
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15) !important; /* 蓝色阴影 */
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small:not(.danger):active {
        transform: translateY(0) !important; /* 点击时恢复位置 */
        background: rgba(59, 130, 246, 0.15) !important; /* 点击背景 */
    }
    
    /* 减少按钮现代化样式 */
    .fixed-top-area .period-controls .period-control-line .btn.small.danger {
        background: transparent !important; /* 透明背景 */
        color: #ef4444 !important; /* 红色文字 */
        border: 1px solid rgba(239, 68, 68, 0.2) !important; /* 红色边框 */
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small.danger:hover,
    .fixed-top-area .period-controls .period-control-line .btn.small.danger:focus {
        background: rgba(239, 68, 68, 0.1) !important; /* 悬停背景 */
        color: #dc2626 !important; /* 深红色文字 */
        border-color: rgba(239, 68, 68, 0.4) !important; /* 深红色边框 */
        transform: translateY(-1px) !important; /* 轻微上移 */
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15) !important; /* 红色阴影 */
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small.danger:active {
        transform: translateY(0) !important; /* 点击时恢复位置 */
        background: rgba(239, 68, 68, 0.15) !important; /* 点击背景 */
    }
    
    /* 移除光泽效果，使用现代化设计 */
    
    /* 移动端课时控制响应式优化 */
    @media (max-width: 480px) {
        .fixed-top-area .period-controls {
            padding: 15px 10px !important; /* 小屏幕减少内边距 */
            gap: 12px !important; /* 减少间距 */
        }
        
        .fixed-top-area .period-controls .period-control-line {
            gap: 8px !important; /* 减少按钮间距 */
        }
        
        .fixed-top-area .period-controls .period-control-line .btn.small {
            min-width: 45px !important; /* 小屏幕适应文字按钮 */
            height: 32px !important;
            font-size: 10px !important;
            padding: 6px 10px !important;
        }
    }
    
    /* 超小屏幕优化 */
    @media (max-width: 360px) {
        .fixed-top-area .period-controls {
            padding: 12px 8px !important;
            gap: 10px !important;
        }
        
        .fixed-top-area .period-controls .period-control-line {
            gap: 6px !important;
        }
        
        .fixed-top-area .period-controls .period-control-line span {
            font-size: 13px !important;
        }
        
        .fixed-top-area .period-controls .period-control-line .btn.small {
            min-width: 40px !important;
            height: 30px !important;
            font-size: 9px !important;
            padding: 5px 8px !important;
        }
    }
    
    /* 确保按钮在触摸设备上有足够的触摸区域 */
    @media (hover: none) and (pointer: coarse) {
        .fixed-top-area .period-controls .period-control-line .btn.small {
            min-width: 50px !important; /* 触摸设备适应文字按钮 */
            height: 36px !important;
            font-size: 11px !important;
            padding: 8px 12px !important;
        }
    }
    
    /* 移动端按钮触摸优化 */
    .fixed-top-area .period-controls .period-control-line .btn.small:active {
        transform: scale(0.95) !important; /* 触摸时的缩放效果 */
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small:not(.danger):active {
        background: rgba(59, 130, 246, 0.2) !important; /* 增加按钮触摸时的背景色 */
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small.danger:active {
        background: rgba(239, 68, 68, 0.2) !important; /* 减少按钮触摸时的背景色 */
    }
    
    /* 确保按钮内容完美居中 */
    .fixed-top-area .period-controls .period-control-line .btn.small::before {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
    }
    
    /* 移动端按钮悬停效果（支持悬停的设备） */
    @media (hover: hover) {
        .fixed-top-area .period-controls .period-control-line .btn.small:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
    }
    
    /* 移动端按钮焦点状态优化 */
    .fixed-top-area .period-controls .period-control-line .btn.small:focus {
        outline: 2px solid rgba(74, 124, 89, 0.5) !important;
        outline-offset: 2px !important;
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small.danger:focus {
        outline-color: rgba(220, 53, 69, 0.5) !important;
    }
    
    /* 横屏模式优化 */
    @media (orientation: landscape) and (max-width: 768px) {
        .fixed-top-area .period-controls {
            flex-direction: row !important; /* 横屏时改为水平布局 */
            justify-content: space-around !important;
            align-items: center !important;
            padding: 15px 20px !important;
            gap: 20px !important;
        }
        
        .fixed-top-area .period-controls .period-control-line {
            flex-direction: column !important; /* 每行改为垂直布局 */
            gap: 8px !important;
            align-items: center !important;
            justify-content: center !important;
        }
        
        .fixed-top-area .period-controls .period-control-line span {
            font-size: 12px !important;
            text-align: center !important;
        }
        
        .fixed-top-area .period-controls .period-control-line .btn.small {
            min-width: 45px !important;
            height: 32px !important;
            font-size: 10px !important;
            padding: 6px 10px !important;
        }
    }
    
    /* 确保按钮内容完美居中 */
    .fixed-top-area .period-controls .period-control-line .btn.small {
        position: relative !important;
        overflow: hidden !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        line-height: 1 !important;
    }
    
    .fixed-top-area .period-controls .period-control-line .btn.small > * {
        margin: 0 !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    /* 移动端容器样式 */
    .container {
        padding-top: 200px !important; /* 增加顶部间距确保科目池完全不被遮挡 */
        max-width: 100vw !important;
        width: 100vw !important;
        margin: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }
    
    /* 移动端主内容区域样式 */
    .main-content {
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        margin: 0 !important;
        padding: 10px 0 0 0 !important; /* 顶部留出间距 */
    }
    
    /* 移动端科目池样式 */
    .subject-pool {
        order: 1;
        width: 100vw !important;
        margin: 0 !important;
        padding: 15px 0 0 0 !important; /* 确保顶部有足够间距 */
        border-radius: 0 !important;
        box-shadow: none !important;
        display: flex;
        flex-direction: column;
    }
    
    .timetable-container {
        order: 2;
        width: 100vw !important;
        max-width: 100vw !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: auto !important; /* 改为横向滚动 */
        -webkit-overflow-scrolling: touch; /* 优化iOS滚动体验 */
    }
    
    .timetable-wrapper {
        min-width: max-content; /* 确保表格内容不被压缩 */
    }
    
    .timetable {
        min-width: max-content; /* 确保表格可以横向滚动 */
    }
}

.subject-pool {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 600px;
    min-height: 400px;
    display: flex;
    flex-direction: column;
}

.period-controls {
    margin-bottom: 15px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    text-align: center;
}

.period-controls h4 {
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: 600;
    color: #495057;
}

.period-controls .period-control-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
}

.period-controls .period-control-line:last-child {
    margin-bottom: 0;
}

.period-controls .period-control-line span {
    color: #495057;
    font-weight: 600;
}

.period-controls .period-control-line .btn.small {
    padding: 4px 8px;
    min-width: 24px;
    height: 24px;
    font-size: 13px;
    border-radius: 4px;
    margin-left: 4px;
}

.subject-pool-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 8px 20px;
        gap: 6px;
        flex-shrink: 0;
        border-bottom: 1px solid #f0f0f0;
    }

.subject-pool h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.subjects {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 0 20px 20px 20px;
        overflow-y: auto;
        flex: 1;
    }

.subject-card {
    background: #f8f9fa;
    border-radius: 4px;
    padding: 8px 10px;
    cursor: grab;
    transition: all 0.3s ease;
    border: 1px solid transparent;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.subject-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.subject-card:active {
    cursor: grabbing;
}

.subject-card.dragging {
    opacity: 0.5;
    cursor: grabbing;
    transform: rotate(5deg);
}

.subject-info {
    flex: 1;
}

.subject-info .subject-name {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 1px;
    color: var(--text-color);
    transition: color 0.3s ease;
}

.subject-info .teacher-name {
    font-size: 12px;
    color: var(--text-color);
    opacity: 0.8;
    transition: color 0.3s ease;
}

.subject-actions {
    display: flex;
    gap: 4px;
    margin-left: 8px;
}

/* 现代化文字按钮设计 */
.btn-text {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 2px;
    position: relative;
    overflow: hidden;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    min-width: 50px;
    height: 28px;
    box-sizing: border-box;
}

.btn-text:hover {
    transform: translateY(-1px);
}

.btn-text:active {
    transform: translateY(0);
}

/* 编辑按钮现代化设计 */
.edit-btn {
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.2);
    background: rgba(59, 130, 246, 0.05);
}

.edit-btn:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #1d4ed8;
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
}

.edit-btn:active {
    background: rgba(59, 130, 246, 0.15);
    transform: translateY(0);
}

/* 删除按钮现代化设计 */
.delete-btn {
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    background: rgba(239, 68, 68, 0.05);
}

.delete-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
}

.delete-btn:active {
    background: rgba(239, 68, 68, 0.15);
    transform: translateY(0);
}

/* 简洁设计不需要光泽效果 */

/* 按钮图标优化 */
.btn-icon i {
    font-size: 16px;
    line-height: 1;
}

.timetable-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.timetable {
    width: 100%;
    border-collapse: collapse;
}

.timetable th,
.timetable td {
    border: 1px solid var(--border-color);
    padding: 12px;
    text-align: center;
    vertical-align: middle;
}

.timetable th {
    background: var(--light-color);
    font-weight: 700;
    font-size: 16px;
    color: var(--text-color);
}

.time-header {
    width: 60px;
}

.period-header {
    width: 80px;
}

.section-header .section-title {
    background: #e9ecef;
    font-weight: 600;
    text-align: center;
    padding: 8px;
}

.section-controls {
    margin-bottom: 15px;
    display: flex;
    gap: 30px;
    justify-content: center;
    align-items: center;
}

.timetable-title-section {
    text-align: center;
    margin-bottom: 20px;
}

.table-title-input {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    border: none;
    background: var(--light-color);
    padding: 8px 16px;
    outline: none;
    transition: all 0.3s ease;
    width: 300px;
    color: var(--text-color);
    border-radius: 4px;
}

.table-title-input:focus {
    background: var(--primary-color);
    color: white;
    border-radius: 4px;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-group span {
    font-weight: bold;
    min-width: 50px;
}

.btn.danger {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
}

.btn.danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
}

.time-cell {
    background: var(--light-color);
    text-align: center;
    font-weight: bold;
    color: var(--text-color);
    border-right: 1px solid var(--border-color);
    width: 40px;
    min-width: 40px;
    vertical-align: middle;
}

.vertical-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: var(--primary-color);
    height: 100%;
    gap: 2px;
}

.period-cell {
    background: var(--light-color);
    font-weight: 600;
    font-size: 14px;
    color: var(--text-color);
}

.time-display {
    font-size: 12px;
    color: var(--secondary-color);
    margin-top: 4px;
    cursor: pointer;
}

.time-display:hover {
    color: var(--primary-color);
    text-decoration: underline;
}

.section-row {
    background: #e9ecef;
    font-weight: 600;
    text-align: center;
}

.section-row td {
    padding: 8px;
    font-size: 16px;
}

.cell {
    width: 120px;
    height: 80px;
    position: relative;
    transition: all 0.3s ease;
    background: white;
    border: 1px solid var(--border-color);
    color: var(--text-color);
}

.cell:hover {
    background: var(--light-color);
}

.cell.drag-over {
    background: #d4edda;
    border: 2px dashed var(--primary-color);
}

.cell.occupied {
    cursor: default;
}

.cell-content {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
}

.delete-cell-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.9);
    color: var(--danger-color);
    border: none;
    border-radius: 50%;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.2s ease;
}

.cell:hover .delete-cell-btn {
    display: flex;
}

.delete-cell-btn:hover {
    background: var(--danger-color);
    color: white;
    transform: scale(1.1);
}

.cell-content .subject-name {
    font-size: 16px;
    margin-bottom: 3px;
    text-align: center;
    line-height: 1.3;
    font-weight: 700;
    color: inherit;
}

.cell-content .teacher-name {
    font-size: 13px;
    opacity: 0.9;
    text-align: center;
    line-height: 1.2;
    color: inherit;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    align-items: center;
    justify-content: center;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
}

.modal-content {
    position: relative;
    background: var(--light-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    min-width: 300px;
    max-width: 90vw;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    overflow-x: hidden;
    box-shadow: 0 8px 32px var(--shadow-color);
    margin: auto;
    display: block;
}

/* 移除所有弹窗的滚动条 - 使用美化的滚动条 */
.modal-content::-webkit-scrollbar {
    width: 6px;
}

.modal-content::-webkit-scrollbar-track {
    background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
    background: var(--primary-color);
}

.modal-content {
    scrollbar-width: thin;
    scrollbar-color: var(--border-color) transparent;
}

/* 调整科目设置弹窗样式 - PC端宽屏不需要滚动条 */
#subjectModal .modal-content {
    min-width: 500px;
    max-width: 600px;
    max-height: none;
    overflow: visible;
    padding: 24px 28px;
    margin: 20px auto;
    display: flex;
    flex-direction: column;
}

/* PC端颜色选择区域横向布局 */
#subjectModal .color-group {
    margin-bottom: 12px;
}

#subjectModal .color-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

#subjectModal .preset-colors {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 6px;
}

#subjectModal .color-option {
    width: 28px;
    height: 28px;
}

#subjectModal .custom-color-inline {
    display: flex;
    gap: 8px;
    align-items: center;
}

#subjectModal .custom-color-inline input[type="color"] {
    width: 36px;
    height: 28px;
}

#subjectModal .custom-color-inline input[type="text"] {
    width: 80px;
    padding: 4px 8px;
    font-size: 12px;
}

/* 颜色预览区域紧凑 */
#subjectModal .color-preview-section {
    margin-bottom: 12px;
}

#subjectModal .color-preview-section .color-preview {
    padding: 12px 16px;
    font-size: 14px;
}

/* 颜色模式选择器样式 - 简洁风格 */
.form-group:has(.color-mode-selector) {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
}

.form-group:has(.color-mode-selector) > label {
    margin-bottom: 0 !important;
    white-space: nowrap;
    flex-shrink: 0;
}

.color-mode-selector {
    display: inline-flex;
    gap: 8px;
}

.color-mode-option {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    padding: 6px 14px;
    border-radius: 6px;
    transition: all 0.25s ease;
    background: transparent;
    border: none;
    color: #333333;
    font-weight: 500;
    white-space: nowrap;
}

.color-mode-option:hover {
    background: rgba(0, 0, 0, 0.08);
}

.color-mode-option input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
}

.color-mode-option span {
    position: relative;
    z-index: 1;
    color: #333333;
}

/* 选中状态样式 */
.color-mode-option.selected {
    background: var(--primary-color);
}

.color-mode-option.selected span {
    color: #ffffff !important;
}

.color-mode-option.selected:hover {
    background: var(--primary-color);
    filter: brightness(1.1);
}

/* :has() 选择器支持 */
.color-mode-option:has(input[type="radio"]:checked) {
    background: var(--primary-color);
}

.color-mode-option:has(input[type="radio"]:checked) span {
    color: #ffffff !important;
}

.color-mode-option:has(input[type="radio"]:checked):hover {
    background: var(--primary-color);
    filter: brightness(1.1);
}

/* 深色主题适配 */
body.theme-dark .color-mode-option {
    background: transparent !important;
}

body.theme-dark .color-mode-option span {
    color: #ffffff !important;
}

body.theme-dark .color-mode-option:hover {
    background: rgba(255, 255, 255, 0.1) !important;
}

body.theme-dark .color-mode-option.selected,
body.theme-dark .color-mode-option:has(input[type="radio"]:checked) {
    background: #20c997 !important;
}

body.theme-dark .color-mode-option.selected span,
body.theme-dark .color-mode-option:has(input[type="radio"]:checked) span {
    color: #ffffff !important;
}

/* 颜色组样式 */
.color-group {
    margin-bottom: 10px !important;
}

.color-group label {
    font-weight: 600;
    font-size: 13px;
    color: var(--text-color);
    margin-bottom: 6px;
    display: block;
}

.color-group .color-options {
    padding: 10px;
    background: var(--light-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
}

.color-group .preset-colors {
    margin-bottom: 8px;
}

/* 内联自定义颜色选择器 */
.custom-color-inline {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--border-color);
}

.custom-color-inline input[type="color"] {
    width: 36px;
    height: 36px;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    padding: 0;
    background: white;
}

.custom-color-inline input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 2px;
}

.custom-color-inline input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 3px;
}

.custom-color-inline input[type="text"] {
    flex: 1;
    padding: 8px 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 13px;
    font-family: monospace;
    text-transform: uppercase;
}

/* 颜色预览区域 */
.color-preview-section {
    margin-bottom: 16px;
}

.color-preview-section label {
    font-weight: 600;
    font-size: 13px;
    color: var(--text-color);
    margin-bottom: 6px;
    display: block;
}

.color-preview-section .color-preview {
    padding: 16px 20px;
    border-radius: 8px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    min-height: 20px;
    /* 默认样式，会被JS覆盖 */
}

#colorPreview span {
    color: inherit;
}

/* 优化表单元素间距 */
.form-group {
    margin-bottom: 12px !important;
}

/* 科目弹窗表单组更紧凑 */
#subjectModal .form-group {
    margin-bottom: 10px !important;
}

/* 优化自定义颜色区域 */
.custom-color {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 12px;
    padding: 12px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 1px 4px var(--shadow-color);
    transition: all 0.3s ease;
}

.custom-color:hover {
    box-shadow: 0 2px 8px var(--shadow-color);
    border-color: var(--primary-color);
}

.custom-color label {
    font-weight: 600;
    font-size: 14px;
    color: #333333 !important;
    text-align: center;
}

/* 自定义颜色按钮样式 */
#customColorBtn {
    padding: 8px 20px;
    font-size: 14px;
    border-radius: 6px;
    min-width: 100px;
}

.custom-color input[type="color"] {
    width: 40px;
    height: 40px;
    border: 2px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    background: white;
    transition: all 0.3s ease;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0;
    outline: none;
    display: none;
}

.custom-color input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}

.custom-color input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
}

.custom-color input[type="color"]::-moz-color-swatch {
    border: none;
    border-radius: 4px;
}

.custom-color input[type="color"]:hover {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 4px var(--shadow-color);
    transform: scale(1.15);
}

/* 修复颜色选择器弹窗位置 */
#customColor {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
}

/* 自定义颜色选择器样式 */
#customColorPickerDialog {
    position: fixed;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    background: var(--light-color) !important;
    border: 2px solid var(--border-color) !important;
    border-radius: 12px !important;
    padding: 20px !important;
    box-shadow: 0 8px 32px var(--shadow-color) !important;
    z-index: 10000 !important;
    width: 300px !important;
    max-width: 95vw !important;
    box-sizing: border-box !important;
}

#customColorPickerDialog h4 {
    margin-bottom: 15px !important;
    color: var(--text-color) !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    text-align: center !important;
}

#customColorPickerDialog input[type="color"] {
    width: 100% !important;
    height: 60px !important;
    border: 2px solid var(--border-color) !important;
    border-radius: 8px !important;
    cursor: pointer !important;
    background: white !important;
    margin-bottom: 15px !important;
    display: block !important;
}

#customColorPickerDialog input[type="text"] {
    width: 100% !important;
    padding: 10px 16px !important;
    border: 2px solid var(--border-color) !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    background-color: white !important;
    color: var(--text-color) !important;
    margin-bottom: 15px !important;
    box-sizing: border-box !important;
}

#customColorPickerDialog button {
    padding: 8px 16px !important;
    border: none !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    transition: all 0.3s ease !important;
    box-sizing: border-box !important;
}

#customColorPickerDialog #pickerCancel {
    background: var(--secondary-color) !important;
    color: white !important;
}

#customColorPickerDialog #pickerCancel:hover {
    background: var(--secondary-hover-color) !important;
}

#customColorPickerDialog #pickerConfirm {
    background: var(--primary-color) !important;
    color: white !important;
}

#customColorPickerDialog #pickerConfirm:hover {
    background: var(--primary-hover-color) !important;
}

/* 深色主题适配 */
body.theme-dark #customColorPickerDialog {
    background: var(--background-color) !important;
    border-color: var(--border-color) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

body.theme-dark #customColorPickerDialog h4 {
    color: var(--text-color) !important;
}

body.theme-dark #customColorPickerDialog input[type="text"] {
    background: var(--background-color) !important;
    color: var(--text-color) !important;
    border-color: var(--border-color) !important;
}

body.theme-dark #customColorPickerDialog input[type="text"]:focus {
    background: white !important;
    color: #333 !important;
}

body.theme-dark #customColorPickerDialog input[type="color"] {
    background: var(--background-color) !important;
    border-color: var(--border-color) !important;
}

/* 手机端弹窗适配 */
@media (max-width: 768px) {
    /* 弹窗容器优化 */
    #subjectModal .modal-content {
        min-width: auto !important;
        max-width: 92vw !important;
        width: 92vw !important;
        max-height: 90vh !important;
        margin: 5vh auto !important;
        padding: 16px !important;
        position: relative !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
    }
    
    /* 弹窗标题优化 */
    #subjectModal h3 {
        margin-bottom: 16px !important;
        padding-bottom: 10px !important;
        font-size: 18px !important;
        text-align: center !important;
    }
    
    /* 表单组优化 */
    .form-group {
        flex-direction: column;
        align-items: stretch;
        gap: 6px !important;
        margin-bottom: 12px !important;
    }
    
    .form-group label {
        min-width: auto;
        max-width: 100%;
        font-size: 14px !important;
        margin-bottom: 4px !important;
        font-weight: 600 !important;
    }
    
    .form-group input {
        width: 100%;
        padding: 10px 12px !important;
        font-size: 14px !important;
        border-radius: 6px !important;
    }
    
    /* 颜色模式选择器移动端优化 */
    .color-mode-selector {
        flex-direction: row !important;
        gap: 10px !important;
        justify-content: center !important;
    }
    
    .color-mode-option {
        padding: 6px 10px !important;
        font-size: 13px !important;
    }
    
    /* 颜色组移动端优化 */
    .color-group {
        margin-bottom: 10px !important;
    }
    
    .color-group .color-options {
        padding: 8px !important;
    }
    
    /* 内联自定义颜色选择器移动端优化 */
    .custom-color-inline {
        padding-top: 6px !important;
        gap: 6px !important;
    }
    
    .custom-color-inline input[type="color"] {
        width: 32px !important;
        height: 32px !important;
    }
    
    .custom-color-inline input[type="text"] {
        padding: 6px 8px !important;
        font-size: 12px !important;
    }
    
    /* 颜色预览移动端优化 */
    .color-preview-section {
        margin-bottom: 12px !important;
    }
    
    .color-preview-section .color-preview,
    #colorPreview {
        padding: 12px 16px !important;
        font-size: 14px !important;
    }
    
    /* 颜色选项区域优化 */
    .color-options {
        padding: 10px !important;
        gap: 8px !important;
        margin-top: 8px !important;
        border-radius: 8px !important;
    }
    
    /* 颜色类型选择器优化 */
    .color-type-selector {
        flex-direction: row !important;
        justify-content: center !important;
        gap: 20px !important;
        padding: 8px 12px !important;
        margin-bottom: 10px !important;
        border-radius: 6px !important;
    }
    
    /* 预设颜色区域优化 */
    .preset-colors {
        grid-template-columns: repeat(6, 1fr) !important;
        gap: 8px !important;
        padding: 10px !important;
        margin-bottom: 10px !important;
        border-radius: 6px !important;
    }
    
    /* 颜色选项优化 */
    .color-option {
        width: 32px !important;
        height: 32px !important;
        margin: 0 !important;
    }
    
    /* 自定义颜色区域优化 */
    .custom-color {
        flex-direction: column !important;
        align-items: center !important;
        gap: 10px !important;
        margin-top: 10px !important;
        padding: 12px !important;
        border-radius: 8px !important;
    }
    
    .custom-color label {
        font-size: 14px !important;
        text-align: center !important;
    }
    
    /* 自定义颜色按钮优化 */
    #customColorBtn {
        width: auto !important;
        min-width: 120px !important;
        padding: 10px 20px !important;
        font-size: 14px !important;
    }
    
    /* 自定义颜色输入框优化 */
    .custom-color input[type="text"] {
        width: 100% !important;
        max-width: 150px !important;
        padding: 8px 12px !important;
        font-size: 14px !important;
        text-align: center !important;
        border-radius: 6px !important;
    }
    
    /* 表单按钮优化 */
    .form-actions {
        display: flex !important;
        flex-direction: row !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 10px !important;
        margin-top: 16px !important;
        padding-top: 16px !important;
        border-top: 1px solid var(--border-color) !important;
        width: 100% !important;
        box-sizing: border-box !important;
        flex-wrap: nowrap !important;
    }
    
    /* 按钮样式优化 */
    #subjectModal .btn {
        flex: 0 1 auto !important;
        min-width: 60px !important;
        max-width: 85px !important;
        padding: 10px 12px !important;
        font-size: 14px !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        white-space: nowrap !important;
    }
    
    /* 删除按钮特殊处理 */
    #subjectModal #deleteSubjectBtn {
        min-width: 60px !important;
        max-width: 80px !important;
    }
    
    /* 自定义颜色选择器弹窗优化 */
    #customColorPickerDialog {
        width: 280px !important;
        padding: 15px !important;
    }
    
    #customColorPickerDialog h4 {
        margin-bottom: 12px !important;
        font-size: 15px !important;
    }
    
    #customColorPickerDialog input[type="color"] {
        height: 50px !important;
        margin-bottom: 12px !important;
    }
    
    #customColorPickerDialog input[type="text"] {
        padding: 8px 14px !important;
        margin-bottom: 12px !important;
    }
    
    #customColorPickerDialog button {
        padding: 8px 14px !important;
        font-size: 13px !important;
    }
}

.custom-color input[type="text"] {
    width: 120px;
    max-width: 150px;
    padding: 8px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    background-color: white;
    color: #333333 !important;
    text-align: center;
    transition: all 0.3s ease;
}

.custom-color input[type="text"]:hover {
    border-color: var(--primary-color);
}

.custom-color input[type="text"]:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--shadow-color);
    background-color: white;
}

/* 深色主题下的自定义颜色区域优化 */
body.theme-dark .custom-color {
    background: var(--background-color);
    border-color: var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

body.theme-dark .custom-color:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

body.theme-dark .custom-color label {
    color: var(--text-color) !important;
}

body.theme-dark .custom-color input[type="color"] {
    background: var(--background-color);
    border-color: var(--border-color);
}

body.theme-dark .custom-color input[type="text"] {
    background: var(--background-color);
    border-color: var(--border-color);
    color: var(--text-color) !important;
}

body.theme-dark .custom-color input[type="text"]:focus {
    background: white;
    color: #333333 !important;
}

/* 调整预设颜色区域的间距 */
.preset-colors {
    gap: 6px;
    padding: 10px;
    margin-bottom: 8px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: none;
}

/* 调整颜色选项区域的内边距 */
.color-options {
    padding: 12px;
    gap: 10px;
    margin-top: 8px;
    background: var(--light-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 1px 4px var(--shadow-color);
}

/* 调整颜色类型选择器 */
.color-type-selector {
    display: flex;
    justify-content: center;
    padding: 8px 12px;
    margin-bottom: 10px;
    gap: 20px;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    box-shadow: none;
}

.color-type-selector label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.color-type-selector label:hover {
    background: var(--light-color);
}

/* 调整颜色选项 */
.color-option {
    width: 32px !important;
    height: 32px !important;
    margin: 0 !important;
    border: 2px solid transparent !important;
    border-radius: 50% !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
    position: relative !important;
    overflow: hidden !important;
}

.color-option:hover {
    transform: scale(1.1) !important;
    border-color: rgba(0, 0, 0, 0.2) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

.color-option.selected {
    transform: scale(1.05) !important;
    border-color: var(--primary-color) !important;
    box-shadow: 0 0 0 2px var(--primary-color), 0 2px 8px rgba(0, 0, 0, 0.2) !important;
}

.color-option.selected::after {
    content: '✓' !important;
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    color: white !important;
    font-size: 14px !important;
    font-weight: bold !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
    z-index: 1 !important;
}

/* 调整自定义颜色输入区域 */
.custom-color .color-input-group {
    gap: 8px;
}

/* 调整模态框标题 */
.modal-content h3 {
    margin-bottom: 20px !important;
    padding-bottom: 10px;
}

/* 调整表单按钮间距 */
.form-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
    padding-top: 16px;
    flex-wrap: nowrap;
    border-top: 1px solid var(--border-color);
    width: 100%;
    box-sizing: border-box;
}

.form-actions .btn {
    flex: 0 1 auto;
    min-width: 70px;
    max-width: 100px;
    padding: 10px 16px;
    font-size: 14px;
    white-space: nowrap;
}

/* 确保科目设置弹窗的按钮不会溢出 */
#subjectModal .form-actions {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    padding-top: 16px;
    flex-wrap: nowrap;
    border-top: 1px solid var(--border-color);
    width: 100%;
    box-sizing: border-box;
}

#subjectModal .btn {
    flex: 0 1 auto;
    min-width: 65px;
    max-width: 90px;
    padding: 10px 14px;
    font-size: 14px;
    white-space: nowrap;
}

/* 确保科目信息中的字体颜色与主题色匹配 */
.subject-info .subject-name,
.subject-info .teacher-name {
    color: var(--text-color) !important;
    opacity: 1;
}

/* 强化深色主题下的科目名称颜色 */
body.theme-dark .subject-info .subject-name,
body.theme-dark .subject-info .teacher-name {
    color: var(--text-color) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 确保模态框内所有文字颜色与主题匹配 */
.modal-content h3,
.modal-content h4,
.modal-content label,
.modal-content span:not(#colorPreview span),
.modal-content input,
.modal-content textarea,
.modal-content select {
    color: var(--text-color) !important;
}

/* 颜色预览区域的文字颜色由JavaScript控制 - 不使用!important */
#colorPreview {
    /* 颜色由JS动态设置 */
}

/* 确保颜色类型选择器的文字颜色正确 */
.color-type-selector label {
    color: var(--text-color) !important;
}

/* 确保自定义颜色区域的文字颜色正确 */
.custom-color label {
    color: var(--text-color) !important;
}

/* 优化颜色类型选择器的样式 */
.color-type-selector {
    background: var(--light-color) !important;
    border: 1px solid var(--border-color) !important;
}

.color-type-selector label {
    color: var(--text-color) !important;
}

.color-type-selector label:hover {
    background: rgba(0, 0, 0, 0.05) !important;
}

/* 优化预设颜色区域样式 */
.preset-colors {
    background: var(--light-color) !important;
    border: 1px solid var(--border-color) !important;
}

/* 确保所有弹窗内容都能正确居中 */
.modal-content > * {
    display: block;
}

/* 确保设置弹窗也能正确居中 */
#settingsModal .modal-content {
    display: block;
}

/* 为教程弹窗设置更大的最小宽度 */
#tutorialModal .modal-content {
    min-width: 500px;
    max-width: 800px;
}

/* 为小弹窗设置更小的内边距和宽度 */
#timeModal .modal-content,
#confirmModal .modal-content,
#importSubjectModal .modal-content {
    min-width: 300px;
    max-width: 450px;
    padding: 25px;
}

/* 为添加科目弹窗设置更大的宽度 - PC端宽屏 */
#subjectModal .modal-content {
    min-width: 520px;
    max-width: 620px;
    padding: 24px 28px;
    max-height: none;
    overflow: visible;
}

/* 确认对话框样式 */
.confirm-message {
    font-size: 16px;
    line-height: 1.6;
    margin: 20px 0;
    text-align: center;
    color: var(--text-color);
}

/* 左侧栏主标题样式 */
.section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-color);
    margin: 0 0 16px 0;
    padding: 12px 20px;
    background-color: var(--background-color);
    border-radius: 8px;
    text-align: center;
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.section-title:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* 统一左侧栏模块样式 */
.left-sidebar > div {
    margin-bottom: 16px;
}

/* 将课时设置标题和内容合并成一个模块 */
.left-sidebar > .section-title:nth-child(1) {
    margin-bottom: 0 !important;
    padding-bottom: 12px !important;
    border-bottom: none !important;
    border-radius: 8px 8px 0 0 !important;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08), -2px 0 8px rgba(0, 0, 0, 0.08), 2px 0 8px rgba(0, 0, 0, 0.08) !important;
    position: relative;
    z-index: 1;
}

/* 课时控制区域样式 - 与标题合并，间距为0 */
.period-controls-desktop {
    margin-top: 0 !important;
    border-radius: 0 0 8px 8px !important;
    border-top: 1px solid var(--border-color) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
    position: relative;
    z-index: 0;
}

/* 科目池模块样式 */
.subject-pool {
    margin-top: 16px !important;
}

/* 确保其他section-title正常显示 */
.left-sidebar > .section-title:not(:nth-child(1)) {
    margin-bottom: 8px !important;
}

/* 科目池头部美化 */
.subject-pool-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: var(--background-color);
    border-bottom: 2px solid var(--border-color);
    margin-bottom: 16px;
    border-radius: 8px;
}

/* 导入科目按钮美化 */
#importSubjectBtn {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    border: 2px solid var(--secondary-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: var(--secondary-color);
    color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 100px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#importSubjectBtn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: var(--secondary-hover-color);
    border-color: var(--secondary-hover-color);
    color: white !important;
}

#importSubjectBtn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* 添加科目按钮美化 */
#addSubjectBtn {
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 700;
    border: 2px solid var(--primary-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: var(--primary-color);
    color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 100px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(74, 124, 89, 0.2);
}

#addSubjectBtn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 124, 89, 0.3);
    background-color: var(--primary-hover-color);
    border-color: var(--primary-hover-color);
    color: white !important;
}

#addSubjectBtn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(74, 124, 89, 0.2);
}

/* 导入科目弹窗美化 */
#importSubjectModal h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--primary-color);
    margin: 0 0 24px 0;
    text-align: center;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--primary-color);
}

#importSubjectModal .form-group {
    margin-bottom: 24px;
}

#importSubjectModal label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color);
    margin-bottom: 8px;
}

#importSubjectModal .form-control {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 14px;
    color: var(--text-color);
    background-color: var(--background-color);
    transition: all 0.3s ease;
    box-sizing: border-box;
}

#importSubjectModal .form-control:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
}

#importSubjectModal .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
}

#importSubjectModal .btn {
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px;
    text-align: center;
}

#importSubjectModal .btn.primary {
    background-color: var(--primary-color);
    color: white;
}

#importSubjectModal .btn.primary:hover {
    background-color: var(--primary-hover-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(74, 124, 89, 0.3);
}

#importSubjectModal .btn.secondary {
    background-color: var(--light-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
}

#importSubjectModal .btn.secondary:hover {
    background-color: var(--border-color);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 深色主题适配 */
body.theme-dark #importSubjectModal .modal-content {
    background-color: var(--light-color);
    color: var(--text-color);
}

body.theme-dark #importSubjectModal h3 {
    color: var(--primary-color);
    border-bottom-color: var(--border-color);
}

body.theme-dark #importSubjectModal .form-control {
    background-color: var(--background-color);
    color: var(--text-color);
    border-color: var(--border-color);
}

body.theme-dark #importSubjectModal .form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.2);
}

body.theme-dark #importSubjectModal .form-actions {
    border-top-color: var(--border-color);
}

body.theme-dark #importSubjectModal .btn.secondary {
    background-color: var(--background-color);
    color: var(--text-color);
    border-color: var(--border-color);
}

body.theme-dark #importSubjectModal .btn.secondary:hover {
    background-color: var(--border-color);
    color: var(--text-color);
}

/* 深色主题下的按钮样式 */
body.theme-dark #importSubjectBtn {
    background-color: var(--secondary-color);
    border-color: var(--secondary-color);
    color: white !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

body.theme-dark #importSubjectBtn:hover {
    background-color: var(--secondary-hover-color);
    border-color: var(--secondary-hover-color);
    color: white !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

body.theme-dark #addSubjectBtn {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
    color: white !important;
    box-shadow: 0 2px 8px rgba(74, 124, 89, 0.3);
}

body.theme-dark #addSubjectBtn:hover {
    background-color: var(--primary-hover-color);
    border-color: var(--primary-hover-color);
    color: white !important;
    box-shadow: 0 4px 12px rgba(74, 124, 89, 0.4);
}

body.theme-dark .subject-pool-header {
    background-color: var(--light-color);
    border-bottom-color: var(--border-color);
}

body.theme-dark .section-title {
    background-color: var(--light-color);
    color: var(--text-color);
    border-color: var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

body.theme-dark .section-title:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 确保表单操作区域居中对齐 */
.form-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-content h3 {
    margin-bottom: 24px;
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-color);
    text-align: center;
    position: relative;
    padding-bottom: 12px;
}

.modal-content h3::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    border-radius: 2px;
}

.form-group {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.form-group label {
    display: flex;
    align-items: center;
    min-width: 70px;
    max-width: 80px;
    font-weight: 600;
    font-size: 14px;
    color: var(--text-color);
    cursor: pointer;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.form-group input {
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 10px 14px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 14px;
    background-color: var(--light-color);
    color: var(--text-color);
    transition: all 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--shadow-color);
    background-color: white;
}

.color-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: var(--light-color);
    padding: 20px;
    border-radius: 10px;
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 12px var(--shadow-color);
}

.color-type-selector {
    display: flex;
    flex-direction: row;
    gap: 30px;
    margin-bottom: 15px;
    justify-content: center;
    padding: 12px;
    background: var(--light-color);
    border-radius: 8px;
    width: 100%;
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 8px var(--shadow-color);
}

.color-type-selector label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 600;
    color: var(--text-color);
    font-size: 15px;
    transition: all 0.3s ease;
    padding: 6px 12px;
    border-radius: 6px;
    white-space: nowrap;
    background: transparent;
    border: 1px solid transparent;
}

.color-type-selector label:hover {
    background: var(--background-color);
    color: var(--text-color);
    border-color: var(--border-color);
    box-shadow: 0 2px 6px var(--shadow-color);
}

.color-type-selector input[type="radio"] {
    display: none;
}

.color-type-selector input[type="radio"] + span {
    position: relative;
    padding-left: 28px;
}

.color-type-selector input[type="radio"] + span::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    background: white;
    transition: all 0.2s ease;
}

.color-type-selector input[type="radio"] + span::after {
    content: '✓';
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    font-weight: bold;
    color: white;
    opacity: 0;
    transition: all 0.2s ease;
}

.color-type-selector input[type="radio"]:checked + span::before {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.color-type-selector input[type="radio"]:checked + span::after {
    opacity: 1;
}

.color-type-selector label:hover input[type="radio"] + span::before {
    border-color: var(--primary-color);
}

.color-type-selector input[type="radio"]:checked + span {
    color: var(--primary-color);
    font-weight: bold;
}

/* 修复预设颜色选中状态的文字颜色 */
.color-option.selected::after {
    color: white;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

/* 美化自定义颜色输入区域 */
.custom-color {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 10px;
    box-shadow: 0 4px 12px var(--shadow-color);
    backdrop-filter: blur(10px);
    margin-top: 15px;
}

.custom-color label {
    display: block;
    font-weight: 600;
    color: white;
    margin-bottom: 5px;
    font-size: 16px;
}

.custom-color .color-input-group {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
}

.custom-color input[type="color"] {
    width: 60px;
    height: 60px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    cursor: pointer;
    background: transparent;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.custom-color input[type="color"]:hover {
    transform: scale(1.1);
    border-color: white;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.custom-color input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 6px;
    overflow: hidden;
}

.custom-color input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
    padding: 0;
}

.custom-color input[type="color"]::-moz-color-swatch {
    border: none;
    border-radius: 6px;
    padding: 0;
}

.custom-color input[type="text"] {
    flex: 1;
    min-width: 200px;
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    transition: all 0.3s ease;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
}

.custom-color .color-preview {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background-color: var(--primary-color);
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.custom-color .color-preview:hover {
    transform: scale(1.1);
    border-color: white;
}

/* 添加颜色信息说明 */
.custom-color .color-info {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    text-align: center;
    margin-top: 5px;
    line-height: 1.4;
}



/* 美化弹窗底部按钮 */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-footer .btn {
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.modal-footer .btn-primary {
    background-color: var(--primary-color);
    color: white;
}

.modal-footer .btn-primary:hover {
    background-color: var(--primary-hover-color);
    box-shadow: 0 4px 12px var(--shadow-color);
    transform: translateY(-1px);
}

.modal-footer .btn-secondary {
    background-color: var(--secondary-color);
    color: white;
}

.modal-footer .btn-secondary:hover {
    background-color: var(--secondary-hover-color);
    box-shadow: 0 4px 12px var(--shadow-color);
    transform: translateY(-1px);
}

.preset-colors {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    margin-bottom: 15px;
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
}

.color-option {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
}

.color-option:hover,
.color-option.selected {
    border-color: var(--text-color);
    transform: scale(1.15);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.color-option.selected::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

.color-option[data-color*="linear-gradient"] {
    border-radius: 6px;
}

.color-option[data-color*="linear-gradient"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    border-radius: 6px;
    z-index: 1;
}

.color-option[data-color*="linear-gradient"].selected::after {
    z-index: 2;
}

/* 主题切换按钮样式 */
.theme-dropdown {
    position: relative;
    display: inline-block;
    margin-right: 10px;
}

#themeMenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 2px 10px var(--shadow-color);
    z-index: 1000;
    min-width: 150px;
}

#themeMenu.show {
    display: block;
}

.theme-item {
    display: block;
    width: 100%;
    padding: 10px 15px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--text-color);
    transition: background-color 0.3s ease;
}

.theme-item:hover {
    background-color: var(--light-color);
}

.theme-item.active {
    background-color: var(--primary-color);
    color: white;
}

/* 字体切换按钮样式 */
.font-dropdown {
    position: relative;
    display: inline-block;
    margin-right: 10px;
}

#fontMenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 2px 10px var(--shadow-color);
    z-index: 1000;
    min-width: 150px;
    max-height: 300px;
    overflow-y: auto;
}

#fontMenu.show {
    display: block;
}

.font-item {
    display: block;
    width: 100%;
    padding: 10px 15px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--text-color);
    transition: background-color 0.3s ease;
    font-family: inherit;
}

.font-item:hover {
    background-color: var(--light-color);
}

.font-item.active {
    background-color: var(--primary-color);
    color: white;
.custom-color {
    display: flex;
    gap: 10px;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 10px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
}   align-items: center;
}

.custom-color input[type="color"] {
    width: 50px;
    height: 30px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.custom-color input[type="text"] {
    flex: 1;
    max-width: 100px;
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    min-width: 80px;
    transition: background-color 0.2s;
}

.btn.primary {
    background: #007bff;
    color: white;
}

.btn.primary:hover {
    background: #0056b3;
}

.btn.secondary {
    background: #6c757d;
    color: white;
}

.btn.secondary:hover {
    background: #545b62;
}

@media print {
    @page {
        size: A4 portrait;
        margin: 15mm 10mm;
    }
    
    /* 高级打印优化 - 强制彩色打印 */
    * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        box-sizing: border-box !important;
        -webkit-filter: none !important;
        filter: none !important;
    }
    
    body {
        background: var(--background-color) !important;
        background-image: var(--pattern-background) !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: "Microsoft YaHei", "微软雅黑", "SimSun", "宋体", serif !important;
        line-height: 1.4 !important;
    }
    
    /* 隐藏控制元素 */
    .header, .subject-pool, .section-controls {
        display: none !important;
    }
    
    /* 隐藏标题区域 */
    .timetable-title-section {
        display: none !important;
    }
    
    .table-title-input {
        display: block !important;
        background: var(--light-color) !important;
        color: var(--text-color) !important;
        margin: 20px auto !important;
        text-align: center !important;
        width: 100% !important;
        max-width: 400px !important;
        font-size: 24px !important;
        font-weight: bold !important;
        border: none !important;
        padding: 10px !important;
        border-radius: 4px !important;
    }
    
    /* 强化表格边框 */
    .timetable {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 0 auto !important;
        border: 2px solid var(--text-color) !important;
        font-size: 13px !important;
        table-layout: fixed !important;
        background: transparent !important;
    }
    
    .timetable thead {
        display: table-header-group !important;
    }
    
    /* 优化表头打印效果 */
    .timetable th {
        background: var(--light-color) !important;
        color: var(--text-color) !important;
        font-weight: 700 !important;
        font-size: 16px !important;
        padding: 12px 8px !important;
        text-align: center !important;
        vertical-align: middle !important;
        border: 1px solid var(--text-color) !important;
        border-bottom: 2px solid var(--text-color) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    .timetable th:first-child,
    .timetable th:nth-child(2) {
        background: var(--light-color) !important;
        color: var(--text-color) !important;
    }
    
    /* 强化单元格边框 */
    .timetable td {
        border: 1px solid var(--text-color) !important;
        border-bottom: 1px solid var(--text-color) !important;
        border-right: 1px solid var(--text-color) !important;
        padding: 8px 4px !important;
        text-align: center !important;
        vertical-align: middle !important;
        background: white !important;
        color: var(--text-color) !important;
    }
    
    /* 确保所有边框可见 */
    .timetable tr {
        border-bottom: 1px solid var(--text-color) !important;
    }
    
    .timetable tbody tr:last-child td {
        border-bottom: 2px solid var(--text-color) !important;
    }
    
    /* 时间列样式 */
    .time-header {
        width: 50px !important;
        background: var(--light-color) !important;
        color: var(--text-color) !important;
        font-weight: 600 !important;
    }
    
    /* 课时列样式 */
    .period-cell {
        background: var(--light-color) !important;
        color: var(--text-color) !important;
        font-weight: 600 !important;
    }
    
    .period-header {
        width: 75px !important;
        background: linear-gradient(135deg, #34495e, #2c3e50) !important;
        color: white !important;
        font-weight: 600 !important;
    }
    
    /* 优化时间单元格打印 */
    .time-cell {
        width: 40px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        color: var(--text-color) !important;
        background: var(--light-color) !important;
        border: 1px solid var(--text-color) !important;
        padding: 8px 4px !important;
        white-space: nowrap !important;
        line-height: 1.3 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    /* 优化节数单元格打印 */
    .period-cell {
        white-space: nowrap !important;
        line-height: 1.4 !important;
        background: var(--light-color) !important;
        border: 1px solid var(--text-color) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    .period-name {
        font-size: 13px !important;
        font-weight: 700 !important;
        color: var(--text-color) !important;
        margin-bottom: 3px !important;
        white-space: nowrap !important;
    }
    
    .time-display {
        font-size: 10px !important;
        color: var(--text-color) !important;
        font-weight: 500 !important;
    }
    
    /* 强化课程单元格边框 - 支持彩色 */
    .cell {
        height: 65px !important;
        width: 105px !important;
        border: 1px solid var(--text-color) !important;
        background: white !important;
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-filter: none !important;
        filter: none !important;
    }
    
    .cell-content {
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        padding: 4px !important;
        border: 1px solid #000 !important;
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-filter: none !important;
        filter: none !important;
    }
    
    .cell-content .subject-name {
        font-size: 14px !important;
        font-weight: 700 !important;
        line-height: 1.4 !important;
        margin-bottom: 3px !important;
        text-align: center !important;
        /* 颜色继承自父元素 */
    }
    
    .cell-content .teacher-name {
        font-size: 12px !important;
        line-height: 1.3 !important;
        text-align: center !important;
        font-weight: 500 !important;
        /* 颜色继承自父元素 */
    }
    
    .delete-cell-btn {
        display: none !important;
    }
    
    /* 强制显示所有边框 */
    .timetable * {
        border-color: #000 !important;
    }
    
    /* 优化彩色打印模式 */
    .timetable th {
        background: #e6f3ff !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-filter: none !important;
        filter: none !important;
    }
    
    .timetable th:first-child,
    .timetable th:nth-child(2) {
        background: #f0f0f0 !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-filter: none !important;
        filter: none !important;
    }
    
    /* 周一到周五表头彩色背景 */
    .timetable th:nth-child(n+3) {
        background: #fff2e6 !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        -webkit-filter: none !important;
        filter: none !important;
    }
    
    /* 优化黑白打印模式 */
    .bw-mode .timetable th {
        background: #e8e8e8 !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    .bw-mode .timetable td {
        border: 1px solid #000 !important;
        background: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    
    .bw-mode .cell {
        background: white !important;
        border: 1px solid #000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }



/* 移动端额外样式优化 */
@media (max-width: 768px) {
    body {
        padding-top: 0;
    }
    
    
    
    
    /* 确保固定顶部区域在移动端正常显示 */
    .fixed-top-area {
        width: 100%;
        max-width: 100%;
    }
    
    /* 优化移动端滚动体验 */
    .main-content {
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    
    /* 超强科目池 - 精确滚动控制 */
    .subject-pool {
        flex: 0 0 auto !important;
        display: flex !important;
        flex-direction: column !important;
        max-height: 180px !important;
        min-height: 100px !important;
        margin: 0 !important;
        padding: 0 !important;
        border-bottom: 1px solid #e9ecef !important;
        background: #fff !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
        overflow: hidden !important;
    }
    
    .subject-pool-header {
        flex-shrink: 0 !important;
        padding: 8px 12px !important;
        margin: 0 !important;
        border-bottom: 1px solid #f1f3f4 !important;
        background: #fafbfc !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #495057 !important;
    }
    
    .subject-cards {
        flex: 1 !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        padding: 8px 12px !important;
        margin: 0 !important;
        background: #fff !important;
        -webkit-overflow-scrolling: touch !important;
    }
    
    .subject-card {
        padding: 4px 8px !important;
        font-size: 12px !important;
        margin: 2px 0 !important;
        border-radius: 4px !important;
        border: 1px solid #e9ecef !important;
        background: #fff !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
    }
    
    .subject-card:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }
    
    /* 超强课程表容器 - 独立滚动系统 */
    .timetable-container {
        flex: 1 !important;
        overflow-y: auto !important;
        overflow-x: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        -webkit-overflow-scrolling: touch !important;
        position: relative !important;
    }
    
    /* 确保表格最小宽度 */
    .timetable-wrapper {
        min-width: 100% !important;
        min-height: 100% !important;
        padding: 10px !important;
    }
    
    .timetable {
        font-size: 12px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        width: 100% !important;
        table-layout: fixed !important;
        min-width: 100% !important;
    }
    
    .cell {
        width: 80px !important;
        height: 60px !important;
        min-width: 80px !important;
        min-height: 60px !important;
    }
    
    /* 隐藏手机端+号按钮 */
    .mobile-add-btn {
        display: none !important;
    }
    
    /* 优化标题样式 */
    .header .title-section {
        margin: 0 !important;
        flex: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important; /* 标题左对齐 */
        order: 1 !important; /* 确保在左侧 */
    }
    
    .header .timetable-title {
        font-size: 16px !important;
        font-weight: 600 !important;
        color: #333 !important;
        margin: 0 !important;
        padding: 0 !important;
        text-align: left !important; /* 标题左对齐 */
    }
    
    /* 手机端controls已隐藏，不需要额外样式 */
    
    /* 超强滚动优化系统 */
    .period-controls {
        justify-content: space-around !important;
        align-items: center !important;
        position: fixed !important;
        top: 48px !important;
        left: 0 !important;
        right: 0 !important;
        z-index: 9998 !important;
        background: #f8f9fa !important;
        padding: 6px 12px !important;
        margin: 0 !important;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
        display: flex !important;
        height: 42px !important;
        border-bottom: 1px solid #dee2e6 !important;
        transform: translate3d(0, 0, 0) !important;
        backface-visibility: hidden !important;
        perspective: 1000px !important;
    }
    
    .period-controls .period-control-line {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        margin: 0 !important;
    }
    
    .period-controls .period-control-line span {
        font-size: 13px !important;
        font-weight: 500 !important;
        margin: 0 !important;
        white-space: nowrap !important;
        color: #495057 !important;
    }
    
    .period-controls .period-control-line .btn {
        padding: 3px 8px !important;
        font-size: 13px !important;
        margin: 0 !important;
        min-width: 28px !important;
        height: 26px !important;
        line-height: 1 !important;
    }
    
    /* 超强触摸优化 */
    .subject-cards {
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: thin !important;
        scrollbar-color: #cbd5e0 #f7fafc !important;
    }
    
    .subject-cards::-webkit-scrollbar {
        width: 4px !important;
    }
    
    .subject-cards::-webkit-scrollbar-track {
        background: #f7fafc !important;
    }
    
    .subject-cards::-webkit-scrollbar-thumb {
        background: #cbd5e0 !important;
        border-radius: 2px !important;
    }
    
    .timetable-container {
        -webkit-overflow-scrolling: touch !important;
        scrollbar-width: thin !important;
        scrollbar-color: #cbd5e0 #f7fafc !important;
    }
    
    .timetable-container::-webkit-scrollbar {
        width: 4px !important;
        height: 4px !important;
    }
    
    .timetable-container::-webkit-scrollbar-track {
        background: #f7fafc !important;
    }
    
    .timetable-container::-webkit-scrollbar-thumb {
        background: #cbd5e0 !important;
        border-radius: 2px !important;
    }
    
    /* 防止iOS橡皮筋效果 */
    .container {
        -webkit-overflow-scrolling: touch !important;
        overscroll-behavior: contain !important;
    }
    
    /* 增强触摸目标 */
    .subject-card, .btn {
        -webkit-tap-highlight-color: transparent !important;
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        user-select: none !important;
    }
        
        /* 课程表区域 - 强制100vw宽度，移除所有边距和滚动 */
        .timetable-container {
            order: 2;
            width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: white;
            border-radius: 0 !important;
            box-shadow: none !important;
        }
        
        .timetable-wrapper {
            width: 100vw !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
        }
        
        /* 7列表格精确布局 - 极致压缩 */
        .timetable {
            width: 100vw !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
            margin: 0 !important;
            border-spacing: 0 !important;
            border: none !important;
            font-size: 7px !important;
        }
        
        .timetable th,
        .timetable td {
            padding: 0 !important;
            margin: 0 !important;
            border: 1px solid #ddd !important;
            box-sizing: border-box !important;
            line-height: 1 !important;
            overflow: hidden !important;
            white-space: nowrap !important;
        }
        
        /* 移除表格标题区域边距 */
        .timetable-title-section {
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .table-title-input {
            margin: 0 !important;
            padding: 1px !important;
            font-size: 10px !important;
            border: none !important;
        }
        
        /* 7列精确宽度分配：时间列8% + 课时列8% + 周一到周五各16.8% */
        .timetable th:nth-child(1),
        .timetable td:nth-child(1) {
            width: 8% !important;
            min-width: 20px !important;
            max-width: 25px !important;
            font-size: 7px !important;
            padding: 0 !important;
        }
        
        .timetable th:nth-child(2),
        .timetable td:nth-child(2) {
            width: 8% !important;
            min-width: 25px !important;
            max-width: 30px !important;
            font-size: 7px !important;
            padding: 0 !important;
        }
        
        .timetable th:nth-child(n+3),
        .timetable td:nth-child(n+3) {
            width: 16.8% !important;
            min-width: 0 !important;
            padding: 0 !important;
        }
        
        /* 单元格高度压缩 */
        .cell {
            height: 35px !important;
            min-height: 35px !important;
            max-height: 35px !important;
            padding: 0 !important;
            margin: 0 !important;
            border: 1px solid #ccc !important;
            overflow: hidden !important;
        }
        
        /* 垂直文本极致压缩 */
        .vertical-text {
            font-size: 7px !important;
            padding: 0 !important;
            letter-spacing: 0 !important;
            line-height: 1 !important;
            writing-mode: vertical-rl !important;
            transform: rotate(180deg) !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        
        /* 内容显示极致压缩 */
        .cell-content {
            font-size: 6px !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            text-align: center !important;
            line-height: 1 !important;
            overflow: hidden !important;
        }
        
        .subject-name {
            font-size: 6px !important;
            font-weight: 600 !important;
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1 !important;
            word-break: break-word !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            max-height: 12px !important;
        }
        
        .teacher-name {
            font-size: 5px !important;
            opacity: 0.8 !important;
            margin: 0 !important;
            padding: 0 !important;
            line-height: 1 !important;
            word-break: break-word !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            max-height: 5px !important;
        }
        
        /* 空单元格+号 */
        .cell.empty-cell,
        .cell:not(.has-subject) {
            background-color: #f5f5f5 !important;
            border: 1px dashed #bbb !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            margin: 0 !important;
        }
        
        .plus-indicator,
        .cell:not(.has-subject):after {
            content: '+' !important;
            font-size: 10px !important;
            color: #aaa !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        /* 控制区域压缩 - 已被固定定位样式覆盖 */
        .controls {
            justify-content: center;
            gap: 2px !important;
            flex-wrap: wrap !important;
            padding: 1px !important;
        }
        
        .btn {
            padding: 2px 4px !important;
            font-size: 9px !important;
            margin: 0 !important;
        }
        
        /* 移除所有可能的溢出 */
        * {
            max-width: 100vw !important;
        }
    }
    
    /* PC端空单元格默认显示+号 */
    @media (min-width: 769px) {
        .main-content {
            display: flex;
            flex-direction: row !important;
            gap: 20px;
        }
        
        .subject-pool {
            width: 250px;
            flex-shrink: 0;
        }
        
        .timetable-container {
            flex: 1;
            margin-left: 20px;
        }
        
        .cell.empty-cell,
        .cell:not(.has-subject) {
            background-color: #f9f9f9 !important;
            border: 1px dashed #ddd !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        }
        
        .plus-indicator,
        .cell:not(.has-subject):after {
            content: '+' !important;
            font-size: 24px !important;
            color: #ccc !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
        }
        
        .cell.empty-cell:hover,
        .cell:not(.has-subject):hover {
            background-color: #e9ecef !important;
        }
        
        .cell.empty-cell:hover .plus-indicator,
        .cell:not(.has-subject):hover:after {
            color: #007bff !important;
        }
    }
}

.bw-mode .cell-content {
    filter: grayscale(100%);
}

/* 时间设置弹窗 */
.time-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
}

.time-modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid var(--border-color);
    width: 80%;
    max-width: 500px;
    border-radius: 10px;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.close:hover {
    color: var(--primary-color);
}

/* 设置弹窗样式 */
.settings-modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    align-items: center;
    justify-content: center;
}

.settings-modal-content {
    background-color: white;
    margin: auto;
    padding: 30px;
    border: 1px solid var(--border-color);
    width: 90%;
    max-width: 400px;
    border-radius: 10px;
    box-shadow: 0 4px 20px var(--shadow-color);
}

.settings-modal-content h2 {
    color: var(--primary-color);
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
}

.settings-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.settings-form label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: var(--text-color);
    cursor: pointer;
}

.settings-form input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    appearance: none;
    border: 2px solid #dee2e6;
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
    background: white;
}

.settings-form input[type="checkbox"]:checked {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
}

.settings-form input[type="checkbox"]:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
}

.settings-form input[type="checkbox"]:hover {
    border-color: #667eea;
    transform: scale(1.05);
}

.settings-form label:hover {
    color: #667eea;
    transform: translateX(2px);
}

/* 简化设置界面样式 */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
}

.modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    line-height: 1;
}

.modal-close:hover {
    background: #f5f5f5;
    color: #333;
}

.settings-content {
    margin-bottom: 15px;
    padding: 0 5px;
}

.setting-item {
    margin-bottom: 0;
    padding: 10px 12px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 8px;
    margin-bottom: 6px;
    background: #fafafa;
    transition: background 0.2s ease;
}

.setting-item:hover {
    background: #f0f0f0;
}

.setting-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.setting-label {
    display: flex;
    align-items: center;
    margin: 0;
    cursor: pointer;
    width: 100%;
    gap: 10px;
}

.setting-checkbox {
    display: none;
}

.setting-label .checkmark {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;
}

.setting-label .checkmark::after {
    content: '✓';
    color: white;
    font-size: 12px;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.setting-checkbox:checked + .checkmark {
    background: var(--primary-color);
    border-color: var(--primary-color);
}

.setting-checkbox:checked + .checkmark::after {
    opacity: 1;
}

.setting-text {
    flex: 1;
}

.setting-text strong {
    display: block;
    font-size: 14px;
    color: #333;
    margin-bottom: 1px;
}

.setting-text small {
    display: block;
    font-size: 11px;
    color: #888;
    font-weight: normal;
}

.settings-form .button-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

/* 移动端弹窗动画 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { 
        opacity: 0;
        transform: translateY(20px);
    }
    to { 
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes slideDown {
    from { 
        opacity: 1;
        transform: translateY(0);
    }
    to { 
        opacity: 0;
        transform: translateY(20px);
    }
}

/* 教程弹窗样式 - 全新设计 */
/* 教程弹窗特定样式 - 仅应用于教程弹窗 */
#tutorialModal .modal-content,
#tutorialModal .tutorial-modal-content {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
    border: 2px solid rgba(var(--primary-color-rgb), 0.2);
    border-radius: 20px;
    box-shadow: 
        0 0 0 1px rgba(var(--primary-color-rgb), 0.1),
        0 10px 30px rgba(0, 0, 0, 0.15),
        0 0 40px rgba(var(--primary-color-rgb), 0.1);
    overflow: hidden;
    animation: modalSlideIn 0.2s ease-out;
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

/* 确保其他弹窗不使用flex布局 */
#subjectModal .modal-content,
#timeModal .modal-content,
#settingsModal .modal-content {
    display: block;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* 教程弹窗底部样式 */
.tutorial-footer {
    padding: 20px 30px;
    background: rgba(var(--primary-color-rgb), 0.05);
    border-top: 1px solid rgba(var(--primary-color-rgb), 0.1);
    border-radius: 0 0 20px 20px;
    margin-top: auto;
}

.tutorial-hint {
    text-align: center;
    margin-bottom: 15px;
    color: var(--text-color);
    font-size: 14px;
}

.tutorial-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}

/* 确保内容区域能自适应高度 */
#tutorialModal .tutorial-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 30px;
}

/* 保留一个统一的modalSlideIn动画 */
@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: scale(0.8);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

#tutorialModal .tutorial-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--dark-color) 100%);
    color: white;
    padding: 20px 25px;
    border-radius: 20px 20px 0 0;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

#tutorialModal .tutorial-header h3 {
    margin: 0;
    font-size: 20px;
    flex: 1;
    text-align: center;
    color: white !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
}

/* 教程弹窗关闭按钮样式 */
#tutorialModal .tutorial-close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;
    z-index: 10;
}

#tutorialModal .tutorial-close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
}

#tutorialModal .tutorial-header-icon {
    font-size: 24px;
    margin-right: 15px;
    position: relative;
    z-index: 2;
}

#tutorialModal .tutorial-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.tutorial-step {
    margin-bottom: 20px;
    background: linear-gradient(135deg, #ffffff 0%, #f9fbfd 100%);
    padding: 18px;
    border-radius: 12px;
    border: 1px solid rgba(var(--primary-color-rgb), 0.1);
    border-left: 4px solid var(--primary-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, box-shadow;
}

.tutorial-step:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: rgba(var(--primary-color-rgb), 0.2);
}

.tutorial-section {
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(var(--primary-color-rgb), 0.1);
}

.tutorial-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

/* 教程内容视觉层次优化 - 重新设计 */
.tutorial-section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(var(--primary-color-rgb), 0.2);
}

.tutorial-section-title svg {
    flex-shrink: 0;
}

/* 教程卡片网格布局 */
.tutorial-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    margin-bottom: 10px;
}

.tutorial-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
    border-radius: 12px;
    border: 1px solid #e8e8e8;
    transition: all 0.2s ease;
}

.tutorial-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    border-color: var(--primary-color);
}

.tutorial-card-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tutorial-card-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.tutorial-card-content strong {
    font-size: 16px;
    color: #333;
}

.tutorial-card-content span {
    font-size: 14px;
    color: #666;
    line-height: 1.4;
}

/* 教程功能列表 */
.tutorial-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tutorial-feature {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: #f9f9f9;
    border-radius: 10px;
    border-left: 4px solid var(--primary-color);
}

.tutorial-feature .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.tutorial-feature .feature-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.tutorial-feature .feature-text strong {
    font-size: 16px;
    color: #333;
}

.tutorial-feature .feature-text span {
    font-size: 14px;
    color: #666;
}

/* 教程小技巧 */
.tutorial-tips {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.tip-item {
    padding: 12px 14px;
    background: linear-gradient(135deg, var(--light-color) 0%, #ffffff 100%);
    border-radius: 8px;
    font-size: 14px;
    color: #555;
    border: 1px solid rgba(var(--primary-color-rgb), 0.15);
}

.tip-item kbd {
    background: var(--primary-color);
    color: white;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 6px;
    font-weight: 600;
}

.tutorial-section-content {
    background: linear-gradient(135deg, #ffffff 0%, #f9fbfd 100%);
    padding: 25px;
    border-radius: 16px;
    border: 1px solid rgba(var(--primary-color-rgb), 0.15);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    margin-bottom: 20px;
}

.tutorial-step-title {
    font-size: 17px;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tutorial-step-title::before {
    content: "▶";
    color: var(--primary-color);
    font-size: 14px;
}

.tutorial-step-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tutorial-step-list li {
    padding: 10px 0;
    padding-left: 32px;
    position: relative;
    line-height: 1.7;
    font-size: 15px;
    color: #444;
    border-bottom: 1px dashed rgba(var(--primary-color-rgb), 0.1);
}

.tutorial-step-list li:last-child {
    border-bottom: none;
}

.tutorial-step-list li::before {
    content: "✨";
    position: absolute;
    left: 0;
    top: 10px;
    font-size: 16px;
    color: var(--primary-color);
    background: rgba(var(--primary-color-rgb), 0.1);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 快捷键网格布局 - 优化 */
.shortcut-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-top: 20px;
}

.shortcut-item {
    background: linear-gradient(135deg, #ffffff 0%, #f9fbfd 100%);
    padding: 16px 12px;
    border-radius: 12px;
    border: 1px solid rgba(var(--primary-color-rgb), 0.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    text-align: center;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, box-shadow;
}

.shortcut-item:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    border-color: rgba(var(--primary-color-rgb), 0.3);
}

.shortcut-key {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 6px;
    background: linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.1) 0%, rgba(var(--primary-color-rgb), 0.05) 100%);
    padding: 8px 10px;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    border: 1px solid rgba(var(--primary-color-rgb), 0.2);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shortcut-desc {
    display: block;
    font-size: 13px;
    color: #555;
    font-weight: 500;
}

/* FAQ样式 - 重新设计 */
.faq-item {
    margin-bottom: 20px;
    background: linear-gradient(135deg, #ffffff 0%, #f9fbfd 100%);
    padding: 20px;
    border-radius: 16px;
    border: 1px solid rgba(var(--primary-color-rgb), 0.15);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
}

.faq-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.faq-question {
    font-size: 17px;
    font-weight: 700;
    color: var(--dark-color);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.faq-question::before {
    content: "❓";
    color: var(--primary-color);
    font-size: 18px;
}

.faq-answer {
    font-size: 15px;
    color: #555;
    line-height: 1.7;
    padding-left: 26px;
    border-left: 3px solid rgba(var(--primary-color-rgb), 0.3);
    margin-left: 8px;
}

/* 教程弹窗样式优化 - 重新设计 */
@media (max-width: 768px) {
    #tutorialModal .modal-content {
        margin: 8px;
        max-width: calc(100vw - 16px);
        max-height: calc(100vh - 16px);
        border-radius: 16px;
        box-shadow: 
            0 0 0 1px rgba(var(--primary-color-rgb), 0.1),
            0 8px 25px rgba(0, 0, 0, 0.15),
            0 0 30px rgba(var(--primary-color-rgb), 0.08);
    }
    
    #tutorialModal .modal-header {
        padding: 18px 20px;
        border-radius: 16px 16px 0 0;
    }
    
    #tutorialModal .tutorial-content {
        padding: 0 20px 20px;
        max-height: calc(100vh - 140px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    
    #tutorialModal .form-actions {
        flex-direction: column;
        gap: 12px;
        padding: 15px 20px;
    }
    
    #tutorialModal .form-actions button {
        width: 100%;
        min-width: auto;
        font-size: 16px;
        padding: 12px 20px;
        border-radius: 10px;
    }
    
    /* 手机端教程弹窗标题优化 */
    #tutorialModal h3 {
        font-size: 22px !important;
        text-align: center;
        margin: 0;
    }
    
    /* 手机端教程内容优化 */
    #tutorialModal .tutorial-content {
        font-size: 15px;
        line-height: 1.6;
    }
    
    .tutorial-section-title {
        font-size: 18px !important;
        margin-bottom: 12px;
    }
    
    .tutorial-step-title {
        font-size: 15px !important;
    }
    
    .tutorial-section-content {
        padding: 18px;
        margin-bottom: 15px;
    }
    
    .tutorial-step-list li {
        font-size: 14px;
        padding: 8px 0;
        padding-left: 28px;
    }
    
    .tutorial-step-list li::before {
        width: 20px;
        height: 20px;
        font-size: 14px;
    }
    
    .shortcut-grid {
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
    }
    
    .shortcut-item {
        padding: 12px 8px;
    }
    
    .shortcut-key {
        font-size: 14px;
        padding: 6px 8px;
    }
    
    .shortcut-desc {
        font-size: 12px;
    }
    
    .faq-item {
        padding: 15px;
    }
    
    .faq-question {
        font-size: 15px;
    }
    
    .faq-answer {
        font-size: 13px;
        padding-left: 20px;
    }
    
    /* 移动端性能优化 */
    .tutorial-step,
    .shortcut-item,
    .faq-item {
        will-change: auto;
    }
    
    /* 移动端科目池完整显示优化 */
    .subject-pool {
        margin-top: 35px !important; /* 增加顶部间距 */
        margin-bottom: 30px !important;
        min-height: 400px !important; /* 增加最小高度 */
        max-height: calc(100vh - 350px) !important; /* 调整最大高度计算 */
        overflow: hidden !important;
        background: white !important;
        border-radius: 12px !important;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
        border: 1px solid rgba(0,0,0,0.05) !important;
    }
    
    .subjects {
        min-height: 300px !important; /* 增加最小高度 */
        max-height: calc(100vh - 350px - 60px) !important; /* 调整最大高度计算 */
        overflow-y: auto !important;
        padding: 15px 20px !important; /* 减少垂直内边距，保持水平内边距 */
        background: white !important;
        border-radius: 0 0 12px 12px !important;
    }
}

/* 教程内容样式 */
.tutorial-content {
    padding: 20px 30px 20px;
    background: transparent;
    max-height: 500px;
    overflow-y: auto;
}

/* 教程内容滚动条样式 */
.tutorial-content::-webkit-scrollbar {
    width: 8px;
}

.tutorial-content::-webkit-scrollbar-track {
    background: rgba(var(--primary-color-rgb), 0.1);
    border-radius: 4px;
}

.tutorial-content::-webkit-scrollbar-thumb {
    background: rgba(var(--primary-color-rgb), 0.4);
    border-radius: 4px;
}

.tutorial-content::-webkit-scrollbar-thumb:hover {
    background: rgba(var(--primary-color-rgb), 0.6);
}

.tutorial-section {
    margin-bottom: 35px;
    padding-bottom: 25px;
    border-bottom: 1px solid rgba(74, 124, 89, 0.1);
    position: relative;
}

.tutorial-section::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--primary-color) 0%, var(--info-color) 100%);
    border-radius: 2px;
    opacity: 0.3;
}

.tutorial-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.tutorial-section h4 {
    color: var(--primary-color);
    font-size: 20px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid var(--primary-color);
    display: inline-block;
    font-weight: 700;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tutorial-step {
    margin-bottom: 25px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    border-left: 5px solid var(--primary-color);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.tutorial-step:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.tutorial-step h5 {
    color: var(--text-color);
    font-size: 17px;
    margin-bottom: 12px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tutorial-step h5::before {
    content: '✓';
    color: var(--primary-color);
    font-weight: 700;
}

.tutorial-step ul {
    margin: 0;
    padding-left: 25px;
}

.tutorial-step li {
    margin-bottom: 10px;
    line-height: 1.6;
    color: #555;
    font-size: 15px;
    position: relative;
}

.tutorial-step li::before {
    content: '•';
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: -18px;
    top: 0;
}

.faq-item {
    margin-bottom: 25px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    border-left: 5px solid var(--info-color);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.faq-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.faq-item h5 {
    color: var(--info-color);
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: 600;
}

.faq-item p {
    color: #555;
    line-height: 1.6;
    margin: 0;
    font-size: 15px;
}

.tutorial-content kbd {
    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
    padding: 4px 8px;
    border-radius: 6px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #333;
    font-weight: 600;
}

/* 教程底部操作区优化 */
#tutorialModal .form-actions {
    background: rgba(74, 124, 89, 0.05);
    padding: 25px 30px;
    margin: 30px -30px 0;
    border-radius: 0 0 16px 16px;
    border-top: 1px solid rgba(74, 124, 89, 0.1);
}

#tutorialModal .form-actions button {
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#tutorialModal .btn.primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--dark-color) 100%);
    border: none;
    color: white;
    padding: 12px 24px;
    font-size: 15px;
}

#tutorialModal .btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 124, 89, 0.4);
}

#tutorialModal .btn.secondary {
    background: white;
    color: var(--text-color);
    border: 1px solid var(--border-color);
    padding: 12px 24px;
    font-size: 15px;
}

#tutorialModal .btn.secondary:hover {
    background: var(--light-color);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

/* 移动端教程内容优化 */
@media (max-width: 768px) {
    #tutorialModal .modal-content {
        margin: 10px;
        max-width: calc(100vw - 20px);
        max-height: calc(100vh - 20px);
        border-radius: 12px;
    }
    
    #tutorialModal .modal-header {
        padding: 20px 25px;
        margin: 0 -15px 20px;
    }
    
    #tutorialModal h3 {
        font-size: 22px !important;
        text-align: center;
    }
    
    .tutorial-content {
        padding: 0 20px 15px;
    }
    
    .tutorial-section h4 {
        font-size: 18px;
    }
    
    .tutorial-step {
        padding: 15px;
        margin-bottom: 20px;
    }
    
    .tutorial-step h5 {
        font-size: 16px;
    }
    
    .tutorial-step li {
        font-size: 14px;
    }
    
    .faq-item {
        padding: 15px;
        margin-bottom: 20px;
    }
    
    .faq-item h5 {
        font-size: 15px;
    }
    
    .faq-item p {
        font-size: 14px;
    }
    
    #tutorialModal .form-actions {
        flex-direction: column;
        gap: 10px;
        padding: 20px;
    }
    
    #tutorialModal .form-actions button {
        width: 100%;
        min-width: auto;
    }
}
    
    /* 确保科目卡片完整显示 */
    .subject-card {
        margin: 6px 0 !important; /* 减少科目卡片间距 */
        padding: 12px 15px !important; /* 减少内边距 */
        min-height: 55px !important; /* 减少最小高度 */
        border: 1px solid var(--border-color) !important;
        background: var(--light-color) !important;
        box-shadow: 0 2px 6px var(--shadow-color) !important; /* 减少阴影 */
        border-radius: 8px !important; /* 减少圆角 */
        transition: all 0.3s ease !important;
    }
    
    .subject-card:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.12) !important;
    }
    
    /* 科目信息样式 */
    .subject-info .subject-name {
        font-size: 15px !important; /* 减少字体大小 */
        font-weight: 600 !important;
        color: var(--text-color) !important;
        margin-bottom: 3px !important; /* 减少底部间距 */
        line-height: 1.3 !important; /* 减少行高 */
    }
    
    .subject-info .teacher-name {
        font-size: 13px !important; /* 减少字体大小 */
        color: var(--text-color) !important;
        opacity: 0.9 !important;
        line-height: 1.1 !important; /* 减少行高 */
    }
    
    /* 科目操作按钮优化 */
    .subject-actions {
        gap: 6px !important; /* 减少按钮间距 */
    }
    
    /* 移动端现代化文字按钮优化 */
    .btn-text {
        padding: 8px 14px !important;
        font-size: 11px !important;
        min-width: 45px !important;
        height: 32px !important;
        border-radius: 8px !important;
        margin: 0 3px !important;
        letter-spacing: 0.3px !important;
        font-weight: 600 !important;
    }
    
    .btn-text:hover {
        transform: translateY(-1px) !important;
    }
    
    .btn-text:active {
        transform: translateY(0) !important;
    }
    
    /* 移动端编辑按钮优化 - 使用主题色变量 */
    .edit-btn {
        background: rgba(143, 188, 143, 0.08) !important;
        border-color: rgba(143, 188, 143, 0.3) !important;
    }
    
    .edit-btn:hover {
        background: rgba(143, 188, 143, 0.15) !important;
        border-color: rgba(143, 188, 143, 0.5) !important;
    }
    
    /* 移动端删除按钮优化 - 使用主题色变量 */
    .delete-btn {
        background: rgba(239, 68, 68, 0.08) !important;
        border-color: rgba(239, 68, 68, 0.3) !important;
    }
    
    .delete-btn:hover {
        background: rgba(239, 68, 68, 0.15) !important;
        border-color: rgba(239, 68, 68, 0.5) !important;
    }
    
    /* 为不同主题添加移动端按钮样式 */
    .theme-blue .edit-btn {
        background: rgba(0, 123, 255, 0.08) !important;
        border-color: rgba(0, 123, 255, 0.3) !important;
    }
    
    .theme-blue .edit-btn:hover {
        background: rgba(0, 123, 255, 0.15) !important;
        border-color: rgba(0, 123, 255, 0.5) !important;
    }
    
    .theme-purple .edit-btn {
        background: rgba(111, 66, 193, 0.08) !important;
        border-color: rgba(111, 66, 193, 0.3) !important;
    }
    
    .theme-purple .edit-btn:hover {
        background: rgba(111, 66, 193, 0.15) !important;
        border-color: rgba(111, 66, 193, 0.5) !important;
    }
    
    .theme-pink .edit-btn {
        background: rgba(233, 30, 99, 0.08) !important;
        border-color: rgba(233, 30, 99, 0.3) !important;
    }
    
    .theme-pink .edit-btn:hover {
        background: rgba(233, 30, 99, 0.15) !important;
        border-color: rgba(233, 30, 99, 0.5) !important;
    }
    
    .theme-orange .edit-btn {
        background: rgba(253, 126, 20, 0.08) !important;
        border-color: rgba(253, 126, 20, 0.3) !important;
    }
    
    .theme-orange .edit-btn:hover {
        background: rgba(253, 126, 20, 0.15) !important;
        border-color: rgba(253, 126, 20, 0.5) !important;
    }
    
    .theme-dark .edit-btn {
        background: rgba(32, 201, 151, 0.08) !important;
        border-color: rgba(32, 201, 151, 0.3) !important;
    }
    
    .theme-dark .edit-btn:hover {
        background: rgba(32, 201, 151, 0.15) !important;
        border-color: rgba(32, 201, 151, 0.5) !important;
    }
}`,
      "tools/kechengbiao2/js/script.js": `class TimetableApp {
    constructor() {
        this.subjects = [];
        this.timetable = {};
        this.periods = {
            morning: [
                { name: '第1节', time: '08:00-08:40' },
                { name: '第2节', time: '08:50-09:30' },
                { name: '第3节', time: '10:00-10:40' },
                { name: '第4节', time: '10:50-11:30' }
            ],
            afternoon: [
                { name: '第1节', time: '14:00-14:40' },
                { name: '第2节', time: '14:50-15:30' },
                { name: '第3节', time: '15:40-16:20' }
            ],
            evening: [
                { name: '第1节', time: '19:00-19:40' },
                { name: '第2节', time: '19:50-20:30' }
            ]
        };
        this.sectionNames = {
            morning: '上午',
            afternoon: '下午',
            evening: '晚上'
        };
        this.settings = {
            showEvening: true,
            showSaturday: true,
            showSunday: true,
            showPeriodTime: true
        };
        this.editingSubject = null;
        this.editingCell = null;
        this.editingPeriod = null;
        this.draggedSubject = null;
        
        this.init();
    }

    init() {
        this.loadData();
        this.loadSettings();
        this.bindEvents();
        this.renderSubjects();
        this.renderTimetable();
        this.loadTimetableTitle();
        this.loadTableTitle();
        this.applySettings();
    }

    bindEvents() {
        // 科目相关
        document.getElementById('addSubjectBtn').addEventListener('click', () => this.openSubjectModal());
        document.getElementById('importSubjectBtn').addEventListener('click', () => this.openImportSubjectModal());
        document.getElementById('subjectForm').addEventListener('submit', (e) => this.saveSubject(e));
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeSubjectModal());
        document.getElementById('deleteSubjectBtn').addEventListener('click', () => this.deleteSubject());
        document.getElementById('importSubjectForm').addEventListener('submit', (e) => this.importSubjects(e));
        document.getElementById('cancelImportBtn').addEventListener('click', () => this.closeImportSubjectModal());
        
        // 课程表标题
        document.getElementById('timetableTitle').addEventListener('input', (e) => this.saveTimetableTitle(e.target.value));
        document.getElementById('tableTitle').addEventListener('input', (e) => this.saveTableTitle(e.target.value));
        
        // 课时管理
        document.getElementById('addMorningBtn').addEventListener('click', () => this.addPeriod('morning'));
        document.getElementById('addAfternoonBtn').addEventListener('click', () => this.addPeriod('afternoon'));
        document.getElementById('addEveningBtn').addEventListener('click', () => this.addPeriod('evening'));
        document.getElementById('removeMorningBtn').addEventListener('click', () => this.removePeriod('morning'));
        document.getElementById('removeAfternoonBtn').addEventListener('click', () => this.removePeriod('afternoon'));
        document.getElementById('removeEveningBtn').addEventListener('click', () => this.removePeriod('evening'));
        
        // PC端课时管理按钮
        document.getElementById('addMorningBtn2').addEventListener('click', () => this.addPeriod('morning'));
        document.getElementById('addAfternoonBtn2').addEventListener('click', () => this.addPeriod('afternoon'));
        document.getElementById('addEveningBtn2').addEventListener('click', () => this.addPeriod('evening'));
        document.getElementById('removeMorningBtn2').addEventListener('click', () => this.removePeriod('morning'));
        document.getElementById('removeAfternoonBtn2').addEventListener('click', () => this.removePeriod('afternoon'));
        document.getElementById('removeEveningBtn2').addEventListener('click', () => this.removePeriod('evening'));
        
        // 时间相关
        document.getElementById('timeForm').addEventListener('submit', (e) => this.savePeriodTime(e));
        document.getElementById('cancelTimeBtn').addEventListener('click', () => this.closeTimeModal());
        
        // 初始化时间选择器
        this.initTimeSelectors();
        
        // 教程事件
        document.getElementById('tutorialBtn').addEventListener('click', () => this.openTutorialModal());
        document.getElementById('closeTutorialBtn').addEventListener('click', () => this.closeTutorialModal());
        
        // 重置和导出
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTimetable());
        
        // 导出下拉菜单
        document.getElementById('exportBtn').addEventListener('click', (e) => this.toggleExportDropdown(e));
        document.getElementById('saveImageBtn').addEventListener('click', () => this.saveAsImage());
        document.getElementById('exportWordBtn').addEventListener('click', () => this.exportToWord());
        document.getElementById('exportExcelBtn').addEventListener('click', () => this.exportToExcel());
        
        // 设置相关
        document.getElementById('settingsBtn').addEventListener('click', () => this.openSettingsModal());
        document.getElementById('settingsForm').addEventListener('submit', (e) => this.saveSettings(e));
        document.getElementById('cancelSettingsBtn').addEventListener('click', () => this.closeSettingsModal());
        
        // 备份数据相关
        document.getElementById('backupBtn').addEventListener('click', (e) => this.toggleBackupMenu(e));
        document.getElementById('exportDataBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importDataBtn').addEventListener('click', () => this.importData());
        document.getElementById('importFileInput').addEventListener('change', (e) => this.handleFileImport(e));
        
        // 手机端汉堡菜单相关
        document.getElementById('hamburgerBtn').addEventListener('click', () => this.toggleMobileSidebar());
        document.getElementById('closeSidebarBtn').addEventListener('click', () => this.closeMobileSidebar());
        document.getElementById('sidebarOverlay').addEventListener('click', () => this.closeMobileSidebar());
        
        // 侧边栏菜单按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sidebar-btn')) {
                const action = e.target.dataset.action;
                this.handleSidebarAction(action);
            }
            // 侧边栏主题按钮
            if (e.target.classList.contains('sidebar-theme-btn')) {
                const theme = e.target.dataset.theme;
                setTheme(theme);
                this.updateSidebarThemeButtons(theme);
            }
            // 侧边栏字体按钮
            if (e.target.classList.contains('sidebar-font-btn')) {
                const font = e.target.dataset.font;
                setFont(font);
                this.updateSidebarFontButtons(font);
            }
        });
        
        // 手机端自定义颜色选择器
        const mobileColorPicker = document.getElementById('mobileCustomColorPicker');
        if (mobileColorPicker) {
            mobileColorPicker.addEventListener('input', (e) => {
                applyCustomColor(e.target.value);
            });
            mobileColorPicker.addEventListener('change', (e) => {
                localStorage.setItem('timetable-custom-color', e.target.value);
            });
        }
        
        // 全局点击事件监听器 - 点击外部区域隐藏下拉菜单
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
        
        // 窗口大小改变时重新调整下拉菜单
        window.addEventListener('resize', () => this.handleWindowResize());
        
        // 颜色选择 - 背景色
        document.querySelectorAll('.color-option.bg-color').forEach(option => {
            option.addEventListener('click', (e) => this.selectBgColor(e));
        });
        
        // 颜色选择 - 字体色
        document.querySelectorAll('.color-option.text-color').forEach(option => {
            option.addEventListener('click', (e) => this.selectTextColor(e));
        });
        
        // 背景色自定义颜色选择器
        const bgColorPicker = document.getElementById('bgColorPicker');
        const bgColorText = document.getElementById('bgColorText');
        
        if (bgColorPicker) {
            bgColorPicker.addEventListener('input', (e) => {
                if (bgColorText) bgColorText.value = e.target.value;
                this.updateColorPreview();
                // 取消预设颜色的选中状态
                document.querySelectorAll('.color-option.bg-color').forEach(opt => opt.classList.remove('selected'));
            });
        }
        
        if (bgColorText) {
            bgColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    if (bgColorPicker) bgColorPicker.value = e.target.value;
                    this.updateColorPreview();
                }
            });
        }
        
        // 字体色自定义颜色选择器
        const textColorPicker = document.getElementById('textColorPicker');
        const textColorText = document.getElementById('textColorText');
        
        if (textColorPicker) {
            textColorPicker.addEventListener('input', (e) => {
                if (textColorText) textColorText.value = e.target.value;
                this.updateColorPreview();
                // 取消预设颜色的选中状态
                document.querySelectorAll('.color-option.text-color').forEach(opt => opt.classList.remove('selected'));
            });
        }
        
        if (textColorText) {
            textColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    if (textColorPicker) textColorPicker.value = e.target.value;
                    this.updateColorPreview();
                }
            });
        }
        
        // 颜色模式选择事件
        document.querySelectorAll('input[name="colorMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleColorModeChange(e.target.value);
            });
        });
        
        // 拖拽相关
        this.setupDragAndDrop();
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.editingCell) {
                this.removeSubjectFromCell(this.editingCell);
            }
            if (e.key === 'Escape') {
                // 关闭所有弹窗（优先级：手机端侧边栏 > 手机端科目选择 > 科目编辑 > 时间设置 > 教程）
                const sidebar = document.getElementById('mobileSidebar');
                if (sidebar && sidebar.classList.contains('show')) {
                    this.closeMobileSidebar();
                } else if (this.currentMobileModal) {
                    this.closeMobileSubjectModal(this.currentMobileModal);
                } else {
                    this.closeSubjectModal();
                    this.closeTimeModal();
                    this.closeTutorialModal();
                }
            }
        });
    }

    setupDragAndDrop() {
        // 科目池拖拽
        document.getElementById('subjectPool').addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('subject-card')) {
                this.draggedSubject = e.target.dataset.subjectId;
                e.target.classList.add('dragging');
            }
        });
        
        document.getElementById('subjectPool').addEventListener('dragend', (e) => {
            if (e.target.classList.contains('subject-card')) {
                e.target.classList.remove('dragging');
            }
        });
        
        // 使用事件委托处理表格拖拽
        const timetable = document.getElementById('timetable');
        
        timetable.addEventListener('dragover', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('occupied')) {
                e.preventDefault();
                cell.classList.add('drag-over');
            }
        });
        
        timetable.addEventListener('dragleave', (e) => {
            const cell = e.target.closest('.cell');
            if (cell) {
                cell.classList.remove('drag-over');
            }
        });
        
        timetable.addEventListener('drop', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && !cell.classList.contains('occupied')) {
                e.preventDefault();
                cell.classList.remove('drag-over');
                
                if (this.draggedSubject) {
                    const day = cell.dataset.day;
                    const section = cell.dataset.section;
                    const period = cell.dataset.period;
                    this.addSubjectToCell(this.draggedSubject, day, section, period);
                }
            }
        });
        
        // 双击删除课程
        timetable.addEventListener('dblclick', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && cell.classList.contains('occupied')) {
                this.removeSubjectFromCell(cell);
            }
        });
    }

    openSubjectModal(subject = null) {
        this.editingSubject = subject;
        const modal = document.getElementById('subjectModal');
        const nameInput = document.getElementById('subjectName');
        const teacherInput = document.getElementById('teacherName');
        const deleteBtn = document.getElementById('deleteSubjectBtn');
        
        if (subject) {
            nameInput.value = subject.name;
            teacherInput.value = subject.teacher || '';
            
            // 设置颜色模式和颜色值
            const colorMode = subject.colorMode || 'both';
            document.querySelector(\`input[name="colorMode"][value="\${colorMode}"]\`).checked = true;
            this.handleColorModeChange(colorMode);
            
            // 设置背景色
            const bgColor = subject.bgColor || subject.color || '#3498DB';
            document.getElementById('bgColorPicker').value = bgColor;
            document.getElementById('bgColorText').value = bgColor;
            this.selectBgColorByValue(bgColor);
            
            // 设置字体色
            const textColor = subject.textColor || '#FFFFFF';
            document.getElementById('textColorPicker').value = textColor;
            document.getElementById('textColorText').value = textColor;
            this.selectTextColorByValue(textColor);
            
            this.updateColorPreview();
            deleteBtn.style.display = 'block';
        } else {
            nameInput.value = '';
            teacherInput.value = '';
            
            // 默认选择背景+字体模式
            document.querySelector('input[name="colorMode"][value="both"]').checked = true;
            this.handleColorModeChange('both');
            
            // 默认颜色
            document.getElementById('bgColorPicker').value = '#3498DB';
            document.getElementById('bgColorText').value = '#3498DB';
            document.getElementById('textColorPicker').value = '#FFFFFF';
            document.getElementById('textColorText').value = '#FFFFFF';
            
            this.selectBgColorByValue('#3498DB');
            this.selectTextColorByValue('#FFFFFF');
            
            deleteBtn.style.display = 'none';
        }
        
        modal.style.display = 'flex';
        
        // 确保预览在弹窗显示后更新
        setTimeout(() => {
            this.updateColorPreview();
        }, 50);
    }

    closeSubjectModal() {
        document.getElementById('subjectModal').style.display = 'none';
        this.editingSubject = null;
    }

    openImportSubjectModal() {
        document.getElementById('importSubjectModal').style.display = 'flex';
    }

    closeImportSubjectModal() {
        document.getElementById('importSubjectModal').style.display = 'none';
    }

    importSubjects(e) {
        e.preventDefault();
        
        const stageSelect = document.getElementById('stageSelect');
        const stage = stageSelect.value;
        
        if (!stage) return;
        
        // 定义各阶段的科目数据
        const stageSubjects = {
            primary: [
                { id: Date.now() + '_1', name: '语文', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_2', name: '数学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_3', name: '英语', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_4', name: '道德与法治', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_5', name: '科学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_6', name: '体育与健康', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_7', name: '音乐', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_8', name: '美术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_9', name: '信息技术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_10', name: '劳动', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_11', name: '综合实践活动', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_12', name: '地方与学校课程', teacher: '', color: '#000000', colorType: 'text' }
            ],
            junior: [
                { id: Date.now() + '_1', name: '语文', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_2', name: '数学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_3', name: '英语', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_4', name: '道德与法治', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_5', name: '历史', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_6', name: '地理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_7', name: '物理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_8', name: '化学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_9', name: '生物', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_10', name: '体育与健康', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_11', name: '音乐', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_12', name: '美术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_13', name: '信息技术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_14', name: '劳动技术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_15', name: '综合实践活动', teacher: '', color: '#000000', colorType: 'text' }
            ],
            senior: [
                { id: Date.now() + '_1', name: '语文', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_2', name: '数学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_3', name: '英语', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_4', name: '思想政治', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_5', name: '历史', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_6', name: '地理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_7', name: '物理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_8', name: '化学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_9', name: '生物', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_10', name: '体育与健康', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_11', name: '音乐', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_12', name: '美术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_13', name: '信息技术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_14', name: '通用技术', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_15', name: '综合实践活动', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_16', name: '校本课程', teacher: '', color: '#000000', colorType: 'text' }
            ],
            university: [
                // 公共基础课
                { id: Date.now() + '_1', name: '大学语文', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_2', name: '高等数学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_3', name: '大学英语', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_4', name: '大学物理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_5', name: '大学化学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_6', name: '思想政治理论', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_7', name: '体育', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_8', name: '军事理论', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_9', name: '心理健康教育', teacher: '', color: '#000000', colorType: 'text' },
                // 专业基础课
                { id: Date.now() + '_10', name: '线性代数', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_11', name: '概率论与数理统计', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_12', name: '程序设计基础', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_13', name: '数据结构', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_14', name: '电路分析', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_15', name: '机械制图', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_16', name: '经济学原理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_17', name: '管理学原理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_18', name: '心理学导论', teacher: '', color: '#000000', colorType: 'text' },
                // 计算机类专业课程
                { id: Date.now() + '_19', name: '操作系统', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_20', name: '计算机网络', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_21', name: '数据库原理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_22', name: '软件工程', teacher: '', color: '#000000', colorType: 'text' },
                // 经济类专业课程
                { id: Date.now() + '_23', name: '微观经济学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_24', name: '宏观经济学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_25', name: '金融学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_26', name: '会计学', teacher: '', color: '#000000', colorType: 'text' },
                // 管理类专业课程
                { id: Date.now() + '_27', name: '市场营销', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_28', name: '人力资源管理', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_29', name: '财务管理', teacher: '', color: '#000000', colorType: 'text' },
                // 工程类专业课程
                { id: Date.now() + '_30', name: '材料力学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_31', name: '工程热力学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_32', name: '自动控制原理', teacher: '', color: '#000000', colorType: 'text' },
                // 文学类专业课程
                { id: Date.now() + '_33', name: '古代文学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_34', name: '现代文学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_35', name: '外国文学', teacher: '', color: '#000000', colorType: 'text' },
                // 法学类专业课程
                { id: Date.now() + '_36', name: '宪法学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_37', name: '民法学', teacher: '', color: '#000000', colorType: 'text' },
                { id: Date.now() + '_38', name: '刑法学', teacher: '', color: '#000000', colorType: 'text' }
            ]
        };

        // 清除现有科目和课程表
        this.subjects = [];
        this.timetable = {};
        
        // 添加新科目
        this.subjects = stageSubjects[stage];
        
        // 保存数据并重新渲染
        this.saveData();
        this.renderSubjects();
        this.renderTimetable();
        
        // 关闭模态框
        this.closeImportSubjectModal();
        
        // 显示成功提示
        this.showNotification('科目导入成功！', 'success');
    }

    saveSubject(e) {
        e.preventDefault();
        
        const name = document.getElementById('subjectName').value.trim();
        const teacher = document.getElementById('teacherName').value.trim();
        const colorMode = document.querySelector('input[name="colorMode"]:checked').value;
        const bgColor = document.getElementById('bgColorPicker').value;
        const textColor = document.getElementById('textColorPicker').value;
        
        if (!name) return;
        
        if (this.editingSubject) {
            this.editingSubject.name = name;
            this.editingSubject.teacher = teacher;
            this.editingSubject.colorMode = colorMode;
            this.editingSubject.bgColor = bgColor;
            this.editingSubject.textColor = textColor;
            // 保持向后兼容
            this.editingSubject.color = bgColor;
            this.editingSubject.colorType = colorMode === 'textOnly' ? 'text' : 'background';
        } else {
            const subject = {
                id: Date.now().toString(),
                name,
                teacher,
                colorMode,
                bgColor,
                textColor,
                // 保持向后兼容
                color: bgColor,
                colorType: colorMode === 'textOnly' ? 'text' : 'background'
            };
            this.subjects.push(subject);
        }
        
        this.saveData();
        this.renderSubjects();
        this.renderTimetable();
        this.closeSubjectModal();
    }

    deleteSubject() {
        if (this.editingSubject) {
            this.deleteSubjectFromPool(this.editingSubject.id);
            this.closeSubjectModal();
        }
    }

    deleteSubjectFromPool(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (subject) {
            // 从科目列表中删除
            this.subjects = this.subjects.filter(s => s.id !== subjectId);
            
            // 从课程表中移除该科目的所有实例
            Object.keys(this.timetable).forEach(key => {
                if (this.timetable[key] === subjectId) {
                    delete this.timetable[key];
                }
            });
            
            this.saveData();
            this.renderSubjects();
            this.renderTimetable();
        }
    }

    // 选择背景色
    selectBgColor(e) {
        const color = e.target.dataset.color;
        if (!color) return;
        
        const bgColorPicker = document.getElementById('bgColorPicker');
        const bgColorText = document.getElementById('bgColorText');
        
        if (bgColorPicker) bgColorPicker.value = color;
        if (bgColorText) bgColorText.value = color;
        
        document.querySelectorAll('.color-option.bg-color').forEach(opt => {
            opt.classList.remove('selected');
        });
        e.target.classList.add('selected');
        this.updateColorPreview();
    }
    
    // 选择字体色
    selectTextColor(e) {
        const color = e.target.dataset.color;
        if (!color) return;
        
        const textColorPicker = document.getElementById('textColorPicker');
        const textColorText = document.getElementById('textColorText');
        
        if (textColorPicker) textColorPicker.value = color;
        if (textColorText) textColorText.value = color;
        
        document.querySelectorAll('.color-option.text-color').forEach(opt => {
            opt.classList.remove('selected');
        });
        e.target.classList.add('selected');
        this.updateColorPreview();
    }
    
    // 根据值选择背景色
    selectBgColorByValue(color) {
        document.querySelectorAll('.color-option.bg-color').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.color === color);
        });
    }
    
    // 根据值选择字体色
    selectTextColorByValue(color) {
        document.querySelectorAll('.color-option.text-color').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.color === color);
        });
    }
    
    // 处理颜色模式切换
    handleColorModeChange(mode) {
        const bgColorGroup = document.getElementById('bgColorGroup');
        const textColorGroup = document.getElementById('textColorGroup');
        
        if (!bgColorGroup || !textColorGroup) return;
        
        // 更新选中状态的样式类
        document.querySelectorAll('.color-mode-option').forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio && radio.checked) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        if (mode === 'both') {
            // 背景+字体模式：显示背景色选择，显示字体色选择
            bgColorGroup.style.display = 'block';
            textColorGroup.style.display = 'block';
        } else {
            // 仅字体色模式：隐藏背景色选择，显示字体色选择
            bgColorGroup.style.display = 'none';
            textColorGroup.style.display = 'block';
        }
        this.updateColorPreview();
    }
    
    // 更新颜色预览
    updateColorPreview() {
        const preview = document.getElementById('colorPreview');
        if (!preview) return;
        
        const colorModeRadio = document.querySelector('input[name="colorMode"]:checked');
        const colorMode = colorModeRadio ? colorModeRadio.value : 'both';
        const bgColorPicker = document.getElementById('bgColorPicker');
        const textColorPicker = document.getElementById('textColorPicker');
        
        const bgColor = bgColorPicker ? bgColorPicker.value : '#3498DB';
        const textColor = textColorPicker ? textColorPicker.value : '#FFFFFF';
        
        // 直接设置样式，使用 cssText 确保覆盖
        if (colorMode === 'both') {
            preview.style.cssText = \`
                padding: 16px 20px;
                border-radius: 8px;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                min-height: 20px;
                background-color: \${bgColor};
                color: \${textColor};
                border: 1px solid \${bgColor};
            \`;
        } else {
            preview.style.cssText = \`
                padding: 16px 20px;
                border-radius: 8px;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                min-height: 20px;
                background-color: transparent;
                color: \${textColor};
                border: 1px solid #ddd;
            \`;
        }
    }

    // 保留旧函数以兼容
    selectColor(e) {
        const color = e.target.dataset.color;
        if (e.target.classList.contains('bg-color')) {
            this.selectBgColor(e);
        } else if (e.target.classList.contains('text-color')) {
            this.selectTextColor(e);
        }
    }

    selectColorByValue(color) {
        // 兼容旧数据
        document.getElementById('bgColorPicker').value = color;
        document.getElementById('bgColorText').value = color;
        this.selectBgColorByValue(color);
    }

    getCurrentColorType() {
        const radio = document.querySelector('input[name="colorMode"]:checked');
        return radio && radio.value === 'textOnly' ? 'text' : 'background';
    }

    showColorOptions(type) {
        // 保留兼容性，但不再使用
    }

    openTimeModal(e) {
        const timeText = e.target;
        const period = timeText.dataset.period;
        const modal = document.getElementById('timeModal');
        const timeInput = document.getElementById('timeRange');
        
        timeInput.value = timeText.textContent;
        timeInput.dataset.period = period;
        modal.style.display = 'flex';
    }

    closeTimeModal() {
        document.getElementById('timeModal').style.display = 'none';
    }

    // 打开时段名称编辑弹窗
    openSectionNameModal(section) {
        this.editingSection = section;
        
        const sectionName = this.sectionNames[section];
        const sectionLabel = { morning: '上午', afternoon: '下午', evening: '晚上' }[section];
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.background = 'rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '2000';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.style.cssText = \`
            background: white;
            border-radius: 12px;
            padding: 25px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        \`;
        
        content.innerHTML = \`
            <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">修改时段名称<\/h3>
            <form id="sectionNameForm">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #666;">时段名称（当前：\${sectionLabel}）<\/label>
                    <input type="text" id="sectionNameInput" value="\${sectionName}" required 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;" 
                           placeholder="请输入旰的名称">
                <\/div>
                <div class="form-actions" style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" id="cancelSectionBtn" class="btn secondary" 
                            style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">取消<\/button>
                    <button type="submit" class="btn primary" 
                            style="padding: 8px 16px; background: #4a7c59; color: white; border: none; border-radius: 6px; cursor: pointer;">保存<\/button>
                <\/div>
            <\/form>
        \`;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 焦点输入框
        setTimeout(() => {
            const input = document.getElementById('sectionNameInput');
            input.focus();
            input.select();
        }, 100);
        
        // 保存事件
        const form = document.getElementById('sectionNameForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newName = document.getElementById('sectionNameInput').value.trim();
            if (newName) {
                this.sectionNames[section] = newName;
                this.saveData();
                this.renderTimetable();
                document.body.removeChild(modal);
            }
        });
        
        // 取消事件
        document.getElementById('cancelSectionBtn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // ESC关闭
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                if (modal.parentNode) {
                    document.body.removeChild(modal);
                }
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    openTutorialModal() {
        this.generateTutorialContent();
        document.getElementById('tutorialModal').style.display = 'flex';
    }

    closeTutorialModal() {
        document.getElementById('tutorialModal').style.display = 'none';
    }

    generateTutorialContent() {
        const tutorialContent = document.getElementById('tutorialContent');
        if (!tutorialContent) return;
    
        const content = \`
            <div class="tutorial-section">
                <h4 class="tutorial-section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/><\/svg>
                    快速开始
                <\/h4>
                <div class="tutorial-grid">
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/><\/svg>
                        <\/div>
                        <div class="tutorial-card-content">
                            <strong>添加科目<\/strong>
                            <span>点击“+ 科目”按钮创建课程<\/span>
                        <\/div>
                    <\/div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/><\/svg>
                        <\/div>
                        <div class="tutorial-card-content">
                            <strong>导入预设<\/strong>
                            <span>按学习阶段快速导入课程<\/span>
                        <\/div>
                    <\/div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><polyline points="5,9 2,12 5,15"/><polyline points="9,5 12,2 15,5"/><polyline points="19,9 22,12 19,15"/><polyline points="9,19 12,22 15,19"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><\/svg>
                        <\/div>
                        <div class="tutorial-card-content">
                            <strong>拖拽排课<\/strong>
                            <span>将科目拖到课程表对应位置<\/span>
                        <\/div>
                    <\/div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/><\/svg>
                        <\/div>
                        <div class="tutorial-card-content">
                            <strong>设置时间<\/strong>
                            <span>点击课时标签修改上课时间<\/span>
                        <\/div>
                    <\/div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/><\/svg>
                        <\/div>
                        <div class="tutorial-card-content">
                            <strong>导出保存<\/strong>
                            <span>支持图片/Word/Excel格式<\/span>
                        <\/div>
                    <\/div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/><\/svg>
                        <\/div>
                        <div class="tutorial-card-content">
                            <strong>备份数据<\/strong>
                            <span>导出/导入JSON数据文件<\/span>
                        <\/div>
                    <\/div>
                <\/div>
            <\/div>
    
            <div class="tutorial-section">
                <h4 class="tutorial-section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/><\/svg>
                    个性化设置
                <\/h4>
                <div class="tutorial-features">
                    <div class="tutorial-feature">
                        <span class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.68 1.5-1.5 0-.38-.1-.74-.33-1.05-.21-.27-.33-.67-.33-1.05 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.52-4.48-10-10-10z"/><\/svg>
                        <\/span>
                        <div class="feature-text">
                            <strong>主题切换<\/strong>
                            <span>6种预设主题 + 自定义颜色<\/span>
                        <\/div>
                    <\/div>
                    <div class="tutorial-feature">
                        <span class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><polyline points="4,7 4,4 20,4 20,7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/><\/svg>
                        <\/span>
                        <div class="feature-text">
                            <strong>字体选择<\/strong>
                            <span>多种中英文字体可选<\/span>
                        <\/div>
                    <\/div>
                    <div class="tutorial-feature">
                        <span class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><\/svg>
                        <\/span>
                        <div class="feature-text">
                            <strong>显示设置<\/strong>
                            <span>控制晚间/周末/时间显示<\/span>
                        <\/div>
                    <\/div>
                <\/div>
            <\/div>
    
            <div class="tutorial-section">
                <h4 class="tutorial-section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/><\/svg>
                    小技巧
                <\/h4>
                <div class="tutorial-tips">
                    <div class="tip-item"><kbd>ESC<\/kbd> 快速关闭弹窗<\/div>
                    <div class="tip-item">右键点击课程可删除<\/div>
                    <div class="tip-item">数据自动保存到浏览器<\/div>
                    <div class="tip-item">建议定期备份数据<\/div>
                <\/div>
            <\/div>
        \`;
    
        tutorialContent.innerHTML = content;
        
        // 绑定"我知道了"按钮事件
        const closeTutorialBtn = document.getElementById('closeTutorialBtn');
        if (closeTutorialBtn) {
            closeTutorialBtn.onclick = () => this.closeTutorialModal();
        }
    }

    // 设置相关方法
    loadSettings() {
        const savedSettings = localStorage.getItem('timetableSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveSettings() {
        localStorage.setItem('timetableSettings', JSON.stringify(this.settings));
    }

    applySettings() {
        // 应用晚上课时显示设置 - 直接通过ID查找并隐藏整个控制行
        const eveningControlLines = document.querySelectorAll('.period-control-line');
        
        eveningControlLines.forEach(controlLine => {
            const span = controlLine.querySelector('span');
            if (span && span.textContent.trim() === '晚上课时') {
                // 隐藏整个控制行（包括文本和按钮）
                controlLine.style.display = this.settings.showEvening ? 'flex' : 'none';
                controlLine.style.visibility = this.settings.showEvening ? 'visible' : 'hidden';
            }
        });

        // 应用周六、周日显示设置
        const saturdayCol = document.getElementById('saturdayCol');
        const sundayCol = document.getElementById('sundayCol');
        
        if (saturdayCol) {
            saturdayCol.style.display = this.settings.showSaturday ? 'table-cell' : 'none';
        }
        if (sundayCol) {
            sundayCol.style.display = this.settings.showSunday ? 'table-cell' : 'none';
        }

        // 更新课程表中的周末列 - 重新渲染后应用设置
        setTimeout(() => {
            const weekendCols = document.querySelectorAll('.weekend-col');
            weekendCols.forEach(col => {
                if (col.dataset.day === '6') {
                    col.style.display = this.settings.showSaturday ? 'table-cell' : 'none';
                } else if (col.dataset.day === '7') {
                    col.style.display = this.settings.showSunday ? 'table-cell' : 'none';
                }
            });
        }, 0);

        // 应用时间显示设置
        setTimeout(() => {
            const timeDisplays = document.querySelectorAll('.time-display');
            timeDisplays.forEach(display => {
                display.style.display = this.settings.showPeriodTime ? 'block' : 'none';
            });
        }, 0);

        this.renderTimetable();
    }

    openSettingsModal() {
        const modal = document.getElementById('settingsModal');
        const showEveningCheckbox = document.getElementById('showEvening');
        const showSaturdayCheckbox = document.getElementById('showSaturday');
        const showSundayCheckbox = document.getElementById('showSunday');
        const showPeriodTimeCheckbox = document.getElementById('showPeriodTime');

        showEveningCheckbox.checked = this.settings.showEvening;
        showSaturdayCheckbox.checked = this.settings.showSaturday;
        showSundayCheckbox.checked = this.settings.showSunday;
        showPeriodTimeCheckbox.checked = this.settings.showPeriodTime;

        modal.style.display = 'flex';
    }

    closeSettingsModal() {
        document.getElementById('settingsModal').style.display = 'none';
    }

    // 备份数据相关方法
    toggleBackupMenu(e) {
        e.stopPropagation();
        const menu = document.getElementById('backupMenu');
        const isVisible = menu.classList.contains('show');
        
        // 关闭所有其他下拉菜单
        this.closeAllDropdowns();
        
        if (!isVisible) {
            menu.classList.add('show');
            this.positionDropdown(menu, e.target);
        }
    }

    closeBackupMenu(e) {
        const menu = document.getElementById('backupMenu');
        const button = document.getElementById('backupBtn');
        
        if (!menu.contains(e.target) && !button.contains(e.target)) {
            menu.classList.remove('show');
            document.removeEventListener('click', this.closeBackupMenu.bind(this));
        }
    }

    // 导出数据
    exportData() {
        try {
            const data = {
                timetable: this.timetable,
                subjects: this.subjects,
                periods: this.periods,
                sectionNames: this.sectionNames,
                settings: this.settings,
                exportTime: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = \`课程表备份_\${new Date().toLocaleDateString().replace(/\\//g, '-')}.json\`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showNotification('数据导出成功！', 'success');
            this.closeBackupMenu({ target: null });
        } catch (error) {
            console.error('导出数据失败:', error);
            this.showNotification('导出数据失败，请重试', 'error');
        }
    }

    // 导入数据
    importData() {
        document.getElementById('importFileInput').click();
        this.closeBackupMenu({ target: null });
    }

    // 处理文件导入
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        console.log('开始导入文件:', file.name, '大小:', file.size, 'bytes');

        if (!file.name.endsWith('.json')) {
            this.showNotification('请选择JSON格式的备份文件', 'error');
            return;
        }

        if (file.size === 0) {
            this.showNotification('文件为空，请选择有效的备份文件', 'error');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB限制
            this.showNotification('文件过大，请选择小于10MB的备份文件', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                console.log('文件读取成功，文件内容长度:', e.target.result.length);
                console.log('文件内容前100字符:', e.target.result.substring(0, 100));
                
                // 检查文件内容是否为空
                if (!e.target.result || e.target.result.trim() === '') {
                    this.showNotification('文件内容为空，请选择有效的备份文件', 'error');
                    return;
                }
                
                console.log('开始解析JSON...');
                const data = JSON.parse(e.target.result);
                console.log('JSON解析成功，数据类型:', typeof data);
                console.log('数据内容:', data);
                
                // 验证数据格式
                if (!this.validateImportData(data)) {
                    this.showNotification('备份文件格式不正确，请检查文件内容', 'error');
                    return;
                }
                
                // 确认导入
                if (confirm('导入数据将覆盖当前课表，是否继续？')) {
                    console.log('用户确认导入，开始加载数据...');
                    this.loadImportedData(data);
                    this.showNotification('数据导入成功！', 'success');
                } else {
                    console.log('用户取消导入');
                }
            } catch (error) {
                console.error('导入数据失败:', error);
                console.error('错误详情:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
                
                let errorMessage = '文件解析失败';
                if (error instanceof SyntaxError) {
                    errorMessage = \`JSON格式错误: \${error.message}\`;
                    console.error('JSON解析错误位置:', error.message);
                } else if (error.message) {
                    errorMessage = \`导入失败: \${error.message}\`;
                }
                this.showNotification(errorMessage, 'error');
            }
        };
        
        reader.onerror = (error) => {
            console.error('文件读取失败:', error);
            this.showNotification('文件读取失败，请重试', 'error');
        };
        
        reader.readAsText(file, 'UTF-8');
        // 清空文件输入，允许重复选择同一文件
        event.target.value = '';
    }

    // 验证导入数据格式
    validateImportData(data) {
        try {
            console.log('开始验证导入数据:', data);
            
            // 基本结构检查
            if (!data || typeof data !== 'object') {
                console.error('数据格式错误: 不是有效的对象');
                return false;
            }
            
            // 检查必要字段
            if (!Array.isArray(data.subjects)) {
                console.error('数据格式错误: subjects 不是数组，实际类型:', typeof data.subjects);
                return false;
            }
            
            if (typeof data.timetable !== 'object') {
                console.error('数据格式错误: timetable 不是对象，实际类型:', typeof data.timetable);
                return false;
            }
            
            if (typeof data.periods !== 'object') {
                console.error('数据格式错误: periods 不是对象，实际类型:', typeof data.periods);
                return false;
            }
            
            // 检查periods结构 - 更宽松的验证
            if (data.periods.morning && !Array.isArray(data.periods.morning)) {
                console.error('数据格式错误: periods.morning 不是数组');
                return false;
            }
            
            if (data.periods.afternoon && !Array.isArray(data.periods.afternoon)) {
                console.error('数据格式错误: periods.afternoon 不是数组');
                return false;
            }
            
            if (data.periods.evening && !Array.isArray(data.periods.evening)) {
                console.error('数据格式错误: periods.evening 不是数组');
                return false;
            }
            
            // 检查科目数据格式 - 更宽松的验证
            for (let i = 0; i < data.subjects.length; i++) {
                const subject = data.subjects[i];
                if (!subject || typeof subject !== 'object') {
                    console.error(\`数据格式错误: 科目[\${i}]不是对象:\`, subject);
                    return false;
                }
                if (!subject.id && !subject.name) {
                    console.error(\`数据格式错误: 科目[\${i}]缺少必要字段:\`, subject);
                    return false;
                }
            }
            
            console.log('数据验证通过，包含字段:', Object.keys(data));
            return true;
        } catch (error) {
            console.error('验证数据时出错:', error);
            return false;
        }
    }

    // 加载导入的数据
    loadImportedData(data) {
        try {
            console.log('开始加载导入数据...');
            
            // 恢复课表数据 - 确保是对象
            this.timetable = (data.timetable && typeof data.timetable === 'object') ? data.timetable : {};
            console.log('课表数据加载:', Object.keys(this.timetable).length, '个时间段');
            
            // 恢复科目数据 - 确保是数组并验证完整性
            this.subjects = Array.isArray(data.subjects) ? data.subjects : [];
            this.subjects = this.subjects.filter(subject => {
                if (!subject || typeof subject !== 'object') {
                    console.warn('过滤掉无效的科目数据:', subject);
                    return false;
                }
                if (!subject.id) {
                    subject.id = 'subject_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    console.log('为科目生成新ID:', subject.name, subject.id);
                }
                return true;
            });
            console.log('科目数据加载:', this.subjects.length, '个科目');
            
            // 恢复时间段数据 - 提供默认值
            this.periods = {
                morning: Array.isArray(data.periods?.morning) ? data.periods.morning : [
                    { name: '第1节', time: '08:00-08:40' },
                    { name: '第2节', time: '08:50-09:30' },
                    { name: '第3节', time: '10:00-10:40' },
                    { name: '第4节', time: '10:50-11:30' }
                ],
                afternoon: Array.isArray(data.periods?.afternoon) ? data.periods.afternoon : [
                    { name: '第1节', time: '14:00-14:40' },
                    { name: '第2节', time: '14:50-15:30' },
                    { name: '第3节', time: '15:40-16:20' }
                ],
                evening: Array.isArray(data.periods?.evening) ? data.periods.evening : [
                    { name: '第1节', time: '19:00-19:40' },
                    { name: '第2节', time: '19:50-20:30' }
                ]
            };
            console.log('时间段数据加载完成');
            
            // 恢复时段名称
            this.sectionNames = data.sectionNames || {
                morning: '上午',
                afternoon: '下午',
                evening: '晚上'
            };
            console.log('时段名称加载:', this.sectionNames);
            
            // 恢复设置数据 - 提供默认值
            if (data.settings && typeof data.settings === 'object') {
                this.settings = { ...this.settings, ...data.settings };
                console.log('设置数据加载:', this.settings);
                // 应用设置
                this.applySettings();
            }
            
            // 重新渲染界面
            this.renderTimetable();
            this.renderSubjects();
            
            // 保存到本地存储
            this.saveData();
            localStorage.setItem('timetableSettings', JSON.stringify(this.settings));
            
            console.log('数据导入成功，界面已更新');
        } catch (error) {
            console.error('加载导入数据时出错:', error);
            this.showNotification('导入数据时发生错误', 'error');
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        \`;
        
        // 根据类型设置颜色
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#dc3545';
                break;
            case 'warning':
                notification.style.backgroundColor = '#ffc107';
                notification.style.color = '#333';
                break;
            default:
                notification.style.backgroundColor = '#007bff';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    saveSettings(e) {
        e.preventDefault();
        
        const showEveningCheckbox = document.getElementById('showEvening');
        const showSaturdayCheckbox = document.getElementById('showSaturday');
        const showSundayCheckbox = document.getElementById('showSunday');
        const showPeriodTimeCheckbox = document.getElementById('showPeriodTime');

        this.settings.showEvening = showEveningCheckbox.checked;
        this.settings.showSaturday = showSaturdayCheckbox.checked;
        this.settings.showSunday = showSundayCheckbox.checked;
        this.settings.showPeriodTime = showPeriodTimeCheckbox.checked;

        // 保存设置到本地存储
        localStorage.setItem('timetableSettings', JSON.stringify(this.settings));
        
        // 应用设置并重新渲染
        this.applySettings();
        this.closeSettingsModal();
    }

    // 立即开始创建课程表功能
    startCreatingTimetable() {
        // 关闭教程弹窗
        this.closeTutorialModal();
        
        // 如果在手机端，确保显示科目池
        if (window.innerWidth <= 768) {
            const subjectPool = document.querySelector('.subject-pool');
            if (subjectPool) {
                subjectPool.style.display = 'block';
            }
        }
        
        // 滚动到课程表顶部，确保用户看到操作区域
        const timetableContainer = document.querySelector('.timetable-container');
        if (timetableContainer) {
            timetableContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // 如果没有科目，提示用户添加
        if (this.subjects.length === 0) {
            // 显示一个简短提示
            const hint = document.createElement('div');
            hint.innerHTML = \`
                <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
                background: #4CAF50; color: white; padding: 15px 25px; border-radius: 8px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; 
                animation: fadeInOut 3s ease-in-out;">
                    请点击左侧「+ 科目」按钮开始添加科目
                <\/div>
                <style>
                @keyframes fadeInOut {
                    0% { opacity: 0; top: 0; }
                    10% { opacity: 1; top: 20px; }
                    90% { opacity: 1; top: 20px; }
                    100% { opacity: 0; top: 0; }
                }
                <\/style>
            \`;
            document.body.appendChild(hint);
            
            // 3秒后自动移除提示
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.parentNode.removeChild(hint);
                }
            }, 3000);
        }
        
        // 如果有科目，但科目池在手机端被隐藏，提示用户如何操作
        if (this.subjects.length > 0 && window.innerWidth <= 768) {
            // 检查科目池是否可见
            const subjectPool = document.querySelector('.subject-pool');
            // 使用getComputedStyle来准确判断元素是否可见
            const computedStyle = window.getComputedStyle(subjectPool);
            if (subjectPool && (subjectPool.style.display === 'none' || computedStyle.display === 'none')) {
                // 显示一个简短提示
                const hint = document.createElement('div');
                hint.innerHTML = \`
                    <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
                    background: #2196F3; color: white; padding: 15px 25px; border-radius: 8px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; 
                    animation: fadeInOut 3s ease-in-out;">
                        请从上方科目池中拖拽科目到课程表中
                    <\/div>
                    <style>
                    @keyframes fadeInOut {
                        0% { opacity: 0; top: 0; }
                        10% { opacity: 1; top: 20px; }
                        90% { opacity: 1; top: 20px; }
                        100% { opacity: 0; top: 0; }
                    }
                    <\/style>
                \`;
                document.body.appendChild(hint);
                
                // 3秒后自动移除提示
                setTimeout(() => {
                    if (hint.parentNode) {
                        hint.parentNode.removeChild(hint);
                    }
                }, 3000);
            }
        }
    }

    saveTime(e) {
        e.preventDefault();
        
        const timeInput = document.getElementById('timeRange');
        const period = timeInput.dataset.period;
        const newTime = timeInput.value.trim();
        
        if (!newTime) return;
        
        document.querySelector(\`[data-period="\${period}"]\`).textContent = newTime;
        this.saveData();
        this.closeTimeModal();
    }

    addSubjectToCell(subjectId, day, section, period) {
        const key = \`\${day}-\${section}-\${period}\`;
        this.timetable[key] = subjectId;
        this.saveData();
        this.renderTimetable();
    }

    removeSubjectFromCell(cell) {
        if (cell.classList.contains('occupied')) {
            const day = cell.dataset.day;
            const section = cell.dataset.section;
            const period = cell.dataset.period;
            const key = \`\${day}-\${section}-\${period}\`;
            delete this.timetable[key];
            this.saveData();
            this.renderTimetable();
        }
    }

    renderSubjects() {
        const pool = document.getElementById('subjectPool');
        pool.innerHTML = '';
        
        this.subjects.forEach(subject => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.draggable = true;
            card.dataset.subjectId = subject.id;
            
            // 使用新的颜色模式
            const colorMode = subject.colorMode || (subject.colorType === 'text' ? 'textOnly' : 'both');
            const bgColor = subject.bgColor || subject.color || '#3498DB';
            const textColor = subject.textColor || (colorMode === 'both' ? '#FFFFFF' : subject.color || '#000000');
            
            if (colorMode === 'both') {
                card.style.borderLeft = \`4px solid \${bgColor}\`;
            } else {
                card.style.borderLeft = \`4px solid \${textColor}\`;
            }
            
            const teacherHtml = subject.teacher ? \`<div class="teacher-name">\${subject.teacher}<\/div>\` : '';
            const subjectStyle = !subject.teacher ? 'style="line-height: 40px;"' : '';
            
            card.innerHTML = \`
                <div class="subject-info">
                    <div class="subject-name" \${subjectStyle}>\${subject.name}<\/div>
                    \${teacherHtml}
                <\/div>
                <div class="subject-actions">
                    <button class="btn-text edit-btn" title="编辑" data-action="edit">编辑<\/button>
                    <button class="btn-text delete-btn" title="删除" data-action="delete">删除<\/button>
                <\/div>
            \`;
            
            // 编辑按钮事件
            card.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openSubjectModal(subject);
            });
            
            // 删除按钮事件
            card.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteSubjectFromPool(subject.id);
            });
            
            pool.appendChild(card);
        });
    }

    addPeriod(section) {
        const periods = this.periods[section];
        let defaultTime = '15:00-15:40';
        switch(section) {
            case 'morning':
                defaultTime = '09:00-09:40';
                break;
            case 'afternoon':
                defaultTime = '15:00-15:40';
                break;
            case 'evening':
                defaultTime = '19:00-19:40';
                break;
        }
        const newPeriod = {
            name: \`第\${periods.length + 1}节\`,
            time: defaultTime
        };
        periods.push(newPeriod);
        this.saveData();
        this.renderTimetable();
    }

    // 自定义确认对话框
    confirm(message, callback) {
        const modal = document.getElementById('confirmModal');
        const messageEl = modal.querySelector('.confirm-message');
        const okBtn = document.getElementById('confirmOkBtn');
        const cancelBtn = document.getElementById('confirmCancelBtn');
        
        messageEl.textContent = message;
        modal.style.display = 'flex';
        
        // 移除之前的事件监听器
        okBtn.removeEventListener('click', this.confirmOkHandler);
        cancelBtn.removeEventListener('click', this.confirmCancelHandler);
        
        // 创建新的事件监听器
        this.confirmOkHandler = () => {
            modal.style.display = 'none';
            if (callback) callback(true);
        };
        
        this.confirmCancelHandler = () => {
            modal.style.display = 'none';
            if (callback) callback(false);
        };
        
        // 添加事件监听器
        okBtn.addEventListener('click', this.confirmOkHandler);
        cancelBtn.addEventListener('click', this.confirmCancelHandler);
        
        // 点击模态框背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.confirmCancelHandler();
            }
        });
    }
    
    removePeriod(section) {
        if (this.periods[section].length <= 1) {
            this.confirm('至少需要保留一节课！');
            return;
        }
        
        let sectionName = '下午';
        switch(section) {
            case 'morning':
                sectionName = '上午';
                break;
            case 'afternoon':
                sectionName = '下午';
                break;
            case 'evening':
                sectionName = '晚上';
                break;
        }
        
        this.confirm(\`确定要删除\${sectionName}的最后一节课吗？\`, (confirmed) => {
            if (confirmed) {
                this.periods[section].pop();
                
                // 清理对应的课程表数据
                const keysToDelete = [];
                for (let key in this.timetable) {
                    if (key.includes(\`-\${section}-\`)) {
                        const parts = key.split('-');
                        const periodIndex = parseInt(parts[2]);
                        if (periodIndex >= this.periods[section].length) {
                            keysToDelete.push(key);
                        }
                    }
                }
                
                keysToDelete.forEach(key => {
                    delete this.timetable[key];
                });
                
                this.saveData();
                this.renderTimetable();
            }
        });
    }

    renderTimetable() {
        const tbody = document.getElementById('timetableBody');
        tbody.innerHTML = '';
        
        // 渲染上午
        if (this.periods.morning.length > 0) {
            this.periods.morning.forEach((period, index) => {
                const row = this.createPeriodRow('morning', index, period);
                tbody.appendChild(row);
            });
        }
        
        // 渲染下午
        if (this.periods.afternoon.length > 0) {
            this.periods.afternoon.forEach((period, index) => {
                const row = this.createPeriodRow('afternoon', index, period);
                tbody.appendChild(row);
            });
        }

        // 渲染晚上
        if (this.settings.showEvening && this.periods.evening.length > 0) {
            this.periods.evening.forEach((period, index) => {
                const row = this.createPeriodRow('evening', index, period);
                tbody.appendChild(row);
            });
        }
    }

    // 手机端选择科目功能
    showMobileSubjectSelector(day, section, period) {
        const cellKey = \`\${day}-\${section}-\${period}\`;
        
        // 创建弹窗
        const modal = document.createElement('div');
        modal.className = 'mobile-subject-modal';
        modal.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        \`;
        
        const content = document.createElement('div');
        // PC端和移动端响应式宽度
        const isMobile = window.innerWidth <= 768;
        content.style.cssText = \`
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: \${isMobile ? '90%' : '600px'};
            width: \${isMobile ? '90%' : '600px'};
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        \`;
        
        // 头部区域
        const header = document.createElement('div');
        header.style.cssText = \`
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 20px 15px;
            border-bottom: 1px solid #eee;
        \`;
        
        const title = document.createElement('h3');
        title.textContent = '选择科目';
        title.style.cssText = 'margin: 0; font-size: 18px; color: #333; font-weight: 600;';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = \`
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
        \`;
        closeBtn.onmouseover = () => closeBtn.style.background = '#f5f5f5';
        closeBtn.onmouseout = () => closeBtn.style.background = 'none';
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // 搜索框区域
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = 'padding: 15px 20px; border-bottom: 1px solid #eee;';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索科目或老师...';
        searchInput.style.cssText = \`
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
            box-sizing: border-box;
        \`;
        searchInput.onfocus = () => searchInput.style.borderColor = '#007bff';
        searchInput.onblur = () => searchInput.style.borderColor = '#ddd';
        
        searchContainer.appendChild(searchInput);
        
        // 科目列表区域
        const listContainer = document.createElement('div');
        listContainer.style.cssText = 'max-height: 50vh; overflow-y: auto; padding: 15px 20px;';
        
        const list = document.createElement('div');
        // 2个课程一行，响应式网格布局
        list.style.cssText = \`
            display: grid;
            grid-template-columns: \${isMobile ? '1fr' : 'repeat(2, 1fr)'};
            gap: 10px;
        \`;
        
        // 渲染科目列表
        const renderSubjects = (filterText = '') => {
            list.innerHTML = '';
            
            const filteredSubjects = this.subjects.filter(subject => {
                if (!filterText) return true;
                const searchLower = filterText.toLowerCase();
                return subject.name.toLowerCase().includes(searchLower) || 
                       (subject.teacher && subject.teacher.toLowerCase().includes(searchLower));
            });
            
            if (filteredSubjects.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.style.cssText = \`
                    text-align: center;
                    padding: 40px 20px;
                    color: #999;
                    font-size: 14px;
                    grid-column: 1 / -1;
                \`;
                emptyMessage.innerHTML = filterText 
                    ? \`<div style="font-size: 48px; margin-bottom: 10px;">🔍<\/div><div>未找到匹配的科目<\/div>\`
                    : \`<div style="font-size: 48px; margin-bottom: 10px;">📚<\/div>
                       <div>暂无科目，请先添加科目<\/div>
                       <button onclick="document.getElementById('addSubjectBtn').click(); this.closest('.mobile-subject-modal').remove();" 
                               style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                           添加科目
                       <\/button>\`;
                list.appendChild(emptyMessage);
            } else {
                filteredSubjects.forEach(subject => {
                    const item = document.createElement('div');
                    item.style.cssText = \`
                        padding: 12px;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: all 0.2s;
                        background: white;
                    \`;
                    item.onmouseover = () => {
                        item.style.background = '#f8f9fa';
                        item.style.borderColor = '#007bff';
                    };
                    item.onmouseout = () => {
                        item.style.background = 'white';
                        item.style.borderColor = '#eee';
                    };
                    
                    const colorBox = document.createElement('div');
                    // 使用新的颜色模式
                    const colorMode = subject.colorMode || (subject.colorType === 'text' ? 'textOnly' : 'both');
                    const bgColor = subject.bgColor || subject.color || '#3498DB';
                    const textColor = subject.textColor || (colorMode === 'both' ? '#FFFFFF' : subject.color || '#000000');
                    const displayColor = colorMode === 'both' ? bgColor : textColor;
                    
                    colorBox.style.cssText = \`
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: \${displayColor};
                        flex-shrink: 0;
                        \${displayColor === '#FFFFFF' || displayColor === '#ffffff' ? 'border: 1px solid #ddd;' : ''}
                    \`;
                    
                    const textContainer = document.createElement('div');
                    textContainer.style.cssText = 'flex: 1; min-width: 0;';
                    
                    const subjectName = document.createElement('div');
                    subjectName.textContent = subject.name;
                    subjectName.style.cssText = 'font-weight: 600; color: #333; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                    
                    const teacherName = document.createElement('div');
                    teacherName.textContent = subject.teacher || '暂无老师';
                    teacherName.style.cssText = 'font-size: 11px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                    
                    textContainer.appendChild(subjectName);
                    textContainer.appendChild(teacherName);
                    
                    item.appendChild(colorBox);
                    item.appendChild(textContainer);
                    
                    item.addEventListener('click', () => {
                        this.addSubjectToCell(subject.id, day, section, period);
                        this.closeMobileSubjectModal(modal);
                    });
                    
                    list.appendChild(item);
                });
            }
        };
        
        // 初始渲染
        renderSubjects();
        
        // 搜索功能
        searchInput.addEventListener('input', (e) => {
            renderSubjects(e.target.value);
        });
        
        listContainer.appendChild(list);
        
        if (this.subjects.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.style.cssText = \`
                text-align: center;
                padding: 40px 20px;
                color: #999;
                font-size: 14px;
            \`;
            emptyMessage.innerHTML = \`
                <div style="font-size: 48px; margin-bottom: 10px;">📚<\/div>
                <div>暂无科目，请先添加科目<\/div>
                <button onclick="document.getElementById('addSubjectBtn').click(); this.closest('.mobile-subject-modal').remove();" 
                        style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    添加科目
                <\/button>
            \`;
            listContainer.appendChild(emptyMessage);
        }
        
        // 底部按钮区域
        const footer = document.createElement('div');
        footer.style.cssText = \`
            padding: 15px 20px 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        \`;
        
        const addSubjectBtn = document.createElement('button');
        addSubjectBtn.textContent = '添加新科目';
        addSubjectBtn.style.cssText = \`
            flex: 1;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        \`;
        addSubjectBtn.onmouseover = () => addSubjectBtn.style.background = '#0056b3';
        addSubjectBtn.onmouseout = () => addSubjectBtn.style.background = '#007bff';
        addSubjectBtn.addEventListener('click', () => {
            this.closeMobileSubjectModal(modal);
            setTimeout(() => this.openSubjectModal(), 300);
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = \`
            flex: 1;
            padding: 10px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        \`;
        cancelBtn.onmouseover = () => cancelBtn.style.background = '#545b62';
        cancelBtn.onmouseout = () => cancelBtn.style.background = '#6c757d';
        cancelBtn.addEventListener('click', () => {
            this.closeMobileSubjectModal(modal);
        });
        
        footer.appendChild(addSubjectBtn);
        footer.appendChild(cancelBtn);
        
        // 组装弹窗
        content.appendChild(header);
        content.appendChild(searchContainer);
        content.appendChild(listContainer);
        content.appendChild(footer);
        modal.appendChild(content);
        
        // CSS动画已在styles.css中定义，无需动态添加
        
        // 多种关闭方式
        const closeModal = () => this.closeMobileSubjectModal(modal);
        
        // 1. 点击关闭按钮
        closeBtn.addEventListener('click', closeModal);
        
        // 2. 点击背景区域
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // 3. 按ESC键关闭
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // 4. 点击取消按钮
        cancelBtn.addEventListener('click', closeModal);
        
        // 防止滚动穿透，同时避免页面晃动
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (scrollBarWidth > 0) {
            document.body.style.paddingRight = scrollBarWidth + 'px';
        }
        
        // 显示弹窗
        document.body.appendChild(modal);
        
        // 保存引用以便关闭
        this.currentMobileModal = modal;
    }
    
    // 关闭手机端选择科目弹窗
    closeMobileSubjectModal(modal) {
        if (!modal) return;
        
        // 直接关闭弹窗，无动画效果
        if (modal.parentNode) {
            document.body.removeChild(modal);
        }
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        this.currentMobileModal = null;
    }

    createPeriodRow(section, periodIndex, period) {
        const row = document.createElement('tr');
        
        // 时间列 - 只在第一节创建，使用rowSpan合并单元格
        if (periodIndex === 0) {
            const timeCell = document.createElement('td');
            timeCell.className = 'time-cell';
            timeCell.style.cursor = 'pointer';
            timeCell.dataset.section = section;
            
            // 获取自定义名称，如果没有则使用默认名称
            const sectionName = this.sectionNames[section] || '上午';
            const chars = sectionName.split('');
            let timeText = '<div class="vertical-text">';
            chars.forEach(char => {
                timeText += \`<span>\${char}<\/span>\`;
            });
            timeText += '<\/div>';
            
            timeCell.innerHTML = timeText;
            timeCell.rowSpan = this.periods[section].length;
            
            // 添加点击事件编辑时段名称
            timeCell.addEventListener('click', () => {
                this.openSectionNameModal(section);
            });
            
            row.appendChild(timeCell);
        }
        
        // 课时列
        const periodCell = document.createElement('td');
        periodCell.className = 'period-cell';
        const timeDisplayStyle = this.settings.showPeriodTime ? 'display: block;' : 'display: none;';
        periodCell.innerHTML = \`
                        <div class="period-name" data-section="\${section}" data-period="\${periodIndex}" style="cursor: pointer; font-weight: bold; color: var(--text-color);">
                            \${period.name}
                        <\/div>
                        <div class="time-display" data-section="\${section}" data-period="\${periodIndex}" style="cursor: pointer; font-size: 12px; color: var(--text-color); \${timeDisplayStyle}">
                            \${period.time}
                        <\/div>
                    \`;
        
        // 添加课时名称和时间段点击事件
        periodCell.querySelector('.period-name').addEventListener('click', (e) => {
            this.openTimeModal(e, section, periodIndex);
        });
        periodCell.querySelector('.time-display').addEventListener('click', (e) => {
            this.openTimeModal(e, section, periodIndex);
        });
        
        row.appendChild(periodCell);
        
        // 周一到周日的格子
        const days = [1, 2, 3, 4, 5];
        if (this.settings.showSaturday) days.push(6);
        if (this.settings.showSunday) days.push(7);

        for (let day of days) {
            const cell = document.createElement('td');
            cell.className = 'cell';
            if (day >= 6) {
                cell.classList.add('weekend-col');
            }
            cell.dataset.day = day;
            cell.dataset.section = section;
            cell.dataset.period = periodIndex;
            
            const key = \`\${day}-\${section}-\${periodIndex}\`;
            const subjectId = this.timetable[key];
            
            if (subjectId) {
                const subject = this.subjects.find(s => s.id === subjectId);
                if (subject) {
                    cell.classList.add('occupied');
                    const content = document.createElement('div');
                    content.className = 'cell-content';
                    
                    // 根据颜色模式应用颜色
                    const colorMode = subject.colorMode || (subject.colorType === 'text' ? 'textOnly' : 'both');
                    const bgColor = subject.bgColor || subject.color || '#3498DB';
                    const textColor = subject.textColor || (colorMode === 'both' ? '#FFFFFF' : subject.color || '#000000');
                    
                    if (colorMode === 'both') {
                        // 背景+字体模式
                        content.style.backgroundColor = bgColor;
                        content.style.color = textColor;
                    } else {
                        // 仅字体色模式 - 透明背景
                        content.style.backgroundColor = 'transparent';
                        content.style.color = textColor;
                    }
                    
                    const teacherHtml = subject.teacher ? \`<div class="teacher-name">\${subject.teacher}<\/div>\` : '';
                    const subjectStyle = !subject.teacher ? 'style="margin-bottom: 0;"' : '';
                    content.innerHTML = \`
                        <div class="subject-name" \${subjectStyle}>\${subject.name}<\/div>
                        \${teacherHtml}
                        <button class="delete-cell-btn" title="删除课程">×<\/button>
                    \`;
                    cell.appendChild(content);
                    
                    // 添加删除按钮事件
                    content.querySelector('.delete-cell-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.removeSubjectFromCell(cell);
                    });
                }
            } else {
                // 所有设备默认显示+号
                cell.classList.add('empty-cell');
                cell.style.cssText = 'position: relative; cursor: pointer;';
                
                // 使用CSS伪元素显示+号，确保默认显示
                const plusIndicator = document.createElement('div');
                plusIndicator.className = 'plus-indicator';
                plusIndicator.textContent = '+';
                plusIndicator.style.cssText = 'font-size: 24px; color: #ccc; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;';
                cell.appendChild(plusIndicator);
            }
            
            // 添加双击删除课程事件
            cell.addEventListener('dblclick', () => {
                if (cell.classList.contains('occupied')) {
                    this.removeSubjectFromCell(cell);
                }
            });
            
            // 添加点击选择
            cell.addEventListener('click', () => {
                this.editingCell = cell;
                document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
                
                // 所有设备点击选择科目
                if (!cell.classList.contains('occupied')) {
                    this.showMobileSubjectSelector(day, section, periodIndex);
                }
            });
            
            row.appendChild(cell);
        }
        
        return row;
    }

    openTimeModal(e, section, periodIndex) {
        this.editingPeriod = { section, periodIndex };
        const modal = document.getElementById('timeModal');
        const nameInput = document.getElementById('periodName');
        const startHourSelect = document.getElementById('startHour');
        const startMinuteSelect = document.getElementById('startMinute');
        const endHourSelect = document.getElementById('endHour');
        const endMinuteSelect = document.getElementById('endMinute');
        
        const period = this.periods[section][periodIndex];
        nameInput.value = period.name;
        
        // 解析现有时间
        const [startTime, endTime] = period.time.split('-');
        const [startH, startM] = startTime.split(':');
        const [endH, endM] = endTime.split(':');
        
        startHourSelect.value = startH;
        startMinuteSelect.value = startM;
        endHourSelect.value = endH;
        endMinuteSelect.value = endM;
        
        modal.style.display = 'flex';
    }

    savePeriodTime(e) {
        e.preventDefault();
        
        if (!this.editingPeriod) return;
        
        const { section, periodIndex } = this.editingPeriod;
        const nameInput = document.getElementById('periodName');
        const startHourSelect = document.getElementById('startHour');
        const startMinuteSelect = document.getElementById('startMinute');
        const endHourSelect = document.getElementById('endHour');
        const endMinuteSelect = document.getElementById('endMinute');
        
        const newName = nameInput.value.trim();
        const startHour = startHourSelect.value;
        const startMinute = startMinuteSelect.value;
        const endHour = endHourSelect.value;
        const endMinute = endMinuteSelect.value;
        
        if (!newName || !startHour || !startMinute || !endHour || !endMinute) return;
        
        const newTime = \`\${startHour}:\${startMinute}-\${endHour}:\${endMinute}\`;
        this.periods[section][periodIndex].time = newTime;
        this.periods[section][periodIndex].name = newName;
        this.saveData();
        this.renderTimetable();
        this.closeTimeModal();
    }

    resetTimetable() {
        if (confirm('确定要重置整个课程表吗？这将清空课程表内容但保留科目')) {
            // 只重置课程表内容，保留科目池
            this.timetable = {};
            this.periods = {
                morning: [
                { name: '第1节', time: '08:00-08:40' },
                { name: '第2节', time: '08:50-09:30' },
                { name: '第3节', time: '10:00-10:40' },
                { name: '第4节', time: '10:50-11:30' }
            ],
            afternoon: [
                { name: '第1节', time: '14:00-14:40' },
                { name: '第2节', time: '14:50-15:30' },
                { name: '第3节', time: '15:40-16:20' }
            ],
            evening: [
                { name: '第1节', time: '19:00-19:40' },
                { name: '第2节', time: '19:50-20:30' }
            ]
            };
            
            // 重置时段名称
            this.sectionNames = {
                morning: '上午',
                afternoon: '下午',
                evening: '晚上'
            };
            
            // 重置课程表标题
            const defaultTitle = '我的课程表';
            document.getElementById('timetableTitle').value = defaultTitle;
            localStorage.setItem('timetableTitle', defaultTitle);
            
            this.saveData();
            this.renderTimetable();
        }
    }

    toggleExportDropdown(e) {
        e.stopPropagation();
        const dropdown = document.getElementById('exportMenu');
        const isVisible = dropdown.classList.contains('show');
        
        // 关闭所有其他下拉菜单
        this.closeAllDropdowns();
        
        // 切换当前下拉菜单
        if (!isVisible) {
            dropdown.classList.add('show');
            this.positionDropdown(dropdown, e.target);
        }
    }

    closeAllDropdowns() {
        // 调用全局关闭函数
        closeAllMenus();
        
        // 关闭其他下拉菜单
        const dropdowns = document.querySelectorAll('.dropdown-content');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        // 隐藏移动端遮罩层
        this.hideMobileOverlay();
    }
    
    // 处理全局点击事件
    handleGlobalClick(e) {
        const exportMenu = document.getElementById('exportMenu');
        const backupMenu = document.getElementById('backupMenu');
        const exportBtn = document.getElementById('exportBtn');
        const backupBtn = document.getElementById('backupBtn');
        
        // 检查是否点击在下拉菜单或按钮上
        const isClickOnExportMenu = exportMenu && (exportMenu.contains(e.target) || exportBtn.contains(e.target));
        const isClickOnBackupMenu = backupMenu && (backupMenu.contains(e.target) || backupBtn.contains(e.target));
        
        // 如果点击在外部区域，隐藏所有下拉菜单
        if (!isClickOnExportMenu && !isClickOnBackupMenu) {
            this.closeAllDropdowns();
        }
    }
    
    // 智能定位下拉菜单
    positionDropdown(dropdown, button) {
        if (!dropdown || !button) return;
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // 手机端：固定定位，避免被遮挡
            this.positionMobileDropdown(dropdown, button);
        } else {
            // PC端：相对定位
            this.positionDesktopDropdown(dropdown, button);
        }
    }
    
    // PC端下拉菜单定位
    positionDesktopDropdown(dropdown, button) {
        const rect = button.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        
        // 重置样式
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.right = 'auto';
        dropdown.style.bottom = 'auto';
        dropdown.style.transform = 'none';
        dropdown.style.zIndex = '9999';
        
        // 检查是否需要调整位置避免超出屏幕
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (rect.left + dropdownRect.width > viewportWidth) {
            dropdown.style.left = 'auto';
            dropdown.style.right = '0';
        }
        
        if (rect.bottom + dropdownRect.height > viewportHeight) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = '100%';
        }
    }
    
    // 手机端下拉菜单定位
    positionMobileDropdown(dropdown, button) {
        // 手机端使用固定定位，从底部弹出
        dropdown.style.position = 'fixed';
        dropdown.style.top = 'auto';
        dropdown.style.bottom = '20px';
        dropdown.style.left = '20px';
        dropdown.style.right = '20px';
        dropdown.style.width = 'auto';
        dropdown.style.transform = 'translateY(120%)';
        dropdown.style.zIndex = '999999';
        dropdown.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        dropdown.style.maxHeight = '50vh';
        dropdown.style.overflowY = 'auto';
        
        // 创建或显示遮罩层
        this.createMobileOverlay();
    }
    
    // 创建移动端遮罩层
    createMobileOverlay() {
        let overlay = document.querySelector('.dropdown-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'dropdown-overlay';
            document.body.appendChild(overlay);
            
            // 点击遮罩层关闭菜单
            overlay.addEventListener('click', () => {
                this.closeAllDropdowns();
            });
        }
        overlay.classList.add('show');
    }
    
    // 隐藏移动端遮罩层
    hideMobileOverlay() {
        const overlay = document.querySelector('.dropdown-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }


    // 处理窗口大小改变
    handleWindowResize() {
        // 检查是否有打开的下拉菜单，重新定位
        const exportMenu = document.getElementById('exportMenu');
        const backupMenu = document.getElementById('backupMenu');
        const exportBtn = document.getElementById('exportBtn');
        const backupBtn = document.getElementById('backupBtn');
        
        if (exportMenu && exportMenu.classList.contains('show') && exportBtn) {
            this.positionDropdown(exportMenu, exportBtn);
        }
        
        if (backupMenu && backupMenu.classList.contains('show') && backupBtn) {
            this.positionDropdown(backupMenu, backupBtn);
        }
        
        // 如果窗口变大，关闭手机端侧边栏
        if (window.innerWidth > 768) {
            this.closeMobileSidebar();
        }
    }
    
    // 手机端侧边栏相关方法
    toggleMobileSidebar() {
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        
        if (sidebar.classList.contains('show')) {
            this.closeMobileSidebar();
        } else {
            this.openMobileSidebar();
        }
    }
    
    openMobileSidebar() {
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        
        sidebar.classList.add('show');
        overlay.classList.add('show');
        hamburgerBtn.classList.add('active');
        
        // 防止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileSidebar() {
        const sidebar = document.getElementById('mobileSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
        hamburgerBtn.classList.remove('active');
        
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
    
    // 处理侧边栏菜单按钮点击
    handleSidebarAction(action) {
        // 关闭侧边栏
        this.closeMobileSidebar();
        
        // 根据action执行相应功能
        switch (action) {
            case 'tutorial':
                this.openTutorialModal();
                break;
            case 'reset':
                this.resetTimetable();
                break;
            case 'saveImage':
                this.saveAsImage();
                break;
            case 'exportWord':
                this.exportToWord();
                break;
            case 'exportExcel':
                this.exportToExcel();
                break;
            case 'exportData':
                this.exportData();
                break;
            case 'importData':
                this.importData();
                break;
            case 'settings':
                this.openSettingsModal();
                break;
            default:
                console.warn('未知的侧边栏操作:', action);
        }
    }
    
    // 更新侧边栏主题按钮状态
    updateSidebarThemeButtons(theme) {
        document.querySelectorAll('.sidebar-theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }
    
    // 更新侧边栏字体按钮状态
    updateSidebarFontButtons(font) {
        document.querySelectorAll('.sidebar-font-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.font === font);
        });
    }

    saveAsImage() {
        let cleanContainer = null;
        try {
            const isMobile = window.innerWidth <= 768;
            
            // 获取主题色
            const getThemeColor = (variableName, defaultValue) => {
                const computedValue = getComputedStyle(document.body).getPropertyValue(variableName).trim();
                return computedValue || defaultValue;
            };
            
            const primaryColor = getThemeColor('--primary-color', '#4a7c59');
            const primaryRgb = this.hexToRgb(primaryColor);
            const lightPrimary = primaryRgb ? \`rgba(\${primaryRgb.r}, \${primaryRgb.g}, \${primaryRgb.b}, 0.1)\` : '#f0f8f0';
            const mediumPrimary = primaryRgb ? \`rgba(\${primaryRgb.r}, \${primaryRgb.g}, \${primaryRgb.b}, 0.15)\` : '#e8f5e9';
            
            // 获取当前字体设置
            const currentFont = getComputedStyle(document.body).fontFamily || '"Microsoft YaHei", "PingFang SC", Arial, sans-serif';
            
            // 获取标题
            const titleInput = document.getElementById('tableTitle');
            const titleText = titleInput.value || '课程表';
            
            // 创建干净导出容器
            cleanContainer = document.createElement('div');
            cleanContainer.style.cssText = \`
                position: absolute; 
                top: -9999px; 
                left: -9999px; 
                width: 900px; 
                padding: 40px 50px; 
                background: #ffffff;
                font-family: \${currentFont};
            \`;

            // 创建标题区域
            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = \`
                text-align: center; 
                margin-bottom: 30px; 
                padding-bottom: 20px;
                border-bottom: 3px solid \${primaryColor};
            \`;
            
            const mainTitle = document.createElement('h1');
            mainTitle.textContent = titleText;
            mainTitle.style.cssText = \`
                margin: 0 0 8px 0; 
                font-size: 32px; 
                font-weight: bold; 
                color: \${primaryColor}; 
                letter-spacing: 4px;
                font-family: \${currentFont};
            \`;
            headerDiv.appendChild(mainTitle);
            
            // 添加日期
            const dateDiv = document.createElement('div');
            const now = new Date();
            const dateStr = \`\${now.getFullYear()}年\${now.getMonth() + 1}月\${now.getDate()}日\`;
            dateDiv.textContent = dateStr;
            dateDiv.style.cssText = \`font-size: 14px; color: #888; margin-top: 5px; font-family: \${currentFont};\`;
            headerDiv.appendChild(dateDiv);
            
            cleanContainer.appendChild(headerDiv);

            // 创建表格容器
            const tableWrapper = document.createElement('div');
            tableWrapper.style.cssText = \`
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #e0e0e0;
            \`;
            
            // 克隆课程表
            const originalContainer = document.querySelector('.timetable-container');
            const containerClone = originalContainer.cloneNode(true);

            // 移除不需要的元素
            const removeSelectors = '.section-controls, .edit-btn, .delete-btn, .timetable-title-section, .table-title-input, .delete-cell-btn, .plus-indicator';
            containerClone.querySelectorAll(removeSelectors).forEach(el => el.remove());

            // 设置表格样式
            const table = containerClone.querySelector('.timetable');
            if (table) {
                table.style.cssText = \`
                    border-collapse: collapse;
                    width: 100%;
                    table-layout: fixed;
                    font-size: 14px;
                    background: #ffffff;
                    font-family: \${currentFont};
                \`;
            }
            
            // 处理表头（星期行）
            const headerCells = containerClone.querySelectorAll('th');
            headerCells.forEach(cell => {
                cell.style.cssText = \`
                    background: \${primaryColor};
                    color: #ffffff;
                    padding: 14px 8px;
                    font-weight: 600;
                    font-size: 15px;
                    border: none;
                    text-align: center;
                    font-family: \${currentFont};
                \`;
            });
            
            // 处理所有单元格
            const allCells = containerClone.querySelectorAll('td');
            allCells.forEach((cell, index) => {
                const isTimeCell = cell.classList.contains('time-cell') || cell.classList.contains('period-cell');
                const isSection = cell.textContent.includes('上午') || cell.textContent.includes('下午') || cell.textContent.includes('晚上');
                const isOccupied = cell.classList.contains('occupied');
                
                let bgColor = '#ffffff';
                let fontWeight = 'normal';
                let textColor = '#333333';
                
                if (isSection) {
                    bgColor = mediumPrimary;
                    fontWeight = '600';
                    textColor = primaryColor;
                } else if (isTimeCell) {
                    bgColor = lightPrimary;
                    fontWeight = '500';
                }
                
                cell.style.cssText = \`
                    padding: 12px 8px;
                    text-align: center;
                    vertical-align: middle;
                    border: 1px solid #e8e8e8;
                    font-size: 13px;
                    color: \${textColor};
                    background: \${bgColor};
                    font-weight: \${fontWeight};
                    font-family: \${currentFont};
                \`;
                
                // 处理已占用单元格 - 保留科目颜色
                if (isOccupied) {
                    const cellContent = cell.querySelector('.cell-content');
                    if (cellContent) {
                        const subjectBg = cellContent.style.backgroundColor;
                        const subjectColor = cellContent.style.color || '#333333';
                        
                        // 获取科目名称和老师名称元素
                        const subjectName = cell.querySelector('.subject-name');
                        const teacherName = cell.querySelector('.teacher-name');
                        
                        // 设置 cell-content 的基础样式
                        cellContent.style.cssText = \`
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            padding: 8px;
                            box-sizing: border-box;
                            background-color: \${subjectBg || 'transparent'};
                            color: \${subjectColor};
                            border-radius: 6px;
                            font-family: \${currentFont};
                        \`;
                        
                        if (subjectBg && subjectBg !== 'transparent' && subjectBg !== 'rgba(0, 0, 0, 0)') {
                            // 背景+字体模式
                            cell.style.backgroundColor = 'transparent';
                            cell.style.padding = '4px';
                            cellContent.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            
                            // 设置文字颜色和字体
                            if (subjectName) {
                                subjectName.style.cssText = \`color: \${subjectColor}; font-weight: 600; font-size: 14px; display: block; margin-bottom: 3px; text-align: center; font-family: \${currentFont};\`;
                            }
                            if (teacherName) {
                                teacherName.style.cssText = \`color: \${subjectColor}; opacity: 0.9; font-size: 12px; display: block; text-align: center; font-family: \${currentFont};\`;
                            }
                        } else {
                            // 仅字体色模式 - 透明背景
                            cellContent.style.backgroundColor = 'transparent';
                            cell.style.backgroundColor = '#ffffff';
                            cell.style.border = '1px solid #e8e8e8';
                            
                            // 设置文字颜色和字体
                            if (subjectName) {
                                subjectName.style.cssText = \`color: \${subjectColor}; font-weight: 600; font-size: 14px; display: block; margin-bottom: 3px; text-align: center; font-family: \${currentFont};\`;
                            }
                            if (teacherName) {
                                teacherName.style.cssText = \`color: \${subjectColor}; opacity: 0.9; font-size: 12px; display: block; text-align: center; font-family: \${currentFont};\`;
                            }
                        }
                    }
                }
            });
            
            // 根据设置隐藏周六和周日列
            const rows = containerClone.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td, th');
                let cellIndex = 0;
                cells.forEach(cell => {
                    if (cellIndex >= 2) {
                        const dayIndex = cellIndex - 2;
                        if ((dayIndex === 5 && !this.settings.showSaturday) || 
                            (dayIndex === 6 && !this.settings.showSunday)) {
                            cell.style.display = 'none';
                        }
                    }
                    cellIndex++;
                });
            });
            
            tableWrapper.appendChild(containerClone);
            cleanContainer.appendChild(tableWrapper);
            
            document.body.appendChild(cleanContainer);
            
            // 生成图片
            html2canvas(cleanContainer, {
                backgroundColor: '#ffffff',
                scale: isMobile ? 3 : 2,
                useCORS: true,
                allowTaint: true,
                width: 900,
                height: cleanContainer.scrollHeight,
                windowWidth: 900,
                logging: false
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = \`\${titleText}.png\`;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
                document.body.removeChild(cleanContainer);
            }).catch(error => {
                console.error('生成图片失败:', error);
                alert('生成图片失败，请重试');
                if (cleanContainer && document.body.contains(cleanContainer)) {
                    document.body.removeChild(cleanContainer);
                }
            });
        } catch (error) {
            console.error('保存图片出错:', error);
            alert('保存图片出错，请重试');
            if (cleanContainer && document.body.contains(cleanContainer)) {
                document.body.removeChild(cleanContainer);
            }
        }
    }
    
    // 辅助函数：十六进制转RGB
    hexToRgb(hex) {
        if (!hex) return null;
        const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }



    saveData() {
        const data = {
            subjects: this.subjects,
            timetable: this.timetable,
            periods: this.periods,
            sectionNames: this.sectionNames
        };
        localStorage.setItem('timetableData', JSON.stringify(data));
    }

    loadData() {
        const data = localStorage.getItem('timetableData');
            
        if (data) {
            const parsed = JSON.parse(data);
                
            // 恢复科目数据
            if (parsed.subjects && Array.isArray(parsed.subjects) && parsed.subjects.length > 0) {
                this.subjects = parsed.subjects;
            } else {
                this.subjects = [];
            }
                
            // 恢复课程表数据
            this.timetable = parsed.timetable || {};
                
            // 恢复课时数据
            this.periods = parsed.periods || {
                morning: [
                    { name: '第1节', time: '08:00-08:40' },
                    { name: '第2节', time: '08:50-09:30' },
                    { name: '第3节', time: '10:00-10:40' },
                    { name: '第4节', time: '10:50-11:30' }
                ],
                afternoon: [
                    { name: '第1节', time: '14:00-14:40' },
                    { name: '第2节', time: '14:50-15:30' },
                    { name: '第3节', time: '15:40-16:20' }
                ],
                evening: [
                    { name: '第1节', time: '19:00-19:40' },
                    { name: '第2节', time: '19:50-20:30' }
                ]
            };
                
            // 加载时段名称
            this.sectionNames = parsed.sectionNames || {
                morning: '上午',
                afternoon: '下午',
                evening: '晚上'
            };
                
            // 确保 evening 存在
            if (!this.periods.evening) {
                this.periods.evening = [
                    { name: '第1节', time: '19:00-19:40' },
                    { name: '第2节', time: '19:50-20:30' }
                ];
            }
        } else {
            // 如果没有数据，初始化所有时段
            this.subjects = [];
            this.timetable = {};
            this.periods = {
                morning: [
                    { name: '第1节', time: '08:00-08:40' },
                    { name: '第2节', time: '08:50-09:30' },
                    { name: '第3节', time: '10:00-10:40' },
                    { name: '第4节', time: '10:50-11:30' }
                ],
                afternoon: [
                    { name: '第1节', time: '14:00-14:40' },
                    { name: '第2节', time: '14:50-15:30' },
                    { name: '第3节', time: '15:40-16:20' }
                ],
                evening: [
                    { name: '第1节', time: '19:00-19:40' },
                    { name: '第2节', time: '19:50-20:30' }
                ]
            };
            this.sectionNames = {
                morning: '上午',
                afternoon: '下午',
                evening: '晚上'
            };
        }
    }

    loadTimetableTitle() {
        const savedTitle = localStorage.getItem('timetableTitle');
        const titleInput = document.getElementById('timetableTitle');
        if (savedTitle) {
            titleInput.value = savedTitle;
        }
    }

    saveTimetableTitle(title) {
        localStorage.setItem('timetableTitle', title);
    }

    saveTableTitle(title) {
        localStorage.setItem('tableTitle', title);
    }

    loadTableTitle() {
        const savedTitle = localStorage.getItem('tableTitle');
        const titleInput = document.getElementById('tableTitle');
        if (savedTitle) {
            titleInput.value = savedTitle;
        }
    }

    initTimeSelectors() {
        // 生成小时选项 (0-23) - 24小时制
        const startHourSelect = document.getElementById('startHour');
        const endHourSelect = document.getElementById('endHour');
        
        for (let i = 0; i <= 23; i++) {
            const hour = i.toString().padStart(2, '0');
            startHourSelect.appendChild(new Option(hour, hour));
            endHourSelect.appendChild(new Option(hour, hour));
        }
        
        // 生成分钟选项 (00-55，间隔5分钟)
        const startMinuteSelect = document.getElementById('startMinute');
        const endMinuteSelect = document.getElementById('endMinute');
        
        for (let i = 0; i < 60; i += 5) {
            const minute = i.toString().padStart(2, '0');
            startMinuteSelect.appendChild(new Option(minute, minute));
            endMinuteSelect.appendChild(new Option(minute, minute));
        }
    }

    // Word导出功能 - 移动端PC端统一效果
    exportToWord() {
        const title = document.getElementById('tableTitle').value || '课程表';
        
        // 检测是否为移动端
        const isMobile = window.innerWidth <= 768;
        
        // 创建兼容Word的HTML格式（移动端PC端统一）
        let wordContent = \`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <title>\${title}<\/title>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print<\/w:View>
                    <w:Zoom>100<\/w:Zoom>
                    <w:DoNotOptimizeForBrowser/>
                <\/w:WordDocument>
            <\/xml>
            <![endif]-->
            <style>
                @page { 
                    margin: 1.2cm 1cm;
                    size: A4 portrait;
                }
                body { 
                    font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; 
                    margin: 0;
                    padding: 10px;
                    background: white;
                }
                .main-title { 
                    text-align: center; 
                    color: #000; 
                    margin-bottom: 15px; 
                    font-size: 22px; 
                    font-weight: bold;
                    letter-spacing: 1px;
                }
                table { 
                    border-collapse: collapse; 
                    width: 100%; 
                    margin: 0 auto; 
                    table-layout: fixed;
                    border: 2px solid #000;
                }
                th, td { 
                    border: 1px solid #000;
                    padding: 8px 6px;
                    text-align: center;
                    font-size: 13px;
                    vertical-align: middle;
                    height: auto;
                    line-height: 1.4;
                    word-wrap: break-word;
                    word-break: break-all;
                    overflow-wrap: break-word;
                    color: #000;
                }
                td {
                    width: 110px;
                    min-width: 110px;
                    max-width: 110px;
                }
                th {
                    width: 110px;
                }
                th { 
                    background-color: #fff;
                    color: #000;
                    font-weight: bold;
                    font-size: 14px;
                }
                .time-header { 
                    background-color: #fff;
                    color: #000;
                    font-weight: bold;
                    width: 50px;
                    min-width: 50px;
                    max-width: 50px;
                    font-size: 13px;
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    padding: 10px 0;
                }
                .period-header { 
                    background-color: #fff;
                    color: #000;
                    font-weight: bold;
                    width: 90px;
                    min-width: 90px;
                    max-width: 90px;
                    font-size: 13px;
                }
                .subject { 
                    font-weight: bold;
                    color: #000;
                    font-size: 14px;
                    margin-bottom: 2px;
                }
                .teacher { 
                    font-size: 12px;
                    color: #000;
                    margin-top: 2px;
                    display: block;
                }
                .period-time { 
                    font-size: 11px;
                    color: #666;
                    display: block;
                    margin-top: 2px;
                }
                td {
                    background-color: #fff;
                }
            <\/style>
        <\/head>
        <body>
            <div class="main-title">\${title}<\/div>
            <table>
                <thead>
                    <tr>
                        <th class="time-header">时段<\/th>
                        <th class="period-header">课时<\/th>
                        \${(() => {
                            let headers = ['周一', '周二', '周三', '周四', '周五'];
                            if (this.settings.showSaturday) headers.push('周六');
                            if (this.settings.showSunday) headers.push('周日');
                            return headers.map(day => \`<th>\${day}<\/th>\`).join('');
                        })()}
                    <\/tr>
                <\/thead>
                <tbody>\`;

        // 构建表格内容
        
        // 添加上午部分
        if (this.periods.morning && this.periods.morning.length > 0) {
            this.periods.morning.forEach((period, periodIndex) => {
                wordContent += \`<tr>\`;
                
                // 时间列（只在第一节显示，竭排显示）
                if (periodIndex === 0) {
                    const sectionText = this.sectionNames.morning.split('').join('<br>');
                    wordContent += \`<td class="time-header" rowspan="\${this.periods.morning.length}">\${sectionText}<\/td>\`;
                }
                
                // 节数和时间（时间段换行显示）
                let periodTimeHtml = period.name;
                if (this.settings.showPeriodTime && period.time) {
                    // 将时间段从中间的-分割，换行显示
                    const timeFormatted = period.time.replace('-', '-<br>');
                    periodTimeHtml += \`<br><span class="period-time">\${timeFormatted}<\/span>\`;
                }
                wordContent += \`<td class="period-header">\${periodTimeHtml}<\/td>\`;
                
                // 每天的课程（根据设置动态显示）
                const dayCount = 5 + (this.settings.showSaturday ? 1 : 0) + (this.settings.showSunday ? 1 : 0);
                for (let day = 1; day <= dayCount; day++) {
                    const key = \`\${day}-morning-\${periodIndex}\`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            wordContent += \`<td>
                                <div class="subject">\${subject.name}<\/div>
                                \${subject.teacher ? \`<div class="teacher">\${subject.teacher}<\/div>\` : ''}
                            <\/td>\`;
                        } else {
                            wordContent += \`<td><\/td>\`;
                        }
                    } else {
                        wordContent += \`<td><\/td>\`;
                    }
                }
                
                wordContent += \`<\/tr>\`;
            });
        }
        
        // 添加下午部分
        if (this.periods.afternoon && this.periods.afternoon.length > 0) {
            this.periods.afternoon.forEach((period, periodIndex) => {
                wordContent += \`<tr>\`;
                
                // 时间列（只在第一节显示，竭排显示）
                if (periodIndex === 0) {
                    const sectionText = this.sectionNames.afternoon.split('').join('<br>');
                    wordContent += \`<td class="time-header" rowspan="\${this.periods.afternoon.length}">\${sectionText}<\/td>\`;
                }
                
                // 节数和时间（时间段换行显示）
                let periodTimeHtml = period.name;
                if (this.settings.showPeriodTime && period.time) {
                    const timeFormatted = period.time.replace('-', '-<br>');
                    periodTimeHtml += \`<br><span class="period-time">\${timeFormatted}<\/span>\`;
                }
                wordContent += \`<td class="period-header">\${periodTimeHtml}<\/td>\`;
                
                // 每天的课程（根据设置动态显示）
                const dayCount = 5 + (this.settings.showSaturday ? 1 : 0) + (this.settings.showSunday ? 1 : 0);
                for (let day = 1; day <= dayCount; day++) {
                    const key = \`\${day}-afternoon-\${periodIndex}\`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            wordContent += \`<td>
                                <div class="subject">\${subject.name}<\/div>
                                \${subject.teacher ? \`<div class="teacher">\${subject.teacher}<\/div>\` : ''}
                            <\/td>\`;
                        } else {
                            wordContent += \`<td><\/td>\`;
                        }
                    } else {
                        wordContent += \`<td><\/td>\`;
                    }
                }
                
                wordContent += \`<\/tr>\`;
            });
        }

        
        // 添加晚上部分（如果显示）
        if (this.settings.showEvening && this.periods.evening && this.periods.evening.length > 0) {
            this.periods.evening.forEach((period, periodIndex) => {
                wordContent += \`<tr>\`;
                
                // 时间列（只在第一节显示，竭排显示）
                if (periodIndex === 0) {
                    const sectionText = this.sectionNames.evening.split('').join('<br>');
                    wordContent += \`<td class="time-header" rowspan="\${this.periods.evening.length}">\${sectionText}<\/td>\`;
                }
                
                // 节数和时间（时间段换行显示）
                let periodTimeHtml = period.name;
                if (this.settings.showPeriodTime && period.time) {
                    const timeFormatted = period.time.replace('-', '-<br>');
                    periodTimeHtml += \`<br><span class="period-time">\${timeFormatted}<\/span>\`;
                }
                wordContent += \`<td class="period-header">\${periodTimeHtml}<\/td>\`;
                
                // 每天的课程（根据设置动态显示）
                const dayCount = 5 + (this.settings.showSaturday ? 1 : 0) + (this.settings.showSunday ? 1 : 0);
                for (let day = 1; day <= dayCount; day++) {
                    const key = \`\${day}-evening-\${periodIndex}\`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            wordContent += \`<td>
                                <div class="subject">\${subject.name}<\/div>
                                \${subject.teacher ? \`<div class="teacher">\${subject.teacher}<\/div>\` : ''}
                            <\/td>\`;
                        } else {
                            wordContent += \`<td><\/td>\`;
                        }
                    } else {
                        wordContent += \`<td><\/td>\`;
                    }
                }
                
                wordContent += \`<\/tr>\`;
            });
        }

        wordContent += \`<\/tbody><\/table><\/body><\/html>\`;

        // 创建Blob并下载（使用正确的HTML格式）
        const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = \`\${title}.doc\`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Excel导出功能 - 重写版本，确保数据完整
    exportToExcel() {
        try {
            const title = document.getElementById('tableTitle').value || '课程表';
            
            // 生成完整的Excel HTML内容
            let excelHTML = this.generateExcelHTML(title);
            
            // 创建Excel文件
            const blob = new Blob([excelHTML], { 
                type: 'application/vnd.ms-excel;charset=utf-8' 
            });
            
            const link = document.createElement('a');
            link.download = \`\${title}.xls\`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
        } catch (error) {
            console.error('导出Excel出错:', error);
            alert('导出Excel出错：' + error.message);
        }
    }
    
    // 生成Excel HTML内容
    generateExcelHTML(title) {
        // Excel文件头部（移除XML声明，避免冲突）
        let html = \`<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!--[if gte mso 9]>
    <xml>
        <x:ExcelWorkbook>
            <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                    <x:Name>课程表<\/x:Name>
                    <x:WorksheetOptions>
                        <x:Print>
                            <x:ValidPrinterInfo/>
                            <x:PaperSizeIndex>9<\/x:PaperSizeIndex>
                        <\/x:Print>
                        <x:Selected/>
                        <x:ProtectContents>False<\/x:ProtectContents>
                    <\/x:WorksheetOptions>
                <\/x:ExcelWorksheet>
            <\/x:ExcelWorksheets>
        <\/x:ExcelWorkbook>
    <\/xml>
    <![endif]-->
    <style>
        body { 
            font-family: 'Microsoft YaHei', 'SimSun', Arial, sans-serif; 
            margin: 0;
            padding: 0;
        }
        .main-title { 
            text-align: center; 
            color: #333; 
            margin: 15px 0;
            font-size: 18px; 
            font-weight: bold;
        }
        table { 
            border-collapse: collapse; 
            width: auto;
            margin: 0 auto; 
            table-layout: fixed; 
            border: 1px solid #666;
            border-spacing: 0;
        }
        th, td { 
            border: 1px solid #999;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
            mso-number-format:'\\@';
            white-space: normal;
            word-wrap: break-word;
            color: #333;
            mso-protection: unlocked visible;
        }
        th {
            background: #f5f5f5;
            color: #333;
            font-weight: bold;
            font-size: 13px;
            height: 40px;
            width: 100px;
            border: 1px solid #999;
        }
        tr {
            height: 60px;
        }
        .time-header {
            width: 50px;
            background: #f5f5f5;
            color: #333;
            font-weight: bold;
            border: 1px solid #999;
        }
        .period-header {
            width: 85px;
            background: #f5f5f5;
            color: #333;
            font-weight: bold;
            border: 1px solid #999;
        }
        .time-section { 
            background: #f5f5f5;
            color: #333;
            font-weight: bold;
            font-size: 13px;
            width: 50px;
            border: 1px solid #999;
        }
        td {
            width: 100px;
            font-size: 12px;
            background: #fff;
            border: 1px solid #999;
        }
        .subject { 
            font-weight: bold;
            color: #000;
            font-size: 14px;
            display: block;
        }
        .teacher { 
            font-size: 11px;
            color: #000;
            display: block;
            margin-top: 3px;
        }
        .period-time { 
            font-size: 10px;
            color: #666;
            display: block;
        }
    <\/style>
<\/head>
<body>
    <div class="main-title">\${title}<\/div>
    <table>
        <thead>
            <tr style="height: 40px;">
                <th class="time-header">时段<\/th>
                <th class="period-header">课时<\/th>\`;
        
        // 添加星期表头
        const weekDays = ['周一', '周二', '周三', '周四', '周五'];
        if (this.settings.showSaturday) weekDays.push('周六');
        if (this.settings.showSunday) weekDays.push('周日');
        weekDays.forEach(day => {
            html += \`<th>\${day}<\/th>\`;
        });
        
        html += \`<\/tr>
        <\/thead>
        <tbody>\`;
        
        // 添加上午课程
        if (this.periods.morning && this.periods.morning.length > 0) {
            this.periods.morning.forEach((period, index) => {
                html += '<tr>';
                
                // 时段列（仅第一行，合并整个时段）
                if (index === 0) {
                    html += \`<td rowspan="\${this.periods.morning.length}" class="time-section">\${this.sectionNames.morning}<\/td>\`;
                }
                
                // 课时列
                html += \`<td class="period-header">\${period.name}\`;
                if (this.settings.showPeriodTime && period.time) {
                    html += \`<br><span class="period-time">\${period.time}<\/span>\`;
                }
                html += \`<\/td>\`;
                
                // 课程内容
                const dayCount = weekDays.length;
                for (let day = 1; day <= dayCount; day++) {
                    const key = \`\${day}-morning-\${index}\`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            const colorType = subject.colorType || 'background';
                            let cellStyle = '';
                            let subjectStyle = '';
                            let teacherStyle = '';
                            
                            if (colorType === 'background') {
                                // 背景色模式
                                cellStyle = \`style="background-color: \${subject.color}; color: white; border: 1px solid #000 !important;"\`;
                            } else {
                                // 字体色模式
                                subjectStyle = \`style="color: \${subject.color};"\`;
                                teacherStyle = \`style="color: \${subject.color};"\`;
                            }
                            
                            html += \`<td \${cellStyle}><span class="subject" \${subjectStyle}>\${subject.name}<\/span>\`;
                            if (subject.teacher) {
                                html += \`<br><span class="teacher" \${teacherStyle}>\${subject.teacher}<\/span>\`;
                            }
                            html += \`<\/td>\`;
                        } else {
                            html += '<td><\/td>';
                        }
                    } else {
                        html += '<td><\/td>';
                    }
                }
                
                html += '<\/tr>';
            });
        }
        
        // 添加下午课程
        if (this.periods.afternoon && this.periods.afternoon.length > 0) {
            this.periods.afternoon.forEach((period, index) => {
                html += '<tr>';
                
                // 时段列（仅第一行，合并整个时段）
                if (index === 0) {
                    html += \`<td rowspan="\${this.periods.afternoon.length}" class="time-section">\${this.sectionNames.afternoon}<\/td>\`;
                }
                
                // 课时列
                html += \`<td class="period-header">\${period.name}\`;
                if (this.settings.showPeriodTime && period.time) {
                    html += \`<br><span class="period-time">\${period.time}<\/span>\`;
                }
                html += \`<\/td>\`;
                
                // 课程内容
                const dayCount = weekDays.length;
                for (let day = 1; day <= dayCount; day++) {
                    const key = \`\${day}-afternoon-\${index}\`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            const colorType = subject.colorType || 'background';
                            let cellStyle = '';
                            let subjectStyle = '';
                            let teacherStyle = '';
                            
                            if (colorType === 'background') {
                                // 背景色模式
                                cellStyle = \`style="background-color: \${subject.color}; color: white; border: 1px solid #000 !important;"\`;
                            } else {
                                // 字体色模式
                                subjectStyle = \`style="color: \${subject.color};"\`;
                                teacherStyle = \`style="color: \${subject.color};"\`;
                            }
                            
                            html += \`<td \${cellStyle}><span class="subject" \${subjectStyle}>\${subject.name}<\/span>\`;
                            if (subject.teacher) {
                                html += \`<br><span class="teacher" \${teacherStyle}>\${subject.teacher}<\/span>\`;
                            }
                            html += \`<\/td>\`;
                        } else {
                            html += '<td><\/td>';
                        }
                    } else {
                        html += '<td><\/td>';
                    }
                }
                
                html += '<\/tr>';
            });
        }
        
        // 添加晚上课程
        if (this.settings.showEvening && this.periods.evening && this.periods.evening.length > 0) {
            this.periods.evening.forEach((period, index) => {
                html += '<tr>';
                
                // 时段列（仅第一行，合并整个时段）
                if (index === 0) {
                    html += \`<td rowspan="\${this.periods.evening.length}" class="time-section">\${this.sectionNames.evening}<\/td>\`;
                }
                
                // 课时列
                html += \`<td class="period-header">\${period.name}\`;
                if (this.settings.showPeriodTime && period.time) {
                    html += \`<br><span class="period-time">\${period.time}<\/span>\`;
                }
                html += \`<\/td>\`;
                
                // 课程内容
                const dayCount = weekDays.length;
                for (let day = 1; day <= dayCount; day++) {
                    const key = \`\${day}-evening-\${index}\`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            const colorType = subject.colorType || 'background';
                            let cellStyle = '';
                            let subjectStyle = '';
                            let teacherStyle = '';
                            
                            if (colorType === 'background') {
                                // 背景色模式
                                cellStyle = \`style="background-color: \${subject.color}; color: white; border: 1px solid #000 !important;"\`;
                            } else {
                                // 字体色模式
                                subjectStyle = \`style="color: \${subject.color};"\`;
                                teacherStyle = \`style="color: \${subject.color};"\`;
                            }
                            
                            html += \`<td \${cellStyle}><span class="subject" \${subjectStyle}>\${subject.name}<\/span>\`;
                            if (subject.teacher) {
                                html += \`<br><span class="teacher" \${teacherStyle}>\${subject.teacher}<\/span>\`;
                            }
                            html += \`<\/td>\`;
                        } else {
                            html += '<td><\/td>';
                        }
                    } else {
                        html += '<td><\/td>';
                    }
                }
                
                html += '<\/tr>';
            });
        }
        
        html += \`<\/tbody>
    <\/table>
<\/body>
<\/html>\`;
        
        return html;
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TimetableApp();
    
    // 初始化主题切换
    initThemeSwitcher();
    initCustomColor();
    initFontSwitcher();
});

// 全局关闭所有下拉菜单函数
function closeAllMenus() {
    const exportMenu = document.getElementById('exportMenu');
    const backupMenu = document.getElementById('backupMenu');
    const themeMenu = document.getElementById('themeMenu');
    const fontMenu = document.getElementById('fontMenu');
    
    if (exportMenu) exportMenu.classList.remove('show');
    if (backupMenu) backupMenu.classList.remove('show');
    if (themeMenu) themeMenu.classList.remove('show');
    if (fontMenu) fontMenu.classList.remove('show');
}

// 重写初始化顺序，确保主题正确应用
function initThemeSwitcher() {
    const themeBtn = document.getElementById('themeBtn');
    const themeMenu = document.getElementById('themeMenu');
    const themeItems = document.querySelectorAll('.theme-item');
    
    // 从本地存储加载主题
    const savedTheme = localStorage.getItem('timetable-theme') || 'default';
    
    // 初始化主题
    if (savedTheme === 'custom') {
        const savedCustomColor = localStorage.getItem('timetable-custom-color');
        if (savedCustomColor) {
            applyCustomColor(savedCustomColor);
        }
    } else {
        setTheme(savedTheme);
    }
    
    // 切换主题菜单显示/隐藏
    themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = themeMenu.classList.contains('show');
        closeAllMenus();
        if (!isVisible) {
            themeMenu.classList.add('show');
        }
    });
    
    // 点击菜单项切换主题
    themeItems.forEach(item => {
        item.addEventListener('click', () => {
            const theme = item.dataset.theme;
            setTheme(theme);
            themeMenu.classList.remove('show');
        });
    });
    
    // 点击页面其他地方关闭主题菜单
    document.addEventListener('click', () => {
        themeMenu.classList.remove('show');
    });
    
    // 阻止菜单内部点击事件冒泡
    themeMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function setTheme(theme) {
    // 移除所有主题类
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-pink', 'theme-orange', 'theme-dark');
    
    // 清除自定义颜色样式
    document.documentElement.removeAttribute('style');
    
    // 应用预设主题
    if (theme !== 'default') {
        document.body.classList.add(\`theme-\${theme}\`);
    }
    
    // 保存到本地存储
    localStorage.setItem('timetable-theme', theme);
    
    // 更新菜单项状态
    document.querySelectorAll('.theme-item').forEach(item => {
        item.classList.toggle('active', item.dataset.theme === theme);
    });
}

// 自定义颜色功能
function initCustomColor() {
    const colorPicker = document.getElementById('customColorPicker');
    const applyBtn = document.getElementById('applyCustomColor');
    
    // 从本地存储加载自定义颜色
    const savedCustomColor = localStorage.getItem('timetable-custom-color');
    if (savedCustomColor) {
        colorPicker.value = savedCustomColor;
    }
    
    // 应用自定义颜色的核心函数
    function applyColor(color) {
        // 移除所有主题类
        document.body.classList.remove('theme-blue', 'theme-purple', 'theme-pink', 'theme-orange', 'theme-dark');
        
        // 清除之前的自定义样式
        document.documentElement.removeAttribute('style');
        
        // 应用自定义颜色
        applyCustomColor(color);
        
        // 保存到本地存储
        localStorage.setItem('timetable-theme', 'custom');
        localStorage.setItem('timetable-custom-color', color);
        
        // 更新主题菜单项状态
        document.querySelectorAll('.theme-item').forEach(item => {
            item.classList.remove('active');
        });
    }
    
    // 直接选择颜色时应用（实时生效）
    colorPicker.addEventListener('input', () => {
        const color = colorPicker.value;
        applyColor(color);
    });
    
    // 颜色选择完成后保存
    colorPicker.addEventListener('change', () => {
        const color = colorPicker.value;
        applyColor(color);
    });
    
    // 隐藏应用按钮，因为不再需要
    if (applyBtn) {
        applyBtn.style.display = 'none';
    }
}

function setTheme(theme) {
    // 移除所有主题类
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-pink', 'theme-orange', 'theme-dark');
    
    // 特殊处理自定义主题
    if (theme === 'custom') {
        // 加载保存的自定义颜色并应用
        const savedCustomColor = localStorage.getItem('timetable-custom-color');
        if (savedCustomColor) {
            applyCustomColor(savedCustomColor);
        }
    } else {
        // 应用预设主题
        if (theme !== 'default') {
            document.body.classList.add(\`theme-\${theme}\`);
        } else {
            // 恢复默认主题（豆沙绿）
            document.documentElement.removeAttribute('style');
        }
    }
    
    // 保存到本地存储
    localStorage.setItem('timetable-theme', theme);
    
    // 更新菜单项状态
    document.querySelectorAll('.theme-item').forEach(item => {
        item.classList.toggle('active', item.dataset.theme === theme);
    });
}

// 自定义颜色功能
function initCustomColor() {
    const colorPicker = document.getElementById('customColorPicker');
    
    // 从本地存储加载自定义颜色
    const savedCustomColor = localStorage.getItem('timetable-custom-color');
    if (savedCustomColor) {
        colorPicker.value = savedCustomColor;
    }
    
    // 直接选择颜色时应用（实时生效）
    colorPicker.addEventListener('input', () => {
        const color = colorPicker.value;
        applyCustomColor(color);
    });
    
    // 颜色选择完成后保存
    colorPicker.addEventListener('change', () => {
        const color = colorPicker.value;
        localStorage.setItem('timetable-custom-color', color);
    });
}

// 字体切换功能
function initFontSwitcher() {
    const fontBtn = document.getElementById('fontBtn');
    const fontMenu = document.getElementById('fontMenu');
    const fontItems = document.querySelectorAll('.font-item');
    
    // 从本地存储加载字体
    const savedFont = localStorage.getItem('timetable-font') || 'system';
    setFont(savedFont);
    
    // 切换字体菜单显示/隐藏
    fontBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = fontMenu.classList.contains('show');
        closeAllMenus();
        if (!isVisible) {
            fontMenu.classList.add('show');
        }
    });
    
    // 点击菜单项切换字体
    fontItems.forEach(item => {
        item.addEventListener('click', () => {
            const font = item.dataset.font;
            setFont(font);
            fontMenu.classList.remove('show');
        });
    });
    
    // 点击页面其他地方关闭字体菜单
    document.addEventListener('click', () => {
        fontMenu.classList.remove('show');
    });
    
    // 阻止菜单内部点击事件冒泡
    fontMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function setFont(font) {
    // 定义字体映射
    const fontMap = {
        'system': 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        'microsoft-yahei': '"Microsoft YaHei", "微软雅黑", sans-serif',
        'simsun': 'SimSun, "宋体", serif',
        'heiti': '"SimHei", "黑体", sans-serif',
        'kaiti': 'KaiTi, "楷体", serif',
        'fangsong': 'FangSong, "仿宋", serif',
        'xingkai': '"STXingkai", "华文行楷", "STXingkai SC", "华文行楷 SC", "KaiTi", "楷体", "SimSun", "宋体", serif',
        'lishu': '"LiSu", "隶书", "STXingkai", "华文行楷", "KaiTi", "楷体", "SimSun", "宋体", serif',
        'kaiti': '"KaiTi", "楷体", "STXingkai", "华文行楷", "SimSun", "宋体", serif',
        'fangsong': '"FangSong", "仿宋", "KaiTi", "楷体", "SimSun", "宋体", serif',
        'youyuan': '"YouYuan", "幼圆", "Microsoft YaHei", "微软雅黑", sans-serif',
        'source-han-sans': '"Source Han Sans", "思源黑体", "Microsoft YaHei", sans-serif',
        'source-han-serif': '"Source Han Serif", "思源宋体", "SimSun", serif',
        'youyuan': '"YouYuan", "幼圆", sans-serif',
        'arial': 'Arial, sans-serif',
        'helvetica': 'Helvetica, Arial, sans-serif',
        'georgia': 'Georgia, serif',
        'times-new-roman': '"Times New Roman", Times, serif'
    };
    
    // 应用字体到整个页面
    document.body.style.fontFamily = fontMap[font] || fontMap['system'];
    
    // 保存到本地存储
    localStorage.setItem('timetable-font', font);
    
    // 更新菜单项状态
    document.querySelectorAll('.font-item').forEach(item => {
        item.classList.toggle('active', item.dataset.font === font);
    });
}

function applyCustomColor(color) {
    // 移除所有主题类
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-pink', 'theme-orange', 'theme-dark');
    
    // 计算颜色变体
    const rgb = hexToRgb(color);
    const lightColor = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.1)\`;
    const darkColor = darkenColor(color, 0.3);
    const borderColor = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.3)\`;
    const shadowColor = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.15)\`;
    const patternBackground = \`radial-gradient(circle at 10% 20%, rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.1) 0%, rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, 0.05) 90%)\`;
    
    // 设置CSS变量
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--light-color', lightColor);
    document.documentElement.style.setProperty('--dark-color', darkColor);
    document.documentElement.style.setProperty('--border-color', borderColor);
    document.documentElement.style.setProperty('--background-color', lightColor);
    document.documentElement.style.setProperty('--text-color', darkColor);
    document.documentElement.style.setProperty('--shadow-color', shadowColor);
    document.documentElement.style.setProperty('--pattern-background', patternBackground);
    
    // 保存到本地存储
    localStorage.setItem('timetable-theme', 'custom');
}

// 辅助函数：十六进制转RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 74, g: 124, b: 89 }; // 默认豆沙绿
}

// 辅助函数：加深颜色
function darkenColor(color, amount) {
    const rgb = hexToRgb(color);
    const r = Math.max(0, Math.min(255, rgb.r - rgb.r * amount));
    const g = Math.max(0, Math.min(255, rgb.g - rgb.g * amount));
    const b = Math.max(0, Math.min(255, rgb.b - rgb.b * amount));
    return \`rgb(\${r}, \${g}, \${b})\`;
}`
    },
    meta: {builtAt: "2026-09-28 11:07:05", sources: {"tools/kechengbiao2/css/styles.css": "154acb2cba12", "assets/js/frame-bridge.js": "1131903c1e46", "tools/kechengbiao2/js/script.js": "e909ce0adecf"}}
  };
})();