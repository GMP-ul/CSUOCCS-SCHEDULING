
// ========================================
// APPOINTMENT INFORMATION
// ========================================

// Sample information.
// Replace these values with actual data from your backend later.

const appointment = {
    name: "Genre y M. Plaza",
    contact: "09XX XXX XXXX",
    email: "juan.delacruz@carsu.edu.ph",
    address: "Trillio St., Ampayon, Butuan, Caraga Region (XIII)",

    college: "CCIS",
    course: "CS",
    yearLevel: "3rd Year",
    referralCode: "0012",

    service: "Registration",
    test: "Exam",
    date: "September 15, 2026",
    time: "1:30 PM"
};


// ========================================
// DISPLAY INFORMATION
// ========================================

document.getElementById("applicant-name").textContent = appointment.name;

document.getElementById("contact-number").textContent = appointment.contact;

document.getElementById("email-address").textContent = appointment.email;

document.getElementById("home-address").textContent = appointment.address;

document.getElementById("college").textContent = appointment.college;

document.getElementById("course").textContent = appointment.course;

document.getElementById("year-level").textContent = appointment.yearLevel;

document.getElementById("referral-code").textContent = appointment.referralCode;

document.getElementById("service").textContent = appointment.service;

document.getElementById("test-name").textContent = appointment.test;

document.getElementById("appointment-date").textContent = appointment.date;

document.getElementById("appointment-time").textContent = appointment.time;


// ========================================
// CONFIRMATION CHECKBOX
// ========================================

const checkbox = document.getElementById("confirm-check");

const confirmButton = document.getElementById("confirm-button");

const statusMessage = document.getElementById("status-message");

checkbox.addEventListener("change", function() {

    confirmButton.disabled = !this.checked;

    statusMessage.textContent = "";

});


// ========================================
// CONFIRM APPOINTMENT BUTTON
// ========================================

confirmButton.addEventListener("click", function() {

    if (!checkbox.checked) {
        statusMessage.textContent =
            "Please confirm that your information is correct.";

        return;
    }

    // Demo navigation.
    // Connect this to your actual confirmation page later.

    window.location.href = "confirmation.html";

});


// ========================================
// BACK BUTTON
// ========================================

document.getElementById("back-button").addEventListener("click", function() {

    // Change this filename to your actual scheduling page.

    window.location.href = "index.html";

});


// ========================================
// EDIT BUTTONS
// ========================================

document.querySelectorAll(".edit-button").forEach(function(button) {

    button.addEventListener("click", function() {

        const section = this.dataset.edit;

        if (section === "personal") {

            statusMessage.textContent =
                "Redirecting to Personal Information...";

            // Replace with your actual personal information page.

        }

        else if (section === "academic") {

            statusMessage.textContent =
                "Redirecting to Academic Information...";

            // Replace with your actual academic information page.

        }

        else if (section === "schedule") {

            statusMessage.textContent =
                "Redirecting to Schedule...";

            // Replace with your actual scheduling page.

        }

    });

});
