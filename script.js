const products = [
  { id: 1, name: "Pistolas lanza agua rígidas de 30 cm", category: "Juguetes", price: 4300, image: "assets/products/water.jpg", tag: "¡Para jugar!" },
  { id: 2, name: "Muñeca con accesorios", category: "Juguetes", price: 5400, image: "assets/products/doll.jpg", tag: "Para regalar" },
  { id: 3, name: "Pilas Triple A (cada una)", category: "Pilas", price: 800, image: "assets/products/batteries.jpg", tag: "Precio por unidad" },
  { id: 4, name: "Set de herramientas para los más peques", category: "Herramientas", price: 7800, image: "assets/products/tools.jpg", tag: "Juego y aprendizaje" },
  { id: 5, name: "Motos de juguete", category: "Juguetes", price: 6100, image: "assets/products/motos.jpg", tag: "Diversión" },
  { id: 6, name: "Pony con accesorios", category: "Juguetes", price: 3500, image: "assets/products/pony.jpg", tag: "Para regalar" },
  { id: 7, name: "Balde con pala y rastrillo", category: "Juguetes", price: 4000, image: "assets/products/bucket1.jpg", tag: "Juegos de playa" },
  { id: 8, name: "Balde con regadera, pala y rastrillo", category: "Juguetes", price: 7000, image: "assets/products/bucket2.jpg", tag: "Juegos de playa" },
  { id: 9, name: "Balde con castillo, pala y rastrillo", category: "Juguetes", price: 6900, image: "assets/products/bucket3.jpg", tag: "Juegos de playa" },
  { id: 10, name: "Castillo con accesorios", category: "Juguetes", price: 6000, image: "assets/products/bucket4.jpg", tag: "Juegos de playa" },
  { id: 11, name: "Accesorios para el pelo", category: "Accesorios", price: 1600, image: "assets/products/hair.jpg", tag: "Ideal para regalar" }
];

// IMPORTANTE: reemplazá este texto por el WhatsApp de Creaciones Luna.
 // Formato internacional, sin +, espacios ni guiones. Argentina: 549 + código de área + número.
const WHATSAPP_NUMBER = "542915058942";

const cart = new Map();
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const toast = document.getElementById("toast");
let activeCategory = "Todos";
let toastTimer;

const money = value => new Intl.NumberFormat("es-AR", {
  style: "currency", currency: "ARS", maximumFractionDigits: 0
}).format(value);

function renderProducts() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesQuery = `${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  productGrid.innerHTML = "";
  if (!filtered.length) {
    productGrid.innerHTML = '<div class="no-results">No encontramos productos con esa búsqueda. Probá con otra palabra ✨</div>';
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">
        <span class="product-tag">${product.tag}</span>
        <img class="product-photo" src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-price">${money(product.price)}</p>
        <button class="add-button" data-add="${product.id}">＋ Agregar al carrito</button>
      </div>`;
    productGrid.appendChild(card);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  showToast("¡Agregado al carrito! 💜");
}

function changeQuantity(id, delta) {
  const next = (cart.get(id) || 0) + delta;
  if (next <= 0) cart.delete(id);
  else cart.set(id, next);
  renderCart();
}

function renderCart() {
  const count = [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
  cartCount.textContent = count;
  const items = document.getElementById("cartItems");
  let total = 0;

  if (!count) {
    items.innerHTML = '<p class="empty-cart">Todavía no agregaste productos.</p>';
  } else {
    items.innerHTML = "";
    cart.forEach((quantity, id) => {
      const product = products.find(item => item.id === id);
      if (!product) return;
      total += product.price * quantity;
      const row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML = `
        <img class="mini-product-photo" src="${product.image}" alt="">
        <div><strong>${product.name}</strong><small>${money(product.price)} c/u</small>
          <div class="quantity">
            <button data-qty="${id}" data-delta="-1" aria-label="Quitar uno">−</button>
            <span>${quantity}</span>
            <button data-qty="${id}" data-delta="1" aria-label="Agregar uno">+</button>
          </div>
        </div>
        <strong>${money(product.price * quantity)}</strong>`;
      items.appendChild(row);
    });
  }
  document.getElementById("cartTotal").textContent = money(total);
}

function openCart() {
  document.body.classList.add("cart-open");
  cartPanel.setAttribute("aria-hidden", "false");
}
function closeCart() {
  document.body.classList.remove("cart-open");
  cartPanel.setAttribute("aria-hidden", "true");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});
document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-qty]");
  if (button) changeQuantity(Number(button.dataset.qty), Number(button.dataset.delta));
});
document.querySelectorAll(".category-card").forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    document.getElementById("productIntro").textContent =
      activeCategory === "Todos" ? "Una selección para empezar a descubrir nuestra tienda." : `Productos de ${activeCategory.toLowerCase()}.`;
    renderProducts();
    document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
  });
});
document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("searchButton").addEventListener("click", () => {
  document.getElementById("searchInput").focus();
  renderProducts();
});
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchBox").scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => document.getElementById("searchInput").focus(), 300);
});
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => {
  if (!cart.size) {
    showToast("Primero agregá algún producto al carrito 😊");
    return;
  }
  if (WHATSAPP_NUMBER.includes("X") || WHATSAPP_NUMBER.length < 10) {
    showToast("Falta configurar el WhatsApp de Creaciones Luna en script.js");
    return;
  }

  let total = 0;
  const lines = [];
  cart.forEach((quantity, id) => {
    const product = products.find(item => item.id === id);
    if (!product) return;
    const subtotal = product.price * quantity;
    total += subtotal;
    lines.push(`• ${product.name} x${quantity} — ${money(subtotal)}`);
  });

  const message = [
    "¡Hola! Quiero hacer este pedido en Creaciones Luna:",
    "",
    ...lines,
    "",
    `Total: ${money(total)}`,
    "",
    "¿Me confirmás disponibilidad? ¡Gracias!"
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});
document.getElementById("menuToggle").addEventListener("click", () => {
  const nav = document.getElementById("nav");
  const opened = nav.classList.toggle("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", String(opened));
});
document.querySelectorAll(".nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("nav").classList.remove("open");
  document.getElementById("menuToggle").setAttribute("aria-expanded", "false");
}));
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
