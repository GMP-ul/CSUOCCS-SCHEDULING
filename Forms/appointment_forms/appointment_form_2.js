// Form 2
const progressFill = document.querySelector(".progressFill");

if (progressFill) {
    progressFill.style.height = "20%";
}

window.addEventListener("scroll", function() {
    const top = document.querySelector(".top");

    if (window.scrollY > 20) {
        top.classList.add("scrolled");
    } else {
        top.classList.remove("scrolled");
    }
});
