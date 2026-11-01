/* Shared UI language toggle — key used across HKDSE虛擬教室 pages */
(function () {
  const KEY = "hkdse-vc-ui-lang";

  function read() {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "en" || v === "zh") return v;
    } catch (e) {}
    return "zh";
  }

  function write(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  function apply(lang) {
    const html = document.documentElement;
    html.setAttribute("data-ui-lang", lang);
    html.lang = lang === "en" ? "en" : "zh-Hant";
    document.querySelectorAll(".lang-switch .lang-btn").forEach(btn => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    document.dispatchEvent(new CustomEvent("ui-lang-change", { detail: { lang } }));
  }

  function ensureSwitch() {
    const nav = document.querySelector(".topnav .inner");
    if (!nav) return null;
    let box = nav.querySelector(".lang-switch");
    if (box) return box;
    box = document.createElement("div");
    box.className = "lang-switch";
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", "Language / 語言");
    box.innerHTML =
      '<button type="button" class="lang-btn" data-lang="zh" aria-pressed="false">中文</button>' +
      '<button type="button" class="lang-btn" data-lang="en" aria-pressed="false">EN</button>';
    nav.appendChild(box);
    return box;
  }

  function wire(box) {
    if (!box || box.dataset.wired) return;
    box.dataset.wired = "1";
    box.addEventListener("click", e => {
      const btn = e.target.closest(".lang-btn");
      if (!btn) return;
      const lang = btn.dataset.lang === "en" ? "en" : "zh";
      write(lang);
      apply(lang);
    });
  }

  window.HKDSE_UI_LANG = {
    key: KEY,
    get: read,
    set(lang) {
      const v = lang === "en" ? "en" : "zh";
      write(v);
      apply(v);
    }
  };

  // Apply ASAP (script may be at end of body; head snippet may have set attr already)
  const initial = read();
  apply(initial);
  const box = ensureSwitch();
  wire(box);
})();
