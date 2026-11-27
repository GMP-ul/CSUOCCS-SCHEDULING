/* =====================================================
   NAVIGATION (your original code)
   ===================================================== */
const mainbtn = document.getElementById("mainBtn");
const appointments = document.getElementById('appointments');
const referral_code = document.getElementById('referral_code');
const applicats = document.getElementById('applicats');
const reports = document.getElementById('reports');
const helpAndSupport = document.getElementById('help&support');
const settings = document.getElementById('settings');

referral_code.classList.add('active');

function setActive(button) {
    const buttons = document.querySelectorAll('.side-bar .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

appointments.addEventListener("click", () => window.location.href = "admin_appointments.html");
mainbtn.addEventListener("click", () => window.location.href = "admin_dashboard.html");
referral_code.addEventListener("click", () => window.location.href = "admin_referral_code.html");
applicats.addEventListener("click", () => window.location.href = "admin_applicants.html");
reports.addEventListener("click", () => window.location.href = "admin_reports.html");
helpAndSupport.addEventListener("click", () => window.location.href = "admin_help&support.html");
settings.addEventListener("click", () => window.location.href = "admin_settings.html");


/* =====================================================
   REFERRAL CODES
   ===================================================== */
const ISSUED_BY = "Ms. Santos";          // change to the logged-in admin later
const STORAGE_KEY = "occs_referral_codes";
const MAX_NUMBER = 9999;                 // OCCS-REF-0001 ... OCCS-REF-9999

let codes = loadCodes();
let currentFilter = "all";
let searchText = "";
let chipNames = [];
let activeNum = null;                    // code currently open in the details popup

const $ = id => document.getElementById(id);

/* ---------- storage ---------- */
function loadCodes() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(saved)) return saved;
    } catch (e) { /* ignore */ }
    // first time: start with your sample row
    return [{
        num: 1,
        usedBy: "Genrey M. Plaza",
        dateIssued: "Aug 20,2026",
        dateUsed: "Aug 20,2026",
        issuedBy: "Ms. Santos"
    }];
}
function saveCodes() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(codes)); } catch (e) { /* ignore */ }
}

/* ---------- helpers ---------- */
function formatCode(num) {
    return "OCCS-REF-" + String(num).padStart(4, "0");
}
function formatDate(d) {
    const m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${m[d.getMonth()]} ${d.getDate()},${d.getFullYear()}`;   // same style as "Aug 20,2026"
}
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
}
function isUsed(c) { return !!c.usedBy; }

/* Random number that has never been used by another code */
function randomUniqueNumber(taken) {
    if (taken.size >= MAX_NUMBER) return null;
    let n;
    do {
        n = 1 + Math.floor(Math.random() * MAX_NUMBER);
    } while (taken.has(n));
    taken.add(n);
    return n;
}

/* ---------- render ---------- */
function render() {
    // stats
    const total = codes.length;
    const used = codes.filter(isUsed).length;
    const unused = total - used;
    $("statTotal").textContent = total;
    $("statUnused").textContent = unused;
    $("statUsed").textContent = used;
    $("statRate").textContent = (total ? Math.round(used / total * 100) : 0) + "%";
    $("fAll").textContent = "All " + total;
    $("fUnused").textContent = "Unused " + unused;
    $("fUsed").textContent = "Used " + used;

    document.querySelectorAll(".filter-1 button").forEach(b => {
        b.classList.toggle("active-filter", b.dataset.filter === currentFilter);
    });

    // rows
    const q = searchText.trim().toLowerCase();
    const list = codes
        .filter(c => currentFilter === "all" || (currentFilter === "used") === isUsed(c))
        .filter(c => !q || formatCode(c.num).toLowerCase().includes(q) || (c.usedBy || "").toLowerCase().includes(q))
        .sort((a, b) => b.num - a.num ? 0 : 0); // keep insertion order (newest first below)

    const rows = list.slice().reverse(); // newest added on top
    $("dataList").innerHTML = rows.length
        ? rows.map(rowHtml).join("")
        : '<div class="empty-row">No codes found.</div>';
}

function rowHtml(c) {
    const used = isUsed(c);
    return `
    <div class="data-info">
        <div class="info-name-1" style="grid-area: info-1;">${formatCode(c.num)}</div>
        <div class="info-name-2 ${used ? "" : "unused"}" style="grid-area: info-2;">${used ? "Used" : "Unused"}</div>
        <div class="info-name-3" style="grid-area: info-3;" title="${escapeHtml(c.usedBy || "")}">${used ? escapeHtml(c.usedBy) : "—"}</div>
        <div style="grid-area: info-4;">${escapeHtml(c.dateIssued)}</div>
        <div style="grid-area: info-5;">${used ? escapeHtml(c.dateUsed) : "—"}</div>
        <div style="grid-area: info-6;">${escapeHtml(c.issuedBy)}</div>
        <div class="fuction" style="grid-area: info-7;">
            <i class="ri-bring-forward" data-num="${c.num}" title="View details"></i>
            <i class="ri-more-2-fill" data-num="${c.num}" title="Edit"></i>
        </div>
    </div>`;
}

/* ---------- popups open / close ---------- */
function openModal(id) { $(id).classList.add("open"); }
function closeModal(id) {
    $(id).classList.remove("open");
    if (id === "detailModal") { $("menuList").classList.remove("open"); exitEditMode(); activeNum = null; }
}
document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
});
document.querySelectorAll(".modal-overlay").forEach(ov => {
    ov.addEventListener("mousedown", e => { if (e.target === ov) closeModal(ov.id); });
});
document.addEventListener("keydown", e => {
    if (e.key === "Escape") document.querySelectorAll(".modal-overlay.open").forEach(ov => closeModal(ov.id));
});

/* ---------- ADD CODE ---------- */
$("addCodeBtn").addEventListener("click", () => {
    chipNames = [];
    $("nameInput").value = "";
    $("qtyInput").value = 1;
    $("addError").textContent = "";
    renderChips();
    openModal("addModal");
    $("nameInput").focus();
});

function renderChips() {
    $("chipBox").querySelectorAll(".chip").forEach(c => c.remove());
    const input = $("nameInput");
    chipNames.forEach((name, i) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.append(name + " ");
        const x = document.createElement("i");
        x.className = "ri-close-line";
        x.addEventListener("click", () => { chipNames.splice(i, 1); renderChips(); });
        chip.appendChild(x);
        $("chipBox").insertBefore(chip, input);
    });
    $("qtyRow").classList.toggle("disabled", chipNames.length > 0);
}

/* take whatever is typed in the box and turn it into chips (supports comma / new line / paste) */
function flushNameInput() {
    const parts = $("nameInput").value.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length) { chipNames.push(...parts); }
    $("nameInput").value = "";
    renderChips();
}
$("nameInput").addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); flushNameInput(); }
    else if (e.key === "Backspace" && !$("nameInput").value && chipNames.length) {
        chipNames.pop(); renderChips();
    }
});
$("nameInput").addEventListener("paste", () => setTimeout(flushNameInput, 0));
$("chipBox").addEventListener("click", () => $("nameInput").focus());

$("confirmAdd").addEventListener("click", () => {
    flushNameInput();

    let entries;   // one entry per code to create
    if (chipNames.length) {
        entries = chipNames.slice();
    } else {
        const qty = parseInt($("qtyInput").value, 10);
        if (!qty || qty < 1 || qty > 100) {
            $("addError").textContent = "Enter at least one name, or a number of blank codes from 1 to 100.";
            return;
        }
        entries = Array(qty).fill("");
    }

    const taken = new Set(codes.map(c => c.num));
    if (taken.size + entries.length > MAX_NUMBER) {
        $("addError").textContent = "Not enough unique codes left.";
        return;
    }

    const today = formatDate(new Date());
    entries.forEach(name => {
        const num = randomUniqueNumber(taken);
        codes.push({
            num,
            usedBy: name,
            dateIssued: today,
            dateUsed: name ? today : "",
            issuedBy: ISSUED_BY
        });
    });

    saveCodes();
    render();
    closeModal("addModal");
});

/* ---------- FILTER + SEARCH ---------- */
document.querySelectorAll(".filter-1 button").forEach(btn => {
    btn.addEventListener("click", () => { currentFilter = btn.dataset.filter; render(); });
});
$("codeSearch").addEventListener("input", e => { searchText = e.target.value; render(); });

/* ---------- DETAILS POPUP ---------- */
$("dataList").addEventListener("click", e => {
    const view = e.target.closest(".ri-bring-forward");
    const edit = e.target.closest(".ri-more-2-fill");
    if (view) openDetails(Number(view.dataset.num));
    else if (edit) openDetails(Number(edit.dataset.num), true);   // opens straight into edit mode
});

function openDetails(num, startEditing = false) {
    activeNum = num;
    fillDetails();
    openModal("detailModal");
    if (startEditing) $("editBtn").click();
}

function fillDetails() {
    const c = codes.find(x => x.num === activeNum);
    if (!c) return;
    const used = isUsed(c);
    $("dCode").textContent = formatCode(c.num);
    $("dStatus").textContent = used ? "Used" : "Unused";
    $("dStatus").className = used ? "used" : "unused";
    $("dUsedBy").textContent = used ? c.usedBy : "—";
    $("dIssued").textContent = c.dateIssued;
    $("dUsedDate").textContent = used ? c.dateUsed : "—";
    $("dIssuedBy").textContent = c.issuedBy;
}

/* 3-dot menu */
$("menuBtn").addEventListener("click", e => {
    e.stopPropagation();
    $("menuList").classList.toggle("open");
});
document.addEventListener("click", () => $("menuList").classList.remove("open"));

/* EDIT (only "Used by") */
$("editBtn").addEventListener("click", () => {
    const c = codes.find(x => x.num === activeNum);
    $("menuList").classList.remove("open");
    $("dUsedByInput").value = c.usedBy || "";
    document.querySelector(".detail-grid").classList.add("editing");
    $("editActions").classList.add("show");
    $("dUsedByInput").focus();
});
function exitEditMode() {
    document.querySelector(".detail-grid").classList.remove("editing");
    $("editActions").classList.remove("show");
}
$("cancelEdit").addEventListener("click", exitEditMode);
$("saveEdit").addEventListener("click", () => {
    const c = codes.find(x => x.num === activeNum);
    const name = $("dUsedByInput").value.trim();
    if (name && !c.usedBy) c.dateUsed = formatDate(new Date());   // became used just now
    if (!name) c.dateUsed = "";                                     // cleared -> unused again
    c.usedBy = name;
    saveCodes();
    exitEditMode();
    fillDetails();
    render();
});

/* DELETE (with confirmation popup) */
$("deleteBtn").addEventListener("click", () => {
    $("menuList").classList.remove("open");
    $("delCodeName").textContent = formatCode(activeNum);
    openModal("deleteModal");
});
$("confirmDelete").addEventListener("click", () => {
    codes = codes.filter(c => c.num !== activeNum);
    saveCodes();
    render();
    closeModal("deleteModal");
    closeModal("detailModal");
});

/* ---------- start ---------- */
render();