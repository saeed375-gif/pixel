// ====== CONFIG ======
// ضع رقم واتساب المتجر هنا (بدون +) مثال فلسطين: 97059XXXXXXX
const STORE_WHATSAPP = "9700595168362"; // <-- عدله

// (اختياري) رابط دفع فيزا/ماستر (Stripe Payment Link أو أي بوابة دفع)
// إذا تركته فارغًا، سيتم فتح واتساب تلقائيًا لطلب رابط الدفع من المتجر.
const VISA_PAYMENT_LINK = ""; // <-- ضع الرابط هنا إذا توفر

// منتجات تجريبية (عدل الأسعار/الوصف لاحقًا)
const PRODUCTS = [
  {
    id: "hoodie-basic",
    type: "hoodie",
    title: "هودي — Basic",
    price: 120,
    currency: "₪",
    meta: "خامة ممتازة + طباعة ثابتة. مناسب للتصميمات البسيطة.",
    tag: "الأكثر طلبًا"
  },
  {
    id: "hoodie-premium",
    type: "hoodie",
    title: "هودي — Premium",
    price: 150,
    currency: "₪",
    meta: "خامة أثقل + طباعة أفضل للتفاصيل.",
    tag: "Premium"
  },
  {
    id: "tshirt-basic",
    type: "tshirt",
    title: "بلايز نص كم — Basic",
    price: 70,
    currency: "₪",
    meta: "خفيفة ومريحة. مناسبة للطباعة الأمامية.",
    tag: "خفيف"
  },
  {
    id: "tshirt-premium",
    type: "tshirt",
    title: "بلايز نص كم — Premium",
    price: 90,
    currency: "₪",
    meta: "قماش أعلى جودة وثبات لون أفضل.",
    tag: "Premium"
  },
  {
    id: "custom-order",
    type: "custom",
    title: "طلب تصميم خاص",
    price: 0,
    currency: "₪",
    meta: "ارفع تصميمك أو اشرح فكرتك وسنؤكد السعر على واتساب.",
    tag: "حسب الطلب",
    isCustom: true
  }
];

// ====== HELPERS ======
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (n, c) => `${c}${n}`;

function waUrl(message){
  const text = encodeURIComponent(message);
  return `https://wa.me/${STORE_WHATSAPP}?text=${text}`;
}

function save(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}
function load(key, fallback){
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

// ====== THEME (Dark/Light) ======
const THEME_KEY = "pixel_theme";
const themeToggle = qs("#themeToggle");
const themeIcon = qs("#themeIcon");

function setTheme(theme){
  const t = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  save(THEME_KEY, t);

  // update icon (show next mode)
  if(themeIcon){
    themeIcon.textContent = t === "light" ? "🌙" : "☀️";
  }

  // update browser UI color
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta){
    meta.setAttribute("content", t === "light" ? "#ffffff" : "#0b0b0f");
  }
}

// init theme
setTheme(load(THEME_KEY, "dark"));

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  setTheme(current === "dark" ? "light" : "dark");
});

// ====== NAV (Mobile) ======
const navToggle = qs("#navToggle");
const navMenu = qs("#navMenu");
if(navToggle){
  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}
qsa('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", () => navMenu?.classList.remove("is-open"));
});

// ====== HERO PREVIEW ======
const designPreview = qs("#designPreview");
const previewText = qs("#previewText");
const previewProduct = qs("#previewProduct");
const previewColor = qs("#previewColor");
const quickAdd = qs("#quickAdd");

function updatePreview(){
  const t = (previewText?.value || "PIXEL").trim() || "PIXEL";
  const p = previewProduct?.value || "هودي";
  const c = previewColor?.value || "أسود";
  if(designPreview){
    designPreview.textContent = t.toUpperCase();
    designPreview.setAttribute("data-product", p);
    designPreview.setAttribute("data-color", c);
  }
}
previewText?.addEventListener("input", updatePreview);
previewProduct?.addEventListener("change", updatePreview);
previewColor?.addEventListener("change", updatePreview);
updatePreview();

// ====== PRODUCTS RENDER ======
const productGrid = qs("#productGrid");
const searchInput = qs("#searchInput");
const filterButtons = qsa(".pill");

function productCard(p){
  const tagClass = p.type === "custom" ? "tag tag--custom" : "tag";
  const priceHtml = p.isCustom ? `<span class="price">حسب الاتفاق</span>` : `<span class="price">${fmt(p.price, p.currency)}</span>`;

  const actionPrimary = p.isCustom
    ? `<a class="btn btn--primary" href="#custom">ابدأ الطلب</a>`
    : `<button class="btn btn--primary" data-add="${p.id}">أضف للسلة</button>`;

  const actionSecondary = p.isCustom
    ? `<a class="btn btn--ghost" href="#faq">كيف؟</a>`
    : `<a class="btn btn--ghost" href="#custom">تصميم خاص</a>`;

  return `
    <article class="card product" data-type="${p.type}" data-title="${p.title}">
      <div class="product__img" aria-hidden="true"></div>
      <div class="product__title">
        <span>${p.title}</span>
        ${priceHtml}
      </div>
      <div class="${tagClass}">${p.tag}</div>
      <div class="product__meta">${p.meta}</div>
      <div class="product__actions">
        ${actionPrimary}
        ${actionSecondary}
      </div>
    </article>
  `;
}

function renderProducts(list){
  if(!productGrid) return;
  productGrid.innerHTML = list.map(productCard).join("");
}

renderProducts(PRODUCTS);

// ====== FILTER + SEARCH ======
let activeFilter = "all";

function applyFilter(){
  const query = (searchInput?.value || "").trim().toLowerCase();
  const list = PRODUCTS.filter(p => {
    const matchesFilter = activeFilter === "all" ? true : p.type === activeFilter;
    const matchesSearch = !query ? true : p.title.toLowerCase().includes(query) || p.meta.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
  renderProducts(list);
  wireAddButtons();
}

filterButtons.forEach(btn=>{
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    applyFilter();
  });
});
searchInput?.addEventListener("input", applyFilter);

// ====== CART ======
const cartBtn = qs("#cartBtn");
const cartDrawer = qs("#cartDrawer");
const drawerOverlay = qs("#drawerOverlay");
const closeCart = qs("#closeCart");
const cartItemsEl = qs("#cartItems");
const cartTotalEl = qs("#cartTotal");
const cartCountEl = qs("#cartCount");
const cartSubtitle = qs("#cartSubtitle");
const checkoutBtn = qs("#checkoutBtn");
const clearCartBtn = qs("#clearCartBtn");

let cart = load("pixel_cart", []);

function openCart(){
  cartDrawer?.classList.add("is-open");
  cartDrawer?.setAttribute("aria-hidden", "false");
  renderCart();
}
function closeCartFn(){
  cartDrawer?.classList.remove("is-open");
  cartDrawer?.setAttribute("aria-hidden", "true");
}
cartBtn?.addEventListener("click", openCart);
drawerOverlay?.addEventListener("click", closeCartFn);
closeCart?.addEventListener("click", closeCartFn);

function addToCart(productId, options = {}){
  const p = PRODUCTS.find(x=>x.id === productId);
  if(!p) return;
  const existing = cart.find(i => i.id === productId && JSON.stringify(i.options||{}) === JSON.stringify(options));
  if(existing) existing.qty += 1;
  else cart.push({ id: p.id, title: p.title, price: p.price, currency: p.currency, qty: 1, options });
  save("pixel_cart", cart);
  renderCart();
  toast(`تمت الإضافة للسلة: ${p.title}`);
}

function removeFromCart(index){
  cart.splice(index, 1);
  save("pixel_cart", cart);
  renderCart();
}

function changeQty(index, delta){
  const it = cart[index];
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) cart.splice(index, 1);
  save("pixel_cart", cart);
  renderCart();
}

function calcTotal(){
  let total = 0;
  for(const it of cart){
    total += (it.price || 0) * it.qty;
  }
  return total;
}

function renderCart(){
  if(!cartItemsEl) return;

  cartCountEl.textContent = cart.reduce((a,b)=>a + b.qty, 0);

  if(cart.length === 0){
    cartItemsEl.innerHTML = `<div class="hint">سلتك فاضية. أضف منتجًا من قسم المتجر.</div>`;
    cartTotalEl.textContent = "₪0";
    cartSubtitle.textContent = "لا يوجد عناصر";
    return;
  }

  cartSubtitle.textContent = `${cart.length} عنصر`;
  cartItemsEl.innerHTML = cart.map((it, idx) => `
    <div class="cartItem">
      <div class="cartItem__thumb" aria-hidden="true"></div>
      <div style="flex:1">
        <div class="cartItem__title">${it.title}</div>
        <div class="cartItem__meta">
          السعر: ${it.price ? fmt(it.price, it.currency) : "حسب الاتفاق"}
        </div>
        <div class="cartItem__row">
          <div class="qty">
            <button aria-label="minus" data-qty="-1" data-idx="${idx}">−</button>
            <span>${it.qty}</span>
            <button aria-label="plus" data-qty="1" data-idx="${idx}">+</button>
          </div>
          <button class="iconBtn" data-remove="${idx}" aria-label="remove">🗑</button>
        </div>
      </div>
    </div>
  `).join("");

  const total = calcTotal();
  cartTotalEl.textContent = fmt(total, "₪");

  // events
  qsa("[data-remove]").forEach(btn=>{
    btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.remove)));
  });
  qsa("[data-qty]").forEach(btn=>{
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.idx), Number(btn.dataset.qty)));
  });
}

function wireAddButtons(){
  qsa("[data-add]").forEach(btn=>{
    btn.addEventListener("click", () => addToCart(btn.dataset.add));
  });
}
wireAddButtons();

quickAdd?.addEventListener("click", () => {
  const p = previewProduct?.value || "هودي";
  const c = previewColor?.value || "أسود";
  const t = (previewText?.value || "PIXEL").trim() || "PIXEL";
  // اختيار المنتج للتجربة
  const id = p.includes("هودي") ? "hoodie-basic" : "tshirt-basic";
  addToCart(id, { color: c, text: t });
});

// ====== CHECKOUT TO WHATSAPP ======
function buildOrderMessage(payMethodLabel){
  const lines = cart.map((it, i) => {
    const opts = it.options && Object.keys(it.options).length
      ? ` | خيارات: ${Object.entries(it.options).map(([k,v])=>`${k}:${v}`).join(", ")}`
      : "";
    const unit = it.price ? fmt(it.price, it.currency) : "حسب الاتفاق";
    return `${i+1}) ${it.title} — عدد: ${it.qty} — سعر/قطعة: ${unit}${opts}`;
  });

  const total = calcTotal();
  return (
`السلام عليكم،
أريد طلب من Pixel.ps:

${lines.join("\n")}

الإجمالي التقريبي: ₪${total}
طريقة الدفع: ${payMethodLabel}
الاسم:
المنطقة:
ملاحظات:`
  );
}

checkoutBtn?.addEventListener("click", () => {
  if(cart.length === 0){
    toast("السلة فارغة.");
    return;
  }

  const payMethod = (qs('input[name="payMethod"]:checked')?.value) || "whatsapp";
  const payLabel = payMethod === "visa" ? "فيزا/ماستر (رابط دفع)" : "واتساب (نقد/تحويل عند التسليم)";
  const msg = buildOrderMessage(payLabel);

  if(payMethod === "visa"){
    if(VISA_PAYMENT_LINK && VISA_PAYMENT_LINK.trim()){
      window.open(VISA_PAYMENT_LINK.trim(), "_blank", "noopener");
      toast("تم فتح رابط الدفع ✅");
    }else{
      toast("سيتم فتح واتساب لطلب رابط الدفع ✅");
      window.open(waUrl(msg), "_blank", "noopener");
    }
    return;
  }

  // default: WhatsApp checkout
  window.open(waUrl(msg), "_blank", "noopener");
});

// ====== CLEAR CART ======
clearCartBtn?.addEventListener("click", () => {
  cart = [];
  save("pixel_cart", cart);
  renderCart();
  toast("تم تفريغ السلة.");
});

// ====== CUSTOM FORM -> WhatsApp ======
const customForm = qs("#customForm");
const saveDraftBtn = qs("#saveDraft");
const toastEl = qs("#toast");

function toast(text){
  if(!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add("is-show");
  setTimeout(()=>toastEl.classList.remove("is-show"), 2400);
}

function fillDraft(){
  const draft = load("pixel_custom_draft", null);
  if(!draft || !customForm) return;
  for(const [k,v] of Object.entries(draft)){
    const el = customForm.elements[k];
    if(el) el.value = v;
  }
}
fillDraft();

saveDraftBtn?.addEventListener("click", () => {
  if(!customForm) return;
  const data = Object.fromEntries(new FormData(customForm).entries());
  save("pixel_custom_draft", data);
  toast("تم حفظ المسودة ✅");
});

customForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(customForm).entries());

  const msg =
`طلب تصميم حسب الطلب — Pixel.ps

الاسم: ${data.name}
واتساب: ${data.phone}

المنتج: ${data.product}
المقاس: ${data.size}
اللون: ${data.color}
مكان الطباعة: ${data.printPlace}

وصف التصميم:
${data.idea}

رابط التصميم: ${data.designLink || "-"}
ملاحظات: ${data.notes || "-"}

رجاءً أكدوا السعر والمدة.`;

  window.open(waUrl(msg), "_blank", "noopener");
  toast("تم فتح واتساب لإرسال الطلب ✅");
});

// ====== Contact Form -> WhatsApp ======
const contactForm = qs("#contactForm");
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(contactForm).entries());
  const msg =
`رسالة من موقع Pixel.ps

الاسم: ${data.cname}
رقم: ${data.cphone || "-"}

الرسالة:
${data.cmsg}`;
  window.open(waUrl(msg), "_blank", "noopener");
});

// ====== WhatsApp Links ======
const fabWa = qs("#fabWa");
const waLink = qs("#waLink");
const helloMsg = `مرحبًا Pixel.ps 👋
عندي استفسار/طلب.`;

[fabWa, waLink].forEach(a=>{
  if(a) a.href = waUrl(helloMsg);
});

// ====== FOOTER YEAR ======
qs("#year").textContent = new Date().getFullYear();

// Render initial cart UI
renderCart();
