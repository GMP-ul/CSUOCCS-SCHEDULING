const mainbtn = document.getElementById("mainBtn");
const appointments = document.getElementById('appointments');
const referral_code = document.getElementById('referral_code');
const applicats = document.getElementById('applicats');
const reports = document.getElementById('reports');
const helpAndSupport = document.getElementById('help&support');
const settings = document.getElementById('settings');


settings.classList.add('active');

function setActive(button) {
    const buttons = document.querySelectorAll('.side-bar .btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

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
    window.location.href = "admin_dashboard.html";
}

function appointmentsPlace() {
    window.location.href = "admin_appointments.html";
}

function referralCodePlace() {
    window.location.href = "admin_referral_code.html";
}

function applicatsPlace() {
    window.location.href = "admin_applicants.html";
}

function reportsPlace() {
    window.location.href = "admin_reports.html";
}

function helpAndSupportPlace() {
    window.location.href = "admin_help&support.html"
}

function settingsPlace() {
    window.location.href = "admin_settings.html";
}