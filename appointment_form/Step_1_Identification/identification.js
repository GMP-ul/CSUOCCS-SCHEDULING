// ---------- For Aesthetic ----------
// Form 1 is the first of four steps, so its progress starts at 0%.
const progressFill = document.querySelector(".progressFill");

if (progressFill) {
    progressFill.style.height = "10%";
}

const applicant_listner = document.getElementById("applicant_listner");
const apllicantTypes = document.getElementById("apllicantTypes");

apllicantTypes.addEventListener("change",
    function() {
        if (apllicantTypes.value !== ""){
            applicant_listner.style.display = "none";
        }
    }
)

const notice_listener = document.getElementById("notice_listener");
const notice_radios = document.querySelectorAll('input[name="referral_code"]');

notice_radios.forEach(function(radio) {
    radio.addEventListener("change",
        function() {
            if (radio.value === "no" && radio.checked){
                notice_listener.style.display = "block";
            } else {
                notice_listener.style.display = "none";
            }
        }
    )
});

// ---------- Form Validation ----------

const continueBtn = document.getElementById("continueBtn");

function checkForm() {

    const applicantSelected = apllicantTypes.value !== "";

    const referralSelected = document.querySelector(
        'input[name="referral_code"]:checked'
    );

    const referralConfirmed = referralSelected && referralSelected.value === "yes";

    if (applicantSelected && referralConfirmed) {
        continueBtn.classList.remove("disabled");
    } else {
        continueBtn.classList.add("disabled");
    }
}

// Listen for changes
apllicantTypes.addEventListener("change", checkForm);

notice_radios.forEach(function(radio) {
    radio.addEventListener("change", checkForm);
});