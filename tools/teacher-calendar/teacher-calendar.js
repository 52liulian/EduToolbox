/** 教师工作日历：按周展示每日日期，高亮本周，支持打印 */
(function () {
  const $ = (id) => document.getElementById(id);
  const wd = ["日","一","二","三","四","五","六"];

  function fmt(d) { return `${d.getMonth()+1}/${d.getDate()}`; }

  function gen() {
    const start = new Date($("start").value);
    if (isNaN(start)) return alert("请选择开学日期");
    const weeks = parseInt($("weeks").value) || 20;
    const day = start.getDay() || 7;
    const monday = new Date(start); monday.setDate(start.getDate() - (day - 1));
    const today = new Date(); today.setHours(0,0,0,0);

    let html = "";
    for (let w = 0; w < weeks; w++) {
      const ws = new Date(monday); ws.setDate(monday.getDate() + w * 7);
      const we = new Date(ws); we.setDate(ws.getDate() + 6);
      const isCur = today >= ws && today <= we;
      let days = "";
      for (let d = 0; d < 7; d++) {
        const dt = new Date(ws); dt.setDate(ws.getDate() + d);
        days += `<div>${wd[d]} ${fmt(dt)}</div>`;
      }
      html += `<div class="week ${isCur ? 'cur' : ''}"><div class="no">第 ${w+1} 周${isCur ? ' · 本周' : ''}</div><div class="range">${fmt(ws)} - ${fmt(we)}</div><div class="days">${days}</div></div>`;
    }
    $("cal").innerHTML = html;
    localStorage.setItem("tcStart", $("start").value);
    localStorage.setItem("tcWeeks", weeks);
  }

  $("gen").addEventListener("click", gen);
  $("print").addEventListener("click", () => window.print());
  const s = localStorage.getItem("tcStart");
  if (s) { $("start").value = s; $("weeks").value = localStorage.getItem("tcWeeks") || 20; gen(); }
  else $("start").value = "2026-02-23";
})();
