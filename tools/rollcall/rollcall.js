/**
 * 随机点名器
 * ----------------------------------------------------------------------------
 * 功能：导入名单，支持随机滚动点名、语音朗读、键盘快捷键
 * 参考实现：Random Name Picker
 * 路由入口：#/onlinetools/rollcall
 * 运行方式：作为 iframe 嵌入主站
 */
(function () {
  "use strict";

  let nameList = [];
  let isRolling = false;
  let rollTimer = null;

  const displayArea = document.getElementById('displayArea');
  const nameDisplay = document.getElementById('nameDisplay');
  const rollBtn = document.getElementById('rollBtn');
  const countBadge = document.getElementById('countBadge');
  const modalOverlay = document.getElementById('modalOverlay');
  const nameInput = document.getElementById('nameInput');
  const voiceEnabled = document.getElementById('voiceEnabled');

  // ===== 名单相关 =====
  function openListModal() {
    nameInput.value = nameList.join(', ');
    modalOverlay.classList.add('active');
    nameInput.focus();
  }

  function closeListModal() {
    modalOverlay.classList.remove('active');
  }

  function saveList() {
    const raw = nameInput.value;
    nameList = raw
      .split(/[,，\n\r\t]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    updateCountBadge();
    closeListModal();
    if (!isRolling) {
      nameDisplay.innerHTML = nameList.length > 0
        ? '<span class="placeholder">点击"点名"开始</span>'
        : '<span class="placeholder">请先添加名单</span>';
      displayArea.className = 'display-area';
    }
  }

  function updateCountBadge() {
    if (nameList.length > 0) {
      countBadge.textContent = nameList.length + '人';
      countBadge.classList.remove('empty');
    } else {
      countBadge.textContent = '0人';
      countBadge.classList.add('empty');
    }
  }

  // ===== 点名相关 =====
  function toggleRoll() {
    if (isRolling) { stopRoll(); } else { startRoll(); }
  }

  function startRoll() {
    if (nameList.length === 0) {
      alert('名单为空，请先点击"名单"按钮添加姓名！');
      return;
    }
    isRolling = true;
    rollBtn.textContent = '⏹ 停止';
    displayArea.className = 'display-area rolling';

    rollTimer = setInterval(() => {
      const idx = Math.floor(Math.random() * nameList.length);
      nameDisplay.textContent = nameList[idx];
    }, 60);
  }

  function stopRoll() {
    clearInterval(rollTimer);
    const finalIdx = Math.floor(Math.random() * nameList.length);
    const finalName = nameList[finalIdx];
    nameDisplay.textContent = finalName;
    displayArea.className = 'display-area show';
    isRolling = false;
    rollBtn.textContent = '🎲 点名';

    if (voiceEnabled.checked) speakName(finalName);
  }

  // ===== 语音朗读 =====
  function speakName(name) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(name);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // ===== 键盘快捷键 =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeListModal();
      return;
    }
    if (modalOverlay.classList.contains('active')) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleRoll();
    }
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeListModal();
  });

  // ===== 全局暴露 onclick =====
  window.openListModal = openListModal;
  window.closeListModal = closeListModal;
  window.saveList = saveList;
  window.toggleRoll = toggleRoll;

  // 初始化
  updateCountBadge();
})();
