// Form 1 is the first of four steps, so its progress starts at 0%.
const progressFill = document.querySelector(".progressFill");

if (progressFill) {
    progressFill.style.height = "0%";
}

window.addEventListener("scroll", function() {
    const top = document.querySelector(".top");

    if (window.scrollY > 20) {
        top.classList.add("scrolled");
    } else {
        top.classList.remove("scrolled");
    }
});