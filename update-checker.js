/* ================================
   SIMPLE UPDATE CHECKER SYSTEM
   For Al Ikhlas App
================================= */

/* ====== CONFIGURATION ====== */
const APP_ID = "al_ikhlas";
const CURRENT_VERSION = "1.2.0";   // আপনার বর্তমান অ্যাপ ভার্সন

/* ====== UPDATE SETTINGS FILE URL ======
   এখানে আপনার update config.json ফাইলের লিংক দিন
   Example:
   https://raw.githubusercontent.com/username/repo/main/update-config.json
========================================= */

const UPDATE_CONFIG_URL = "https://raw.githubusercontent.com/abunaem1219-boop/alikhlas/refs/heads/main/update-config.json";


/* ====== CREATE POPUP UI ====== */
function createUpdatePopup(data) {

    const overlay = document.createElement("div");
    overlay.id = "update-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    overlay.style.backdropFilter = "blur(4px)";

    const box = document.createElement("div");
    box.style.background = "#ffffff";
    box.style.padding = "25px";
    box.style.borderRadius = "18px";
    box.style.maxWidth = "90%";
    box.style.width = "350px";
    box.style.textAlign = "center";
    box.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
    box.style.fontFamily = "Poppins, sans-serif";

    box.innerHTML = `
        <h3 style="margin-bottom:10px;">New Update Available 🚀</h3>
        <p style="font-size:14px; margin-bottom:20px;">
            ${data.message || "A new version is available. Please update your app."}
        </p>
        <button id="update-now-btn"
            style="background:#1b5e20;color:white;border:none;padding:12px 20px;
            border-radius:12px;width:100%;font-weight:600;cursor:pointer;">
            Update Now
        </button>
        ${data.force ? "" : `
        <button id="skip-btn"
            style="margin-top:10px;background:transparent;border:1px solid #1b5e20;
            color:#1b5e20;padding:10px 20px;border-radius:12px;width:100%;cursor:pointer;">
            Skip
        </button>`}
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById("update-now-btn").onclick = function () {
        window.location.href = data.update_url;
    };

    if (!data.force) {
        document.getElementById("skip-btn").onclick = function () {
            document.body.removeChild(overlay);
        };
    }
}


/* ====== VERSION COMPARE FUNCTION ====== */
function isNewerVersion(latest, current) {
    const l = latest.split('.').map(Number);
    const c = current.split('.').map(Number);

    for (let i = 0; i < l.length; i++) {
        if ((l[i] || 0) > (c[i] || 0)) return true;
        if ((l[i] || 0) < (c[i] || 0)) return false;
    }
    return false;
}


/* ====== CHECK FOR UPDATE ====== */
async function checkForUpdate() {

    if (!UPDATE_CONFIG_URL || UPDATE_CONFIG_URL === "PASTE_YOUR_UPDATE_CONFIG_LINK_HERE") {
        console.warn("Update config URL not set.");
        return;
    }

    try {
        const response = await fetch(UPDATE_CONFIG_URL + "?t=" + Date.now());
        const config = await response.json();

        if (!config[APP_ID]) return;

        const appData = config[APP_ID];

        if (isNewerVersion(appData.version, CURRENT_VERSION)) {
            createUpdatePopup(appData);
        }

    } catch (error) {
        console.error("Update check failed:", error);
    }
}


/* ====== RUN AFTER PAGE LOAD ====== */
window.addEventListener("load", function () {
    setTimeout(checkForUpdate, 1500);
});