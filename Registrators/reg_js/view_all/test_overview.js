const mainbtn = document.getElementById("mainBtn");
const appointments = document.getElementById('appointments');
const referral_code = document.getElementById('referral_code');
const applicats = document.getElementById('applicats');
const reports = document.getElementById('reports');
const helpAndSupport = document.getElementById('help&support');
const settings = document.getElementById('settings');

const modal    = document.getElementById('testModal');
const form     = document.getElementById('testForm');
const testList = document.getElementById('testList');


appointments.classList.add('active');

function setActive(button) {
    const buttons = document.querySelectorAll('.side-bar .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

appointments.addEventListener("click", appointmentsPlace);
mainbtn.addEventListener("click", mainbtnPlace);
referral_code.addEventListener("click", referralCodePlace);
applicats.addEventListener("click", applicatsPlace);
reports.addEventListener("click", reportsPlace);
helpAndSupport.addEventListener("click", helpAndSupportPlace);
settings.addEventListener("click", settingsPlace);


function mainbtnPlace() {
    window.location.href = "/Registrators/reg_html/admin_dashboard.html";
}
function appointmentsPlace() {
    window.location.href = "/Registrators/reg_html/admin_appointments.html";
}
function referralCodePlace() {
    window.location.href = "/Registrators/reg_html/admin_referral_code.html";
}
function applicatsPlace() {
    window.location.href = "/Registrators/reg_html/admin_applicants.html";
}
function reportsPlace() {
    window.location.href = "/Registrators/reg_html/admin_reports.html";
}
function helpAndSupportPlace() {
    window.location.href = "/Registrators/reg_html/admin_help&support.html"
}
function settingsPlace() {
    window.location.href = "/Registrators/reg_html/admin_settings.html";
}




// ===== TESTS =====
let tests = JSON.parse(localStorage.getItem('tests')) || [];
let editIndex = null;

const modalTitle    = document.getElementById('modalTitle');
const submitBtn     = document.getElementById('submitBtn');
const adviserSelect = document.getElementById('testAdviser');
const otherWrap     = document.getElementById('otherWrap');
const otherInput    = document.getElementById('testAdviserOther');

// 3-dots menu + delete flow
const modalMenu        = document.getElementById('modalMenu');
const menuDots         = document.getElementById('menuDots');
const deleteTestBtn    = document.getElementById('deleteTest');
const deleteModal      = document.getElementById('deleteModal');
const cancelDeleteBtn  = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const deleteTestNameEl = document.getElementById('deleteTestName');

function escapeHTML(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function saveTests() {
    localStorage.setItem('tests', JSON.stringify(tests));
}

// ----- Render the list -----
function renderTests() {
    testList.innerHTML = '';

    tests.forEach((t, i) => {
        const isFull = t.takers >= t.slots;
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `
            <p>${escapeHTML(t.name)}</p>
            <p>${t.slots}</p>
            <p>${t.takers}</p>
            <p><span class="status ${isFull ? 'full' : ''}">${isFull ? 'Full' : 'Open'}</span></p>
            <button class="edit-btn" type="button"><i class="ri-edit-line"></i></button>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => openModal(i));
        testList.appendChild(row);
    });
}

// ----- Red star: hide when the field is filled -----
function updateStars() {
    form.querySelectorAll('.field').forEach(field => {
        const control = field.querySelector('input, select');
        field.classList.toggle('filled', control.value.trim() !== '');
    });
}

// ----- "Others" adviser -----
function toggleOther() {
    const isOther = adviserSelect.value === 'Others';
    otherWrap.hidden = !isOther;
    otherInput.required = isOther;
    if (!isOther) otherInput.value = '';
}

adviserSelect.addEventListener('change', () => {
    toggleOther();
    updateStars();
});
form.addEventListener('input', updateStars);
form.addEventListener('change', updateStars);

// ----- 3-dots menu toggle -----
menuDots.addEventListener('click', (e) => {
    e.stopPropagation();               // don't trigger the outside-click close
    modalMenu.classList.toggle('open');
});

// close menu when clicking anywhere outside
document.addEventListener('click', (e) => {
    if (!modalMenu.contains(e.target)) {
        modalMenu.classList.remove('open');
    }
});

// close menu when pressing Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalMenu.classList.remove('open');
        deleteModal.classList.remove('open');
    }
});

// ----- Open the modal (create or edit) -----
function openModal(index = null) {
    editIndex = index;
    form.reset();
    modalMenu.classList.remove('open');   // always close menu on open

    if (index === null) {
        modalTitle.textContent = 'Add New Test';
        submitBtn.textContent  = 'Create test';
        modalMenu.hidden       = true;    // hide 3-dots when creating
        toggleOther();
    } else {
        const t = tests[index];
        modalTitle.textContent = 'Edit Test';
        submitBtn.textContent  = 'Save changes';
        modalMenu.hidden       = false;   // show 3-dots when editing

        document.getElementById('testName').value     = t.name;
        document.getElementById('testLocation').value = t.location || '';
        document.getElementById('testDate').value     = t.date || '';
        document.getElementById('testTime').value     = t.time || '';
        document.getElementById('testSlots').value    = t.slots;

        const known = [...adviserSelect.options].some(o => o.value === t.adviser);
        adviserSelect.value = known ? t.adviser : 'Others';
        toggleOther();
        if (!known) otherInput.value = t.adviser || '';
    }

    updateStars();
    modal.classList.add('open');
}

function closeModal() {
    form.reset();
    toggleOther();
    updateStars();
    editIndex = null;
    modalMenu.hidden = true;
    modalMenu.classList.remove('open');
    modal.classList.remove('open');
}

document.getElementById('newTest').addEventListener('click', () => openModal());
document.getElementById('cancelTest').addEventListener('click', closeModal);

// click the dark background of the main modal to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// ----- Save (create or edit) -----
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const adviser = adviserSelect.value === 'Others'
        ? otherInput.value.trim()
        : adviserSelect.value;

    const data = {
        name:     document.getElementById('testName').value.trim(),
        location: document.getElementById('testLocation').value.trim(),
        date:     document.getElementById('testDate').value,
        time:     document.getElementById('testTime').value,
        adviser:  adviser,
        slots:    Number(document.getElementById('testSlots').value)
    };

    if (editIndex === null) {
        tests.unshift({ ...data, takers: 0 });
    } else {
        tests[editIndex] = { ...tests[editIndex], ...data };
    }

    saveTests();
    renderTests();
    closeModal();
});

// ===== DELETE FLOW =====

// open confirmation popup from the 3-dots menu
deleteTestBtn.addEventListener('click', () => {
    if (editIndex === null) return;
    modalMenu.classList.remove('open');              // close dropdown
    deleteTestNameEl.textContent = tests[editIndex].name;
    deleteModal.classList.add('open');
});

cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.classList.remove('open');
});

deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) deleteModal.classList.remove('open');
});

confirmDeleteBtn.addEventListener('click', () => {
    if (editIndex === null) return;

    tests.splice(editIndex, 1);
    saveTests();
    renderTests();

    deleteModal.classList.remove('open');
    closeModal();
});

renderTests();