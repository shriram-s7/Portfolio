(() => {
  "use strict";
  const GROUPS = window.GROUPS || [], DATA = window.CREDENTIALS || [];
  const app = document.getElementById("app");
  const slug = document.body.dataset.group;
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const CODE_LABEL = { aws: "Validation number", oracle: "Certification no.", nptel: "Roll no.", iitm: "Roll no." };

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (d) => { const [y, m, day] = (d || "").split("-"); return !y ? "" : !m ? y : `${day ? +day + " " : ""}${MON[+m - 1]} ${y}`; };
  const key = (e) => { const [y, m = "00", d = "00"] = (e.date || "").split("-"); return `${y}-${m}-${d}`; };
  const ext = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
  const copyIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ───── home: list of groups ───── */
  function home() {
    document.title = "S Shriram | Certifications";
    app.innerHTML = `
      <section class="hero">
        <h1><span class="gradient-text">S Shriram</span></h1>
        <p>Certifications and courses. Pick a group to see its certificates and verify them.</p>
      </section>
      <ul class="groups">${GROUPS.map((g) => `
        <li><a class="group" href="${g.slug}/index.html">
          <span class="g-name">${esc(g.name)}</span>
          <span class="g-blurb">${esc(g.blurb)}</span>
          <span class="g-foot"><b>${g.count}</b> ${g.count === 1 ? "certificate" : "certificates"} ${arrow}</span>
        </a></li>`).join("")}
      </ul>`;
  }

  /* ───── group page: certificate cards ───── */
  function codeRow(label, value) {
    return `<div class="code"><span class="code-label">${esc(label)}</span><code>${esc(value)}</code><button type="button" class="copy" data-copy="${esc(value)}" aria-label="Copy ${esc(label)}">${copyIcon}<span>Copy</span></button></div>`;
  }
  function card(e) {
    const main = e.files[0]?.path || e.images[0]?.src;
    const codes = [];
    if (e.credentialId) codes.push(codeRow(CODE_LABEL[e.provider] || "ID", e.credentialId));
    (e.extraIds || []).forEach(([l, v]) => codes.push(codeRow(l, v)));
    const chips = [e.rank, e.score && `Score ${e.score}`, fmt(e.date), e.expires && `Valid until ${fmt(e.expires)}`].filter(Boolean);
    const v = e.verify[0];
    const others = [...e.files.slice(1), ...e.images.map((im) => ({ label: "Badge image", path: im.src }))];
    return `<article class="card">
      ${main ? `<a class="preview" href="${esc(main)}" target="_blank" rel="noopener" aria-label="Open certificate: ${esc(e.title)}">
        ${e.preview ? `<img src="${esc(e.preview)}" alt="Certificate: ${esc(e.title)}" loading="lazy" decoding="async">` : ""}</a>` : ""}
      <div class="info">
        <h2>${esc(e.title)}</h2>
        <p class="issuer">${esc(e.issuer)}</p>
        <p class="chips">${chips.map((c) => `<span>${esc(c)}</span>`).join("")}</p>
        ${codes.length ? `<div class="codes">${codes.join("")}</div>` : ""}
        <div class="actions">
          ${v ? `<a class="btn primary" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Verify ${ext}</a>` : ""}
          ${main ? `<a class="btn ghost" href="${esc(main)}" target="_blank" rel="noopener">View certificate</a>` : ""}
          ${others.map((f) => `<a class="btn ghost" href="${esc(f.path)}" target="_blank" rel="noopener">${esc(f.label.replace(/ \(PDF\)/, ""))}</a>`).join("")}
        </div>
        ${v && v.hint ? `<p class="hint">${esc(v.hint)}</p>` : ""}
        ${!v ? `<p class="hint">The issuer provides no online verification page. The certificate itself is attached.</p>` : ""}
      </div></article>`;
  }
  function group(g) {
    document.title = `${g.name} | S Shriram`;
    const list = DATA.filter((e) => e.provider === g.provider).sort((a, b) => key(b).localeCompare(key(a)));
    app.innerHTML = `
      <a class="back" href="index.html">${arrow.replace("M5 12h14M13 6l6 6-6 6", "M19 12H5M11 6l-6 6 6 6")} All groups</a>
      <section class="hero small">
        <h1><span class="gradient-text">${esc(g.name)}</span></h1>
        <p>${esc(g.blurb)} · ${list.length} ${list.length === 1 ? "certificate" : "certificates"}</p>
      </section>
      <div class="cards">${list.map(card).join("")}</div>`;
  }

  /* ───── copy buttons ───── */
  document.addEventListener("click", async (ev) => {
    const b = ev.target.closest("[data-copy]"); if (!b) return;
    const text = b.dataset.copy;
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement("textarea"); t.value = text; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch {} t.remove(); }
    const label = b.querySelector("span"); label.textContent = "Copied"; b.classList.add("done");
    setTimeout(() => { label.textContent = "Copy"; b.classList.remove("done"); }, 1500);
  });
  // a missing thumbnail should never leave a broken-image icon
  document.addEventListener("error", (ev) => { if (ev.target.tagName === "IMG") ev.target.closest(".preview")?.classList.add("noimg"); }, true);

  const g = GROUPS.find((x) => x.slug === slug);
  g ? group(g) : home();
})();
