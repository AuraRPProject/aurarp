const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const { t } = window.__I18N__;

const PLATFORMS = [
  ["youtube","YouTube"],["netflix","Netflix"],["spotify","Spotify"],["twitch","Twitch"],
  ["github","GitHub"],["x","X"],["reddit","Reddit"],["soundcloud","SoundCloud"],
  ["primevideo","Prime Video"],["disneyplus","Disney+"],["hbomax","Max"],
  ["crunchyroll","Crunchyroll"],["stackoverflow","Stack Overflow"],
  ["wikipedia","Wikipedia"],["vscode","VS Code Web"],
  ["applemusic","Apple Music"],["tidal","Tidal"],["deezer","Deezer"],
  ["vimeo","Vimeo"],["linkedin","LinkedIn"],["medium","Medium"],
  ["notion","Notion"],["figma","Figma"],["chatgpt","ChatGPT"],
  ["gmail","Gmail"],["pinterest","Pinterest"],["tiktok","TikTok"],
];

let lang = "en";

function applyLang() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(el => { el.textContent = t(lang, el.dataset.i18n); });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(lang, el.dataset.i18nPh); });
  // re-render platform list keep filter
  renderPlatforms();
}

$$(".tabs button").forEach(b => b.addEventListener("click", () => {
  $$(".tabs button").forEach(x => x.classList.remove("active"));
  $$(".pane").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  $(`[data-pane="${b.dataset.tab}"]`).classList.add("active");
}));

let cachedDisabled = new Set();

function renderPlatforms() {
  const filter = ($("#appSearch")?.value || "").toLowerCase();
  $("#platformList").innerHTML = PLATFORMS
    .filter(([_, n]) => n.toLowerCase().includes(filter))
    .map(([id, name]) => `
      <label class="platform">
        <span>${name}</span>
        <input type="checkbox" data-pid="${id}" ${cachedDisabled.has(id) ? "" : "checked"} />
      </label>
    `).join("");
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
  $("#idleAway").checked = cfg.idleAway !== false;
  $("#skipIncognito").checked = cfg.skipIncognito !== false;
  $("#enabled").checked = cfg.enabled !== false;
  cachedDisabled = new Set(cfg.disabledPlatforms || []);

  applyLang();
  refreshStatus();
}

function refreshStatus() {
  chrome.runtime.sendMessage({ type: "status:get" }, async (res) => {
    if (chrome.runtime.lastError || !res) return;
    const pill = $("#statusPill");
    pill.textContent = t(lang, res.connected ? "connected" : "offline");
    pill.className = "pill " + (res.connected ? "on" : "off");
    const a = res.activity;
    $("#actName").textContent = a ? a.name : "—";
    $("#actDetails").textContent = a?.details || "";
    $("#actState").textContent = a?.state || "";
    const { trackedToday = {} } = await chrome.storage.local.get("trackedToday");
    const today = new Date().toISOString().slice(0,10);
    $("#todayMin").textContent = Math.round((trackedToday[today] || 0) / 60);
  });
}

async function send(data, reconnect = false) {
  return new Promise(r => chrome.runtime.sendMessage({ type: "config:save", data, reconnect }, r));
}

$("#lang").addEventListener("change", async () => {
  lang = $("#lang").value;
  await send({ lang });
  applyLang();
  refreshStatus();
});

$("#save").addEventListener("click", async () => {
  const data = { token: $("#token").value.trim(), appId: $("#appId").value.trim() };
  if (!data.token) return alert(t(lang, "enterToken"));
  $("#save").disabled = true; $("#save").textContent = t(lang, "connecting");
  await send(data, true);
  setTimeout(() => { $("#save").disabled = false; $("#save").textContent = t(lang, "saveConnect"); refreshStatus(); }, 800);
});

$("#statusSel").addEventListener("change", () => send({ status: $("#statusSel").value }));
$("#enabled").addEventListener("change", () => send({ enabled: $("#enabled").checked }, true));
$("#idleAway").addEventListener("change", () => send({ idleAway: $("#idleAway").checked }));
$("#skipIncognito").addEventListener("change", () => send({ skipIncognito: $("#skipIncognito").checked }));

$("#saveCustom").addEventListener("click", () =>
  send({ customText: $("#customText").value.trim(), customType: $("#customType").value }));
$("#clearCustom").addEventListener("click", async () => { $("#customText").value = ""; await send({ customText: "" }); });

$("#clear").addEventListener("click", () => chrome.runtime.sendMessage({ type: "presence:clear" }, refreshStatus));
$("#disconnectBtn").addEventListener("click", () => chrome.runtime.sendMessage({ type: "disconnect" }, refreshStatus));

$("#appSearch").addEventListener("input", renderPlatforms);

function savePlatforms() {
  const disabled = [...$$("#platformList input")].filter(i => !i.checked).map(i => i.dataset.pid);
  cachedDisabled = new Set(disabled);
  send({ disabledPlatforms: disabled });
}

$("#exportBtn").addEventListener("click", async () => {
  const cfg = await chrome.storage.local.get(null);
  delete cfg.token; // never export token
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

load();
setInterval(refreshStatus, 3000);
