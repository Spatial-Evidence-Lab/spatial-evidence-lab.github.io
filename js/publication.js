/* ==========================================================
   MAP LIGHTBOX v4.1C
   ========================================================== */

const thumbs=document.querySelectorAll('.atlas-thumb');

thumbs.forEach(button=>{

button.addEventListener('click',()=>{

thumbs.forEach(item=>item.classList.remove('active'));
button.classList.add('active');

const mapId=button.dataset.map.replace('.','-');
const target=document.getElementById(`map-${mapId}`);

if(target){
window.scrollTo({
 top:target.offsetTop-90,
 behavior:'smooth'
});
}

});

});

/* Figure Zoom */

const zoomButtons=document.querySelectorAll('[data-lightbox]');

zoomButtons.forEach(button=>{

button.addEventListener('click',()=>{

const id=button.dataset.lightbox;
const image=document.querySelector(`#map-${id.replace('.','-')} img`);

if(!image)return;

const overlay=document.createElement('div');
overlay.className='figure-lightbox';

overlay.innerHTML=`
<div class="figure-lightbox-inner">
<img src="${image.src}" alt="${image.alt}">
<button class="figure-close">×</button>
</div>`;

document.body.appendChild(overlay);

overlay.querySelector('.figure-close').onclick=()=>overlay.remove();
overlay.onclick=e=>{
if(e.target===overlay) overlay.remove();
};

});

});
