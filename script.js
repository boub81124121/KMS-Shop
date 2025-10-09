// script.js — version complète, autonome avec boutiques, filtre/tri par boutique et produit, panier, CSV, paiement simulé

// Données produits organisées par boutique
const products = [
  {"id":1,"title":"Sérum Visage Hydratant","price":15000,"img":"https://www.endro-cosmetiques.com/cdn/shop/files/serum-hydratant-1-dacide-hyaluronique-endro-cosmetiques-serums-visage-4120923.png?crop=center&height=952&v=1759233413&width=952?text=S%C3%A9rum","desc":"Hydratation longue durée, texture légère.","store":"Beauté & Soins"},
  {"id":2,"title":"Crème Anti-âge","price":20000,"img":"https://www.byphasse.com/wp-content/uploads/2024/04/SUPER-PROTECT-CITY-ANTI-AGING-FACE-CREAM-SPF50-50ML-PRODUCT-SHADOW_5.png?text=Cr%C3%A8me","desc":"Régénère la peau et réduit les rides.","store":"Beauté & Soins"},
  {"id":3,"title":"Sac à Dos Urbain","price":25000,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxFWEHN1KnJ7qNURITH-8QnXATrzUovx5QaQ&s?text=Sac","desc":"Grand volume, poche pour ordinateur portable.","store":"Mode & Accessoires"},
  {"id":4,"title":"Montre Classique Homme","price":85000,"img":"https://www.lepage.fr/40363-home_default/montre-tissot-le-locle-powermatic-80-automatique-cadran-bleu-bracelet-acier-39-mm-t0064071104300.jpg?text=Montre","desc":"Cadran élégant, bracelet en cuir.","store":"Mode & Accessoires"},
  {"id":5,"title":"Lunettes de Soleil","price":30000,"img":"https://terredefrance.fr/cdn/shop/products/3107948238.jpg?v=1754165783?text=Lunettes","desc":"Protection UV et style moderne.","store":"Mode & Accessoires"},
  {"id":6,"title":"Casque Audio Bluetooth","price":35000,"img":"https://png.pngtree.com/png-vector/20201129/ourmid/pngtree-black-and-red-wireless-headset-png-image_2445268.jpg?text=Casque","desc":"Son clair, autonomie 30h.","store":"Tech & Électronique"},
  {"id":7,"title":"Clé USB 128GB","price":12000,"img":"https://media.rueducommerce.fr/rd/products/db3/db3ad36e0edb438655b74cfd0d24101aed4141e3.jpg?text=USB","desc":"Stockage rapide et fiable.","store":"Tech & Électronique"},
  {"id":8,"title":"Enceinte Bluetooth Portable","price":45000,"img":"https://media.rueducommerce.fr/ld/products/00/06/11/94/LD0006119437.jpg?text=Enceinte","desc":"Son puissant, compacte et portable.","store":"Tech & Électronique"}
];

// État global
const state = { siteName: 'SaniShop', products, cart: [], route: 'home', filterStore: 'all', sortBy: 'default' };
const money = v => v.toLocaleString('fr-FR') + ' FCFA';
const q = s => document.querySelector(s);
function qAll(s){ return document.querySelectorAll(s); }

// --- Rendu principal ---
function render(){
  document.title = state.siteName + ' — ' + (state.route||'');
  const sy = document.getElementById('siteYear'); if(sy) sy.textContent = new Date().getFullYear();
  const app = q('#app');
  if(state.route==='home') renderHome(app);
  else if(state.route==='shop') renderShop(app);
  else if(state.route==='product') renderProduct(app, state.productId);
  else if(state.route==='cart') renderCart(app);
  else if(state.route==='profile') renderProfile(app);
  else if(state.route==='about') renderAbout(app);
  else if(state.route==='contact') renderContact(app);
  updateCartCount();
  highlightBottomNav();
}

// --- Pages ---
function renderHome(container){
  const heroImg = "https://static-cse.canva.com/blob/1149256/Ficheproduite.commece.png?text=SaniShop+Promo";

  container.innerHTML = `
  <section class="hero bg-white p-4 rounded-3 mb-4 shadow-sm" id="heroSection">
    <div class="row align-items-center">
      <div class="col-lg-6">
        <h1>Bienvenue sur ${state.siteName} 🚀</h1>
        <p class="lead">Boutique demo responsive — affichage optimisé du 50" au smartphone.</p>
        <div class="d-flex gap-2">
          <button class="btn btn-primary" data-link="shop">Voir la boutique</button>
          <button class="btn btn-outline-light" data-link="about">À propos</button>
        </div>
      </div>
      <div class="col-lg-6 d-none d-lg-block">
        <img src="${heroImg}" class="img-fluid rounded-3" alt="hero">
      </div>
    </div>
  </section>
  <section>
    <h4 class="mb-3">Produits en vedette</h4>
    <div class="row g-3" id="featuredRow"></div>
  </section>
  `;

  const heroSection = document.getElementById('heroSection');

  function updateHero(){
    if(window.innerWidth < 992){ // Mobile
      heroSection.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.79), rgba(0,0,0,0.79)), url(${heroImg})`;
      heroSection.style.backgroundSize = 'cover';
      heroSection.style.backgroundPosition = 'center';
      heroSection.style.color = '#fff';
      heroSection.querySelectorAll('.btn-outline-secondary').forEach(btn=>{
        btn.classList.remove('btn-outline-secondary');
        btn.classList.add('btn-outline-light');
      });
      heroSection.querySelectorAll('.col-lg-6 img').forEach(img => img.style.display = 'none');
    } else { // Desktop
      heroSection.style.backgroundImage = '';
      heroSection.style.color = 'black';
      heroSection.querySelectorAll('.btn-outline-light').forEach(btn=>{
        btn.classList.remove('btn-outline-light');
        btn.classList.add('btn-outline-secondary');
      });
      heroSection.querySelectorAll('.col-lg-6 img').forEach(img => img.style.display = 'block');
    }
  }

  updateHero();
  window.addEventListener('resize', updateHero);

  // Produits en vedette
  const row = q('#featuredRow');
  const featured = state.products.slice(0, 100);
  featured.forEach(p=>{
    const col=document.createElement('div');
    col.className='col-6 col-md-4 col-lg-3';
    col.innerHTML=productCardHTML(p);
    row.appendChild(col);
  });
}




function renderShop(container){
container.innerHTML = `
<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
<h3 id="shopTitle">Boutiques / Produits${state.filterStore !== 'all' ? ` (${state.filterStore})` : ''}</h3>
<div class="d-flex gap-2 flex-wrap">
<select id="filterStoreSelect" class="form-select form-select-sm" style="width:180px">
<option value="all">Toutes les boutiques</option>
<option value="Beauté & Soins">Beauté & Soins</option>
<option value="Mode & Accessoires">Mode & Accessoires</option>
<option value="Tech & Électronique">Tech & Électronique</option>
</select>
<select id="sortSelect" class="form-select form-select-sm" style="width:180px">
<option value="default">Tri par défaut</option>
<option value="price-asc">Prix croissant</option>
<option value="price-desc">Prix décroissant</option>
<option value="name-asc">Nom A → Z</option>
<option value="name-desc">Nom Z → A</option>
</select>
</div>
</div>
<div class="row g-3" id="productsGrid"></div>
`;


const grid = q('#productsGrid');
const filterSelect = q('#filterStoreSelect');
const sortSelect = q('#sortSelect');
const shopTitle = q('#shopTitle');


filterSelect.addEventListener('change', ()=>{
state.filterStore = filterSelect.value;
// Mettre à jour le titre sans re-render complet
shopTitle.textContent = 'Boutiques / Produits' + (state.filterStore !== 'all' ? ` (${state.filterStore})` : '');
renderShopGrid();
});


sortSelect.addEventListener('change', ()=>{ state.sortBy = sortSelect.value; renderShopGrid(); });


function renderShopGrid(){
let filtered = [...state.products];
if(state.filterStore!=='all') filtered = filtered.filter(p=>p.store===state.filterStore);


switch(state.sortBy){
case 'price-asc': filtered.sort((a,b)=>a.price-b.price); break;
case 'price-desc': filtered.sort((a,b)=>b.price-a.price); break;
case 'name-asc': filtered.sort((a,b)=>a.title.localeCompare(b.title)); break;
case 'name-desc': filtered.sort((a,b)=>b.title.localeCompare(a.title)); break;
}


grid.innerHTML='';
filtered.forEach(p=>{ const col=document.createElement('div'); col.className='col-6 col-md-4 col-lg-3'; col.innerHTML=productCardHTML(p); grid.appendChild(col); });
}


renderShopGrid();
}

// Le reste du script (renderProduct, renderCart, panier, CSV, paiement simulé, navigation, utils) reste inchangé


function renderProduct(container,id){
  const p = state.products.find(x=>x.id==id);
  if(!p){ container.innerHTML='<div class="alert alert-warning">Produit non trouvé.</div>'; return }
  container.innerHTML = `
    <div class="row g-3">
      <div class="col-lg-6">
        <div class="product-card p-3 bg-contain">
          <img src="${p.img}" alt="${p.title}" class="img-fluid rounded-2 mb-3">
          <div class="p-2">
            <h4>${p.title}</h4>
            <p class="text-muted">${p.desc}</p>
            <h5 class="mt-3">${money(p.price)}</h5>
            <div class="mt-3 d-flex gap-2">
              <button id="addToCartBtn" class="btn btn-primary">Ajouter au panier</button>
              <button class="btn btn-outline-secondary" data-link="shop">Retour boutique</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="card p-3 shadow-sm">
          <h5>Détails</h5>
          <p class="text-muted">Description complète et caractéristiques techniques.</p>
        </div>
      </div>
    </div>
  `;
  const addBtn=document.getElementById('addToCartBtn'); if(addBtn) addBtn.addEventListener('click', ()=>addToCart(p.id));
}

function renderCart(container){
  if(state.cart.length===0){ container.innerHTML='<div class="alert alert-info">Votre panier est vide. <a href="#" data-link="shop">Voir les produits</a></div>'; return; }
  let total=0;
  container.innerHTML=`<h3>Panier</h3><div id="cartList" class="list-group mb-3"></div><div class="d-flex justify-content-between"><div><strong>Total:</strong> <span id="cartTotal">0</span></div><div class="d-flex gap-2"><button id="exportCsvBtn" class="btn btn-outline-secondary">Exporter CSV</button><button id="checkoutBtn" class="btn btn-success">Commander</button></div></div>`;
  const list=q('#cartList');
  state.cart.forEach(item=>{const p=state.products.find(x=>x.id==item.id);total+=p.price*item.qty;const row=document.createElement('div');row.className='list-group-item d-flex align-items-center gap-3';row.innerHTML=`<img src="${p.img}" style="width:70px;height:50px;border-radius:5px"><div class="flex-grow-1"><div class="d-flex justify-content-between"><strong>${p.title}</strong><small>${money(p.price)}</small></div><div class="mt-2 d-flex align-items-center gap-2"><button class="btn btn-sm btn-outline-secondary dec-btn">-</button><span class="px-2 qty">${item.qty}</span><button class="btn btn-sm btn-outline-secondary inc-btn">+</button><button class="btn btn-sm btn-danger ms-3 remove-btn">Supprimer</button></div></div>`;row.querySelector('.dec-btn').addEventListener('click',()=>changeQty(item.id,-1));row.querySelector('.inc-btn').addEventListener('click',()=>changeQty(item.id,+1));row.querySelector('.remove-btn').addEventListener('click',()=>removeFromCart(item.id));list.appendChild(row);});
  q('#cartTotal').textContent=money(total);
  q('#exportCsvBtn').addEventListener('click',exportCartCSV);
  q('#checkoutBtn').addEventListener('click',()=>openPaymentModal(total));
}

function renderProfile(container){container.innerHTML='<div class="card p-4"><h4>Profil / Connexion</h4><p class="text-muted">Fonction à venir.</p></div>';}
function renderAbout(container){container.innerHTML='<div class="card p-4"><h4>À propos</h4><p class="text-muted">SaniShop — boutique démo responsive.</p></div>';}
function renderContact(container){container.innerHTML='<div class="card p-4"><h4>Contact</h4><p>Email: contact@sanishop.com</p></div>';}

function productCardHTML(p){
  return `
  <div class="product-card p-2 position-relative view-btn" data-id="${p.id}" style="color:#000;">
    <div class="product-bg" style="
      background-image: url('${p.img}');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: var(--card-radius);
      height: 220px;
    "></div>
    <div class="p-2 position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end" style="background: linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)); border-radius: var(--card-radius);">
      <h6 class="text-white mb-1">${p.title}</h6>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-white">${money(p.price)}</small>
        <div>
          <button class="btn btn-sm btn-outline-light me-1 view-btn" data-id="${p.id}">Voir</button>
          <button class="btn btn-sm btn-primary add-btn" data-id="${p.id}"><i class="bi bi-cart-plus"></i></button>
        </div>
      </div>
    </div>
  </div>
  `;
}


// Panier ;alert('Ajouté au panier')
function addToCart(id){const f=state.cart.find(x=>x.id==id);if(f)f.qty++;else state.cart.push({id,qty:1});updateCartCount();}
function changeQty(id,d){const i=state.cart.find(x=>x.id==id);if(!i)return;i.qty+=d;if(i.qty<=0)removeFromCart(id);render();}
function removeFromCart(id){state.cart=state.cart.filter(x=>x.id!=id);render();}
function updateCartCount(){const c=state.cart.reduce((s,i)=>s+i.qty,0);const el=document.getElementById('cartCount');if(el)el.textContent=c;}

// Export CSV
function exportCartCSV(){if(state.cart.length===0)return alert('Panier vide');const headers=['id','title','price','qty','total'];const rows=state.cart.map(i=>{const p=state.products.find(x=>x.id==i.id);return[p.id,p.title,p.price,i.qty,p.price*i.qty];});const csv=[headers.join(','),...rows.map(r=>r.join(','))].join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='panier.csv';a.click();URL.revokeObjectURL(url);}

// Paiement simulé
function openPaymentModal(amount){const html=`<div class="modal fade" id="payModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5>Paiement Simulation</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><p>Montant: <strong>${money(amount)}</strong></p><div class="d-flex gap-2"><button id="stripeSim" class="btn btn-primary flex-fill">Stripe</button><button id="paypalSim" class="btn btn-outline-secondary flex-fill">PayPal</button></div></div></div></div></div>`;const wrap=document.createElement('div');wrap.innerHTML=html;document.body.appendChild(wrap);const modal=new bootstrap.Modal(document.getElementById('payModal'));modal.show();document.getElementById('stripeSim').addEventListener('click',()=>simulatePayment('Stripe',amount,modal));document.getElementById('paypalSim').addEventListener('click',()=>simulatePayment('PayPal',amount,modal));document.getElementById('payModal').addEventListener('hidden.bs.modal',()=>wrap.remove());}
function simulatePayment(provider,amount,modal){const body=document.querySelector('#payModal .modal-body');body.innerHTML=`<p>Paiement en cours via <strong>${provider}</strong>...</p>`;setTimeout(()=>{body.innerHTML=`<div class="text-center"><h5>Paiement réussi ✅</h5><p>Merci pour votre achat via ${provider}</p><button id="closePayOk" class="btn btn-success mt-2">Fermer</button></div>`;document.getElementById('closePayOk').addEventListener('click',()=>{bootstrap.Modal.getInstance(document.getElementById('payModal')).hide();onPaymentSuccess(provider,amount);});},1200);}
function onPaymentSuccess(provider,amount){alert('Paiement simulé via '+provider+' — '+money(amount));state.cart=[];render();}

// Navigation
function navigateTo(route,params){state.route=route;if(params&&params.id)state.productId=params.id;render();}
window.addEventListener('click',e=>{const link=e.target.closest('[data-link]');if(link){e.preventDefault();const route=link.getAttribute('data-link');if(route==='product'){const id=link.getAttribute('data-id');navigateTo('product',{id});}else navigateTo(route);}const add=e.target.closest('.add-btn');if(add){const id=+add.getAttribute('data-id');addToCart(id);}const view=e.target.closest('.view-btn');if(view){const id=+view.getAttribute('data-id');navigateTo('product',{id});}});

function highlightBottomNav(){qAll('.bottom-nav .nav-btn').forEach(b=>{b.classList.remove('active');if(b.getAttribute('data-link')===state.route)b.classList.add('active');});}


document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const cat = item.getAttribute('data-category');
    state.filterStore = cat === 'all' ? 'all' : cat;
    if(state.route !== 'shop') state.route = 'shop';
    render();
  });
});


// Init
render();
