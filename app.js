// OpenLeaf site script.
// The page text lives in content.js. Blog posts are GitHub issues labelled
// "blog" in the repo named in content.js, grouped so every writer gets a page.
(() => {
  "use strict";

  const S = window.SITE;
  const $ = (selector, root = document) => root.querySelector(selector);

  if (!S) {
    $("#main").innerHTML =
      '<p class="wrap" style="padding:64px 0">The page text did not load. Open content.js on GitHub and check for a missing quote or comma.</p>';
    return;
  }

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const avatarUrl = (url, size) => `${url}${url.includes("?") ? "&" : "?"}s=${size}`;

  const REPO = S.blog.repo;
  const LABEL = S.blog.label || "blog";
  const WRITE_URL = `https://github.com/${REPO}/issues/new?template=${encodeURIComponent(S.blog.template || "blog-post.yml")}`;
  const LIST_URL = `https://github.com/${REPO}/issues?q=${encodeURIComponent(`is:issue is:open label:${LABEL}`)}`;

  // ---------- Sample screens: original drawings, so no photos are needed ----------
  const INK = "#2c3530", TEXT = "#5c6862", BAR = "#d5dcd7", PANEL = "#f1f5f2", EDGE = "#e2e8e4";
  const rect = (x, y, w, h, fill, rx = 0, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${extra ? " " + extra : ""}/>`;
  const dot = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  const colours = (hue) => ({
    main: `hsl(${hue}, 45%, 42%)`,
    soft: `hsl(${hue}, 55%, 90%)`,
    soft2: `hsl(${(hue + 35) % 360}, 70%, 90%)`,
    pop: `hsl(${(hue + 35) % 360}, 75%, 64%)`
  });

  const browser = () =>
    rect(0.5, 0.5, 319, 219, "#fff", 10, `stroke="${EDGE}"`) +
    `<path d="M1 18V10.5A9.5 9.5 0 0 1 10.5 1h299A9.5 9.5 0 0 1 319 10.5V18z" fill="${PANEL}"/>` +
    dot(11, 9.5, 2.6, BAR) + dot(19, 9.5, 2.6, BAR) + dot(27, 9.5, 2.6, BAR) +
    rect(104, 5, 112, 9, "#fff", 4.5);

  const handset = () => rect(4, 4, 152, 292, "#fff", 22, `stroke="${EDGE}" stroke-width="2"`) + rect(62, 12, 36, 6, EDGE, 3);

  const SCREENS = {
    landing(c) {
      return browser() +
        rect(14, 28, 12, 12, c.main, 3) + rect(31, 31, 40, 6, INK, 3) +
        rect(186, 31, 22, 5, BAR, 2.5) + rect(214, 31, 22, 5, BAR, 2.5) + rect(242, 31, 22, 5, BAR, 2.5) +
        rect(272, 27, 34, 13, c.main, 6.5) +
        rect(14, 58, 156, 13, INK, 4) + rect(14, 77, 116, 13, INK, 4) +
        rect(14, 101, 158, 5, BAR, 2.5) + rect(14, 111, 144, 5, BAR, 2.5) + rect(14, 121, 118, 5, BAR, 2.5) +
        rect(14, 137, 58, 18, c.main, 9) + rect(78.5, 137.5, 50, 17, "#fff", 8.5, `stroke="${BAR}"`) +
        rect(188, 50, 118, 108, c.soft, 12) + dot(276, 78, 13, c.pop) +
        `<path d="M188 146L220 108L246 132L268 114L306 144V146Z" fill="${c.main}" opacity=".5"/>` +
        [14, 114, 214].map((x) =>
          rect(x, 172, 92, 36, PANEL, 8) + dot(x + 17, 190, 8, c.soft) +
          rect(x + 31, 184, 50, 5, TEXT, 2.5) + rect(x + 31, 194, 34, 4, BAR, 2)
        ).join("");
    },

    booking(c) {
      const picked = { "1-3": c.main, "0-5": c.soft, "2-1": c.soft, "2-4": c.soft, "3-2": c.soft, "3-6": c.soft, "4-5": c.soft };
      let cells = "";
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) cells += rect(14 + col * 26, 58 + row * 28, 22, 22, picked[`${row}-${col}`] || PANEL, 6);
      }
      let slots = "";
      for (let i = 0; i < 6; i++) {
        slots += i === 2
          ? rect(216, 68 + i * 22, 80, 16, c.main, 8)
          : rect(216.5, 68.5 + i * 22, 79, 15, "#fff", 7.5, `stroke="${BAR}"`);
      }
      return browser() + rect(14, 28, 86, 10, INK, 4) + rect(14, 43, 56, 5, BAR, 2.5) + cells +
        rect(206, 28, 100, 182, PANEL, 10) + rect(216, 40, 62, 8, INK, 4) + rect(216, 53, 44, 4, BAR, 2) + slots;
    },

    shop(c) {
      let cards = "";
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          const x = 14 + col * 99, y = 50 + row * 84, odd = (row * 3 + col) % 2 === 1;
          cards += rect(x, y, 93, 76, PANEL, 8) + rect(x + 6, y + 6, 81, 40, odd ? c.soft2 : c.soft, 6) +
            dot(x + 46.5, y + 26, 10, odd ? c.main : c.pop) +
            rect(x + 6, y + 53, 50, 5, TEXT, 2.5) + rect(x + 6, y + 63, 28, 5, c.main, 2.5);
        }
      }
      return browser() + rect(14, 28, 12, 12, c.main, 3) + rect(31, 31, 40, 6, INK, 3) +
        rect(220, 27, 86, 14, PANEL, 7) + dot(296, 34, 3, BAR) + cards;
    },

    dashboard(c) {
      const menu = [0, 1, 2, 3, 4].map((i) => rect(10, 54 + i * 16, 38, 5, i === 0 ? c.main : BAR, 2.5)).join("");
      const stats = [0, 1, 2].map((i) => {
        const x = 68 + i * 82;
        return rect(x, 28, 74, 40, PANEL, 8) + rect(x + 9, 37, 30, 4, BAR, 2) + rect(x + 9, 47, 40, 11, INK, 3) +
          rect(x + 55, 48, 10, 9, i === 1 ? c.pop : c.main, 2);
      }).join("");
      const pts = [[78, 182], [97, 170], [116, 174], [136, 152], [156, 158], [176, 132], [196, 140], [214, 112]];
      const line = pts.map((p) => p.join(",")).join(" ");
      const area = `M${pts.map((p) => p.join(" ")).join("L")}L214 200L78 200Z`;
      const bars = [42, 70, 54, 92, 64].map((h, i) => rect(242 + i * 12, 200 - h, 8, h, i === 3 ? c.main : c.soft, 2)).join("");
      return browser() +
        `<path d="M1 18H58V219H10.5A9.5 9.5 0 0 1 1 209.5Z" fill="${PANEL}"/>` +
        rect(10, 28, 12, 12, c.main, 3) + menu + stats +
        rect(68.5, 76.5, 155, 133, "#fff", 8, `stroke="${EDGE}"`) +
        `<path d="${area}" fill="${c.soft}"/>` +
        `<polyline points="${line}" fill="none" stroke="${c.main}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>` +
        rect(232.5, 76.5, 73, 133, "#fff", 8, `stroke="${EDGE}"`) + bars;
    },

    blog(c) {
      return browser() + rect(14, 28, 12, 12, c.main, 3) + rect(31, 31, 40, 6, INK, 3) +
        rect(246, 31, 26, 5, BAR, 2.5) + rect(280, 31, 26, 5, BAR, 2.5) +
        rect(14, 48, 292, 62, c.soft, 10) + dot(270, 72, 12, c.pop) +
        `<path d="M24 100L64 74L94 92L130 66L180 100Z" fill="${c.main}" opacity=".5"/>` +
        rect(14, 122, 214, 11, INK, 4) + rect(14, 138, 156, 11, INK, 4) +
        dot(19, 160, 5, c.pop) + rect(29, 157, 64, 5, c.main, 2.5) +
        [172, 181, 190, 199].map((y, i) => rect(14, y, i === 3 ? 196 : 292 - (i % 2) * 14, 4, BAR, 2)).join("");
    },

    menu(c) {
      const items = [0, 1, 2, 3].map((i) => {
        const y = 114 + i * 38;
        return dot(32, y + 12, 11, i % 2 ? c.soft : PANEL) + dot(32, y + 12, 5, i % 2 ? c.main : c.pop) +
          rect(50, y + 5, 62, 6, TEXT, 3) + rect(50, y + 16, 44, 4, BAR, 2) + rect(122, y + 6, 22, 6, c.main, 3);
      }).join("");
      return handset() + rect(16, 30, 84, 10, INK, 4) + rect(16, 45, 104, 5, BAR, 2.5) +
        rect(16, 58, 128, 44, c.soft, 10) + dot(124, 80, 12, c.pop) +
        rect(26, 70, 56, 7, c.main, 3.5) + rect(26, 83, 40, 5, "#fff", 2.5) +
        items + rect(16, 264, 128, 20, c.main, 10) + rect(56, 271, 48, 6, "#fff", 3);
    },

    timetable(c) {
      const days = [0, 1, 2, 3, 4].map((i) => {
        const x = 16 + i * 26, on = i === 1;
        return rect(x, 58, 22, 28, on ? c.main : PANEL, 7) + rect(x + 6, 64, 10, 4, on ? "#fff" : BAR, 2) +
          rect(x + 5, 73, 12, 7, on ? "#fff" : TEXT, 3);
      }).join("");
      const classes = [0, 1, 2, 3, 4].map((i) => {
        const y = 98 + i * 36;
        return rect(16, y, 128, 30, PANEL, 8) + rect(22, y + 7, 3, 16, i % 3 === 0 ? c.main : c.pop, 1.5) +
          rect(32, y + 7, 62, 6, TEXT, 3) + rect(32, y + 18, 40, 4, BAR, 2) +
          rect(116.5, y + 8.5, 20, 13, "#fff", 6.5, `stroke="${BAR}"`);
      }).join("");
      return handset() + rect(16, 30, 72, 10, INK, 4) + rect(16, 45, 96, 5, BAR, 2.5) + days + classes;
    }
  };

  function screen(kind, hue = 150, label = "") {
    const draw = SCREENS[kind] || SCREENS.landing;
    const phone = kind === "menu" || kind === "timetable";
    const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
    return `<svg class="screen${phone ? " is-phone" : ""}" viewBox="${phone ? "0 0 160 300" : "0 0 320 220"}" xmlns="http://www.w3.org/2000/svg" ${a11y}>${draw(colours(Number(hue) || 0))}</svg>`;
  }

  // ---------- Service icons ----------
  const ICONS = {
    site: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 13h6M7 16h4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3v3H8z"/>',
    chart: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 16v-3M12 16V8M16 16v-6"/>',
    cart: '<path d="M3 4h2l2.2 10.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 1.9-1.4L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.7-4.4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.7 4.4L21 15"/><path d="M21 20v-5h-5"/>',
    shield: '<path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="M9 12l2 2 4-4"/>'
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.site}</svg>`;

  // ---------- Home page ----------
  function renderHome() {
    document.querySelectorAll(".brand-name").forEach((el) => { el.textContent = S.name; });

    const h = S.hero;
    $("#hero").innerHTML = `
      <div class="hero-copy">
        <h1>${esc(h.title)}</h1>
        <p class="lede">${esc(h.text)}</p>
        <div class="actions">
          <a class="btn btn-primary" href="#contact">${esc(h.primaryButton)}</a>
          <a class="btn btn-quiet" href="#work">${esc(h.secondaryButton)}</a>
        </div>
      </div>
      <div class="leaves" aria-hidden="true">
        <div class="leaf leaf-1">${screen("blog", 205)}</div>
        <div class="leaf leaf-2">${screen("booking", 28)}</div>
        <div class="leaf leaf-3">${screen("landing", 150)}</div>
      </div>`;

    const a = S.about;
    $("#about").innerHTML = `
      <div class="wrap two-col">
        <div class="about-copy">
          <h2>${esc(a.title)}</h2>
          ${a.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
        </div>
        <div>
          <h3 class="minor">${esc(a.stepsTitle)}</h3>
          <ol class="steps">${a.steps.map((s) => `<li><strong>${esc(s.title)}</strong><span>${esc(s.text)}</span></li>`).join("")}</ol>
        </div>
      </div>`;

    const sv = S.services;
    $("#services").innerHTML = `
      <div class="wrap">
        <div class="section-head"><h2>${esc(sv.title)}</h2><p>${esc(sv.intro)}</p></div>
        <ul class="services">${sv.items.map((it) => `
          <li><span class="icon">${icon(it.icon)}</span><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></li>`).join("")}
        </ul>
      </div>`;

    const pr = S.projects;
    $("#work").innerHTML = `
      <div class="wrap">
        <div class="section-head"><h2>${esc(pr.title)}</h2><p>${esc(pr.intro)}</p></div>
        <ul class="projects">${pr.items.map((p) => `
          <li class="project">
            <div class="sheet">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : screen(p.screen, p.hue, `${p.name} sample screen`)}</div>
            <h3>${p.link ? `<a href="${esc(p.link)}">${esc(p.name)}</a>` : esc(p.name)}</h3>
            <p>${esc(p.text)}</p>
            <p class="tags">${(p.tags || []).map(esc).join(", ")}</p>
          </li>`).join("")}
        </ul>
      </div>`;

    const g = S.gallery;
    $("#gallery").innerHTML = `
      <div class="wrap">
        <div class="section-head"><h2>${esc(g.title)}</h2><p>${esc(g.intro)}</p></div>
        <ul class="gallery">${g.items.map((it, i) => `
          <li><button class="tile" type="button" data-i="${i}" aria-label="Enlarge: ${esc(it.caption)}">
            <span class="art">${it.image ? `<img src="${esc(it.image)}" alt="" loading="lazy">` : screen(it.screen, it.hue)}</span>
            <span class="cap">${esc(it.caption)}</span>
          </button></li>`).join("")}
        </ul>
      </div>`;

    const b = S.blog;
    $("#blog").innerHTML = `
      <div class="wrap">
        <div class="blog-head">
          <div><h2>${esc(b.title)}</h2><p>${esc(b.intro)}</p></div>
          <a class="btn btn-primary" href="${WRITE_URL}" target="_blank" rel="noopener">Write a post</a>
        </div>
        <div class="blog-grid">
          <div>
            <h3 class="minor">Writers</h3>
            <div class="writers" id="writers" aria-live="polite"></div>
          </div>
          <div>
            <h3 class="minor">Latest posts</h3>
            <ol class="post-list" id="latest"></ol>
            <h3 class="minor">How to write a post</h3>
            <ol class="steps small">
              <li><span>Sign in to GitHub. An account is free.</span></li>
              <li><span>Press Write a post, then add a title and your post.</span></li>
              <li><span>Press Create. Your post shows here within a minute, on your own page.</span></li>
            </ol>
          </div>
        </div>
      </div>`;

    const ct = S.contact;
    $("#contact").innerHTML = `
      <div class="wrap two-col">
        <div>
          <h2>${esc(ct.title)}</h2>
          <p class="muted">${esc(ct.text)}</p>
          <p class="contact-email"><a href="mailto:${esc(ct.email)}">${esc(ct.email)}</a></p>
          <ul class="links">${(ct.links || []).map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>
        </div>
        <form class="form" id="contact-form">
          <label>Your name<input name="name" autocomplete="name" required></label>
          <label>Your email<input name="email" type="email" autocomplete="email" required></label>
          <label>What do you need?<textarea name="message" rows="5" required></textarea></label>
          <button class="btn btn-primary" type="submit">Write the email</button>
          <p class="hint">This opens your email app with your message ready to send.</p>
        </form>
      </div>`;

    $("#copyright").textContent = `© ${new Date().getFullYear()} ${S.name}. Hosted on GitHub Pages.`;
    $("#source-link").href = `https://github.com/${REPO}`;
  }

  // ---------- Blog posts from GitHub issues ----------
  const CACHE_KEY = `openleaf-posts:${REPO}:${LABEL}`;
  const CACHE_MS = 3 * 60 * 1000;
  let postsPromise = null;

  function getPosts() {
    if (!postsPromise) postsPromise = loadPosts().catch((err) => { postsPromise = null; throw err; });
    return postsPromise;
  }

  async function loadPosts() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.t < CACHE_MS) return cached.posts;
    } catch {
      // storage unavailable: load fresh
    }

    const posts = [];
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(
        `https://api.github.com/repos/${REPO}/issues?labels=${encodeURIComponent(LABEL)}&state=open&per_page=100&page=${page}`,
        { headers: { Accept: "application/vnd.github.full+json" } }
      );
      if (!res.ok) {
        const err = new Error(`GitHub answered ${res.status}`);
        err.status = res.status;
        err.limited = res.headers.get("x-ratelimit-remaining") === "0";
        throw err;
      }
      const items = await res.json();
      for (const it of items) {
        if (it.pull_request || !it.user) continue;
        posts.push({
          n: it.number,
          title: it.title,
          login: it.user.login,
          avatar: it.user.avatar_url,
          created: it.created_at,
          url: it.html_url,
          comments: it.comments,
          html: it.body_html || ""
        });
      }
      if (items.length < 100) break;
    }
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), posts })); } catch {
      // too big or blocked: skip caching
    }
    return posts;
  }

  function groupByWriter(posts) {
    const writers = new Map();
    for (const p of posts) {
      const key = p.login.toLowerCase();
      if (!writers.has(key)) writers.set(key, { login: p.login, avatar: p.avatar, posts: [] });
      writers.get(key).posts.push(p);
    }
    return [...writers.values()];
  }

  // Posts are written by visitors, so only a safe set of tags and links is kept.
  const KEEP = new Set("a abbr b blockquote br code dd del details div dl dt em figcaption figure h1 h2 h3 h4 h5 h6 hr i img ins kbd li mark ol p pre q s small span strong sub summary sup table tbody td tfoot th thead tr u ul".split(" "));
  const DROP = new Set("script style iframe object embed form input button textarea select option svg math template link meta base frame frameset noscript audio video source track canvas".split(" "));
  const ATTRS = { a: ["href", "title"], img: ["src", "alt", "title", "width", "height"], td: ["align", "colspan", "rowspan"], th: ["align", "colspan", "rowspan"], ol: ["start"], details: ["open"] };

  function absoluteUrl(value, allowMail) {
    try {
      const url = new URL(value, "https://github.com/");
      if (url.protocol === "https:" || url.protocol === "http:" || (allowMail && url.protocol === "mailto:")) return url.href;
    } catch {
      // not a URL
    }
    return "";
  }

  function clean(node) {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.TEXT_NODE) continue;
      if (child.nodeType !== Node.ELEMENT_NODE) { child.remove(); continue; }
      const tag = child.localName;
      if (DROP.has(tag)) { child.remove(); continue; }
      clean(child);
      if (!KEEP.has(tag)) { child.replaceWith(...child.childNodes); continue; }
      const allowed = ATTRS[tag] || [];
      for (const attr of [...child.attributes]) {
        const name = attr.name.toLowerCase();
        if (!allowed.includes(name)) { child.removeAttribute(attr.name); continue; }
        if (name === "href" || name === "src") {
          const url = absoluteUrl(attr.value, name === "href");
          if (url) child.setAttribute(attr.name, url); else child.removeAttribute(attr.name);
        }
      }
      if (tag === "a") {
        child.setAttribute("target", "_blank");
        child.setAttribute("rel", "noopener noreferrer nofollow ugc");
      }
      if (tag === "img") child.setAttribute("loading", "lazy");
    }
  }

  function postContent(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    clean(tpl.content);
    // The post form adds a "Your post" heading above the text; it is not part of the post.
    const first = tpl.content.firstElementChild;
    if (first && /^h[1-6]$/.test(first.localName) && first.textContent.trim().toLowerCase() === "your post") first.remove();
    return tpl.content;
  }

  function excerpt(post) {
    if (post._excerpt == null) {
      const text = postContent(post.html).textContent.replace(/\s+/g, " ").trim();
      post._excerpt = text.length > 180 ? `${text.slice(0, 177).trimEnd()}…` : text;
    }
    return post._excerpt;
  }

  function problem(err) {
    let text = "Posts could not load. Check your connection and try again.";
    if (err && (err.limited || err.status === 403 || err.status === 429)) {
      text = "GitHub limits how often one device can load posts, and that limit is used up for now. Try again in a few minutes, or read the posts on GitHub.";
    } else if (err && err.status === 404) {
      text = "The blog's repository was not found. Check the repo name in content.js.";
    }
    return `<div class="notice"><p>${esc(text)}</p><div class="row">
      <button class="btn btn-quiet" type="button" data-retry>Try again</button>
      <a class="btn btn-quiet" href="${LIST_URL}" target="_blank" rel="noopener">Read posts on GitHub</a>
    </div></div>`;
  }

  async function renderBlogHome() {
    const writersEl = $("#writers");
    const latestEl = $("#latest");
    writersEl.innerHTML = '<p class="loading">Loading writers…</p>';
    latestEl.innerHTML = "";
    let posts;
    try {
      posts = await getPosts();
    } catch (err) {
      writersEl.innerHTML = problem(err);
      return;
    }
    if (!posts.length) {
      writersEl.innerHTML = `<div class="notice"><p>No posts yet. Be the first to write one.</p>
        <div class="row"><a class="btn btn-primary" href="${WRITE_URL}" target="_blank" rel="noopener">Write the first post</a></div></div>`;
      latestEl.innerHTML = '<li class="loading">New posts will show up here.</li>';
      return;
    }
    writersEl.innerHTML = groupByWriter(posts).map((w) => `
      <a class="writer" href="#/blog/${encodeURIComponent(w.login)}">
        <img src="${esc(avatarUrl(w.avatar, 96))}" alt="" width="48" height="48" loading="lazy">
        <span class="w-name">@${esc(w.login)}</span>
        <span class="w-meta">${plural(w.posts.length, "post")}</span>
        <span class="w-latest">${esc(w.posts[0].title)}</span>
      </a>`).join("");
    latestEl.innerHTML = posts.slice(0, 5).map((p) => `
      <li><a href="#/post/${p.n}">
        <span class="p-title">${esc(p.title)}</span>
        <span class="p-meta">@${esc(p.login)}, ${fmtDate(p.created)}</span>
      </a></li>`).join("");
  }

  // ---------- Writer and post pages ----------
  const home = $("#home");
  const view = $("#view");
  const baseTitle = document.title;
  const setTitle = (text) => { document.title = text ? `${text} | ${S.name}` : baseTitle; };
  let ticket = 0;

  function viewShell(loadingText) {
    view.innerHTML = `<div class="narrow"><a class="back" href="#blog">All writers</a>
      <div id="view-body" aria-live="polite"><p class="loading">${loadingText}</p></div></div>`;
    return $("#view-body");
  }

  async function renderWriter(login) {
    const mine = ++ticket;
    const body = viewShell("Loading posts…");
    setTitle(`@${login}`);
    let posts;
    try {
      posts = await getPosts();
    } catch (err) {
      if (mine === ticket) body.innerHTML = problem(err);
      return;
    }
    if (mine !== ticket) return;
    const own = posts.filter((p) => p.login.toLowerCase() === login.toLowerCase());
    if (!own.length) {
      body.innerHTML = `<h1 class="page-title">@${esc(login)}</h1>
        <p class="muted">No posts from @${esc(login)} yet.</p>
        <p><a class="btn btn-primary" href="${WRITE_URL}" target="_blank" rel="noopener">Write a post</a></p>`;
      return;
    }
    const w = own[0];
    setTitle(`@${w.login}'s blog`);
    body.innerHTML = `
      <header class="author-head">
        <img src="${esc(avatarUrl(w.avatar, 168))}" alt="" width="84" height="84">
        <div>
          <h1 class="page-title">@${esc(w.login)}</h1>
          <p class="muted">${plural(own.length, "post")} on ${esc(S.name)}</p>
          <a href="https://github.com/${encodeURIComponent(w.login)}" target="_blank" rel="noopener">GitHub profile</a>
        </div>
      </header>
      <ol class="post-cards">${own.map((p) => `
        <li><a href="#/post/${p.n}">
          <h2>${esc(p.title)}</h2>
          <p>${esc(excerpt(p))}</p>
          <time datetime="${esc(p.created)}">${fmtDate(p.created)}</time>
        </a></li>`).join("")}
      </ol>`;
  }

  async function renderPost(number) {
    const mine = ++ticket;
    const body = viewShell("Loading post…");
    setTitle("Post");
    let posts;
    try {
      posts = await getPosts();
    } catch (err) {
      if (mine === ticket) body.innerHTML = problem(err);
      return;
    }
    if (mine !== ticket) return;
    const p = posts.find((x) => x.n === number);
    if (!p) {
      setTitle("Post not found");
      body.innerHTML = `<h1 class="page-title">Post not found</h1>
        <p class="muted">This post is not on the blog. Its writer may have closed it.</p>`;
      return;
    }
    setTitle(p.title);
    const writerLink = `#/blog/${encodeURIComponent(p.login)}`;
    const back = $(".back", view);
    back.href = writerLink;
    back.textContent = `More from @${p.login}`;
    body.innerHTML = `
      <article>
        <h1 class="page-title">${esc(p.title)}</h1>
        <p class="byline">
          <img src="${esc(avatarUrl(p.avatar, 64))}" alt="" width="32" height="32">
          <a href="${writerLink}">@${esc(p.login)}</a>
          <time datetime="${esc(p.created)}">${fmtDate(p.created)}</time>
        </p>
        <div class="post-body"></div>
        <p class="post-foot">
          <a class="btn btn-quiet" href="${esc(p.url)}" target="_blank" rel="noopener">${p.comments ? `Read ${plural(p.comments, "comment")} on GitHub` : "Comment on GitHub"}</a>
          <a class="btn btn-quiet" href="${writerLink}">More from @${esc(p.login)}</a>
        </p>
      </article>`;
    $(".post-body", body).append(postContent(p.html));
  }

  // ---------- Simple router: #/blog/name and #/post/12 open their own pages ----------
  function route() {
    const hash = location.hash;
    let m;
    if ((m = hash.match(/^#\/blog\/([A-Za-z0-9-]{1,39})\/?$/))) {
      openView();
      renderWriter(m[1]);
    } else if ((m = hash.match(/^#\/post\/(\d{1,9})\/?$/))) {
      openView();
      renderPost(Number(m[1]));
    } else {
      closeView(hash);
    }
  }

  function openView() {
    home.hidden = true;
    view.hidden = false;
    closeMenu();
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function closeView(hash) {
    if (view.hidden) return; // already on the home page; the browser scrolls to the section itself
    ticket++;
    view.hidden = true;
    view.innerHTML = "";
    home.hidden = false;
    setTitle("");
    const target = hash.length > 1 && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }

  // ---------- Menu, header, gallery and contact form ----------
  const menuBtn = $(".menu-btn");
  const nav = $("#site-nav");
  function closeMenu() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }

  function wireUp() {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const lightbox = $("#lightbox");
    $("#gallery").addEventListener("click", (e) => {
      const tile = e.target.closest(".tile");
      if (!tile || typeof lightbox.showModal !== "function") return;
      const item = S.gallery.items[Number(tile.dataset.i)];
      $(".lb-art", lightbox).innerHTML = item.image
        ? `<img src="${esc(item.image)}" alt="${esc(item.caption)}">`
        : screen(item.screen, item.hue, item.caption);
      $(".lb-cap", lightbox).textContent = item.caption;
      lightbox.showModal();
    });
    $(".lb-close", lightbox).addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

    $("#contact-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get("name")).trim();
      const subject = `Project enquiry from ${name}`;
      const text = `${String(data.get("message")).trim()}\n\n${name}\n${String(data.get("email")).trim()}`;
      window.location.href = `mailto:${S.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-retry]")) return;
      postsPromise = null;
      try { sessionStorage.removeItem(CACHE_KEY); } catch {
        // storage blocked
      }
      renderBlogHome();
      if (!view.hidden) route();
    });

    window.addEventListener("hashchange", route);
  }

  // ---------- Start ----------
  renderHome();
  wireUp();
  route();
  renderBlogHome();
  if (view.hidden && location.hash.length > 1) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  }
})();
