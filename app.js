// ==========================================================================
// ZENITH AI - Interactive Brand Showcase App Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const svgFrame = document.getElementById('svg-frame');
  const stageContainer = document.getElementById('svg-stage');
  const stageLoader = document.getElementById('stage-loader');
  const currentFilenameSpan = document.getElementById('current-filename');
  const downloadSvgBtn = document.getElementById('btn-download-svg');
  const downloadPngBtn = document.getElementById('btn-download-png');
  const copyLinkedinBtn = document.getElementById('copy-linkedin-btn');
  const linkedinTextarea = document.getElementById('linkedin-text');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  // Interactive Stage State
  let currentVariant = 'fullcolor'; // 'fullcolor', 'monochrome', 'reversed', 'grid'
  let currentLockup = 'full';       // 'full', 'mark'
  let currentBg = 'dark';           // 'dark', 'light', 'black', 'transparent'

  // Update SVG Stage Asset based on state
  function updateStage() {
    stageLoader.style.display = 'block';
    
    let filename = '';
    let pngFilename = '';

    if (currentVariant === 'grid') {
      filename = 'zenith-logo-grid.svg';
      pngFilename = 'zenith-logo-blueprint-2000x1000.png';
    } else {
      const type = currentLockup === 'mark' ? 'iconmark' : 'logo';
      filename = `zenith-${type}-${currentVariant}.svg`;
      pngFilename = `zenith-${type}-${currentVariant}-1000x1000.png`;
    }

    const svgPath = `assets/vectors/${filename}`;
    const pngPath = `assets/png/${pngFilename}`;

    svgFrame.src = svgPath;
    currentFilenameSpan.innerHTML = `<i class="fa-regular fa-file-code"></i> assets/vectors/${filename}`;

    // Update Download Button Links
    downloadSvgBtn.setAttribute('href', svgPath);
    downloadSvgBtn.setAttribute('download', filename);

    downloadPngBtn.setAttribute('href', pngPath);
    downloadPngBtn.setAttribute('download', pngFilename);

    // Hide loader once iframe loads
    svgFrame.onload = () => {
      stageLoader.style.display = 'none';
    };
  }

  // Variant Controls
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      currentVariant = target.dataset.variant;
      updateStage();
    });
  });

  // Lockup Controls
  document.querySelectorAll('.lockup-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.lockup-btn').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      currentLockup = target.dataset.lockup;

      // If user was on grid and clicks lockup, switch back to fullcolor
      if (currentVariant === 'grid') {
        currentVariant = 'fullcolor';
        document.querySelectorAll('.tool-btn').forEach(b => {
          b.classList.toggle('active', b.dataset.variant === 'fullcolor');
        });
      }
      updateStage();
    });
  });

  // Background Swatch Controls
  document.querySelectorAll('.bg-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      currentBg = target.dataset.bg;

      stageContainer.className = `svg-stage bg-${currentBg}`;
    });
  });

  // Theme Toggle (Dark/Light)
  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    themeToggleBtn.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    showToast(isLight ? 'Switched to Light Theme' : 'Switched to Dark Theme');
  });

  // Copy LinkedIn Post
  if (copyLinkedinBtn) {
    copyLinkedinBtn.addEventListener('click', () => {
      linkedinTextarea.select();
      navigator.clipboard.writeText(linkedinTextarea.value).then(() => {
        showToast('LinkedIn Post copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    });
  }

  // Toast Notification Helper
  window.showToast = function(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // Helper function for copy text onclick on swatch rows
  window.copyText = function(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label} (${text})`);
    });
  };

  // Smooth Active Nav Link Scrolling
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Initial stage update
  updateStage();
});
