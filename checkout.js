document.addEventListener("DOMContentLoaded", () => {
  const orderInput = document.getElementById("orderData");
  const preview = document.getElementById("orderPreview");
  const form = document.getElementById("checkoutForm");

  const SHIPPING_COST = 25; 

  
  function buildSummaryFromCart() {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!cart.length) return "No items in cart.";

      let subtotal = 0;
      let itemDetails = "";

      cart.forEach(item => {
        const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
        const price = parseFloat(item.price) || 0;
        const total = qty * price;
        subtotal += total;

        itemDetails += `${item.name} — ₹${price} × ${qty} = ₹${total}\n`;
      });

      const shipping = subtotal > 0 ? SHIPPING_COST : 0;
      const grandTotal = subtotal + shipping;

      const summary =
`${itemDetails}
Subtotal: ₹${subtotal}
Shipping: ₹${shipping}
Grand Total: ₹${grandTotal}`;

      return summary;
    } catch {
      return "Error building summary.";
    }
  }

  // Show order summary on page load
  const savedSummary = buildSummaryFromCart();
  if (orderInput) orderInput.value = savedSummary;
  if (preview) preview.textContent = savedSummary;

  
  form.addEventListener("submit", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const subtotal = cart.reduce((sum, item) => {
      const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
      return sum + (item.price * qty);
    }, 0);

    const shipping = subtotal > 0 ? SHIPPING_COST : 0;
    const grandTotal = subtotal + shipping;

    const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 3);

    
    const finalSummary = buildSummaryFromCart();
    if (orderInput) orderInput.value = finalSummary;
    if (preview) preview.textContent = finalSummary;

    // Save order details to localStorage
    const orderDetails = {
      orderId: orderId,
      cartItems: cart,
      total: grandTotal,
      shipping: SHIPPING_COST,
      status: "Processing",
      estimatedDelivery: estimatedDate
    };
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

    // Clear the cart
    localStorage.removeItem("cart");
  });
});
