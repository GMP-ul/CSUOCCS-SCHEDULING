let currentStep = 0;
const totalSteps = 4;

function updateProgress() {
    const percentage = (currentStep / totalSteps) * 100;

    document.querySelector(".progressFill").style.height = percentage + "%";
}

function nextStep() {
    if (currentStep < totalSteps) {
        currentStep++;
        updateProgress();
    }
}

function previousStep() {
    if (currentStep > 0) {
        currentStep--;
        updateProgress();
    }
}

updateProgress();