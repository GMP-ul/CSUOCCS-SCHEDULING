const navBtn = document.getElementById('nav-btn');
const menuBtn = document.querySelector('.nav-menu-btn');
const closeBtn = document.querySelector('.nav-close-btn');

menuBtn.addEventListener('click', () => {
    navBtn.classList.add('open');
});

closeBtn.addEventListener('click', () => {
    navBtn.classList.remove('open');
});