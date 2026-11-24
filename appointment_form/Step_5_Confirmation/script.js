
// ========================================
// APPOINTMENT CONFIRMATION DATA
// ========================================

// Sample data for frontend testing.
// Later, retrieve these values from your backend API.

const confirmationData = {
    referenceNumber: "OCCS-2026-004821",
    applicant: "Genrey M. Plaza",
    applicantType: "Student",
    collegeCourse: "CCIS - BS Computer Science",
    date: "September 15, 2026",
    time: "1:30 PM",
    coordinator: "OCCS Registrar - Ms. Santos"
};


// ========================================
// DISPLAY CONFIRMATION DETAILS
// ========================================

document.getElementById("reference-number").textContent =
    confirmationData.referenceNumber;

document.getElementById("applicant-name").textContent =
    confirmationData.applicant;

document.getElementById("applicant-type").textContent =
    confirmationData.applicantType;

document.getElementById("college-course").textContent =
    confirmationData.collegeCourse;

document.getElementById("appointment-date").textContent =
    confirmationData.date;

document.getElementById("appointment-time").textContent =
    confirmationData.time;

document.getElementById("office-coordinator").textContent =
    confirmationData.coordinator;


// ========================================
// DOWNLOAD CONFIRMATION
// ========================================

document.getElementById("download-button").addEventListener("click", function() {

    window.print();

});


// ========================================
// BACK TO DASHBOARD
// ========================================

document.getElementById("dashboard-button").addEventListener("click", function() {

    // Change this filename to your group's actual dashboard page.

    window.location.href = "dashboard.html";

});
