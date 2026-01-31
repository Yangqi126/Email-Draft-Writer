const el = (id) => document.getElementById(id);

const purposeEl = el("purpose");
const audienceEl = el("audience");
const toneEl = el("tone");
const lengthEl = el("length");
const contextEl = el("context");
const includeSubjectEl = el("includeSubject");

const generateBtn = el("generateBtn");
const regenBtn = el("regenBtn");
const clearBtn = el("clearBtn");

const statusEl = el("status");
const resultEl = el("result");
const copyBtn = el("copyBtn");
const downloadBtn = el("downloadBtn");

const apiBaseEl = el("apiBase");
const saveSettingsBtn = el("saveSettingsBtn");

let lastPayload = null;

function setStatus(msg, type = "info") {
  statusEl.textContent = msg || "";
  statusEl.dataset.type = type;
}

function getApiBase() {
  return localStorage.getItem("EMAIL_WRITER_API_BASE") || window.location.origin;
}

function setApiBase(url) {
  localStorage.setItem("EMAIL_WRITER_API_BASE", url);
}

function validateInputs() {
  if (!purposeEl.value.trim()) return "Please enter a purpose.";
  if (!contextEl.value.trim()) return "Please add some key details/context.";
  const base = getApiBase();
  if (!base) return "Please set your Backend URL in Settings.";
  return null;
}

function buildPayload() {
  return {
    purpose: purposeEl.value.trim(),
    audience: audienceEl.value,
    tone: toneEl.value,
    length: lengthEl.value,
    includeSubject: includeSubjectEl.checked,
    context: contextEl.value.trim(),
  };
}

async function callGenerate(payload) {
  const base = getApiBase().replace(/\/$/, "");
  const url = `${base}/api/generate`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

async function generate(isRegen = false) {
  const err = validateInputs();
  if (err) {
    setStatus(err, "error");
    return;
  }

  const payload = buildPayload();
  lastPayload = payload;

  generateBtn.disabled = true;
  regenBtn.disabled = true;
  copyBtn.disabled = true;
  downloadBtn.disabled = true;

  setStatus(isRegen ? "Regenerating..." : "Generating...");
  resultEl.value = "";

  try {
    const data = await callGenerate(payload);
    resultEl.value = data?.text || "";
    setStatus("Done. You can copy, download, or regenerate.");

    regenBtn.disabled = false;
    copyBtn.disabled = !resultEl.value;
    downloadBtn.disabled = !resultEl.value;
  } catch (e) {
    setStatus(e.message || "Something went wrong.", "error");
  } finally {
    generateBtn.disabled = false;
  }
}

function clearAll() {
  purposeEl.value = "";
  contextEl.value = "";
  resultEl.value = "";
  setStatus("");
  regenBtn.disabled = true;
  copyBtn.disabled = true;
  downloadBtn.disabled = true;
  lastPayload = null;
}

async function copyResult() {
  try {
    await navigator.clipboard.writeText(resultEl.value);
    setStatus("Copied to clipboard ✅");
  } catch {
    setStatus("Copy failed. Please copy manually.", "error");
  }
}

function downloadTxt() {
  const blob = new Blob([resultEl.value], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "email-draft.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function initSettings() {
  apiBaseEl.value = getApiBase();
  saveSettingsBtn.addEventListener("click", () => {
    const v = (apiBaseEl.value || "").trim();
    setApiBase(v);
    setStatus(v ? "Saved settings ✅" : "Backend URL cleared.", "info");
  });
}

generateBtn.addEventListener("click", () => generate(false));
regenBtn.addEventListener("click", () => generate(true));
clearBtn.addEventListener("click", clearAll);
copyBtn.addEventListener("click", copyResult);
downloadBtn.addEventListener("click", downloadTxt);

initSettings();
setStatus("Set Backend URL in Settings, then generate.");


// --- PRO UI enhancements ---
const emptyState = document.getElementById("emptyState");
const advancedPanel = document.getElementById("advancedPanel");
const openAdvancedBtn = document.getElementById("openAdvancedBtn");

function toggleEmpty() {
  const hasText = (resultEl.value || "").trim().length > 0;
  if (emptyState) emptyState.style.display = hasText ? "none" : "grid";
  // Keep textarea visible always; just show empty overlay when no text.
}
toggleEmpty();

const originalGenerate = generate;
generate = async function(isRegen = false){
  await originalGenerate(isRegen);
  toggleEmpty();
};

const originalClearAll = clearAll;
clearAll = function(){
  originalClearAll();
  toggleEmpty();
};

if (openAdvancedBtn && advancedPanel){
  openAdvancedBtn.addEventListener("click", () => {
    advancedPanel.open = true;
    advancedPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// Quick prompt presets
const presets = {
  meeting: {
    purpose: "Request a meeting",
    tone: "friendly",
    context: "Who you are / why you’re reaching out. Propose 2 time windows. Ask what works best for them."
  },
  extension: {
    purpose: "Ask for an extension",
    tone: "formal",
    context: "State the reason briefly. Request a specific new deadline. Confirm you will submit by then and appreciate their consideration."
  },
  followup: {
    purpose: "Follow up on a previous message",
    tone: "concise",
    context: "Reference the previous email. Ask for an update politely. Offer to provide more info if needed."
  }
};

document.querySelectorAll(".quick-card").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-preset");
    const p = presets[key];
    if (!p) return;
    purposeEl.value = p.purpose;
    toneEl.value = p.tone;
    contextEl.value = p.context;
    setStatus("Preset applied. Edit details, then click Generate.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
