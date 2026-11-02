/* =========================================================
   Bakerz Bite — site logic (vanilla JS, no framework needed)
   ========================================================= */
(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch { return fallback; } },
    set(key, value)    { try { localStorage.setItem(key, value); } catch { /* storage blocked */ } }
  };

  /* ---------------------------------------------------------
     DATA — change images/prices/text here.
     To use your own photo: put it in assets/images/ and set
     image:"assets/images/my-cake.jpg"
     --------------------------------------------------------- */
  const WHATSAPP_NUMBER = "923001234567"; // sample number — replace with the real one

  const products = [
    { id:1,  name:"Velvet Celebration Cake", category:"Cakes",       price:3200, badge:"Bestseller",         image:"assets/images/velvet-cake.svg", description:"Soft red velvet layers with silky cream frosting — perfect for birthdays and special moments.", ingredients:"Wheat flour, cocoa, sugar, eggs, real butter, cream, milk, vanilla.", tags:"chocolate birthday cake" },
    { id:2,  name:"Strawberry Cream Cake",   category:"Cakes",       price:2800, badge:"Fresh today",        image:"assets/images/strawberry-cake.svg", description:"Light sponge layered with fresh cream and sweet strawberry flavour.", ingredients:"Wheat flour, eggs, sugar, cream, strawberries, butter, vanilla.", tags:"fruit strawberry cake" },
    { id:3,  name:"Butter Croissant",        category:"Pastries",    price:350,  badge:"Fresh today",        image:"assets/images/butter-croissant.svg",    description:"Golden, flaky layers with a delicate buttery centre. Lovely with coffee.", ingredients:"Wheat flour, real butter, milk, yeast, sugar, salt.", tags:"croissant breakfast" },
    { id:4,  name:"Chocolate Danish",        category:"Pastries",    price:420,  badge:"Popular",            image:"assets/images/chocolate-danish.svg", description:"A tender pastry with a rich chocolate filling and crisp golden edges.", ingredients:"Wheat flour, butter, cocoa, chocolate, milk, yeast, sugar.", tags:"danish chocolate pastry" },
    { id:5,  name:"Choco Chip Cookies",      category:"Cookies",     price:220,  badge:"Customer favourite", image:"assets/images/choco-chip-cookies.svg", description:"Chewy-centred cookies with chocolate chips and lightly crisp edges.", ingredients:"Wheat flour, butter, brown sugar, eggs, chocolate chips, vanilla.", tags:"cookies biscuit chocolate" },
    { id:6,  name:"Oat & Raisin Cookies",    category:"Cookies",     price:200,  badge:"Homestyle",          image:"assets/images/oat-raisin-cookies.svg",    description:"A homestyle cookie with oats, raisins and a gentle cinnamon note.", ingredients:"Oats, wheat flour, butter, raisins, sugar, eggs, cinnamon.", tags:"oat raisin cookies" },
    { id:7,  name:"Apple Cinnamon Pie",      category:"Pies",        price:550,  badge:"Seasonal",           image:"assets/images/apple-pie.svg",    description:"Warm apple filling and cinnamon tucked inside a golden pastry crust.", ingredients:"Apples, wheat flour, butter, sugar, cinnamon, lemon juice.", tags:"apple pie cinnamon" },
    { id:8,  name:"Lemon Tart",              category:"Pies",        price:480,  badge:"Tangy & sweet",      image:"assets/images/lemon-tart.svg", description:"A buttery tart shell filled with bright, smooth lemon custard.", ingredients:"Wheat flour, butter, eggs, sugar, lemon juice, cream.", tags:"lemon tart pie" },
    { id:9,  name:"Bakerz Bite Mug",         category:"Merchandise", price:650,  badge:"Brand favourite",    image:"assets/images/mug.svg", description:"A reusable branded mug for your daily coffee or tea ritual.", ingredients:"Ceramic mug with printed Bakerz Bite branding. Wash before first use.", tags:"mug cup merchandise" },
    { id:10, name:"Bakery Tote Bag",         category:"Merchandise", price:500,  badge:"Reusable",           image:"assets/images/tote-bag.svg", description:"A handy reusable tote for carrying treats and everyday essentials.", ingredients:"Reusable fabric tote bag with Bakerz Bite-inspired branding.", tags:"bag tote merchandise" },
    { id:11, name:"Bakerz Bite Glass",       category:"Merchandise", price:400,  badge:"New",                image:"assets/images/glass.svg", description:"A simple branded glass for cold drinks and café favourites.", ingredients:"Glass drinkware with branded design. Handle with care.", tags:"glass drinkware merchandise" },
    { id:12, name:"Serving Tray",            category:"Merchandise", price:900,  badge:"Gift idea",          image:"assets/images/tray.svg", description:"A serving tray for sharing coffee, pastries and sweet moments.", ingredients:"Decorative serving tray with Bakerz Bite-inspired branding.", tags:"tray serving merchandise" }
  ];

  /* Gallery photos live in assets/photos/ (see README there). "ratio" = width / height of each tile,
     so the masonry knows each tile's height before the picture loads. */
  const gallery = [
    { src:"assets/gallery/velvet-cake.jpg",        title:"Celebration cakes",    cat:"Cakes",    ratio:323/537 },
    { src:"assets/gallery/butter-croissant.jpg",   title:"Buttery pastries",     cat:"Pastries", ratio:345/252 },
    { src:"assets/gallery/choco-chip-cookies.jpg", title:"Cookie moments",       cat:"Cookies",  ratio:296/250 },
    { src:"assets/gallery/cafe.jpg",               title:"Café favourites",      cat:"Cafe",     ratio:301/288 },
    { src:"assets/gallery/cupcakes.jpg",           title:"Sweet little details", cat:"Cakes",    ratio:345/242 },
    { src:"assets/gallery/apple-pie.jpg",          title:"Warm apple pie",       cat:"Pies",     ratio:296/205 },
    { src:"assets/gallery/brownies.jpg",           title:"Brownies & Bars",      cat:"Cakes",    ratio:301/205 },
    { src:"assets/gallery/cake-slices.jpg",        title:"Cake by the slice",    cat:"Cakes",    ratio:687/1032 }
  ];

  const seedReviews = [
    { name:"Ayesha K.", rating:5, message:"The croissants are unbelievably flaky — still warm when I picked them up!" },
    { name:"Hamza R.",  rating:5, message:"Ordered the Velvet Celebration Cake for my sister's birthday. Everyone loved it." },
    { name:"Sana M.",   rating:4, message:"Lovely café vibe and great cookies. Would love more seating!" }
  ];

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  const money = n => "Rs. " + Number(n).toLocaleString("en-PK");
  const TINT  = { Cakes:["#6b3a2a","#c9764a"], Pastries:["#7a4a1c","#e0a24a"], Cookies:["#5a3a22","#b8793c"], Pies:["#6a3b26","#d98b4a"], Merchandise:["#3a4a45","#7fb99a"], Cafe:["#4a2f22","#b98a5e"] };

  /* Nice-looking offline placeholder (used when a photo can't load) */
  function placeholder(category, label) {
    const [c1, c2] = TINT[category] || TINT.Cakes;
    const text = (label || "Bakerz Bite").replace(/[<>&"]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="800" height="640" fill="url(#g)"/><circle cx="650" cy="110" r="150" fill="#fff" fill-opacity=".07"/><circle cx="120" cy="560" r="190" fill="#fff" fill-opacity=".06"/><circle cx="400" cy="300" r="120" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="6"/><circle cx="400" cy="300" r="94" fill="#fff" fill-opacity=".12"/><text x="400" y="322" font-size="64" font-family="Georgia,serif" font-style="italic" fill="#fff" text-anchor="middle">BB</text><text x="400" y="500" font-size="38" font-family="Georgia,serif" fill="#fff" fill-opacity=".9" text-anchor="middle">${text}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* REAL PHOTOS: for every picture the site first looks for  assets/photos/<name>.jpg (then .webp).
     If that file does not exist it falls back to the drawn picture in assets/images/<name>.svg,
     and as a last resort to a themed placeholder.  So: just drop real photos into assets/photos/ !  */
  const photoChain = path => {
    const m = /^assets\/images\/([^/]+)\.svg$/.exec(path);
    if (!m) return [path];
    const name = m[1], base = name.replace(/-tall$/, "");          // portrait gallery pictures can reuse the normal photo
    const names = base === name ? [name] : [name, base];
    return [...names.flatMap(n => [`assets/photos/${n}.jpg`, `assets/photos/${n}.webp`]), path];
  };
  function setPicture(el, path) {                 // used for pictures changed later (popup, lightbox)
    const chain = photoChain(path);
    delete el.dataset.fellBack; el.dataset.srcs = chain.join("|"); el.dataset.i = "0"; el.src = chain[0];
  }

  /* 'error' does not bubble, so we listen in the capture phase. */
  document.addEventListener("error", e => {
    const el = e.target;
    if (!(el instanceof HTMLImageElement) || el.dataset.fellBack || !el.getAttribute("src") || el.src.startsWith("data:")) return;
    const list = (el.dataset.srcs || "").split("|").filter(Boolean), i = Number(el.dataset.i || 0);
    if (i < list.length - 1) { el.dataset.i = String(i + 1); el.src = list[i + 1]; return; }   // try next candidate
    el.dataset.fellBack = "1";
    el.src = placeholder(el.dataset.fallback || "Cakes", el.alt);
  }, true);

  const img = (path, alt, category, extra = "") => {
    const chain = photoChain(path);
    return `<img src="${chain[0]}" data-srcs="${chain.join("|")}" data-i="0" alt="${alt}" data-fallback="${category}" loading="lazy" decoding="async" ${extra}>`;
  };

  /* ---------------------------------------------------------
     Theme toggle (dark ⇄ light)
     --------------------------------------------------------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.querySelector("use").setAttribute("href", theme === "dark" ? "#i-sun" : "#i-moon");
    themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = theme === "dark" ? "#1b120e" : "#fbf6ee";
  }
  applyTheme(root.getAttribute("data-theme") || "dark");
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next); store.set("bb_theme", next);
  });

  /* ---------------------------------------------------------
     Menu: render, filter, search, sort
     --------------------------------------------------------- */
  const grid = $("#productGrid"), searchInput = $("#productSearch"), sortSelect = $("#productSort");
  const emptyState = $("#emptyState"), resultCount = $("#resultCount");
  let activeCategory = "All";

  function visibleProducts() {
    const q = searchInput.value.trim().toLowerCase();
    let list = products.filter(p =>
      (activeCategory === "All" || p.category === activeCategory) &&
      `${p.name} ${p.category} ${p.description} ${p.tags}`.toLowerCase().includes(q));
    switch (sortSelect.value) {
      case "low":  list.sort((a, b) => a.price - b.price); break;
      case "high": list.sort((a, b) => b.price - a.price); break;
      case "az":   list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }

  function renderProducts() {
    const list = visibleProducts();
    grid.innerHTML = list.map((p, i) => `
      <article class="card" style="animation-delay:${Math.min(i, 8) * 45}ms">
        <div class="card-img">
          ${img(p.image, p.name, p.category)}
          <span class="badge">${p.badge}</span>
        </div>
        <div class="card-body">
          <span class="card-cat">${p.category}</span>
          <h3>${p.name}</h3>
          <p class="card-desc">${p.description}</p>
          <div class="card-foot">
            <span class="price">${money(p.price)}</span>
            <button class="view-btn" type="button" data-product-id="${p.id}">View details</button>
          </div>
        </div>
      </article>`).join("");
    emptyState.hidden = list.length > 0;
    resultCount.textContent = list.length
      ? `Showing ${list.length} ${list.length === 1 ? "item" : "items"}${activeCategory === "All" ? "" : " in " + activeCategory}`
      : "";
  }

  function setCategory(cat) {
    activeCategory = cat || "All";
    $$(".pill").forEach(p => {
      const on = p.dataset.category === activeCategory;
      p.classList.toggle("active", on);
      p.setAttribute("aria-selected", on);
    });
    renderProducts();
  }

  $("#categoryPills").addEventListener("click", e => {
    const b = e.target.closest("[data-category]"); if (b) setCategory(b.dataset.category);
  });
  /* Any link with data-category (nav dropdown, sitemap) filters the menu too */
  $$("a[data-category]").forEach(a => a.addEventListener("click", () => { setCategory(a.dataset.category); closeNav(); }));
  searchInput.addEventListener("input", renderProducts);
  sortSelect.addEventListener("change", renderProducts);

  /* ---------------------------------------------------------
     Dialogs: product details + lightbox
     --------------------------------------------------------- */
  function openDialog(d)  { d.showModal(); document.body.style.overflow = "hidden"; }
  function closeDialog(d) { if (d.open) d.close(); }
  $$("dialog.modal").forEach(d => {
    d.addEventListener("close", () => { document.body.style.overflow = ""; });
    d.addEventListener("click", e => { if (e.target === d || e.target.closest("[data-close]")) closeDialog(d); });
  });

  const productModal = $("#productModal");
  let currentProduct = null;
  grid.addEventListener("click", e => {
    const btn = e.target.closest("[data-product-id]"); if (!btn) return;
    const p = products.find(x => x.id === Number(btn.dataset.productId)); if (!p) return;
    const m = $("#modalImage");
    m.dataset.fallback = p.category;
    setPicture(m, p.image); m.alt = p.name;
    $("#modalCategory").textContent = p.category;
    $("#modalTitle").textContent = p.name;
    $("#modalDescription").textContent = p.description;
    $("#modalIngLabel").textContent = p.category === "Merchandise" ? "Details" : "Ingredients";
    $("#modalIngredients").textContent = p.ingredients;
    $("#modalPrice").textContent = money(p.price);
    currentProduct = p;
    $("#modalOrder").href = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(`Hi Bakerz Bite! I'd like to order: ${p.name} (${money(p.price)})`);
    openDialog(productModal);
  });

  /* ---------------------------------------------------------
     Cart (saved in this browser). Checkout opens WhatsApp in a NEW TAB.
     --------------------------------------------------------- */
  const cartDrawer = $("#cartDrawer"), cartItems = $("#cartItems"), cartFoot = $("#cartFoot");
  const cartCount = $("#cartCount"), cartTotal = $("#cartTotal"), cartOrder = $("#cartOrder"), toastEl = $("#toast");
  let cart = {};
  try { cart = JSON.parse(store.get("bb_cart", "{}")) || {}; } catch { cart = {}; }
  Object.keys(cart).forEach(id => { if (!products.some(p => p.id === Number(id)) || !(cart[id] > 0)) delete cart[id]; });
  const saveCart = () => store.set("bb_cart", JSON.stringify(cart));
  const cartLines = () => Object.keys(cart).map(id => ({ p: products.find(x => x.id === Number(id)), qty: cart[id] })).filter(l => l.p);

  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    try { if (!toastEl.matches(":popover-open")) toastEl.showPopover(); } catch { toastEl.hidden = false; }   /* popover = sits above open dialogs */
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => { try { toastEl.hidePopover(); } catch { toastEl.hidden = true; } }, 300);
    }, 2200);
  }

  function renderCart() {
    const lines = cartLines();
    const count = lines.reduce((t, l) => t + l.qty, 0);
    const total = lines.reduce((t, l) => t + l.qty * l.p.price, 0);
    cartCount.textContent = count; cartCount.hidden = count === 0;
    $("#cartBtn").setAttribute("aria-label", `Open cart (${count} item${count === 1 ? "" : "s"})`);
    cartTotal.textContent = money(total);
    cartFoot.hidden = lines.length === 0;
    if (!lines.length) {
      cartItems.innerHTML = `<p class="cart-empty">Your cart is empty.<br><small>Open any treat and tap “Add to Cart”.</small></p>`;
      return;
    }
    cartItems.innerHTML = lines.map(({ p, qty }) => `
      <div class="cart-line" data-id="${p.id}">
        <div class="cart-thumb">${img(p.image, p.name, p.category)}</div>
        <div class="cart-info">
          <b>${p.name}</b>
          <span>${money(p.price)} each</span>
          <div class="qty">
            <button type="button" data-act="dec" aria-label="Decrease quantity">−</button>
            <span aria-live="polite">${qty}</span>
            <button type="button" data-act="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-side">
          <strong>${money(p.price * qty)}</strong>
          <button type="button" class="cart-remove" data-act="remove" aria-label="Remove ${p.name}">Remove</button>
        </div>
      </div>`).join("");
    const msg = "Hi Bakerz Bite! I'd like to order:\n" +
      lines.map((l, i) => `${i + 1}. ${l.p.name} x${l.qty} — ${money(l.p.price * l.qty)}`).join("\n") +
      `\nTotal: ${money(total)}`;
    cartOrder.href = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(msg);
  }

  function addToCart(p, qty = 1) {
    cart[p.id] = Math.min((cart[p.id] || 0) + qty, 20);
    saveCart(); renderCart();
    const b = $("#cartBtn"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    toast(`${p.name} added to cart`);
  }

  $("#modalAddCart").addEventListener("click", () => { if (currentProduct) addToCart(currentProduct); });
  $("#cartBtn").addEventListener("click", () => { renderCart(); openDialog(cartDrawer); });
  cartItems.addEventListener("click", e => {
    const btn = e.target.closest("[data-act]"); if (!btn) return;
    const id = btn.closest("[data-id]").dataset.id, act = btn.dataset.act;
    if (act === "inc") cart[id] = Math.min((cart[id] || 0) + 1, 20);
    if (act === "dec") cart[id] = (cart[id] || 1) - 1;
    if (act === "remove" || cart[id] <= 0) delete cart[id];
    saveCart(); renderCart();
  });
  $("#cartClear").addEventListener("click", () => { cart = {}; saveCart(); renderCart(); });
  renderCart();

  /* Gallery: plain grid. Tiles appear in exactly the same order as the `gallery` list above
     (left to right, row by row). To change the order, just reorder that list. */
  const galleryGrid = $("#galleryGrid");
  galleryGrid.innerHTML = gallery.map((g, i) =>
    `<button type="button" class="g-tile" data-index="${i}" aria-label="View ${g.title}">${img(g.src, g.title, g.cat)}<span class="g-cap">${g.title}</span></button>`
  ).join("");

  const lightbox = $("#lightbox"), lbImage = $("#lbImage"), lbCaption = $("#lbCaption");
  let lbIndex = 0;
  function showLightbox(i) {
    lbIndex = (i + gallery.length) % gallery.length;
    const g = gallery[lbIndex];
    lbImage.dataset.fallback = g.cat;
    setPicture(lbImage, g.src); lbImage.alt = g.title;
    lbCaption.textContent = `${g.title}  ·  ${lbIndex + 1} / ${gallery.length}`;
  }
  galleryGrid.addEventListener("click", e => {
    const t = e.target.closest("[data-index]"); if (!t) return;
    showLightbox(Number(t.dataset.index)); openDialog(lightbox);
  });
  $("#lbPrev").addEventListener("click", () => showLightbox(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => showLightbox(lbIndex + 1));
  lightbox.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
  });

  /* ---------------------------------------------------------
     Reviews (saved in this browser with localStorage)
     --------------------------------------------------------- */
  const reviewList = $("#reviewList"), reviewForm = $("#reviewForm"), notice = $("#reviewNotice");
  let reviews;
  try { reviews = JSON.parse(store.get("bb_reviews", "null")); } catch { reviews = null; }
  if (!Array.isArray(reviews)) reviews = seedReviews.slice();

  function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }
  function renderReviews() {
    reviewList.replaceChildren(...reviews.slice(0, 6).map(r => {
      const a = document.createElement("article"); a.className = "review";
      const n = document.createElement("strong"); n.textContent = r.name + " ";
      const s = document.createElement("span"); s.className = "review-stars"; s.textContent = stars(r.rating);
      const p = document.createElement("p"); p.textContent = r.message;
      a.append(n, s, p); return a;
    }));
    const avg = reviews.reduce((t, r) => t + r.rating, 0) / reviews.length;
    $("#averageRating").textContent = avg.toFixed(1);
    $("#averageStars").textContent = stars(Math.round(avg));
    $("#ratingCount").textContent = `Based on ${reviews.length} review${reviews.length === 1 ? "" : "s"}`;
  }
  reviewForm.addEventListener("submit", e => {
    e.preventDefault();
    const nameEl = $("#reviewName"), msgEl = $("#reviewMessage");
    const name = nameEl.value.trim(), message = msgEl.value.trim(), rating = Number($("#reviewRating").value);
    nameEl.classList.toggle("invalid", !name); msgEl.classList.toggle("invalid", !message);
    if (!name || !message) { notice.className = "form-note err"; notice.textContent = "Please enter your name and feedback."; return; }
    reviews.unshift({ name, rating, message });
    store.set("bb_reviews", JSON.stringify(reviews.slice(0, 30)));
    renderReviews(); reviewForm.reset();
    notice.className = "form-note ok"; notice.textContent = "Thank you! Your feedback has been added.";
  });
  renderReviews();

  /* ---------------------------------------------------------
     Navigation: burger, dropdown, scroll-spy, header shadow, back-to-top
     --------------------------------------------------------- */
  const burger = $("#burger"), nav = $("#mainNav"), drop = $(".nav-drop"), dropBtn = $(".drop-btn");
  function closeNav() {
    nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
    drop.classList.remove("open"); dropBtn.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  dropBtn.addEventListener("click", () => {
    const open = drop.classList.toggle("open"); dropBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", e => { if (!drop.contains(e.target)) { drop.classList.remove("open"); dropBtn.setAttribute("aria-expanded", "false"); } });
  $$(".nav-link[href]").forEach(a => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeNav(); });
  window.addEventListener("resize", () => { if (innerWidth > 960) closeNav(); });

  const spyLinks = $$("[data-spy]");
  const spyIds = ["home", "menu", "offers", "gallery", "about", "faq", "contact"];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        spyLinks.forEach(l => l.classList.toggle("active", l.dataset.spy === en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spyIds.forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  const header = $("#siteHeader"), toTop = $("#toTop");
  function onScroll() {
    header.classList.toggle("scrolled", scrollY > 10);
    toTop.hidden = scrollY < 700;
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------------------------------------------------------
     Scroll reveal + animated stat counters
     --------------------------------------------------------- */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function countUp(el) {
    const target = Number(el.dataset.count), suffix = el.dataset.suffix || "";
    if (reduce) { el.textContent = target + suffix; return; }
    const start = performance.now(), dur = 1200;
    (function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.dataset.count) countUp(en.target);
      obs.unobserve(en.target);
    }), { threshold: .15 });
    $$(".reveal, [data-count]").forEach(el => io.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));
    $$("[data-count]").forEach(el => el.textContent = el.dataset.count + (el.dataset.suffix || ""));
  }

  /* ---------------------------------------------------------
     Videos (with graceful fallbacks if the file isn't there)
     --------------------------------------------------------- */
  const heroMedia = $("#heroMedia"), heroVideo = $(".hero-video", heroMedia);
  heroVideo.addEventListener("loadeddata", () => heroMedia.classList.add("video-on"));
  heroVideo.play?.().catch(() => { /* autoplay blocked: the photo stays visible */ });

  const kv = $("#kitchenVideo"), kFallback = $("#videoFallback");
  const kSources = $$("source", kv); let kFailed = 0;
  function showKitchenFallback() {
    const fi = $("img", kFallback);
    if (!fi.getAttribute("src")) setPicture(fi, fi.dataset.src);
    kFallback.hidden = false; kv.controls = false; kv.hidden = true;
  }
  kSources.forEach(s => s.addEventListener("error", () => { if (++kFailed === kSources.length) showKitchenFallback(); }));
  kv.addEventListener("loadeddata", () => { kFallback.hidden = true; });

  /* ---------------------------------------------------------
     Ticker: date, time, location + visitor counter
     --------------------------------------------------------- */
  const timeEls = $$(".js-time");
  function tick() {
    const txt = new Date().toLocaleString("en-PK", { weekday:"short", day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", second:"2-digit" });
    timeEls.forEach(el => { el.textContent = txt; });
  }
  /* Duplicate the ticker content so the marquee loops seamlessly */
  const track = $("#tickerTrack"), group = $(".ticker-group", track);
  const clone = group.cloneNode(true); clone.setAttribute("aria-hidden", "true"); track.appendChild(clone);
  const allTime = $$(".js-time"); timeEls.length = 0; allTime.forEach(el => timeEls.push(el));
  tick(); setInterval(tick, 1000);

  /* City guess from the device time-zone (no permission needed) */
  let city = "";
  try { city = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").split("/").pop().replace(/_/g, " "); } catch { /* ignore */ }
  const locEls = $$(".js-loc");
  const setLoc = t => locEls.forEach(el => { el.textContent = t; });
  setLoc(city ? `${city} (tap for exact location)` : "Tap to share location");
  track.addEventListener("click", e => {
    if (!e.target.closest(".js-loc-btn")) return;
    if (!navigator.geolocation) { setLoc("Location not supported on this browser"); return; }
    setLoc("Requesting location…");
    navigator.geolocation.getCurrentPosition(
      pos => setLoc(`${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}${city ? " · " + city : ""}`),
      () => setLoc(city ? `${city} (location permission denied)` : "Location permission denied"),
      { enableHighAccuracy:false, timeout:8000, maximumAge:60000 });
  });

  /* Visitor counter: counts real visits from this browser, on top of a starting number */
  let visits = Number(store.get("bb_visits", "0"));
  try {
    if (!sessionStorage.getItem("bb_counted")) { visits += 1; store.set("bb_visits", String(visits)); sessionStorage.setItem("bb_counted", "1"); }
  } catch { visits += 1; }
  $("#visitorCount").textContent = (1284 + visits).toLocaleString("en-US");

  $("#year").textContent = new Date().getFullYear();


  /* ---------------------------------------------------------
     Navbar account button: show "Hi, Name" when someone is logged in
     (the login / sign-up form itself lives on login.html -> js/auth.js)
     --------------------------------------------------------- */
  (function navAccount() {
    const btn = $("#accountBtn"); if (!btn) return;
    let email = "";
    try { email = sessionStorage.getItem("bb_session") || store.get("bb_session", ""); } catch { email = store.get("bb_session", ""); }
    if (!email) return;
    let users = {}; try { users = JSON.parse(store.get("bb_users", "{}")) || {}; } catch { /* ignore */ }
    const user = users[email]; if (!user) return;
    $(".account-label", btn).textContent = "Hi, " + user.name.split(" ")[0];
    btn.classList.add("signed-in"); btn.setAttribute("aria-label", "Your account");
  })();

  /* Go! */
  renderProducts();
})();

/* ---- animation helpers (added): stagger delay for cards + header shadow on scroll ---- */
(function () {
  const stagger = () => document.querySelectorAll("#productGrid > *, #galleryGrid .g-tile").forEach((el, i) => el.style.setProperty("--i", i % 8));
  const watch = id => { const n = document.getElementById(id); if (n) new MutationObserver(stagger).observe(n, { childList:true, subtree:true }); };
  stagger(); watch("productGrid"); watch("galleryGrid");
  const hdr = document.querySelector(".site-header");
  const onScroll = () => hdr && hdr.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive:true }); onScroll();
})();


/* ---- professional animations (added) ---- */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  document.documentElement.classList.add("anim");

  /* scroll progress bar */
  const bar = document.createElement("div"); bar.className = "scroll-progress"; bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);
  /* hero parallax */
  const heroImg = document.querySelector(".hero-media img");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
      if (heroImg && scrollY < innerHeight * 1.2) heroImg.style.translate = `0 ${scrollY * 0.12}px`;
      ticking = false;
    });
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* scroll reveal for gallery tiles + contact items (re-run when tiles are rebuilt) */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in-view"); o.unobserve(e.target); }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : null;
  const watchTiles = () => document.querySelectorAll(".g-tile:not([data-w]), .contact-details > *:not([data-w]), .section-head:not([data-w])").forEach((el, i) => {
    el.dataset.w = "1";
    if (!io) { el.classList.add("in-view"); return; }
    io.observe(el);
  });
  watchTiles();
  const gg = document.getElementById("galleryGrid");
  if (gg) new MutationObserver(watchTiles).observe(gg, { childList: true });

  /* card tilt (mouse devices only) */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const grid = document.getElementById("productGrid");
    const tilt = (card, e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `translateY(-8px) perspective(800px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
    };
    if (grid) {
      grid.addEventListener("mousemove", e => { const c = e.target.closest("#productGrid > *"); if (c) tilt(c, e); });
      grid.addEventListener("mouseout", e => { const c = e.target.closest("#productGrid > *"); if (c && !c.contains(e.relatedTarget)) c.style.transform = ""; });
    }
  }

  /* button ripple */
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest(".btn"); if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 1.6;
    const s = document.createElement("span"); s.className = "ripple";
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s); setTimeout(() => s.remove(), 700);
  });
})();
