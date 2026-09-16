
const mainbtn = document.getElementById("mainBtn");
const nav = document.querySelector("side-bar")

mainbtn.classList.add('active');

nav.addEventListener('mouseenter', () => {
    
})

function setActive(button) {
    const buttons = document.querySelectorAll('.side-bar .btn');

    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    button.classList.add('active');
}