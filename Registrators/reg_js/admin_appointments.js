// ===== SIDEBAR NAVIGATION =====
function setActive(button) {
    const buttons = document.querySelectorAll('.side-bar .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

const mainbtn = document.getElementById("mainBtn");
const appointments = document.getElementById('appointments');
const referral_code = document.getElementById('referral_code');
const applicats = document.getElementById('applicats');
const reports = document.getElementById('reports');
const helpAndSupport = document.getElementById('help&support');
const settings = document.getElementById('settings');

if (appointments) appointments.classList.add('active');

if (appointments) appointments.addEventListener("click", () => window.location.href = "/Registrators/reg_html/admin_appointments.html");
if (mainbtn) mainbtn.addEventListener("click", () => window.location.href = "/Registrators/reg_html/admin_dashboard.html");
if (referral_code) referral_code.addEventListener("click", () => window.location.href = "/Registrators/reg_html/admin_referral_code.html");
if (applicats) applicats.addEventListener("click", () => window.location.href = "/Registrators/reg_html/admin_applicants.html");
if (reports) reports.addEventListener("click", () => window.location.href = "/Registrators/reg_html/admin_reports.html");
if (helpAndSupport) helpAndSupport.addEventListener("click", () => window.location.href = "/Registrators/reg_html/admin_help&support.html");
if (settings) settings.addEventListener("click", () => window.location.href = "/Registrators/reg_html/admin_settings.html");


// ===== SHARED HELPERS =====
function escapeHTML(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}


// ===== RENDER UPCOMING TESTS (Cards) =====
const upcomingTestList = document.getElementById('upcomingTestList');
const leftBtn = document.getElementById('scrollLeftBtn');
const rightBtn = document.getElementById('scrollRightBtn');

function renderUpcomingTests() {
    if (!upcomingTestList) return;

    const tests = JSON.parse(localStorage.getItem('tests')) || [];
    
    // Sort by date (ascending)
    const sortedTests = [...tests].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
        const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
        return dateA - dateB;
    });

    upcomingTestList.innerHTML = '';

    if (sortedTests.length === 0) {
        upcomingTestList.innerHTML = '<p class="empty-msg" style="font-size:11px;color:#727272;">No upcoming tests scheduled.</p>';
        updateArrowVisibility();
        return;
    }

    sortedTests.forEach((t) => {
        let month = 'TBA';
        let day = '00';
        
        if (t.date) {
            const d = new Date(t.date);
            const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
            month = months[d.getMonth()];
            day = d.getDate();
        }

        let displayTime = t.time || 'TBA';
        if (t.time) {
            const [hourStr, minStr] = t.time.split(':');
            let hour = parseInt(hourStr, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12 || 12;
            displayTime = `${hour}:${minStr} ${ampm}`;
        }

        const percentFull = Math.min((t.takers / t.slots) * 100, 100) || 0;
        const isFull = t.takers >= t.slots;

        const card = document.createElement('div');
        card.className = 'upcoming-card';
        card.innerHTML = `
            <div class="card-top">
                <div class="date-block">
                    <span class="month">${month}</span>
                    <span class="day">${day}</span>
                </div>
                <span class="status-open" style="color: ${isFull ? '#F38B49' : '#3E7D2E'}">
                    ${isFull ? 'Full' : 'Open'}
                </span>
            </div>

            <p class="card-title">${escapeHTML(t.name)}</p>
            <p class="card-batch">Batch 1</p> 

            <div class="card-details">
                <div class="detail-row">
                    <i class="ri-time-line"></i>
                    <span>${displayTime}</span>
                </div>
                <div class="detail-row">
                    <i class="ri-map-pin-line"></i>
                    <span>${escapeHTML(t.location || 'TBA')}</span>
                </div>
            </div>

            <div class="card-slots">
                <p class="slots-text">${t.takers}/${t.slots} slots</p>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: ${percentFull}%"></div>
                </div>
            </div>
        `;
        upcomingTestList.appendChild(card);
    });

    // Re-check arrow visibility after cards are rendered/widths adjust
    setTimeout(updateArrowVisibility, 50);
}

// ===== SCROLL LOGIC & ARROWS =====
if (leftBtn && rightBtn && upcomingTestList) {
    leftBtn.addEventListener('click', () => {
        upcomingTestList.scrollBy({ left: -upcomingTestList.clientWidth, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        upcomingTestList.scrollBy({ left: upcomingTestList.clientWidth, behavior: 'smooth' });
    });

    upcomingTestList.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);
}

function updateArrowVisibility() {
    if (!leftBtn || !rightBtn || !upcomingTestList) return;

    if (upcomingTestList.scrollLeft <= 0) {
        leftBtn.hidden = true;
    } else {
        leftBtn.hidden = false;
    }

    if (Math.ceil(upcomingTestList.scrollLeft + upcomingTestList.clientWidth) >= upcomingTestList.scrollWidth) {
        rightBtn.hidden = true;
    } else {
        rightBtn.hidden = false;
    }
}

// ===== SCROLL LOGIC & ARROWS =====
if (leftBtn && rightBtn && upcomingTestList) {
    leftBtn.addEventListener('click', () => {
        // Scroll left by the width of the container
        upcomingTestList.scrollBy({ left: -upcomingTestList.clientWidth, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        // Scroll right by the width of the container
        upcomingTestList.scrollBy({ left: upcomingTestList.clientWidth, behavior: 'smooth' });
    });

    // Show/Hide arrows based on scroll position
    upcomingTestList.addEventListener('scroll', updateArrowVisibility);
    window.addEventListener('resize', updateArrowVisibility);
}

function updateArrowVisibility() {
    if (!leftBtn || !rightBtn || !upcomingTestList) return;

    // Hide left arrow if at the very beginning
    if (upcomingTestList.scrollLeft <= 0) {
        leftBtn.hidden = true;
    } else {
        leftBtn.hidden = false;
    }

    // Hide right arrow if at the very end
    // (scrollLeft + clientWidth >= scrollWidth means scrolled to the max right)
    if (Math.ceil(upcomingTestList.scrollLeft + upcomingTestList.clientWidth) >= upcomingTestList.scrollWidth) {
        rightBtn.hidden = true;
    } else {
        rightBtn.hidden = false;
    }
}


// ===== RENDER TEST OVERVIEW (List) =====
const testOverviewList = document.getElementById('testOverviewList');

function renderTestOverview() {
    if (!testOverviewList) return;

    const tests = JSON.parse(localStorage.getItem('tests')) || [];
    testOverviewList.innerHTML = '';

    tests.forEach((t) => {
        const isFull = t.takers >= t.slots;
        const row = document.createElement('div');
        row.className = 'test-row';
        row.innerHTML = `
            <p class="col-name">${escapeHTML(t.name)}</p>
            <div class="col-info">
                <p>${t.slots}</p>
                <p>${t.takers}</p>
                <p><span class="status ${isFull ? 'full' : ''}">${isFull ? 'Full' : 'Open'}</span></p>
            </div>
            <div class="col-func">
                <a href="../reg_html/view_all/appointments/test_overview.html">
                    <i class="ri-arrow-right-s-line"></i>
                </a>
            </div>
        `;
        testOverviewList.appendChild(row);
    });

    if (tests.length === 0) {
        testOverviewList.innerHTML = '<p class="empty-msg">No scheduled tests yet.</p>';
    }
}


// ===== INITIAL RENDER & LIVE SYNC =====
function renderAll() {
    renderUpcomingTests();
    renderTestOverview();
}

renderAll();

// Live sync when localStorage changes (from test_overview.html)
window.addEventListener('storage', (e) => {
    if (e.key === 'tests') renderAll();
});

// Refresh when navigating back to this page
window.addEventListener('focus', renderAll);