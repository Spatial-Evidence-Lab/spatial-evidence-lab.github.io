/* ==========================================================
   SPATIAL EVIDENCE LAB
   PUBLICATION ENGINE v4.1B
   Scrollspy + Reading Progress + Mobile TOC
   ========================================================== */

const progressBar=document.querySelector('.publication-progress-bar');

function updateReadingProgress(){

const scrollTop=window.scrollY;
const documentHeight=document.documentElement.scrollHeight-window.innerHeight;
const progress=Math.min((scrollTop/documentHeight)*100,100);

if(progressBar){
progressBar.style.width=`${progress}%`;
}

}

window.addEventListener('scroll',updateReadingProgress,{passive:true});
updateReadingProgress();

/* =========================
   SCROLLSPY
   ========================= */

const sections=document.querySelectorAll('section[id]');
const navLinks=document.querySelectorAll('.publication-toc a,.publication-mobile-panel a');

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

const id=entry.target.id;

navLinks.forEach(link=>{

link.classList.remove('active');

if(link.getAttribute('href')===`#${id}`){
link.classList.add('active');
}

});

}

});

},{
rootMargin:'-40% 0px -50% 0px',
threshold:.1
});

sections.forEach(section=>observer.observe(section));

/* =========================
   SMOOTH SCROLL OFFSET
   ========================= */

navLinks.forEach(link=>{

link.addEventListener('click',event=>{

const href=link.getAttribute('href');

if(!href.startsWith('#')) return;

event.preventDefault();

const target=document.querySelector(href);
if(!target) return;

const offset=90;

const position=target.getBoundingClientRect().top+window.pageYOffset-offset;

window.scrollTo({
 top:position,
 behavior:'smooth'
});

closePublicationMenu();

});

});

/* =========================
   MOBILE TOC
   ========================= */

const mobileButton=document.querySelector('.publication-mobile-button');
const mobilePanel=document.querySelector('.publication-mobile-panel');

function closePublicationMenu(){
if(mobilePanel){
mobilePanel.classList.remove('open');
document.body.classList.remove('publication-lock');
}
}

if(mobileButton){
mobileButton.addEventListener('click',()=>{
mobilePanel.classList.toggle('open');
document.body.classList.toggle('publication-lock');
});
}

/* ESC closes menu */

document.addEventListener('keydown',event=>{
if(event.key==='Escape') closePublicationMenu();
});

/* =========================
   ACTIVE HEADER SHADOW
   ========================= */

const header=document.querySelector('.site-header');

window.addEventListener('scroll',()=>{
if(window.scrollY>40){
header.classList.add('scrolled');
}else{
header.classList.remove('scrolled');
}
},{passive:true});
