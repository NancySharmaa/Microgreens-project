
const cartCountElement = document.getElementById("cart-count");


let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
  let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalQuantity;
}


updateCartCount();


document.querySelectorAll(".product-card button").forEach(button => {
  button.addEventListener("click", function () {
    const productCard = this.closest(".product-card");

    const name = productCard.getAttribute("data-name");
    const price = parseInt(productCard.getAttribute("data-price"));
    const image = productCard.querySelector("img").src;

    const product = { name, price, image, quantity: 1 };

    const existingProductIndex = cart.findIndex(item => item.name === name);
    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  });
});
