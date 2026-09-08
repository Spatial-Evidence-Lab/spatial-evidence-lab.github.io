(function(){
  const grid=document.querySelector('[data-project-grid]');
  if(!grid) return;
  fetch('../projects.json').then(r=>r.json()).then(projects=>{
    grid.innerHTML=projects.map(p=>`
      <a class="catalogue-card" href="${p.url}" data-domain="${p.domain}">
        <div class="catalogue-image"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>
        <div class="catalogue-body">
          <div class="catalogue-meta"><span>${p.id}</span><span>${p.status}</span></div>
          <h2>${p.title}</h2>
          <p>${p.summary}</p>
          <span class="catalogue-link">View project →</span>
        </div>
      </a>`).join('');
    const buttons=[...document.querySelectorAll('[data-filter]')];
    const cards=[...grid.querySelectorAll('.catalogue-card')];
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const f=btn.dataset.filter;cards.forEach(c=>c.classList.toggle('hidden',f!=='all'&&c.dataset.domain!==f));
    }));
  }).catch(()=>{grid.innerHTML='<div class="empty-state" style="display:block">Project catalogue could not be loaded. Please refresh the page.</div>';});
})();
