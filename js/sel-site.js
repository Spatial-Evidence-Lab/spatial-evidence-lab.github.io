(function(){
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.site-nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});}

  const sections=[...document.querySelectorAll('.project-section[id]')];
  const links=[...document.querySelectorAll('.project-toc a[href^="#"]')];
  if(sections.length&&links.length&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}})},{rootMargin:'-25% 0px -60% 0px',threshold:0});
    sections.forEach(s=>io.observe(s));
  }

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();
