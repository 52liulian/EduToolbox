class TimetableApp {
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
            document.querySelector(`input[name="colorMode"][value="${colorMode}"]`).checked = true;
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
            preview.style.cssText = `
                padding: 16px 20px;
                border-radius: 8px;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                min-height: 20px;
                background-color: ${bgColor};
                color: ${textColor};
                border: 1px solid ${bgColor};
            `;
        } else {
            preview.style.cssText = `
                padding: 16px 20px;
                border-radius: 8px;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                min-height: 20px;
                background-color: transparent;
                color: ${textColor};
                border: 1px solid #ddd;
            `;
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
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 25px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        content.innerHTML = `
            <h3 style="margin: 0 0 20px 0; font-size: 18px; color: #333;">修改时段名称</h3>
            <form id="sectionNameForm">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: #666;">时段名称（当前：${sectionLabel}）</label>
                    <input type="text" id="sectionNameInput" value="${sectionName}" required 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; box-sizing: border-box;" 
                           placeholder="请输入旰的名称">
                </div>
                <div class="form-actions" style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                    <button type="button" id="cancelSectionBtn" class="btn secondary" 
                            style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">取消</button>
                    <button type="submit" class="btn primary" 
                            style="padding: 8px 16px; background: #4a7c59; color: white; border: none; border-radius: 6px; cursor: pointer;">保存</button>
                </div>
            </form>
        `;
        
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
    
        const content = `
            <div class="tutorial-section">
                <h4 class="tutorial-section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    快速开始
                </h4>
                <div class="tutorial-grid">
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                        </div>
                        <div class="tutorial-card-content">
                            <strong>添加科目</strong>
                            <span>点击“+ 科目”按钮创建课程</span>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                        </div>
                        <div class="tutorial-card-content">
                            <strong>导入预设</strong>
                            <span>按学习阶段快速导入课程</span>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><polyline points="5,9 2,12 5,15"/><polyline points="9,5 12,2 15,5"/><polyline points="19,9 22,12 19,15"/><polyline points="9,19 12,22 15,19"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
                        </div>
                        <div class="tutorial-card-content">
                            <strong>拖拽排课</strong>
                            <span>将科目拖到课程表对应位置</span>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
                        </div>
                        <div class="tutorial-card-content">
                            <strong>设置时间</strong>
                            <span>点击课时标签修改上课时间</span>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </div>
                        <div class="tutorial-card-content">
                            <strong>导出保存</strong>
                            <span>支持图片/Word/Excel格式</span>
                        </div>
                    </div>
                    <div class="tutorial-card">
                        <div class="tutorial-card-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>
                        </div>
                        <div class="tutorial-card-content">
                            <strong>备份数据</strong>
                            <span>导出/导入JSON数据文件</span>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="tutorial-section">
                <h4 class="tutorial-section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    个性化设置
                </h4>
                <div class="tutorial-features">
                    <div class="tutorial-feature">
                        <span class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.68 1.5-1.5 0-.38-.1-.74-.33-1.05-.21-.27-.33-.67-.33-1.05 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.52-4.48-10-10-10z"/></svg>
                        </span>
                        <div class="feature-text">
                            <strong>主题切换</strong>
                            <span>6种预设主题 + 自定义颜色</span>
                        </div>
                    </div>
                    <div class="tutorial-feature">
                        <span class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><polyline points="4,7 4,4 20,4 20,7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
                        </span>
                        <div class="feature-text">
                            <strong>字体选择</strong>
                            <span>多种中英文字体可选</span>
                        </div>
                    </div>
                    <div class="tutorial-feature">
                        <span class="feature-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                        </span>
                        <div class="feature-text">
                            <strong>显示设置</strong>
                            <span>控制晚间/周末/时间显示</span>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="tutorial-section">
                <h4 class="tutorial-section-title">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    小技巧
                </h4>
                <div class="tutorial-tips">
                    <div class="tip-item"><kbd>ESC</kbd> 快速关闭弹窗</div>
                    <div class="tip-item">右键点击课程可删除</div>
                    <div class="tip-item">数据自动保存到浏览器</div>
                    <div class="tip-item">建议定期备份数据</div>
                </div>
            </div>
        `;
    
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
            link.download = `课程表备份_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
            
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
                    errorMessage = `JSON格式错误: ${error.message}`;
                    console.error('JSON解析错误位置:', error.message);
                } else if (error.message) {
                    errorMessage = `导入失败: ${error.message}`;
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
                    console.error(`数据格式错误: 科目[${i}]不是对象:`, subject);
                    return false;
                }
                if (!subject.id && !subject.name) {
                    console.error(`数据格式错误: 科目[${i}]缺少必要字段:`, subject);
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
        notification.style.cssText = `
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
        `;
        
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
            hint.innerHTML = `
                <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
                background: #4CAF50; color: white; padding: 15px 25px; border-radius: 8px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; 
                animation: fadeInOut 3s ease-in-out;">
                    请点击左侧「+ 科目」按钮开始添加科目
                </div>
                <style>
                @keyframes fadeInOut {
                    0% { opacity: 0; top: 0; }
                    10% { opacity: 1; top: 20px; }
                    90% { opacity: 1; top: 20px; }
                    100% { opacity: 0; top: 0; }
                }
                </style>
            `;
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
                hint.innerHTML = `
                    <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
                    background: #2196F3; color: white; padding: 15px 25px; border-radius: 8px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; 
                    animation: fadeInOut 3s ease-in-out;">
                        请从上方科目池中拖拽科目到课程表中
                    </div>
                    <style>
                    @keyframes fadeInOut {
                        0% { opacity: 0; top: 0; }
                        10% { opacity: 1; top: 20px; }
                        90% { opacity: 1; top: 20px; }
                        100% { opacity: 0; top: 0; }
                    }
                    </style>
                `;
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
        
        document.querySelector(`[data-period="${period}"]`).textContent = newTime;
        this.saveData();
        this.closeTimeModal();
    }

    addSubjectToCell(subjectId, day, section, period) {
        const key = `${day}-${section}-${period}`;
        this.timetable[key] = subjectId;
        this.saveData();
        this.renderTimetable();
    }

    removeSubjectFromCell(cell) {
        if (cell.classList.contains('occupied')) {
            const day = cell.dataset.day;
            const section = cell.dataset.section;
            const period = cell.dataset.period;
            const key = `${day}-${section}-${period}`;
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
                card.style.borderLeft = `4px solid ${bgColor}`;
            } else {
                card.style.borderLeft = `4px solid ${textColor}`;
            }
            
            const teacherHtml = subject.teacher ? `<div class="teacher-name">${subject.teacher}</div>` : '';
            const subjectStyle = !subject.teacher ? 'style="line-height: 40px;"' : '';
            
            card.innerHTML = `
                <div class="subject-info">
                    <div class="subject-name" ${subjectStyle}>${subject.name}</div>
                    ${teacherHtml}
                </div>
                <div class="subject-actions">
                    <button class="btn-text edit-btn" title="编辑" data-action="edit">编辑</button>
                    <button class="btn-text delete-btn" title="删除" data-action="delete">删除</button>
                </div>
            `;
            
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
            name: `第${periods.length + 1}节`,
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
        
        this.confirm(`确定要删除${sectionName}的最后一节课吗？`, (confirmed) => {
            if (confirmed) {
                this.periods[section].pop();
                
                // 清理对应的课程表数据
                const keysToDelete = [];
                for (let key in this.timetable) {
                    if (key.includes(`-${section}-`)) {
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
        const cellKey = `${day}-${section}-${period}`;
        
        // 创建弹窗
        const modal = document.createElement('div');
        modal.className = 'mobile-subject-modal';
        modal.style.cssText = `
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
        `;
        
        const content = document.createElement('div');
        // PC端和移动端响应式宽度
        const isMobile = window.innerWidth <= 768;
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 0;
            max-width: ${isMobile ? '90%' : '600px'};
            width: ${isMobile ? '90%' : '600px'};
            max-height: 80vh;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;
        
        // 头部区域
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 20px 15px;
            border-bottom: 1px solid #eee;
        `;
        
        const title = document.createElement('h3');
        title.textContent = '选择科目';
        title.style.cssText = 'margin: 0; font-size: 18px; color: #333; font-weight: 600;';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
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
        `;
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
        searchInput.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
            box-sizing: border-box;
        `;
        searchInput.onfocus = () => searchInput.style.borderColor = '#007bff';
        searchInput.onblur = () => searchInput.style.borderColor = '#ddd';
        
        searchContainer.appendChild(searchInput);
        
        // 科目列表区域
        const listContainer = document.createElement('div');
        listContainer.style.cssText = 'max-height: 50vh; overflow-y: auto; padding: 15px 20px;';
        
        const list = document.createElement('div');
        // 2个课程一行，响应式网格布局
        list.style.cssText = `
            display: grid;
            grid-template-columns: ${isMobile ? '1fr' : 'repeat(2, 1fr)'};
            gap: 10px;
        `;
        
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
                emptyMessage.style.cssText = `
                    text-align: center;
                    padding: 40px 20px;
                    color: #999;
                    font-size: 14px;
                    grid-column: 1 / -1;
                `;
                emptyMessage.innerHTML = filterText 
                    ? `<div style="font-size: 48px; margin-bottom: 10px;">🔍</div><div>未找到匹配的科目</div>`
                    : `<div style="font-size: 48px; margin-bottom: 10px;">📚</div>
                       <div>暂无科目，请先添加科目</div>
                       <button onclick="document.getElementById('addSubjectBtn').click(); this.closest('.mobile-subject-modal').remove();" 
                               style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                           添加科目
                       </button>`;
                list.appendChild(emptyMessage);
            } else {
                filteredSubjects.forEach(subject => {
                    const item = document.createElement('div');
                    item.style.cssText = `
                        padding: 12px;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: all 0.2s;
                        background: white;
                    `;
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
                    
                    colorBox.style.cssText = `
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: ${displayColor};
                        flex-shrink: 0;
                        ${displayColor === '#FFFFFF' || displayColor === '#ffffff' ? 'border: 1px solid #ddd;' : ''}
                    `;
                    
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
            emptyMessage.style.cssText = `
                text-align: center;
                padding: 40px 20px;
                color: #999;
                font-size: 14px;
            `;
            emptyMessage.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 10px;">📚</div>
                <div>暂无科目，请先添加科目</div>
                <button onclick="document.getElementById('addSubjectBtn').click(); this.closest('.mobile-subject-modal').remove();" 
                        style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    添加科目
                </button>
            `;
            listContainer.appendChild(emptyMessage);
        }
        
        // 底部按钮区域
        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 15px 20px 20px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
        `;
        
        const addSubjectBtn = document.createElement('button');
        addSubjectBtn.textContent = '添加新科目';
        addSubjectBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
        addSubjectBtn.onmouseover = () => addSubjectBtn.style.background = '#0056b3';
        addSubjectBtn.onmouseout = () => addSubjectBtn.style.background = '#007bff';
        addSubjectBtn.addEventListener('click', () => {
            this.closeMobileSubjectModal(modal);
            setTimeout(() => this.openSubjectModal(), 300);
        });
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.cssText = `
            flex: 1;
            padding: 10px;
            background: #6c757d;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        `;
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
                timeText += `<span>${char}</span>`;
            });
            timeText += '</div>';
            
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
        periodCell.innerHTML = `
                        <div class="period-name" data-section="${section}" data-period="${periodIndex}" style="cursor: pointer; font-weight: bold; color: var(--text-color);">
                            ${period.name}
                        </div>
                        <div class="time-display" data-section="${section}" data-period="${periodIndex}" style="cursor: pointer; font-size: 12px; color: var(--text-color); ${timeDisplayStyle}">
                            ${period.time}
                        </div>
                    `;
        
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
            
            const key = `${day}-${section}-${periodIndex}`;
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
                    
                    const teacherHtml = subject.teacher ? `<div class="teacher-name">${subject.teacher}</div>` : '';
                    const subjectStyle = !subject.teacher ? 'style="margin-bottom: 0;"' : '';
                    content.innerHTML = `
                        <div class="subject-name" ${subjectStyle}>${subject.name}</div>
                        ${teacherHtml}
                        <button class="delete-cell-btn" title="删除课程">×</button>
                    `;
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
        
        const newTime = `${startHour}:${startMinute}-${endHour}:${endMinute}`;
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
            const lightPrimary = primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)` : '#f0f8f0';
            const mediumPrimary = primaryRgb ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)` : '#e8f5e9';
            
            // 获取当前字体设置
            const currentFont = getComputedStyle(document.body).fontFamily || '"Microsoft YaHei", "PingFang SC", Arial, sans-serif';
            
            // 获取标题
            const titleInput = document.getElementById('tableTitle');
            const titleText = titleInput.value || '课程表';
            
            // 创建干净导出容器
            cleanContainer = document.createElement('div');
            cleanContainer.style.cssText = `
                position: absolute; 
                top: -9999px; 
                left: -9999px; 
                width: 900px; 
                padding: 40px 50px; 
                background: #ffffff;
                font-family: ${currentFont};
            `;

            // 创建标题区域
            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = `
                text-align: center; 
                margin-bottom: 30px; 
                padding-bottom: 20px;
                border-bottom: 3px solid ${primaryColor};
            `;
            
            const mainTitle = document.createElement('h1');
            mainTitle.textContent = titleText;
            mainTitle.style.cssText = `
                margin: 0 0 8px 0; 
                font-size: 32px; 
                font-weight: bold; 
                color: ${primaryColor}; 
                letter-spacing: 4px;
                font-family: ${currentFont};
            `;
            headerDiv.appendChild(mainTitle);
            
            // 添加日期
            const dateDiv = document.createElement('div');
            const now = new Date();
            const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
            dateDiv.textContent = dateStr;
            dateDiv.style.cssText = `font-size: 14px; color: #888; margin-top: 5px; font-family: ${currentFont};`;
            headerDiv.appendChild(dateDiv);
            
            cleanContainer.appendChild(headerDiv);

            // 创建表格容器
            const tableWrapper = document.createElement('div');
            tableWrapper.style.cssText = `
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid #e0e0e0;
            `;
            
            // 克隆课程表
            const originalContainer = document.querySelector('.timetable-container');
            const containerClone = originalContainer.cloneNode(true);

            // 移除不需要的元素
            const removeSelectors = '.section-controls, .edit-btn, .delete-btn, .timetable-title-section, .table-title-input, .delete-cell-btn, .plus-indicator';
            containerClone.querySelectorAll(removeSelectors).forEach(el => el.remove());

            // 设置表格样式
            const table = containerClone.querySelector('.timetable');
            if (table) {
                table.style.cssText = `
                    border-collapse: collapse;
                    width: 100%;
                    table-layout: fixed;
                    font-size: 14px;
                    background: #ffffff;
                    font-family: ${currentFont};
                `;
            }
            
            // 处理表头（星期行）
            const headerCells = containerClone.querySelectorAll('th');
            headerCells.forEach(cell => {
                cell.style.cssText = `
                    background: ${primaryColor};
                    color: #ffffff;
                    padding: 14px 8px;
                    font-weight: 600;
                    font-size: 15px;
                    border: none;
                    text-align: center;
                    font-family: ${currentFont};
                `;
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
                
                cell.style.cssText = `
                    padding: 12px 8px;
                    text-align: center;
                    vertical-align: middle;
                    border: 1px solid #e8e8e8;
                    font-size: 13px;
                    color: ${textColor};
                    background: ${bgColor};
                    font-weight: ${fontWeight};
                    font-family: ${currentFont};
                `;
                
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
                        cellContent.style.cssText = `
                            width: 100%;
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            padding: 8px;
                            box-sizing: border-box;
                            background-color: ${subjectBg || 'transparent'};
                            color: ${subjectColor};
                            border-radius: 6px;
                            font-family: ${currentFont};
                        `;
                        
                        if (subjectBg && subjectBg !== 'transparent' && subjectBg !== 'rgba(0, 0, 0, 0)') {
                            // 背景+字体模式
                            cell.style.backgroundColor = 'transparent';
                            cell.style.padding = '4px';
                            cellContent.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                            
                            // 设置文字颜色和字体
                            if (subjectName) {
                                subjectName.style.cssText = `color: ${subjectColor}; font-weight: 600; font-size: 14px; display: block; margin-bottom: 3px; text-align: center; font-family: ${currentFont};`;
                            }
                            if (teacherName) {
                                teacherName.style.cssText = `color: ${subjectColor}; opacity: 0.9; font-size: 12px; display: block; text-align: center; font-family: ${currentFont};`;
                            }
                        } else {
                            // 仅字体色模式 - 透明背景
                            cellContent.style.backgroundColor = 'transparent';
                            cell.style.backgroundColor = '#ffffff';
                            cell.style.border = '1px solid #e8e8e8';
                            
                            // 设置文字颜色和字体
                            if (subjectName) {
                                subjectName.style.cssText = `color: ${subjectColor}; font-weight: 600; font-size: 14px; display: block; margin-bottom: 3px; text-align: center; font-family: ${currentFont};`;
                            }
                            if (teacherName) {
                                teacherName.style.cssText = `color: ${subjectColor}; opacity: 0.9; font-size: 12px; display: block; text-align: center; font-family: ${currentFont};`;
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
                link.download = `${titleText}.png`;
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
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
        let wordContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                    <w:Zoom>100</w:Zoom>
                    <w:DoNotOptimizeForBrowser/>
                </w:WordDocument>
            </xml>
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
            </style>
        </head>
        <body>
            <div class="main-title">${title}</div>
            <table>
                <thead>
                    <tr>
                        <th class="time-header">时段</th>
                        <th class="period-header">课时</th>
                        ${(() => {
                            let headers = ['周一', '周二', '周三', '周四', '周五'];
                            if (this.settings.showSaturday) headers.push('周六');
                            if (this.settings.showSunday) headers.push('周日');
                            return headers.map(day => `<th>${day}</th>`).join('');
                        })()}
                    </tr>
                </thead>
                <tbody>`;

        // 构建表格内容
        
        // 添加上午部分
        if (this.periods.morning && this.periods.morning.length > 0) {
            this.periods.morning.forEach((period, periodIndex) => {
                wordContent += `<tr>`;
                
                // 时间列（只在第一节显示，竭排显示）
                if (periodIndex === 0) {
                    const sectionText = this.sectionNames.morning.split('').join('<br>');
                    wordContent += `<td class="time-header" rowspan="${this.periods.morning.length}">${sectionText}</td>`;
                }
                
                // 节数和时间（时间段换行显示）
                let periodTimeHtml = period.name;
                if (this.settings.showPeriodTime && period.time) {
                    // 将时间段从中间的-分割，换行显示
                    const timeFormatted = period.time.replace('-', '-<br>');
                    periodTimeHtml += `<br><span class="period-time">${timeFormatted}</span>`;
                }
                wordContent += `<td class="period-header">${periodTimeHtml}</td>`;
                
                // 每天的课程（根据设置动态显示）
                const dayCount = 5 + (this.settings.showSaturday ? 1 : 0) + (this.settings.showSunday ? 1 : 0);
                for (let day = 1; day <= dayCount; day++) {
                    const key = `${day}-morning-${periodIndex}`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            wordContent += `<td>
                                <div class="subject">${subject.name}</div>
                                ${subject.teacher ? `<div class="teacher">${subject.teacher}</div>` : ''}
                            </td>`;
                        } else {
                            wordContent += `<td></td>`;
                        }
                    } else {
                        wordContent += `<td></td>`;
                    }
                }
                
                wordContent += `</tr>`;
            });
        }
        
        // 添加下午部分
        if (this.periods.afternoon && this.periods.afternoon.length > 0) {
            this.periods.afternoon.forEach((period, periodIndex) => {
                wordContent += `<tr>`;
                
                // 时间列（只在第一节显示，竭排显示）
                if (periodIndex === 0) {
                    const sectionText = this.sectionNames.afternoon.split('').join('<br>');
                    wordContent += `<td class="time-header" rowspan="${this.periods.afternoon.length}">${sectionText}</td>`;
                }
                
                // 节数和时间（时间段换行显示）
                let periodTimeHtml = period.name;
                if (this.settings.showPeriodTime && period.time) {
                    const timeFormatted = period.time.replace('-', '-<br>');
                    periodTimeHtml += `<br><span class="period-time">${timeFormatted}</span>`;
                }
                wordContent += `<td class="period-header">${periodTimeHtml}</td>`;
                
                // 每天的课程（根据设置动态显示）
                const dayCount = 5 + (this.settings.showSaturday ? 1 : 0) + (this.settings.showSunday ? 1 : 0);
                for (let day = 1; day <= dayCount; day++) {
                    const key = `${day}-afternoon-${periodIndex}`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            wordContent += `<td>
                                <div class="subject">${subject.name}</div>
                                ${subject.teacher ? `<div class="teacher">${subject.teacher}</div>` : ''}
                            </td>`;
                        } else {
                            wordContent += `<td></td>`;
                        }
                    } else {
                        wordContent += `<td></td>`;
                    }
                }
                
                wordContent += `</tr>`;
            });
        }

        
        // 添加晚上部分（如果显示）
        if (this.settings.showEvening && this.periods.evening && this.periods.evening.length > 0) {
            this.periods.evening.forEach((period, periodIndex) => {
                wordContent += `<tr>`;
                
                // 时间列（只在第一节显示，竭排显示）
                if (periodIndex === 0) {
                    const sectionText = this.sectionNames.evening.split('').join('<br>');
                    wordContent += `<td class="time-header" rowspan="${this.periods.evening.length}">${sectionText}</td>`;
                }
                
                // 节数和时间（时间段换行显示）
                let periodTimeHtml = period.name;
                if (this.settings.showPeriodTime && period.time) {
                    const timeFormatted = period.time.replace('-', '-<br>');
                    periodTimeHtml += `<br><span class="period-time">${timeFormatted}</span>`;
                }
                wordContent += `<td class="period-header">${periodTimeHtml}</td>`;
                
                // 每天的课程（根据设置动态显示）
                const dayCount = 5 + (this.settings.showSaturday ? 1 : 0) + (this.settings.showSunday ? 1 : 0);
                for (let day = 1; day <= dayCount; day++) {
                    const key = `${day}-evening-${periodIndex}`;
                    const subjectId = this.timetable[key];
                    
                    if (subjectId) {
                        const subject = this.subjects.find(s => s.id === subjectId);
                        if (subject) {
                            wordContent += `<td>
                                <div class="subject">${subject.name}</div>
                                ${subject.teacher ? `<div class="teacher">${subject.teacher}</div>` : ''}
                            </td>`;
                        } else {
                            wordContent += `<td></td>`;
                        }
                    } else {
                        wordContent += `<td></td>`;
                    }
                }
                
                wordContent += `</tr>`;
            });
        }

        wordContent += `</tbody></table></body></html>`;

        // 创建Blob并下载（使用正确的HTML格式）
        const blob = new Blob([wordContent], { type: 'application/msword;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title}.doc`;
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
            link.download = `${title}.xls`;
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
        let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
      xmlns:x="urn:schemas-microsoft-com:office:excel" 
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <!--[if gte mso 9]>
    <xml>
        <x:ExcelWorkbook>
            <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                    <x:Name>课程表</x:Name>
                    <x:WorksheetOptions>
                        <x:Print>
                            <x:ValidPrinterInfo/>
                            <x:PaperSizeIndex>9</x:PaperSizeIndex>
                        </x:Print>
                        <x:Selected/>
                        <x:ProtectContents>False</x:ProtectContents>
                    </x:WorksheetOptions>
                </x:ExcelWorksheet>
            </x:ExcelWorksheets>
        </x:ExcelWorkbook>
    </xml>
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
            mso-number-format:'\@';
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
    </style>
</head>
<body>
    <div class="main-title">${title}</div>
    <table>
        <thead>
            <tr style="height: 40px;">
                <th class="time-header">时段</th>
                <th class="period-header">课时</th>`;
        
        // 添加星期表头
        const weekDays = ['周一', '周二', '周三', '周四', '周五'];
        if (this.settings.showSaturday) weekDays.push('周六');
        if (this.settings.showSunday) weekDays.push('周日');
        weekDays.forEach(day => {
            html += `<th>${day}</th>`;
        });
        
        html += `</tr>
        </thead>
        <tbody>`;
        
        // 添加上午课程
        if (this.periods.morning && this.periods.morning.length > 0) {
            this.periods.morning.forEach((period, index) => {
                html += '<tr>';
                
                // 时段列（仅第一行，合并整个时段）
                if (index === 0) {
                    html += `<td rowspan="${this.periods.morning.length}" class="time-section">${this.sectionNames.morning}</td>`;
                }
                
                // 课时列
                html += `<td class="period-header">${period.name}`;
                if (this.settings.showPeriodTime && period.time) {
                    html += `<br><span class="period-time">${period.time}</span>`;
                }
                html += `</td>`;
                
                // 课程内容
                const dayCount = weekDays.length;
                for (let day = 1; day <= dayCount; day++) {
                    const key = `${day}-morning-${index}`;
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
                                cellStyle = `style="background-color: ${subject.color}; color: white; border: 1px solid #000 !important;"`;
                            } else {
                                // 字体色模式
                                subjectStyle = `style="color: ${subject.color};"`;
                                teacherStyle = `style="color: ${subject.color};"`;
                            }
                            
                            html += `<td ${cellStyle}><span class="subject" ${subjectStyle}>${subject.name}</span>`;
                            if (subject.teacher) {
                                html += `<br><span class="teacher" ${teacherStyle}>${subject.teacher}</span>`;
                            }
                            html += `</td>`;
                        } else {
                            html += '<td></td>';
                        }
                    } else {
                        html += '<td></td>';
                    }
                }
                
                html += '</tr>';
            });
        }
        
        // 添加下午课程
        if (this.periods.afternoon && this.periods.afternoon.length > 0) {
            this.periods.afternoon.forEach((period, index) => {
                html += '<tr>';
                
                // 时段列（仅第一行，合并整个时段）
                if (index === 0) {
                    html += `<td rowspan="${this.periods.afternoon.length}" class="time-section">${this.sectionNames.afternoon}</td>`;
                }
                
                // 课时列
                html += `<td class="period-header">${period.name}`;
                if (this.settings.showPeriodTime && period.time) {
                    html += `<br><span class="period-time">${period.time}</span>`;
                }
                html += `</td>`;
                
                // 课程内容
                const dayCount = weekDays.length;
                for (let day = 1; day <= dayCount; day++) {
                    const key = `${day}-afternoon-${index}`;
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
                                cellStyle = `style="background-color: ${subject.color}; color: white; border: 1px solid #000 !important;"`;
                            } else {
                                // 字体色模式
                                subjectStyle = `style="color: ${subject.color};"`;
                                teacherStyle = `style="color: ${subject.color};"`;
                            }
                            
                            html += `<td ${cellStyle}><span class="subject" ${subjectStyle}>${subject.name}</span>`;
                            if (subject.teacher) {
                                html += `<br><span class="teacher" ${teacherStyle}>${subject.teacher}</span>`;
                            }
                            html += `</td>`;
                        } else {
                            html += '<td></td>';
                        }
                    } else {
                        html += '<td></td>';
                    }
                }
                
                html += '</tr>';
            });
        }
        
        // 添加晚上课程
        if (this.settings.showEvening && this.periods.evening && this.periods.evening.length > 0) {
            this.periods.evening.forEach((period, index) => {
                html += '<tr>';
                
                // 时段列（仅第一行，合并整个时段）
                if (index === 0) {
                    html += `<td rowspan="${this.periods.evening.length}" class="time-section">${this.sectionNames.evening}</td>`;
                }
                
                // 课时列
                html += `<td class="period-header">${period.name}`;
                if (this.settings.showPeriodTime && period.time) {
                    html += `<br><span class="period-time">${period.time}</span>`;
                }
                html += `</td>`;
                
                // 课程内容
                const dayCount = weekDays.length;
                for (let day = 1; day <= dayCount; day++) {
                    const key = `${day}-evening-${index}`;
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
                                cellStyle = `style="background-color: ${subject.color}; color: white; border: 1px solid #000 !important;"`;
                            } else {
                                // 字体色模式
                                subjectStyle = `style="color: ${subject.color};"`;
                                teacherStyle = `style="color: ${subject.color};"`;
                            }
                            
                            html += `<td ${cellStyle}><span class="subject" ${subjectStyle}>${subject.name}</span>`;
                            if (subject.teacher) {
                                html += `<br><span class="teacher" ${teacherStyle}>${subject.teacher}</span>`;
                            }
                            html += `</td>`;
                        } else {
                            html += '<td></td>';
                        }
                    } else {
                        html += '<td></td>';
                    }
                }
                
                html += '</tr>';
            });
        }
        
        html += `</tbody>
    </table>
</body>
</html>`;
        
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
        document.body.classList.add(`theme-${theme}`);
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
            document.body.classList.add(`theme-${theme}`);
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
    const lightColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
    const darkColor = darkenColor(color, 0.3);
    const borderColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
    const shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
    const patternBackground = `radial-gradient(circle at 10% 20%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05) 90%)`;
    
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
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
    return `rgb(${r}, ${g}, ${b})`;
}