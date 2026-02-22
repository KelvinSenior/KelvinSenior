document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('footer-year').textContent=new Date().getFullYear();

  // Scroll reveal for elements with .reveal
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.15});
  reveals.forEach(r=>obs.observe(r));

  // 3D tilt for elements with data-tilt
  function addTilt(el, opts={max:12}){
    const rect = ()=>el.getBoundingClientRect();
    el.addEventListener('mousemove', (ev)=>{
      const r = rect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      const rx = (-y * opts.max).toFixed(2);
      const ry = (x * opts.max).toFixed(2);
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      el.style.boxShadow = `0 20px 50px rgba(2,6,23,0.6)`;
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transform = '';
      el.style.boxShadow = '';
    });
  }
  document.querySelectorAll('[data-tilt]').forEach(el=>addTilt(el,{max:10}));

  // Lightbox for gallery
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.gallery img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lightboxImg.src = img.src;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden','false');
    });
  });
  lightbox.addEventListener('click', (e)=>{
    if(e.target === lightbox || e.target === lightboxImg) {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden','true');
      lightboxImg.src = '#';
    }
  });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ lightbox.classList.remove('show'); lightbox.setAttribute('aria-hidden','true'); }});

  // Subtle parallax on hero based on mouse
  const hero = document.querySelector('.hero');
  const heroCard = document.querySelector('.hero-card');
  if(hero && heroCard){
    hero.addEventListener('mousemove', (ev)=>{
      const w = window.innerWidth, h = window.innerHeight;
      const x = (ev.clientX / w - 0.5) * 8;
      const y = (ev.clientY / h - 0.5) * 8;
      hero.style.backgroundPosition = `${50 - x}% ${50 - y}%`;
      heroCard.style.transform = `translateZ(20px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    hero.addEventListener('mouseleave', ()=>{ heroCard.style.transform=''; hero.style.backgroundPosition='50% 50%'; });
  }

  // Scroll progress bar
  const progress = document.getElementById('progress');
  function updateProgress(){
    const doc = document.documentElement;
    const top = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? Math.min(100, Math.round((top/height)*100)) : 0;
    if(progress) progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  // Skill bars animate when visible
  const skillBars = document.querySelectorAll('.skill-row .bar');
  const skillObserver = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const b = en.target;
        const level = b.getAttribute('data-level') || 60;
        b.style.width = level + '%';
        skillObserver.unobserve(b);
      }
    });
  },{threshold:0.25});
  skillBars.forEach(b=>skillObserver.observe(b));

  // Footer parallax layers: as user scrolls near bottom, show layered movement
  const footer = document.querySelector('.site-footer');
  const footerLayers = [];
  if(footer){
    // create a few subtle gradient layers
    for(let i=0;i<3;i++){
      const d = document.createElement('div');
      d.className = 'footer-layer';
      d.style.background = `radial-gradient(circle at ${20+i*30}% ${30+i*20}%, rgba(37,99,235,${0.06+i*0.02}), transparent 35%)`;
      d.style.transform = 'translateY(0px)';
      footer.insertBefore(d, footer.firstChild);
      footerLayers.push(d);
    }
  }
  function updateFooterParallax(){
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const nearBottom = Math.max(0, (scrollTop - (docHeight*0.6)) / (docHeight*0.4));
    footerLayers.forEach((layer,idx)=>{
      const speed = (idx+1) * 6; // different speeds
      layer.style.transform = `translateY(${ -nearBottom * speed }px)`;
      layer.style.opacity = 0.04 + nearBottom*0.2;
    });
  }
  window.addEventListener('scroll', updateFooterParallax, {passive:true});
  updateFooterParallax();
});
