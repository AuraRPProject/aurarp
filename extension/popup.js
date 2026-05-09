const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const t = window.__I18N__.t;

// [id, name, category]
const PLATFORMS = [
  ["youtube","YouTube","streaming"],["netflix","Netflix","streaming"],["primevideo","Prime Video","streaming"],
  ["disneyplus","Disney+","streaming"],["hbomax","Max","streaming"],["crunchyroll","Crunchyroll","streaming"],
  ["twitch","Twitch","streaming"],["kick","Kick","streaming"],["vimeo","Vimeo","streaming"],["tiktok","TikTok","streaming"],
  ["spotify","Spotify","music"],["soundcloud","SoundCloud","music"],["applemusic","Apple Music","music"],
  ["tidal","Tidal","music"],["deezer","Deezer","music"],["lastfm","Last.fm","music"],
  ["bandcamp","Bandcamp","music"],["genius","Genius","music"],
  ["github","GitHub","dev"],["gitlab","GitLab","dev"],["stackoverflow","Stack Overflow","dev"],
  ["vscode","VS Code Web","dev"],["mdn","MDN","dev"],["figma","Figma","dev"],
  ["x","X","social"],["reddit","Reddit","social"],["instagram","Instagram","social"],
  ["linkedin","LinkedIn","social"],["pinterest","Pinterest","social"],["letterboxd","Letterboxd","social"],
  ["anilist","AniList","social"],["mal","MyAnimeList","social"],["steam","Steam","social"],
  ["chatgpt","ChatGPT","ai"],["claude","Claude","ai"],["gemini","Gemini","ai"],
  ["coursera","Coursera","learning"],["udemy","Udemy","learning"],["khan","Khan Academy","learning"],
  ["duolingo","Duolingo","learning"],
  ["notion","Notion","productivity"],["gmail","Gmail","productivity"],["medium","Medium","productivity"],
  ["wikipedia","Wikipedia","productivity"],
];

const CATEGORIES = ["streaming","music","dev","social","ai","learning","productivity","other"];

let lang = "en";

function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el => { el.textContent = t(lang, el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(lang, el.dataset.i18nPh); });
  renderPlatforms();
  updatePreview();
}

$$(".tabs button").forEach(b => b.addEventListener("click", () => {
  $$(".tabs button").forEach(x => x.classList.remove("active"));
  $$(".pane").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  $(`[data-pane="${b.dataset.tab}"]`).classList.add("active");
  if (b.dataset.tab === "logs") loadLogs();
}));

let cachedDisabled = new Set();

function renderPlatforms() {
  const filter = ($("#appSearch")?.value || "").toLowerCase();
  const list = $("#platformList");
  let html = "";
  for (const cat of CATEGORIES) {
    const items = PLATFORMS.filter(([id,name,c]) => (c||"other") === cat && name.toLowerCase().includes(filter));
    if (!items.length) continue;
    html += `<div class="cat-head">${t(lang,"cat_"+cat)} <span class="muted">(${items.length})</span></div>`;
    html += items.map(([id, name]) => `
      <label class="platform">
        <span>${name}</span>
        <input type="checkbox" data-pid="${id}" ${cachedDisabled.has(id) ? "" : "checked"} />
      </label>`).join("");
  }
  list.innerHTML = html;
  $$("#platformList input").forEach(i => i.addEventListener("change", savePlatforms));
}

async function load() {
  const cfg = await chrome.storage.local.get(null);
  lang = cfg.lang || (navigator.language || "en").slice(0,2);
  if (!["en","pt","es"].includes(lang)) lang = "en";
  $("#lang").value = lang;
  $("#token").value = cfg.token || "";
  $("#appId").value = cfg.appId || "";
  $("#statusSel").value = cfg.status || "online";
  $("#customText").value = cfg.customText || "";
  $("#customType").value = cfg.customType ?? "0";
  if ($("#customState")) $("#customState").value = cfg.customState || "";
  if ($("#customImg")) $("#customImg").value = cfg.customImg || "";
  $("#idleAway").checked = cfg.idleAway !== false;
  $("#skipIncognito").checked = cfg.skipIncognito !== false;
  $("#enabled").checked = cfg.enabled !== false;
  if ($("#showButtons")) $("#showButtons").checked = cfg.showButtons !== false;
  if ($("#showThumbnails")) $("#showThumbnails").checked = cfg.showThumbnails !== false;
  if ($("#notifyOnConnect")) $("#notifyOnConnect").checked = cfg.notifyOnConnect !== false;
  cachedDisabled = new Set(cfg.disabledPlatforms || []);

  applyLang();
  refreshStatus();
  checkUpdate();
}

function renderBot(botUser, connected) {
  const card = $("#botCard");
  if (!botUser) { card.classList.add("hidden"); return; }
  card.classList.remove("hidden");
  setText($("#botName"), botUser.username);
  $("#botPing").className = "pill " + (connected ? "on" : "off");
  const av = botUser.avatar
    ? `https://cdn.discordapp.com/avatars/${botUser.id}/${botUser.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${(parseInt(botUser.id) >> 22) % 6}.png`;
  setSrc($("#botAvatar"), av);
}

async function checkUpdate() {
  const ver = chrome.runtime.getManifest().version;
  const { lastSeenVersion, pendingUpdate } = await chrome.storage.local.get(["lastSeenVersion","pendingUpdate"]);
  setText($("#aboutVer"), "v" + ver);
  if (pendingUpdate && lastSeenVersion !== ver) {
    $("#updateBanner").classList.remove("hidden");
    setText($("#updateVer"), `v${pendingUpdate.from || "?"} → v${ver}`);
  } else {
    $("#updateBanner").classList.add("hidden");
  }
}

function setText(el, val) { if (el && el.textContent !== val) el.textContent = val; }
function setSrc(el, val) { if (el && el.getAttribute("src") !== val) el.src = val; }

function refreshStatus() {
  chrome.runtime.sendMessage({ type: "status:get" }, async (res) => {
    if (chrome.runtime.lastError || !res) return;
    const pill = $("#statusPill");
    setText(pill, __aura_t(lang, res.connected ? "connected" : "offline"));
    pill.className = "pill " + (res.connected ? "on" : "off");
    renderBot(res.botUser, res.connected);
    const a = res.activity;
    setText($("#actName"), a ? a.name : "—");
    setText($("#actDetails"), a?.details || "");
    setText($("#actState"), a?.state || "");
    const thumb = $("#actThumb");
    if (a?.thumbnail) { setSrc(thumb, a.thumbnail); thumb.classList.remove("hidden"); }
    else thumb.classList.add("hidden");
    const { trackedToday = {} } = await chrome.storage.local.get("trackedToday");
    const today = new Date().toISOString().slice(0,10);
    setText($("#todayMin"), String(Math.round((trackedToday[today] || 0) / 60)));
    const top = $("#topApps");
    if (top) {
      const entries = Object.entries(res.trackedByApp || {})
        .filter(([k]) => k.startsWith(today + ":"))
        .map(([k,v]) => [k.split(":")[1], v])
        .sort((a,b) => b[1]-a[1]).slice(0,5);
      const html = !entries.length
        ? `<div class="muted small" style="padding:6px">${__aura_t(lang,"noApps")}</div>`
        : (() => {
            const max = entries[0][1];
            return entries.map(([id,sec]) => {
              const name = (PLATFORMS.find(p=>p[0]===id)||[id,id])[1];
              const pct = Math.max(8, Math.round(sec/max*100));
              return `<div class="ta-row"><span>${name}</span><span class="ta-bar"><span style="width:${pct}%"></span></span><span class="muted small">${Math.round(sec/60)}m</span></div>`;
            }).join("");
          })();
      if (top.dataset.html !== html) { top.innerHTML = html; top.dataset.html = html; }
    }
  });
}

async function send(data, reconnect = false) {
  return new Promise(r => chrome.runtime.sendMessage({ type: "config:save", data, reconnect }, r));
}

async function loadLogs() {
  chrome.runtime.sendMessage({ type: "logs:get" }, (res) => {
    const list = $("#logList");
    if (!res?.logs?.length) { list.innerHTML = `<div class="muted small" style="padding:14px;text-align:center">${t(lang,"noLogs")}</div>`; return; }
    list.innerHTML = res.logs.map(l => {
      const time = new Date(l.t).toLocaleTimeString();
      return `<div class="log log-${l.level}"><span class="log-time">${time}</span><span class="log-msg">${l.message}</span></div>`;
    }).join("");
  });
}

function updatePreview() {
  const name = ($("#customText")?.value || "").trim() || "—";
  const state = ($("#customState")?.value || "").trim();
  const img = ($("#customImg")?.value || "").trim();
  const type = $("#customType")?.value || "0";
  const labels = { "0": t(lang,"typePlaying"), "2": t(lang,"typeListening"), "3": t(lang,"typeWatching"), "5": t(lang,"typeCompeting") };
  setText($("#previewType"), labels[type] || "");
  setText($("#previewName"), name);
  setText($("#previewState"), state);
  const pi = $("#previewImg");
  if (img) { pi.src = img; pi.style.display = "block"; }
  else { pi.style.display = "none"; }
}

["customText","customState","customImg","customType"].forEach(id => {
  document.getElementById(id)?.addEventListener("input", updatePreview);
  document.getElementById(id)?.addEventListener("change", updatePreview);
});

$("#lang").addEventListener("change", async () => {
  lang = $("#lang").value;
  await send({ lang });
  applyLang();
  refreshStatus();
});

$("#save").addEventListener("click", async () => {
  const token = $("#token").value.trim();
  const appId = $("#appId").value.trim();
  if (!token) return alert(t(lang, "enterToken"));
  $("#save").disabled = true; $("#save").textContent = t(lang, "loggingIn");
  const status = $("#loginStatus");
  status.className = "login-status info"; status.classList.remove("hidden");
  status.textContent = t(lang, "validating");
  chrome.runtime.sendMessage({ type: "auth:test", token }, async (res) => {
    if (!res?.ok) {
      status.className = "login-status err";
      status.textContent = t(lang, "loginFailed") + (res?.status ? ` (${res.status})` : "");
      $("#save").disabled = false; $("#save").textContent = t(lang, "loginConnect");
      return;
    }
    status.className = "login-status ok";
    status.textContent = `✓ ${t(lang, "loggedAs")} ${res.user.username}`;
    await send({ token, appId }, true);
    setTimeout(() => {
      $("#save").disabled = false;
      $("#save").textContent = t(lang, "loginConnect");
      refreshStatus();
    }, 800);
  });
});

$("#statusSel").addEventListener("change", () => send({ status: $("#statusSel").value }));
$("#enabled").addEventListener("change", () => send({ enabled: $("#enabled").checked }, true));
$("#idleAway").addEventListener("change", () => send({ idleAway: $("#idleAway").checked }));
$("#skipIncognito").addEventListener("change", () => send({ skipIncognito: $("#skipIncognito").checked }));
$("#showButtons")?.addEventListener("change", () => send({ showButtons: $("#showButtons").checked }));
$("#showThumbnails")?.addEventListener("change", () => send({ showThumbnails: $("#showThumbnails").checked }));
$("#notifyOnConnect")?.addEventListener("change", () => send({ notifyOnConnect: $("#notifyOnConnect").checked }));

$("#saveCustom").addEventListener("click", () =>
  send({
    customText: $("#customText").value.trim(),
    customState: $("#customState")?.value.trim() || "",
    customImg: $("#customImg")?.value.trim() || "",
    customType: $("#customType").value
  }, true));
$("#clearCustom").addEventListener("click", async () => {
  $("#customText").value = ""; if ($("#customState")) $("#customState").value = "";
  if ($("#customImg")) $("#customImg").value = "";
  await send({ customText: "", customState: "", customImg: "" }, true);
  updatePreview();
});

$("#clear").addEventListener("click", () => chrome.runtime.sendMessage({ type: "presence:clear" }, refreshStatus));
$("#disconnectBtn").addEventListener("click", () => chrome.runtime.sendMessage({ type: "disconnect" }, () => { refreshStatus(); load(); }));

$("#appSearch").addEventListener("input", renderPlatforms);
$("#enableAll")?.addEventListener("click", () => { cachedDisabled = new Set(); renderPlatforms(); send({ disabledPlatforms: [] }); });
$("#disableAll")?.addEventListener("click", () => {
  cachedDisabled = new Set(PLATFORMS.map(p => p[0]));
  renderPlatforms();
  send({ disabledPlatforms: [...cachedDisabled] });
});
$("#refreshLogs").addEventListener("click", loadLogs);
$("#clearLogs").addEventListener("click", () => chrome.runtime.sendMessage({ type: "logs:clear" }, loadLogs));

function savePlatforms() {
  const disabled = [...$$("#platformList input")].filter(i => !i.checked).map(i => i.dataset.pid);
  cachedDisabled = new Set(disabled);
  send({ disabledPlatforms: disabled });
}

$("#exportBtn").addEventListener("click", async () => {
  const cfg = await chrome.storage.local.get(null);
  delete cfg.token;
  const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "aura-config.json";
  a.click();
});
$("#importBtn").addEventListener("click", () => $("#importFile").click());
$("#importFile").addEventListener("change", async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    await send(data);
    alert(t(lang, "imported"));
    load();
  } catch { alert(t(lang, "invalidFile")); }
});

$("#resetBtn")?.addEventListener("click", async () => {
  if (!confirm(t(lang, "resetConfirm"))) return;
  await new Promise(r => chrome.storage.local.clear(r));
  chrome.runtime.sendMessage({ type: "disconnect" }, () => load());
});

function openPage(url) { chrome.tabs.create({ url: chrome.runtime.getURL(url) }); }
$("#seeUpdate")?.addEventListener("click", async () => {
  await chrome.storage.local.set({ lastSeenVersion: chrome.runtime.getManifest().version });
  openPage("whatsnew.html");
});
$("#openWhatsNew")?.addEventListener("click", () => openPage("whatsnew.html"));
$("#openWelcome")?.addEventListener("click", () => openPage("welcome.html"));

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "log:new" && $("[data-pane='logs']").classList.contains("active")) loadLogs();
  if (msg.type === "auth:ok" || msg.type === "auth:failed") refreshStatus();
});

load();
setInterval(refreshStatus, 3000);
