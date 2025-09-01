document.addEventListener("DOMContentLoaded", () => {
  const statusArea = document.getElementById("status-area");
  const order = JSON.parse(localStorage.getItem("orderDetails"));

  if (!order) {
    statusArea.innerHTML = "<p>No recent orders found.</p>";
    return;
  }

  // Estimate delivery date: today + 3 days
  const today = new Date();
  const estimatedDate = new Date(today);
  estimatedDate.setDate(today.getDate() + 3);

  // Format date
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = estimatedDate.toLocaleDateString("en-GB", options);

  // Build items HTML
  let itemsHtml = "";
  order.cartItems.forEach(item => {
    const qty = item.quantity || 1;
    itemsHtml += `<p>${item.name} — ₹${item.price} × ${qty} = ₹${item.price * qty}</p>`;
  });

  // Final HTML
  statusArea.innerHTML = `
    <h2>Order Details</h2>
    <p><strong>Order ID:</strong> ${order.orderId}</p>
    <p><strong>Estimated Delivery:</strong> ${formattedDate}</p>
    <h3>Items:</h3>
    ${itemsHtml}
    <p><strong>Total:</strong> ₹${order.total}</p>
  `;
});
