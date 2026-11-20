
  const CONFIG = {
    

    backgroundImageUrl: "",
    
    backgroundOpacity: 0.5,


    logoUrl: "",

    stepIcons: {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: ""
    }
  };
  /* ================================================================ */

  if (CONFIG.backgroundImageUrl) {
    const bg = document.getElementById('bgPhoto');
    bg.style.backgroundImage = `url("${CONFIG.backgroundImageUrl}")`;
    document.querySelector('.bg-tint').style.background =
      `linear-gradient(180deg, rgba(244,247,244,${CONFIG.backgroundOpacity}), rgba(244,247,244,${CONFIG.backgroundOpacity}))`;
  }

  if (CONFIG.logoUrl) {
    document.getElementById('logoImg').src = CONFIG.logoUrl;
    document.getElementById('brandRow').style.display = 'flex';
  }


  Object.entries(CONFIG.stepIcons).forEach(([stepNum, url]) => {
    if (!url) return;
    const iconBox = document.getElementById(`icon-${stepNum}`);
    if (iconBox) {
      iconBox.innerHTML = `<img src="${url}" alt="Step ${stepNum} icon">`;
    }
  });

  // Reveal steps as they scroll into view
  const steps = document.querySelectorAll('.step');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  steps.forEach(step => observer.observe(step));