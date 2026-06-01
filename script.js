/* ============================================================
   MYA — shared interactions
   ============================================================ */

/* ---------- header scroll state + progress bar ---------- */
(function(){
  const header = document.getElementById('header');
  const progress = document.getElementById('progress');
  function onScroll(){
    const y = window.scrollY || document.documentElement.scrollTop;
    if(header) header.classList.toggle('scrolled', y > 40);
    if(progress){
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

/* ---------- mobile drawer ---------- */
(function(){
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if(!burger || !drawer) return;
  function toggle(){
    const open = drawer.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', toggle);
  drawer.querySelectorAll('[data-close]').forEach(a=>{
    a.addEventListener('click', ()=>{
      drawer.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---------- reveal on scroll ---------- */
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(e=>e.classList.add('in')); return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  },{threshold:.16, rootMargin:'0px 0px -8% 0px'});
  els.forEach(e=>io.observe(e));
})();

/* ---------- count-up stats ---------- */
(function(){
  const nums = document.querySelectorAll('.num[data-count]');
  if(!nums.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      if(el.dataset.plain){ return; }
      const target = parseInt(el.dataset.count,10);
      const span = el.querySelector('.c');
      if(!span) return;
      const dur = 1400; const start = performance.now();
      function step(now){
        const p = Math.min((now-start)/dur,1);
        const eased = 1-Math.pow(1-p,3);
        span.textContent = Math.round(target*eased);
        if(p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  },{threshold:.5});
  nums.forEach(n=>io.observe(n));
})();

/* ---------- contact form (no backend — graceful note) ---------- */
(function(){
  const form = document.getElementById('enquiry');
  if(!form) return;
  const note = document.getElementById('note');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(note) note.classList.add('show');
    form.reset();
  });
  /* float labels for selects */
  form.querySelectorAll('select').forEach(sel=>{
    const sync = ()=> sel.closest('.field').classList.toggle('sel', !!sel.value);
    sel.addEventListener('change', sync); sync();
  });
})();

/* ---------- gallery lightbox ---------- */
(function(){
  const lb = document.getElementById('lightbox');
  if(!lb) return;
  const lbImg = lb.querySelector('img');
  const photos = Array.from(document.querySelectorAll('.gphoto[data-full]'));
  let idx = 0;
  function open(i){
    idx = i;
    lbImg.src = photos[idx].dataset.full;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
  function go(dir){
    idx = (idx + dir + photos.length) % photos.length;
    lbImg.src = photos[idx].dataset.full;
  }
  photos.forEach((p,i)=> p.addEventListener('click', ()=>open(i)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', (e)=>{e.stopPropagation();go(-1);});
  lb.querySelector('.lb-next').addEventListener('click', (e)=>{e.stopPropagation();go(1);});
  lb.addEventListener('click', (e)=>{ if(e.target === lb) close(); });
  document.addEventListener('keydown', (e)=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') go(-1);
    if(e.key==='ArrowRight') go(1);
  });
})();
