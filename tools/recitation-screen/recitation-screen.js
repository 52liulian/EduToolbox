/** 背诵记录大屏：导入学号姓名，点击切换已背诵状态，支持导出 */
(function () {
  const $ = (id) => document.getElementById(id);
  let students = JSON.parse(localStorage.getItem("recitation") || "[]");

  function save() { localStorage.setItem("recitation", JSON.stringify(students)); }
  function render() {
    if (!students.length) { $("grid").innerHTML = '<div class="empty">请导入名单（CSV 格式：学号,姓名，每行一个）</div>'; return; }
    const done = students.filter(s => s.done).length;
    $("grid").innerHTML = students.map((s, i) =>
      `<div class="card ${s.done ? 'done' : ''}" data-i="${i}"><div class="name">${s.name}</div><div class="sid">${s.id}</div></div>`
    ).join("");
    $("grid").querySelectorAll(".card").forEach(c => c.addEventListener("click", () => {
      students[+c.dataset.i].done = !students[+c.dataset.i].done; save(); render();
    }));
  }

  $("file").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      students = ev.target.result.split(/\r?\n/).map(l => l.trim()).filter(Boolean).map(l => {
        const [id, name] = l.split(/[,，\t]/);
        return { id: (id||"").trim(), name: (name||"").trim() || id, done: false };
      });
      save(); render();
    };
    r.readAsText(f, "UTF-8");
  });

  $("export").addEventListener("click", () => {
    const csv = "学号,姓名,状态\n" + students.map(s => `${s.id},${s.name},${s.done ? "已背诵" : "未背诵"}`).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "背诵记录.csv"; a.click();
  });

  $("fs").addEventListener("click", () => document.documentElement.requestFullscreen?.());
  render();
})();
