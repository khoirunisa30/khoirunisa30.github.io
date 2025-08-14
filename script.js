// Mobile nav
const hamb = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');
hamb.addEventListener('click', ()=>{
  const expanded = hamb.getAttribute('aria-expanded') === 'true';
  hamb.setAttribute('aria-expanded', String(!expanded));
  nav.style.display = expanded ? 'none' : 'flex';
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      observer.unobserve(e.target);
    }
  });
},{threshold:.15});

document.querySelectorAll('.reveal, .card, .service, .quote').forEach(el=>observer.observe(el));

// Simple cart
const cart = { items: [], get total(){ return this.items.reduce((a,c)=>a+c.price,0) } };
document.querySelectorAll('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    cart.items.push({ name: btn.dataset.name, price: Number(btn.dataset.price) });
    document.getElementById('cart-count').textContent = cart.items.length;
    document.getElementById('cart-total').textContent = toRupiah(cart.total);
  });
});
document.getElementById('checkout').addEventListener('click', ()=>{
  if(!cart.items.length) return alert('Keranjang masih kosong 🙂');
  const list = cart.items.map(i=>`• ${i.name} — ${toRupiah(i.price)}`).join('\n');
  alert(`Ringkasan belanja:\n${list}\n\nTotal: ${toRupiah(cart.total)}\n\nSimulasi checkout selesai (demo).`);
});
function toRupiah(n){ return n.toLocaleString('id-ID', { style:'currency', currency:'IDR' }); }

// Slider
const slidesEl = document.querySelector('.slides');
const slideEls = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dots = document.querySelector('.dots');
let index = 0, timer;

function updateDots(){
  dots.innerHTML = '';
  slideEls.forEach((_,i)=>{
    const b = document.createElement('button');
    if(i===index) b.classList.add('active');
    b.addEventListener('click', ()=>go(i));
    dots.appendChild(b);
  });
}

function go(i){
  index = (i + slideEls.length) % slideEls.length;
  slidesEl.style.transform = `translateX(-${index*100}%)`;
  updateDots();
  restart();
}
function next(){ go(index+1) }
function prev(){ go(index-1) }
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

function autoplay(){ timer = setInterval(next, 3500) }
function stop(){ clearInterval(timer) }
function restart(){ stop(); autoplay() }

// Swipe support
let startX=0;
slidesEl.addEventListener('touchstart', e=>startX=e.touches[0].clientX);
slidesEl.addEventListener('touchend', e=>{
  const dx = e.changedTouches[0].clientX - startX;
  if(Math.abs(dx)>40){ dx>0 ? prev() : next() }
});

updateDots();
autoplay();

// Subtle parallax on hero image
const heroImg = document.querySelector('.hero-art .floating');
window.addEventListener('mousemove', (e)=>{
  const dx = (e.clientX / window.innerWidth - .5) * 10;
  const dy = (e.clientY / window.innerHeight - .5) * 10;
  heroImg.style.transform = `translate(${dx}px, ${-8 + dy/2}px)`;
});
