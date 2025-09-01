
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const grandTotalEl = document.getElementById("grand-total");
  const checkoutLink = document.querySelector(".checkout-btn")?.closest("a");
  const cartCountEl = document.getElementById("cart-count");

  const SHIPPING_COST = 25;

  
  function loadCart() {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch (e) {
      console.error("Invalid cart data in localStorage, resetting.", e);
      localStorage.setItem("cart", JSON.stringify([]));
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(cart);
  }

  function updateCartCount(cart) {
    if (!cartCountEl) return;
    const totalQty = cart.reduce((s, it) => s + (it.quantity || 0), 0);
    cartCountEl.textContent = totalQty;
  }

  function formatPrice(n) {
    return `₹${n}`;
  }

  function renderEmpty() {
    if (!cartContainer) return;
    cartContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    subtotalEl.textContent = `Subtotal: ₹0`;
    shippingEl.textContent = `Shipping: ₹0`;
    grandTotalEl.textContent = `Grand Total: ₹0`;
    if (checkoutLink) checkoutLink.style.pointerEvents = "none";
  }

  function renderCart() {
    const cart = loadCart();

    if (!cartContainer || !subtotalEl || !grandTotalEl || !shippingEl) return;

    if (!cart.length) {
      renderEmpty();
      return;
    }

    checkoutLink && (checkoutLink.style.pointerEvents = "auto");

    cartContainer.innerHTML = ""; 

    let subtotal = 0;

    cart.forEach((item, index) => {
      const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
      const price = parseFloat(item.price) || 0;
      subtotal += price * qty;

      const itemDiv = document.createElement("div");
      itemDiv.className = "cart-item";
      itemDiv.dataset.index = index;

      itemDiv.innerHTML = `
        <img src="${item.image || 'Images/default.png'}" alt="${item.name}" onerror="this.src='Images/default.png'"/>
        <div class="cart-info">
          <h4 class="cart-name">${item.name}</h4>
          <p class="cart-price">${formatPrice(price)}</p>
          <div class="qty-controls">
            <button class="qty-decrease" data-index="${index}" aria-label="Decrease">−</button>
            <input class="qty-input" data-index="${index}" type="number" min="1" value="${qty}" />
            <button class="qty-increase" data-index="${index}" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="cart-actions">
          <p class="item-total">${formatPrice(price * qty)}</p>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;

      cartContainer.appendChild(itemDiv);
    });

    subtotalEl.textContent = `Subtotal: ${formatPrice(subtotal)}`;
    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    shippingEl.textContent = `Shipping: ${formatPrice(shipping)}`;
    grandTotalEl.textContent = `Grand Total: ${formatPrice(subtotal + shipping)}`;

    updateCartCount(cart);
  }

  cartContainer && cartContainer.addEventListener("click", (e) => {
    const cart = loadCart();

    // Remove
    if (e.target.classList.contains("remove-btn")) {
      const idx = Number(e.target.dataset.index);
      if (!Number.isNaN(idx)) {
        cart.splice(idx, 1);
        saveCart(cart);
        renderCart();
      }
      return;
    }

    // Quantity increase
    if (e.target.classList.contains("qty-increase")) {
      const idx = Number(e.target.dataset.index);
      if (!Number.isNaN(idx) && cart[idx]) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
        saveCart(cart);
        renderCart();
      }
      return;
    }

    // Quantity decrease
    if (e.target.classList.contains("qty-decrease")) {
      const idx = Number(e.target.dataset.index);
      if (!Number.isNaN(idx) && cart[idx]) {
        cart[idx].quantity = Math.max(1, (cart[idx].quantity || 1) - 1);
        saveCart(cart);
        renderCart();
      }
      return;
    }
  });


  cartContainer && cartContainer.addEventListener("input", (e) => {
    if (e.target.classList && e.target.classList.contains("qty-input")) {
      const idx = Number(e.target.dataset.index);
      const cart = loadCart();
      let val = parseInt(e.target.value, 10);
      if (Number.isNaN(val) || val < 1) val = 1;
      if (cart[idx]) {
        cart[idx].quantity = val;
        saveCart(cart);
        renderCart();
      }
    }
  });

  if (checkoutLink) {
    checkoutLink.addEventListener("click", (e) => {
     
      e.preventDefault();

      const cart = loadCart();
      if (!cart.length) {
        alert("Your cart is empty.");
        return;
      }

      const orderSummary = cart
        .map((it) => `${it.name} x${it.quantity || 1} - ₹${(parseFloat(it.price) || 0) * (it.quantity || 1)}`)
        .join(", ");

      localStorage.setItem("orderSummary", orderSummary);

      window.location.href = checkoutLink.href;
    });
  }

  
  renderCart();

 
  window.addEventListener("storage", (e) => {
    if (e.key === "cart") renderCart();
  });
});
