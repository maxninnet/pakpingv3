/**
 * phak.simuang.com - Premium Animation Engine v2
 * Cursor trail, parallax orbs, staggered hero entrance, easeOutExpo counters,
 * page transitions, gallery stagger, 3D tilt, particles, infinite marquee.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollProgress();
  initIntersectionObserver();
  initDataAnimateObserver();
  init3DTilt();
  initParticles();
  initStatsCounter();
  initFullTeamCarousel();
  initCarouselDragScroll();
  initGlowCards();
  initInfiniteMarquee();
  initReportForm();
  initCursorTrail();
  initHeroEntrance();
  initParallaxOrbs();
  initPageTransitions();
  initAnnouncementsLoader();
  initPoliciesLoader();
  initDeptModal();
});

// Dynamic admin sync disabled (Static mode enabled)

/* ─────────────────────────────────────────────
   1. Responsive Navbar & Mobile Nav Controls
───────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  const mobileLinks = document.querySelectorAll('.mobile-nav__link');

  if (!navbar) return;

  let lastScrollY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        navbar.classList.toggle('navbar--scrolled', currentScrollY > 50);

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('mobile-nav--open');
      document.body.style.overflow = 'hidden';
    });
  }

  [menuClose, mobileMenu].forEach(el => {
    if (!el) return;
    el.addEventListener('click', e => {
      if (e.target === el || el === menuClose) {
        mobileMenu.classList.remove('mobile-nav--open');
        document.body.style.overflow = '';
      }
    });
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('mobile-nav--open');
      document.body.style.overflow = '';
    });
  });

  // Highlight current page link and clean URLs
  const isLocal = window.location.protocol === 'file:';
  if (!isLocal) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
        link.setAttribute('href', href.substring(0, href.length - 5));
      }
    });
  }

  let currentPath = window.location.pathname.split('/').pop() || 'index';
  if (currentPath.endsWith('.html')) {
    currentPath = currentPath.substring(0, currentPath.length - 5);
  }
  if (currentPath === '') currentPath = 'index';

  const checkActive = (link) => {
    let href = link.getAttribute('href') || '';
    if (href.endsWith('.html')) href = href.substring(0, href.length - 5);
    if (href === '' || href === '/' || href === './') href = 'index';
    return href === currentPath;
  };

  document.querySelectorAll('.navbar__link').forEach(link => {
    link.classList.toggle('navbar__link--active', checkActive(link));
  });
  mobileLinks.forEach(link => {
    link.classList.toggle('mobile-nav__link--active', checkActive(link));
  });
}

/* ─────────────────────────────────────────────
   2. Scroll-bound gradient progress bar
───────────────────────────────────────────── */
function initScrollProgress() {
  const scrollBar = document.getElementById('scrollBar');
  if (!scrollBar) return;

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? window.scrollY / total : 0;
    scrollBar.style.transform = `scaleX(${progress})`;
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   3. IntersectionObserver — inline opacity:0 elements
───────────────────────────────────────────── */
function initIntersectionObserver() {
  const targets = document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal-active');
      if (entry.target.classList.contains('stats-grid')) startCounting();
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ─────────────────────────────────────────────
   3b. data-animate declarative observer
───────────────────────────────────────────── */
function initDataAnimateObserver() {
  const targets = document.querySelectorAll('[data-animate]');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(t => observer.observe(t));
}

/* ─────────────────────────────────────────────
   4. Realistic 3D Tilt Hover Effects
───────────────────────────────────────────── */
function init3DTilt() {
  if (window.innerWidth < 992) return;

  document.querySelectorAll('[data-tilt], #heroCard').forEach(card => {
    if (card.dataset.tiltBound) return;
    card.dataset.tiltBound = "true";
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px) scale(1.02)`;
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
}

/* ─────────────────────────────────────────────
   5. Dynamic HTML5 Canvas particles swarm
───────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = (Math.random() - 0.5) * 0.35;
      this.color = Math.random() > 0.5
        ? 'rgba(139,92,246,0.22)'
        : 'rgba(217,70,239,0.22)';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 100) * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    particlesArray = [];
    const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < count; i++) particlesArray.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  init();
  animate();
}

/* ─────────────────────────────────────────────
   5.1 Glow-card mouse position tracking
───────────────────────────────────────────── */
function initGlowCards() {
  document.querySelectorAll('.glow-card').forEach(card => {
    if (card.dataset.glowBound) return;
    card.dataset.glowBound = "true";
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
}


/* ─────────────────────────────────────────────
   7. Stats counter with easeOutExpo easing
───────────────────────────────────────────── */
let countersStarted = false;
function initStatsCounter() { /* triggered by IntersectionObserver */ }

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function startCounting() {
  if (countersStarted) return;
  countersStarted = true;

  document.querySelectorAll('.stat-value').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const hasPct = counter.textContent.includes('%');
    const hasPlus = counter.textContent.includes('+');
    const duration = 1800;
    let startTime = null;

    function tick(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(easeOutExpo(progress) * target);

      if (hasPct) counter.textContent = `${current}%`;
      else if (hasPlus) counter.textContent = `${current}+`;
      else counter.textContent = current;

      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ─────────────────────────────────────────────
   8. Dynamic 61-member team carousel (team.html)
───────────────────────────────────────────── */
// ==========================================
// รายชื่อทีมงาน (สามารถเปลี่ยนรูป ชื่อ และฝ่ายตรงนี้ได้เลยครับ)
// หากมีรูปจริง ให้ใส่พาธรูปในช่อง image เช่น 'images/staff/staff1.jpg'
// หากใส่ image: '' หรือไม่มี คีย์นี้ ระบบจะแสดงเป็นกล่อง Emoji พรีเมียมแทนโดยอัตโนมัติ
// ==========================================
const PAKPING_STAFF_LIST = [
  { name: 'นายวีรภัทร แถวทัศ', role: 'ฝ่ายบริหาร #1', image: 'images/BEEE1.jpg' },
  { name: 'น.ส.นภัสกร สุดดวง', role: 'ฝ่ายบริหาร #2', image: 'images/BEEE2.jpg' },
  { name: 'น.ส.ดวงกมล บุญยัษเฐียร', role: 'ฝ่ายบริหาร #3', image: 'images/BEEE3.jpg' },
  { name: 'น.ส.กมลวรรณ หนูเอียด', role: 'ฝ่ายบริหาร #4', image: 'images/BEEE4.jpg' },
  { name: 'น.ส.ณิชนันทน์ ดำสง', role: 'ฝ่ายวิชาการ #1', image: 'images/be1.jpg' },
  { name: 'น.ส.พัชราภรณ์ เผือกแดง', role: 'ฝ่ายวิชาการ #2', image: 'images/be2.jpg' },
  { name: 'น.ส.ริณลดา จิตรชำนาญ', role: 'ฝ่ายวิชาการ #3', image: 'images/be3.jpg' },
  { name: 'น.ส.ปาณิสรา เนตรไสว', role: 'ฝ่ายวิชาการ #4', image: 'images/be4.jpg' },
  { name: 'นายกำพล พันธุ์วงศ์', role: 'ฝ่ายวิชาการ #5', image: 'images/be5.jpg' },
  { name: 'น.ส.กชพร ชูน้อย', role: 'ฝ่ายอำนวยการ #1', image: 'images/BEE1.jpg' },
  { name: 'นายอติกันต์ สุวรรณ', role: 'ฝ่ายอำนวยการ #2', image: 'images/BEE2.jpg' },
  { name: 'นายธันวา มาลัย', role: 'ฝ่ายอำนวยการ #3', image: 'images/BEE3.jpg' },
  { name: 'นายพันธสิน คงปลอด', role: 'ฝ่ายอำนวยการ #4', image: 'images/BEE4.jpg' },
  { name: 'นายทรงพล เล็กขำ', role: 'ฝ่ายอำนวยการ #5', image: 'images/BEE5.jpg' },
  { name: 'นายปิยวัฒน์ ปัจฉิมเพ็ชร', role: 'ฝ่ายอำนวยการ #6', image: 'images/BEE6.jpg' },
  { name: 'น.ส.สุภัควี จันทร์เกิด', role: 'ฝ่ายกิจการนักเรียน #1', image: 'images/b1.jpg' },
  { name: 'น.ส.มลธวรรณ สุขเสน', role: 'ฝ่ายกิจการนักเรียน #2', image: 'images/b2.jpg' },
  { name: 'นายรังสิมันต์ จิตเกิด', role: 'ฝ่ายกิจการนักเรียน #3', image: 'images/b3.jpg' },
  { name: 'นายวราศิลป์ นิลเขต', role: 'ฝ่ายกิจการนักเรียน #4', image: 'images/b4.jpg' },
  { name: 'นายกิตติพงศ์ พิชคุณ', role: 'ฝ่ายกิจการนักเรียน #5', image: 'images/b5.jpg' },
  { name: 'นายก้องเกียรติ มากนวล', role: 'ฝ่ายประชาสัมพันธ์ #1', image: 'images/e1.jpg' },
  { name: 'น.ส.สโรชา นายาว', role: 'ฝ่ายประชาสัมพันธ์ #2', image: 'images/e2.jpg' },
  { name: 'น.ส.ณัฐกฤตา มาฆะโว', role: 'ฝ่ายประชาสัมพันธ์ #3', image: 'images/e3.jpg' },
  { name: 'น.ส.นฤมล อินทแย้ม', role: 'ฝ่ายประชาสัมพันธ์ #4', image: 'images/e4.jpg' },
  { name: 'น.ส.สุริย์วิภา มวลวงศ์', role: 'ฝ่ายประชาสัมพันธ์ #5', image: 'images/e5.jpg' },
  { name: 'น.ส.ชนกนันท์ เพ่งกิจ', role: 'ฝ่ายประสานงาน&สื่อโสตทัศน์ #1', image: 'images/a1.jpg' },
  { name: 'น.ส.อาทิตยา วัฒนธรรม', role: 'ฝ่ายประสานงาน&สื่อโสตทัศน์ #2', image: 'images/a2.jpg' },
  { name: 'น.ส.ปนิดา อ้วนผุย', role: 'ฝ่ายประสานงาน&สื่อโสตทัศน์ #3', image: 'images/a3.jpg' },
  { name: 'นายศรัณยพงศ์ คงชนะ', role: 'ฝ่ายประสานงาน&สื่อโสตทัศน์ #4', image: 'images/a4.jpg' },
  { name: 'นายรณกร เรื่องไกร', role: 'ฝ่ายประสานงาน&สื่อโสตทัศน์ #5', image: 'images/a5.jpg' },
];

function initFullTeamCarousel() {
  const container = document.getElementById('fullTeamCarousel');
  if (!container) return;

  const emojis = ['⚡', '🌟', '🛡️', '📢', '🎨', '📚', '💪', '🤝', '🔥', '✨', '🎓', '🎯', '🚀', '🔮', '❤️', '💡', '🌈'];
  const depts = ['ฝ่ายประชาสัมพันธ์', 'ฝ่ายออกแบบ', 'ฝ่ายกิจกรรม', 'ฝ่ายวิชาการ', 'ฝ่ายสวัสดิการ', 'ฝ่ายต่างประเทศ', 'ทีมงานเบื้องหลัง', 'ทีมสนับสนุน'];

  // รวมข้อมูลหลักกับข้อมูลจำลองให้เต็มจำนวน 61 คน
  const finalStaff = [...PAKPING_STAFF_LIST];
  for (let i = finalStaff.length + 1; i <= 30; i++) {
    finalStaff.push({
      name: `ฝ่ายดำเนินงาน #${i}`,
      role: depts[i % depts.length],
      image: '' // เปลี่ยนเป็นพาธรูปภาพจริงได้ เช่น `images/staff/staff${i}.jpg`
    });
  }

  let html = '';
  finalStaff.forEach((staff, index) => {
    const i = index + 1;
    const emoji = emojis[i % emojis.length];
    const h1 = (i * 37) % 360;
    const h2 = (h1 + 60) % 360;
    const bg = `linear-gradient(135deg, hsla(${h1},80%,65%,0.15) 0%, hsla(${h2},80%,65%,0.15) 100%)`;
    const glow = `radial-gradient(circle, hsla(${h1},80%,65%,0.3) 0%, transparent 70%)`;

    // ถ้ามีรูปภาพจริง ให้ใช้แท็ก img
    const imageHTML = staff.image
      ? `<img src="${staff.image}" alt="${staff.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" class="staff-photo">`
      : `<div class="image-placeholder-glow" style="background:${glow};width:180px;height:180px;"></div>
         <div style="text-align:center;z-index:10;position:relative;">
           <div style="font-size:3.5rem;margin-bottom:0.5rem;filter:drop-shadow(0 4px 10px rgba(0,0,0,0.08));">${emoji}</div>
           <div style="font-weight:800;font-size:1.1rem;color:var(--primary-700);">PAKPING Staff #${String(i).padStart(2, '0')}</div>
         </div>`;

    html += `
      <div class="team-carousel-item">
        <div class="image-placeholder" style="background:${staff.image ? 'transparent' : bg}; border:none; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
          ${imageHTML}
        </div>
        <div class="team-carousel-content">
          <h4 class="team-carousel-name">${staff.name}</h4>
          <p class="team-carousel-role">${staff.role}</p>
        </div>
      </div>`;
  });

  container.innerHTML = html;
}

/* ─────────────────────────────────────────────
   9. Grab-to-scroll for team sliders
───────────────────────────────────────────── */
function initCarouselDragScroll() {
  document.querySelectorAll('.team-carousel-track').forEach(carousel => {
    let isDown = false, startX, scrollLeft;

    carousel.addEventListener('mousedown', e => {
      isDown = true;
      carousel.classList.add('active-drag');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => { isDown = false; carousel.classList.remove('active-drag'); });
    carousel.addEventListener('mouseup', () => { isDown = false; carousel.classList.remove('active-drag'); });

    carousel.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  });
}

/* ─────────────────────────────────────────────
   10. Infinite auto-scrolling marquee loop
───────────────────────────────────────────── */
function initInfiniteMarquee() {
  document.querySelectorAll('.team-carousel-track').forEach(track => {
    const origChildren = Array.from(track.children);
    if (!origChildren.length) return;

    origChildren.forEach(child => track.appendChild(child.cloneNode(true)));

    let speed = 0.6;
    let isHovered = false;
    let isDragging = false;
    let isTouchActive = false;
    let currentScroll = track.scrollLeft;

    track.addEventListener('mouseenter', () => {
      if (isTouchActive) return;
      isHovered = true;
    });
    track.addEventListener('mouseleave', () => {
      isHovered = false;
    });
    track.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);

    // Touch events for mobile devices to prevent marquee from getting stuck on touch/hover
    track.addEventListener('touchstart', () => {
      isTouchActive = true;
      isDragging = true;
    }, { passive: true });

    const handleTouchEnd = () => {
      isDragging = false;
      isHovered = false;
      currentScroll = track.scrollLeft; // Sync scroll position
      setTimeout(() => {
        isTouchActive = false;
      }, 500);
    };

    track.addEventListener('touchend', handleTouchEnd, { passive: true });
    track.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    // Seamless wrap
    track.addEventListener('scroll', () => {
      const half = track.scrollWidth / 2;
      if (track.scrollLeft >= half) {
        track.scrollLeft -= half;
        currentScroll = track.scrollLeft;
      } else if (track.scrollLeft <= 0) {
        track.scrollLeft = half;
        currentScroll = track.scrollLeft;
      }
    }, { passive: true });

    function step() {
      if (!isHovered && !isDragging && !track.classList.contains('active-drag')) {
        currentScroll += speed;
        const half = track.scrollWidth / 2;
        if (currentScroll >= half) {
          currentScroll -= half;
        }
        track.scrollLeft = currentScroll;
      } else {
        currentScroll = track.scrollLeft;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ─────────────────────────────────────────────
   11. Report Form handling & validation
───────────────────────────────────────────── */
function initReportForm() {
  const reportForm = document.getElementById('reportForm');
  const anonymousToggle = document.getElementById('anonymousToggle');
  const studentNameInput = document.getElementById('studentName');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const successModal = document.getElementById('successModal');
  const reportModalText = document.getElementById('reportModalText');

  // Image Upload DOM Elements
  const uploadArea = document.getElementById('uploadArea');
  const reportFile = document.getElementById('reportFile');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadPreviewContainer = document.getElementById('uploadPreviewContainer');
  const uploadPreview = document.getElementById('uploadPreview');
  const btnRemovePreview = document.getElementById('btnRemovePreview');

  let reportBase64Data = ""; // Stores compressed Base64 dataURL

  if (anonymousToggle && studentNameInput) {
    anonymousToggle.addEventListener('change', () => {
      if (anonymousToggle.checked) {
        studentNameInput.disabled = true;
        studentNameInput.placeholder = 'ผู้ส่งเรื่อง: ไม่เปิดเผยตัวตน (Anonymous)';
        studentNameInput.value = '';
      } else {
        studentNameInput.disabled = false;
        studentNameInput.placeholder = 'ตัวอย่าง: เด็กชายส้ม สมมุติ';
      }
    });
  }

  // Set up Image Upload Actions (Click and Drag/Drop)
  if (uploadArea && reportFile) {
    // Click to select file
    uploadArea.addEventListener('click', (e) => {
      if (e.target.closest('#btnRemovePreview')) return;
      reportFile.click();
    });

    // File input change
    reportFile.addEventListener('change', handleFileSelect);

    // Drag over highlights
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.style.borderColor = 'var(--primary-500)';
      uploadArea.style.background = 'rgba(139, 92, 246, 0.05)';
    }

    function unhighlight(e) {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.style.borderColor = '';
      uploadArea.style.background = '';
    }

    // Drop file
    uploadArea.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        reportFile.files = files;
        processFile(files[0]);
      }
    });

    // Remove preview
    if (btnRemovePreview) {
      btnRemovePreview.addEventListener('click', (e) => {
        e.stopPropagation();
        removeReportImage();
      });
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  }

  // Resize and compress image client-side using canvas
  function processFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกเฉพาะไฟล์รูปภาพเท่านั้น');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const max_size = 1000; // maximum dimension

        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        reportBase64Data = canvas.toDataURL('image/jpeg', 0.7);

        if (uploadPreview && uploadPreviewContainer && uploadPlaceholder) {
          uploadPreview.src = reportBase64Data;
          uploadPlaceholder.style.display = 'none';
          uploadPreviewContainer.style.display = 'block';
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  function removeReportImage() {
    reportBase64Data = "";
    if (reportFile) reportFile.value = "";
    if (uploadPreview) uploadPreview.src = "";
    if (uploadPreviewContainer) uploadPreviewContainer.style.display = 'none';
    if (uploadPlaceholder) uploadPlaceholder.style.display = 'block';
  }

  // Convert Base64 dataURL to Blob for multipart/form-data Webhook post
  function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  if (reportForm) {
    reportForm.addEventListener('submit', e => {
      e.preventDefault();

      const category = document.getElementById('issueCategory')?.value || '';
      const title = document.getElementById('issueTitle')?.value || '';
      const desc = document.getElementById('issueDescription')?.value || '';
      const grade = document.getElementById('studentGrade')?.value || '';
      const name = anonymousToggle?.checked
        ? 'ผู้ไม่ประสงค์ออกนาม (Anonymous)'
        : (studentNameInput?.value || 'ไม่ระบุชื่อ');

      if (!title || !desc) {
        alert('กรุณากรอกหัวข้อและรายละเอียดของปัญหา');
        return;
      }

      const embed = {
        title: '📢 มีเรื่องแจ้งร้องเรียนใหม่เข้ามา!',
        description: `**หัวข้อ:** ${title}`,
        color: 8142573,
        fields: [
          { name: '📁 หมวดหมู่', value: category, inline: true },
          { name: '👤 ผู้แจ้ง', value: name, inline: true },
          { name: '🏫 ระดับชั้น / ห้องเรียน', value: grade || 'ไม่ระบุ', inline: true },
          { name: '📝 รายละเอียดปัญหา', value: desc }
        ],
        footer: { text: 'ระบบแจ้งเรื่องร้องเรียน พรรคพิง PAKPING หมายเลข 2' },
        timestamp: new Date().toISOString()
      };

      let fetchPromise;

      if (reportBase64Data) {
        embed.image = {
          url: 'attachment://report_image.jpg'
        };
        const formData = new FormData();
        const imageBlob = dataURLtoBlob(reportBase64Data);
        formData.append('files[0]', imageBlob, 'report_image.jpg');
        formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

        fetchPromise = fetch('https://discordapp.com/api/webhooks/1510145153388777593/nFKJG9co-RlG6lJPEkWbNe6WvGzL_4mjrlDm3GVRMAuOqeSIpACFaqZZZySEEbZ0-iuu', {
          method: 'POST',
          body: formData
        });
      } else {
        const payload = {
          embeds: [embed]
        };
        fetchPromise = fetch('https://discordapp.com/api/webhooks/1510145153388777593/nFKJG9co-RlG6lJPEkWbNe6WvGzL_4mjrlDm3GVRMAuOqeSIpACFaqZZZySEEbZ0-iuu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      fetchPromise
        .then(res => { if (!res.ok) console.error('Webhook failed'); })
        .catch(err => console.error('Webhook error:', err));

      if (reportModalText) {
        reportModalText.innerHTML = `เราได้รับเรื่อง <strong>"${title}"</strong> หมวดหมู่ <strong>${category}</strong> จาก <strong>${name}</strong> เรียบร้อยแล้ว ทีมงานพรรคพิงจะเร่งนำปัญหานี้เข้าสู่การอภิปรายเพื่อช่วยเหลืออย่างรวดเร็วที่สุด!`;
      }

      if (successModal) successModal.classList.add('report-modal--open');

      reportForm.reset();
      removeReportImage();
      if (studentNameInput && anonymousToggle) {
        studentNameInput.disabled = false;
        studentNameInput.placeholder = 'ตัวอย่าง: เด็กชายส้ม สมมุติ';
      }
    });
  }

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('report-modal--open');
    });
  }
}

/* ─────────────────────────────────────────────
   12. Custom cursor trail (desktop only)
───────────────────────────────────────────── */
function initCursorTrail() {
  if (window.innerWidth < 992) return;

  const dot = Object.assign(document.createElement('div'), { className: 'cursor-dot' });
  const ring = Object.assign(document.createElement('div'), { className: 'cursor-ring' });
  document.body.append(dot, ring);

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  // Expand ring over interactive elements
  document.querySelectorAll('a, button, [data-tilt], .bento-card, .stat-card, .team-carousel-item, .gallery-day-tab, .policy-slide, .org-flow-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });

  function loop() {
    // Dot follows instantly
    dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    // Ring lerps smoothly (lag = 12%)
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ─────────────────────────────────────────────
   13. Hero staggered entrance animation
───────────────────────────────────────────── */
function initHeroEntrance() {
  const steps = [
    { selector: '.hero-number-badge', delay: 100 },
    { selector: '.hero-tagline', delay: 260 },
    { selector: '.hero-title', delay: 390 },
    { selector: '.hero-slogan-wrapper', delay: 510 },
    { selector: '.hero-subtitle', delay: 610 },
    { selector: '.btn-group', delay: 710 },
    { selector: '.hero-image-wrapper', delay: 300 },
    { selector: '.scroll-indicator', delay: 900 },
  ];

  steps.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    // Elements start with opacity:0 set inline in HTML
    setTimeout(() => {
      el.style.transition = 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, delay);
  });
}

/* ─────────────────────────────────────────────
   14. Parallax scroll for hero background orbs
───────────────────────────────────────────── */
function initParallaxOrbs() {
  const orbs = [
    { el: document.querySelector('.orb-1'), rate: 0.08 },
    { el: document.querySelector('.orb-2'), rate: -0.05 },
    { el: document.querySelector('.orb-3'), rate: 0.04 },
  ].filter(o => o.el);

  if (!orbs.length) return;

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    orbs.forEach(({ el, rate }) => {
      el.style.transform = `translateY(${sy * rate}px)`;
    });
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   15. Smooth page-leave transitions
───────────────────────────────────────────── */
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.28s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });
}

/* ─────────────────────────────────────────────
   16. Dynamic Announcements Loader (with fallback)
   Loads from: Supabase -> static JSON -> localStorage -> Defaults
───────────────────────────────────────────── */
const DYN_DEFAULT_ANNOUNCEMENTS = [
  {
    id: "announce-1",
    title: "ภาพบรรยากาศกิจกรรมปัจฉิมนิเทศ วันที่ 24 กุมภาพันธ์",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมปัจฉิมนิเทศ วันที่ 24 กุมภาพันธ์ ปีการศึกษา 2568 สามารถรับชมและดาวน์โหลดรูปภาพทั้งหมดได้ทาง Google Drive",
    date: "วันนี้",
    tagMini: "announcement",
    tags: ["#graduation", "#download"],
    linkUrl: "https://drive.google.com/drive/mobile/folders/1daJXwyEwtnOcuj6Ty_wH-lGnrRpqvpUS",
    linkText: "คลิกเพื่อดาวน์โหลดภาพ",
    imageType: "svg",
    imageValue: "1",
    svgBadgeText: "CLOUD PHOTO DRIVE"
  },
  {
    id: "announce-2",
    title: "ภาพกิจกรรมหาเสียงวันที่ 14 มกราคม",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมหาเสียงวันที่ 14 มกราคม สามารถรับชมและดาวน์โหลดรูปภาพทั้งหมดได้ทาง Google Drive ได้เลยครับ",
    date: "14 มกราคม 2569",
    tagMini: "download",
    tags: ["#campaign", "#photos"],
    linkUrl: "https://drive.google.com/drive/folders/10on-4lhNZFyAk3EBNPsv6IFSEzoMLBDX",
    linkText: "คลิกเพื่อดาวน์โหลดภาพ",
    imageType: "svg",
    imageValue: "2",
    svgBadgeText: "CLOUD PHOTO DRIVE"
  },
  {
    id: "announce-3",
    title: "ดาวน์โหลดไฟล์วันที่ 12 มกราคม",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมหาเสียงวันที่ 12 มกราคม สามารถรับชมและดาวน์โหลดรูปภาพทั้งหมดได้ทาง Google Drive ได้เลยครับ",
    date: "12 มกราคม 2569",
    tagMini: "download",
    tags: ["#campaign", "#files"],
    linkUrl: "https://drive.google.com/drive/folders/1HdMJxeaDTLznRF8QQcJoZiiqmxFOn4Jy",
    linkText: "คลิกเพื่อดาวน์โหลดภาพ",
    imageType: "svg",
    imageValue: "3",
    svgBadgeText: "CLOUD PHOTO DRIVE"
  },
  {
    id: "announce-4",
    title: "ดาวน์โหลดไฟล์วันที่ 9 มกราคม",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมหาเสียงวันที่ 9 มกราคม สามารถรับชมและดาวน์โหลดรูปภาพทั้งหมดได้ทาง Google Drive ได้เลยครับ",
    date: "9 มกราคม 2569",
    tagMini: "download",
    tags: ["#campaign", "#files"],
    linkUrl: "https://drive.google.com/drive/folders/1Yge_FFSdeKRMIri31aoqzs2nazByXgWc",
    linkText: "คลิกเพื่อดาวน์โหลดภาพ",
    imageType: "svg",
    imageValue: "4",
    svgBadgeText: "CLOUD PHOTO DRIVE"
  },
  {
    id: "announce-5",
    title: "ดาวน์โหลดไฟล์วันที่ 8 มกราคม",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมหาเสียงวันที่ 8 มกราคม สามารถรับชมและดาวน์โหลดรูปภาพทั้งหมดได้ทาง Google Drive ได้เลยครับ",
    date: "8 มกราคม 2569",
    tagMini: "download",
    tags: ["#campaign", "#files"],
    linkUrl: "https://drive.google.com/drive/folders/10Yy-TqPJeDQ8y2hK44cnmm70w_DQV1ce",
    linkText: "คลิกเพื่อดาวน์โหลดภาพ",
    imageType: "svg",
    imageValue: "5",
    svgBadgeText: "CLOUD PHOTO DRIVE"
  },
  {
    id: "announce-6",
    title: "ดาวน์โหลดไฟล์วันที่ 7 มกราคม",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมหาเสียงวันที่ 7 มกราคม สามารถรับชมและดาวน์โหลดรูปภาพทั้งหมดได้ทาง Google Drive ได้เลยครับ",
    date: "7 มกราคม 2569",
    tagMini: "download",
    tags: ["#campaign", "#files"],
    linkUrl: "https://drive.google.com/drive/folders/1LX9aIrTq4ROEPPPY-bU16iRW9RSSa_B9",
    linkText: "คลิกเพื่อดาวน์โหลดภาพ",
    imageType: "svg",
    imageValue: "6",
    svgBadgeText: "CLOUD PHOTO DRIVE"
  },
  {
    id: "announce-7",
    title: "ดาวน์โหลดไฟล์วันที่ 6 มกราคม",
    excerpt: "ประมวลภาพบรรยากาศกิจกรรมหาเสียงวันที่ 6 มกราคม สามารถรับชมและดาวน์โหลดรูปภาพทั้งหมดได้ทาง Google Drive ได้เลยครับ",
    date: "6 มกราคม 2569",
    tagMini: "download",
    tags: ["#campaign", "#files"],
    linkUrl: "https://drive.google.com/drive/folders/1ULTkRjduz-qWJGvhs96pFa1TRQN73Qv6",
    linkText: "คลิกเพื่อดาวน์โหลดภาพ",
    imageType: "svg",
    imageValue: "7",
    svgBadgeText: "CLOUD PHOTO DRIVE"
  }
];

function getAnnouncementSVG(val, badgeText = 'CLOUD PHOTO DRIVE') {
  const gradients = {
    "1": { bg: ['#0a0a18', '#05050b'], neon: ['#8b5cf6', '#ec4899'] },
    "2": { bg: ['#050a18', '#02040b'], neon: ['#06b6d4', '#3b82f6'] },
    "3": { bg: ['#0a0518', '#04020b'], neon: ['#8b5cf6', '#d946ef'] },
    "4": { bg: ['#0a0518', '#04020b'], neon: ['#a855f7', '#cbd5e1'] },
    "5": { bg: ['#0a0518', '#04020b'], neon: ['#ec4899', '#ffd700'] },
    "6": { bg: ['#0a0518', '#04020b'], neon: ['#06b6d4', '#d946ef'] },
    "7": { bg: ['#0a0518', '#04020b'], neon: ['#f59e0b', '#ec4899'] }
  };

  const g = gradients[val] || gradients["1"];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" height="100%" style="display: block;">
    <defs>
      <linearGradient id="announce-bg-dyn-${val}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${g.bg[0]}" />
        <stop offset="100%" stop-color="${g.bg[1]}" />
      </linearGradient>
      <linearGradient id="announce-neon-dyn-${val}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${g.neon[0]}" />
        <stop offset="100%" stop-color="${g.neon[1]}" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#announce-bg-dyn-${val})" />
    <path d="M 0 30 L 320 30 M 0 70 L 320 70 M 0 110 L 320 110 M 0 150 L 320 150 M 0 190 L 320 190" stroke="rgba(255,255,255,0.015)" stroke-width="1" />
    <g transform="translate(125, 45)" opacity="0.8">
      <path d="M 10 50 A 15 15 0 0 1 25 35 A 25 25 0 0 1 65 25 A 20 20 0 0 1 85 45 A 15 15 0 0 1 80 65 L 20 65 A 15 15 0 0 1 10 50 Z" fill="none" stroke="url(#announce-neon-dyn-${val})" stroke-width="1.8" />
      <path d="M 47 40 L 47 62 M 40 55 L 47 62 L 54 55" stroke="url(#announce-neon-dyn-${val})" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="160" y="160" text-anchor="middle" fill="#cbd5e1" font-family="'Outfit', sans-serif" font-size="10" font-weight="800" letter-spacing="4">${badgeText.toUpperCase()}</text>
  </svg>`;
}

async function initAnnouncementsLoader() {
  const grid = document.getElementById('announcementsGrid');
  if (!grid) return; // Exit if not on announcements page

  // Load from localStorage (saved by admin panel) → fallback to JSON file → fallback to defaults
  let list = [];
  try {
    const saved = localStorage.getItem('pakping_announcements');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) { /* ignore parse errors */ }

  if (list.length === 0) {
    try {
      const res = await fetch('announcements_data.json');
      if (res.ok) {
        const parsed = await res.json();
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not fetch announcements_data.json natively", e);
    }
  }

  if (list.length === 0) {
    list = [...DYN_DEFAULT_ANNOUNCEMENTS];
  }

  // Render cards
  let html = "";
  list.forEach(item => {
    const clickAttr = item.linkUrl ? `onclick="window.open('${item.linkUrl}', '_blank')"` : '';

    let imageHTML = "";
    if (item.imageType === 'svg') {
      imageHTML = getAnnouncementSVG(item.imageValue, item.svgBadgeText || 'CLOUD PHOTO DRIVE');
    } else {
      imageHTML = `<img src="${item.imageValue}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
    }

    const tagsHTML = (item.tags || []).map(t => `<span class="announcement-tag">${t}</span>`).join('\n');

    let bodyLinkHTML = "";
    if (item.linkUrl) {
      bodyLinkHTML = `
        <div class="announcement-card-body">
          <a href="${item.linkUrl}" target="_blank" rel="noopener noreferrer" class="announcement-link">
            <span>${item.linkText || 'คลิกเพื่อดาวน์โหลดภาพ'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
        </div>
      `;
    }

    html += `
      <article class="announcement-card-modern glow-card" style="opacity: 0; transform: translateY(50px);" ${clickAttr}>
        <div class="announcement-card-glow"></div>
        <div class="announcement-card-image-wrapper">
          ${imageHTML}
          <div class="announcement-card-image-overlay"></div>
        </div>
        <div class="announcement-card-content">
          <div class="announcement-card-meta">
            <div class="announcement-date-badge-modern">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" class="announcement-date-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span class="announcement-date-text">${item.date || 'วันนี้'}</span>
            </div>
            <div class="announcement-tags-preview">
              <span class="announcement-tag-mini">${item.tagMini || 'download'}</span>
            </div>
          </div>
          <h2 class="announcement-card-title-modern">${item.title}</h2>
          <p class="announcement-card-excerpt">${item.excerpt}</p>
          ${bodyLinkHTML}
          <div class="announcement-card-footer">
            <div class="announcement-tags">
              ${tagsHTML}
            </div>
          </div>
          <div class="announcement-card-indicator">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" class="announcement-indicator-icon">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </article>
    `;
  });

  grid.innerHTML = html;

  // Re-run animation observers and listeners on newly rendered cards
  initIntersectionObserver();
  init3DTilt();
  initGlowCards();
}

/* ─────────────────────────────────────────────
   17. Dynamic Policies Loader (with fallback)
───────────────────────────────────────────── */
const DYN_DEFAULT_POLICIES = [
  {
    "id": "policy-1",
    "number": "01",
    "tag": "สุขภาพจิต",
    "title": "Ngl",
    "subtitle": "พื้นที่ในการแลกเปลี่ยนความคิดเห็น",
    "description": "พื้นที่ในการแลกเปลี่ยนความคิดเห็น เปลี่ยนทุกเสียงสะท้อนให้กลายเป็นการพัฒนาเราพร้อมรับฟังทุกเรื่องราว เป็นเซฟโซนที่น่าอยู่ยิ่งกว่า",
    "icon": "📵",
    "imageType": "emoji",
    "imageValue": "📵",
    "gradientStyle": "1"
  },
  {
    "id": "policy-2",
    "number": "02",
    "tag": "กิจกรรม",
    "title": "\"What's Next? Center\"",
    "subtitle": "ศูนย์รวมกิจจกรรมสร้างสรรค์ตามเทศกาล",
    "description": "ศูนย์รวมกิจจกรรมสร้างสรรค์ตามเทศกาล พวกเราจะจัดหากิจกรรมที่เหมาะสมเเละอินเทรนด์มาให้ได้ร่วมสนุก เพื่อให้น้องๆ และเพื่อนๆ ได้ผ่อนคลายและสนุกร่วมกัน",
    "icon": "🎬",
    "imageType": "emoji",
    "imageValue": "🎬",
    "gradientStyle": "2"
  },
  {
    "id": "policy-3",
    "number": "03",
    "tag": "ทักษะอาชีพ",
    "title": "สภา เพิ่มช่องทางสร้างรายได้",
    "subtitle": "เปิดพื้นที่สื่อช่วยประชาสัมพันธ์โปรโมทร้าน",
    "description": "เปิดพื้นที่สื่อช่วยประชาสัมพันธ์โปรโมทร้านเเละธุรกิจเล็กๆ ของเพื่อนๆ พี่ๆ น้องๆ ทุกคนเพื่อเพิ่มช่องทางสร้างรายได้และโปรโมททักษะความสามารถ",
    "icon": "🛍️",
    "imageType": "emoji",
    "imageValue": "🛍️",
    "gradientStyle": "3"
  },
  {
    "id": "policy-4",
    "number": "04",
    "tag": "กิจกรรม",
    "title": "THE CANVAS",
    "subtitle": "ส่งเสริมการจัดกิจกรรมและการแข่งขัน",
    "description": "การส่งเสริมการจัดกิจกรรมหรือการแข่งขัน ที่ให้ทุกคนได้มาแสดงศักยภาพของตัวเอง ในทุกด้าน ไม่ว่าจะเป็นศิลปะ ดนตรี กีฬา หรือทักษะอื่นๆ",
    "icon": "🎮",
    "imageType": "emoji",
    "imageValue": "🎮",
    "gradientStyle": "4"
  },
  {
    "id": "policy-5",
    "number": "05",
    "tag": "การช่วยเหลือ",
    "title": "มีร่มให้ยืม และ ผ้าอนามัยฉุกเฉิน",
    "subtitle": "บริการยืมร่มและผ้าอนามัยฉุกเฉิน",
    "description": "• สามารถยืมได้ในวันที่ฝนตกช่วงเย็น\n• ยืมได้ตั้งแต่เวลา15:50 และนำมาคืนในวันถัดไป\n• การยืมต้องลงชื่อ และถ่ายภาพเป็นหลักฐานก่อน",
    "icon": "✨",
    "imageType": "emoji",
    "imageValue": "✨",
    "gradientStyle": "5"
  },
  {
    "id": "policy-6",
    "number": "06",
    "tag": "การสื่อสาร",
    "title": "ข้อมูลรู้ทันฉับไว",
    "subtitle": "ข้อมูลข่าวสารต่างๆในโรงเรียน ไม่ว่าจะเป็นเล็กหรือใหญ่ จะประชาสัมพันธ์ข้อมูลในทุกช่องทางทั้งผ่านหูและผ่านตา",
    "description": "สำหรับข้อมูลข่าวสารต่างๆในโรงเรียน ไม่ว่าจะเป็นเล็กหรือใหญ่ พวกเราจะประชาสัมพันธ์ข้อมูลในทุกช่องทางทั้งผ่านหูและผ่านตา อย่างถูกต้องรวดเร็วและเข้าใจกันโดยทั่วถึงทั้งคุณครูและนักเรียนในทุกๆกิจกรรมและข่าวสารของโรงเรียน",
    "icon": "📢",
    "imageType": "emoji",
    "imageValue": "📢",
    "gradientStyle": "6"
  },
  {
    "id": "policy-7",
    "number": "07",
    "tag": "วินัย",
    "title": "ตารางเวรธงชาติ",
    "subtitle": "มีการแจ้งตารางเวรล่วงหน้า",
    "description": "พวกเราจะมีการแจ้งตารางเวรเชิญธงชาติเพื่อให้ห้องที่เป็นเวรได้จัดเตรียมตัวแทนไว้ล่วงหน้า",
    "icon": "⏰",
    "imageType": "emoji",
    "imageValue": "⏰",
    "gradientStyle": "7"
  },
  {
    "id": "policy-8",
    "number": "08",
    "tag": "การทำงานร่วมกัน",
    "title": "Pass The Torch",
    "subtitle": "สานต่อกิจกรรมและผลงานที่พี่ๆ สภานักเรียนปีการศึกษา 2568",
    "description": "เพราะประสบการณ์จากรุ่นพี่ คือแสงนำทางของรุ่นน้อง พวกเราพร้อมสานต่อกิจกรรมและผลงานที่พี่ๆ สภานักเรียนปีการศึกษา 2568 ที่ได้ขับเคลื่อนไว้ เพื่อสร้างความเหนียวแน่นและรักษาความต่อเนื่องในการทำงาน ซึ่งจะส่งผลให้รั้วม่วงขาวของเราเกิดการพัฒนาอย่างยั่งยืนและก้าวไปได้ไกลกว่าเดิม",
    "icon": "🔥",
    "imageType": "emoji",
    "imageValue": "🔥",
    "gradientStyle": "8"
  },
  {
    "id": "policy-9",
    "number": "09",
    "tag": "สวัสดิการ",
    "title": "ปั่นใจให้น้ำ",
    "subtitle": "ช่วยซัพพอร์ตน้ำดื่มให้ในวันแข่งขันกรีฑา",
    "description": "ในช่วงแข่งขันกีฬาสีภายในเมื่อแข่งขันกีฬาชนะเลิศ 1 รายการพวกเราจะช่วยซัพพอร์ตน้ำดื่มให้ ในวันแข่งขันกรีฑา 1 แพ็ค เพื่อเป็นกำลังใจให้นักกีฬาทุกคน 1 รายการ ต่อ 1 แพ็ค เฉพาะกีฬาฟุตซอล เปตอง วอลเลย์บอล บาสเกตบอล",
    "icon": "🥤",
    "imageType": "emoji",
    "imageValue": "🥤",
    "gradientStyle": "9"
  },
  {
    "id": "policy-10",
    "number": "10",
    "tag": "จิตอาสา",
    "title": "สภาพาทำจิตอาสา",
    "subtitle": "จัดกิจกรรมจิตอาสาภายในโรงเรียน เพื่อเปิดโอกาสให้นักเรียนทุกคนได้เข้าร่วมกิจกรรมที่สร้างประโยชน์ต่อส่วนรวม",
    "description": "นโยบายนี้จะมุ่งเน้นไปที่กลุ่มนักเรียนชั้นมัธยมศึกษาตอนปลายเพราะกิจกรรมจิตอาสาเป็นหนึ่งในองค์ประกอบสำคัญของ PORTFOLIO เราจึงมีแนวคิดจัดกิจกรรมจิตอาสาภายในโรงเรียน เพื่อเปิดโอกาสให้นักเรียนทุกคนได้เข้าร่วมกิจกรรมที่สร้างประโยชน์ต่อส่วนรวมพร้อมทั้งได้เก็บเกี่ยวประสบการณ์และผลงาน ที่สามารถนำไปต่อยอดในการศึกษา",
    "icon": "🤝",
    "imageType": "emoji",
    "imageValue": "🤝",
    "gradientStyle": "10"
  },
  {
    "id": "policy-11",
    "number": "11",
    "tag": "สุขภาพ",
    "title": "เตรียมห้องพร้อมผู้ป่วย",
    "subtitle": "มีการผลัดเปลี่ยนเวรไปช่วยคุณครูดูแลที่ห้องพยาบาล",
    "description": "ใน 1 สัปดาห์พวกเราจะมีการผลัดเปลี่ยนเวรไป ช่วยคุณครูดูแลและเตรียมพร้อมของห้องพยาบาลไว้รองรับนักเรียน คุณครูและบุคลากรในโรงเรียน ที่มีอาการเจ็บป่วยต่างๆ เพื่อให้ห้องสะอาดและสะดวกต่อการเข้ามาใช้บริการ",
    "icon": "🩹",
    "imageType": "emoji",
    "imageValue": "🩹",
    "gradientStyle": "11"
  },
  {
    "id": "policy-12",
    "number": "12",
    "tag": "สวัสดิการ",
    "title": "She safe & Softly Clean",
    "subtitle": "จัดหากระดาษReuse ไว้สำหรับเพื่อนๆผู้หญิงได้ใช้ห่อผ้าอนามัย และ จัดวางเจลล้างมือไว้บริเวณอ่างล้างมือภายในห้องน้ำ",
    "description": "นโยบายสวัสดิการที่ใส่ใจสุขอนามัยและสิ่งแวดล้อมควบคู่กันเราจะจัดหากระดาษReuse ไว้สำหรับเพื่อนๆผู้หญิงได้ใช้ห่อผ้าอนามัยก่อนทิ้งลงถังขยะ และ เราจะจัดวางเจลล้างมือไว้บริเวณอ่างล้างมือภายในห้องน้ำ ให้ทุกคนได้ดูแลตัวเองง่ายๆและเพื่อสุขอนามัยที่ดี",
    "icon": "✨",
    "imageType": "emoji",
    "imageValue": "✨",
    "gradientStyle": "12"
  },
  {
    "id": "policy-13",
    "number": "13",
    "tag": "กิจกรรม",
    "title": "เสียงตามสาย",
    "subtitle": "สามารถขอเพลงได้โดยตรงจากพวกเราหรือส่งข้อความมาบอกพวกเราได้ทุกแพลตฟอร์ม",
    "description": "เช้าวันใหม่ที่ดี เริ่มต้นด้วยพลังงานบวกพวกเราพร้อมเสิร์ฟทำนองที่โดนใจ ปลุกความสดชื่นไล่ความง่วงเหงาหาวนอน ให้เสียงเพลงยามเช้าเป็นแรงผลักดันให้ทุกคนพร้อมสตาร์ทวันใหม่อย่างมีความสุขและมีพลังเต็มร้อย",
    "icon": "🎙️",
    "imageType": "emoji",
    "imageValue": "🎙️",
    "gradientStyle": "1"
  },
  {
    "id": "policy-14",
    "number": "14",
    "tag": "สิ่งแวดล้อม",
    "title": "ByeBye กลิ่นใหญ่บ๊อง!",
    "subtitle": "นำเอาสมุนไพรธรรมชาติไปช่วยดับกลิ่นให้ปลอดภัย ไม่มีสารเคมี",
    "description": "ปัญหาเดินเข้าห้องน้ำแล้วต้องกลั้นหายใจพวกเราจะนำเอาสมุนไพรธรรมชาติไปช่วยดับกลิ่นให้ปลอดภัย ไม่มีสารเคมี และที่สำคัญพวกเราจะไม่เอาไปวางทิ้งไว้เฉยๆ แน่นอนแต่จะจัดทีมมาดูแลและเปลี่ยนใหม่ให้ทุกๆสัปดาห์ เพื่อพวกเราชาวม่วงขาวทุกคน",
    "icon": "🌿",
    "imageType": "emoji",
    "imageValue": "🌿",
    "gradientStyle": "2"
  },
  {
    "id": "policy-15",
    "number": "15",
    "tag": "สุขภาพจิต",
    "title": "Hug Space",
    "subtitle": "พื้นที่ฮีลใจสำหรับทุกคน",
    "description": "เราพร้อมรับฟังและให้คำปรึกษาแก่พี่น้องชาวม่วงขาว โดยเรื่องราวของทุกคนจะถูกเก็บไว้เป็นความลับอย่างดีที่สุด ให้เราได้กอดใจและผ่านวันยากๆ ไปด้วยกัน",
    "icon": "❤️",
    "imageType": "emoji",
    "imageValue": "❤️",
    "gradientStyle": "3"
  },
  {
    "id": "policy-16",
    "number": "16",
    "tag": "การสื่อสาร",
    "title": "สภาเปิดการมองเห็น",
    "subtitle": "ใช้พื้นที่สื่อของสภาในการแชร์ความรู้แนะนำแนวทางและส่งต่อโอกาสดีๆ",
    "description": "เหล่าทีมงานสภาของเราจะใช้พื้นที่สื่อของสภาในการแชร์ความรู้แนะนำแนวทางและส่งต่อโอกาสดีๆ ที่เป็นประโยชน์แก่พี่น้องชาวม่วงขาว เพื่อผลักดันให้ชาวม่วงขาวมุ่งสู่โอกาสที่มากขึ้นกว่าเดิม",
    "icon": "💡",
    "imageType": "emoji",
    "imageValue": "💡",
    "gradientStyle": "4"
  }
];

function getPolicyGradient(val) {
  const gradients = {
    "1": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "2": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    "3": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "4": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "5": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "6": "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
    "7": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "8": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "9": "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
    "10": "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)",
    "11": "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)",
    "12": "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
  };
  // Cycle through 1-12 if val is out of range
  const num = parseInt(val);
  if (!isNaN(num) && num > 12) return gradients[String(((num - 1) % 12) + 1)] || gradients["1"];
  return gradients[val] || gradients["1"];
}

function getPolicyColors(val) {
  const colors = {
    "1": { text: "#a78bfa", bg: "rgba(139, 92, 246, 0.1)", border: "rgba(139, 92, 246, 0.2)", glow: "rgba(139, 92, 246, 0.25)" },
    "2": { text: "#34d399", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.2)", glow: "rgba(16, 185, 129, 0.25)" },
    "3": { text: "#38bdf8", bg: "rgba(14, 165, 233, 0.1)", border: "rgba(14, 165, 233, 0.2)", glow: "rgba(14, 165, 233, 0.25)" },
    "4": { text: "#fb7185", bg: "rgba(244, 63, 94, 0.1)", border: "rgba(244, 63, 94, 0.2)", glow: "rgba(244, 63, 94, 0.25)" },
    "5": { text: "#f472b6", bg: "rgba(236, 72, 153, 0.1)", border: "rgba(236, 72, 153, 0.2)", glow: "rgba(236, 72, 153, 0.25)" },
    "6": { text: "#22d3ee", bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.2)", glow: "rgba(6, 182, 212, 0.25)" },
    "7": { text: "#fca5a5", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)", glow: "rgba(239, 68, 68, 0.25)" },
    "8": { text: "#94a3b8", bg: "rgba(148, 163, 184, 0.1)", border: "rgba(148, 163, 184, 0.2)", glow: "rgba(148, 163, 184, 0.25)" },
    "9": { text: "#fbbf24", bg: "rgba(251, 191, 36, 0.1)", border: "rgba(251, 191, 36, 0.2)", glow: "rgba(251, 191, 36, 0.25)" },
    "10": { text: "#86efac", bg: "rgba(134, 239, 172, 0.1)", border: "rgba(134, 239, 172, 0.2)", glow: "rgba(134, 239, 172, 0.25)" },
    "11": { text: "#f87171", bg: "rgba(248, 113, 113, 0.1)", border: "rgba(248, 113, 113, 0.2)", glow: "rgba(248, 113, 113, 0.25)" },
    "12": { text: "#7dd3fc", bg: "rgba(125, 211, 252, 0.1)", border: "rgba(125, 211, 252, 0.2)", glow: "rgba(125, 211, 252, 0.25)" }
  };
  // Cycle if out of range
  const num = parseInt(val);
  if (!isNaN(num) && num > 12) return colors[String(((num - 1) % 12) + 1)] || colors["1"];
  return colors[val] || colors["1"];
}

async function initPoliciesLoader() {
  const policiesGrid = document.getElementById('policiesGrid');
  const bentoGrid = document.getElementById('bentoPoliciesGrid');

  if (!policiesGrid && !bentoGrid) return;

  // Load from localStorage (saved by admin panel) → fallback to JSON file → fallback to defaults
  let list = [];
  try {
    const saved = localStorage.getItem('pakping_policies');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) { /* ignore */ }

  if (list.length === 0) {
    try {
      const res = await fetch('policies_data.json');
      if (res.ok) {
        const parsed = await res.json();
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not fetch policies_data.json natively", e);
    }
  }

  if (list.length === 0) {
    list = [...DYN_DEFAULT_POLICIES];
  }

  // Render on policy.html
  if (policiesGrid) {
    let html = "";
    list.forEach((item, index) => {
      const grad = getPolicyGradient(item.gradientStyle);
      const colors = getPolicyColors(item.gradientStyle);

      html += `
        <div class="policy-slide glow-card" style="opacity: 0; transform: translateY(50px);">
          <div class="policy-slide-glow" style="background: ${grad};"></div>
          <div class="policy-slide-content">
            <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; width: 100%; margin-bottom: 1.5rem;">
              <div class="policy-number-badge" style="background: ${grad}; margin-bottom: 0;">
                <span>${item.number || String(index + 1).padStart(2, '0')}</span>
              </div>
              <span class="policy-slide-tag" style="color: ${colors.text}; background: ${colors.bg}; border-color: ${colors.border}; margin-bottom: 0;">
                <span style="font-size: 0.85rem; margin-right: 4px;">${item.icon || '💡'}</span>
                ${item.tag}
              </span>
            </div>
            <h3 class="policy-slide-title">${item.title}</h3>
            ${item.subtitle ? `<p class="policy-slide-subtitle" style="color: ${colors.text};">${item.subtitle}</p>` : ''}
            <p class="policy-slide-description" style="margin-bottom: 1.5rem;">${item.description}</p>
            <div class="policy-slide-line" style="background: ${grad};"></div>
          </div>
        </div>
      `;
    });
    policiesGrid.innerHTML = html;

    // Update count label dynamically
    const countLabel = document.getElementById('policyCountLabel');
    if (countLabel) countLabel.textContent = list.length;
  }

  // Render on index.html bento grid (first 4 policies)
  if (bentoGrid) {
    let html = "";
    const bentoItems = list.slice(0, 4);
    bentoItems.forEach((item, index) => {
      const grad = getPolicyGradient(item.gradientStyle);
      const colors = getPolicyColors(item.gradientStyle);
      const isLarge = index === 0 || index === 3;

      html += `
        <div class="bento-card ${isLarge ? 'bento-large' : 'bento-medium'} glow-card" style="opacity: 0; transform: translateY(50px) scale(0.95);" onclick="location.href='${window.location.protocol === 'file:' ? 'policy.html' : 'policy'}'">
          <div class="bento-glow" style="background: ${grad};"></div>
          <div class="bento-corner" style="background: ${grad};"></div>
          <div class="bento-content">
            <div class="bento-icon-wrapper">
              <div class="bento-icon-hex" style="background: ${grad}; display:flex; align-items:center; justify-content:center; font-size:1.3rem;">
                ${item.icon || '💡'}
              </div>
              <div class="bento-icon-ring" style="border-color: ${colors.text};"></div>
            </div>
            <div class="bento-text">
              <span class="bento-tag" style="color: ${colors.text}; background: ${colors.bg};">${item.tag}</span>
              <h3 class="bento-title">${item.title}</h3>
              <p class="bento-description">${item.description}</p>
            </div>
            <div class="bento-arrow" style="background: ${grad};">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
          <div class="bento-accent-line" style="background: ${grad};"></div>
        </div>
      `;
    });
    bentoGrid.innerHTML = html;
  }

  // Re-run observer to reveal loaded items nicely
  initIntersectionObserver();
  initGlowCards();
}

/* ─────────────────────────────────────────────
   18. Interactive Department Members Modal
   ───────────────────────────────────────────── */
function initDeptModal() {
  const modal = document.getElementById('deptModal');
  const closeBtn = document.getElementById('deptModalCloseBtn');
  const modalTitle = document.getElementById('deptModalTitle');
  const modalDesc = document.getElementById('deptModalDesc');
  const modalIcon = document.getElementById('deptModalIcon');
  const modalGrid = document.getElementById('deptModalGrid');
  const backdrop = modal ? modal.querySelector('.dept-modal-backdrop') : null;

  if (!modal || !modalGrid) return;

  // Add click handlers for department cards
  document.querySelectorAll('.org-flow-card').forEach(card => {
    card.addEventListener('click', () => {
      const deptName = card.getAttribute('data-dept');
      if (!deptName) return;

      // Extract details from current card
      const title = card.querySelector('.org-flow-title')?.textContent || deptName;
      const desc = card.querySelector('.org-flow-desc')?.textContent || '';
      const iconHTML = card.querySelector('.org-icon-floating')?.innerHTML || '';
      const accentColor = card.style.getPropertyValue('--accent-color') || '#8b5cf6';

      // Set modal header details
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalIcon) {
        modalIcon.innerHTML = iconHTML;
        modalIcon.style.color = accentColor;
        modalIcon.style.background = `${accentColor}14`; // 8% opacity background
        modalIcon.style.borderColor = `${accentColor}33`; // 20% opacity border
      }

      // Filter members belonging to this department
      const members = PAKPING_STAFF_LIST.filter(staff => {
        return staff.role.startsWith(deptName);
      });

      // Build grid HTML
      let gridHTML = '';
      if (members.length > 0) {
        members.forEach((member, idx) => {
          const photoHTML = member.image
            ? `<img src="${member.image}" alt="${member.name}" class="dept-member-photo">`
            : `<div class="image-placeholder-glow" style="width:100%;height:100%;background:radial-gradient(circle, ${accentColor}4d 0%, transparent 70%);opacity:0.6;"></div>
               <div style="position:absolute;font-size:2rem;z-index:2;">👤</div>`;

          gridHTML += `
            <div class="dept-member-card glow-card" style="--accent-color: ${accentColor}; opacity: 0; transform: translateY(20px);">
              <div class="dept-member-img-area">
                ${photoHTML}
              </div>
              <h4 class="dept-member-name">${member.name}</h4>
              <p class="dept-member-role">${member.role}</p>
            </div>
          `;
        });
      } else {
        gridHTML = `<p style="grid-column: span 3; color: var(--text-muted); margin: 2rem 0;">ไม่พบรายชื่อแกนนำของฝ่ายนี้</p>`;
      }

      modalGrid.innerHTML = gridHTML;

      // Open Modal
      modal.classList.add('modal-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Staggered animate members entrance inside modal
      const cards = modalGrid.querySelectorAll('.dept-member-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.style.transition = 'opacity 0.6s var(--ease-smooth), transform 0.6s var(--ease-smooth)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 80);
      });

      // Bind glow card hover effect on dynamically generated elements
      initGlowCards();
    });
  });

  // Close function
  const closeModal = () => {
    modal.classList.remove('modal-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Clear details after transit finishes
    setTimeout(() => {
      modalGrid.innerHTML = '';
    }, 400);
  };

  // Close events
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-open')) {
      closeModal();
    }
  });
}
