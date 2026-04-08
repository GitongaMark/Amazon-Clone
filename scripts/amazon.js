import { products } from "../data/products.js";
import { addToCart, getTotalItemsInCart } from "../data/cart.js";

console.log("Products loaded successfully");
renderProductsGrid(products);

function updateCartCount() {
  const totalItems = getTotalItemsInCart();
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = totalItems;
  }
}

window.onload = function () {
  updateCartCount();
};
function renderProductsGrid(products) {
  console.log("Rendering products grid...");
  let productsHTML = "";

  products.forEach((product) => {
    console.log("Rendering product:", product.name);

    const starsUrl = product.getStarsUrl();
    const price = product.getPrice();
    
    // ✅ Get extra info (for clothing, this includes the size chart)
    const extraInfo = product.extraInfoHTML();

    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>
        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>
        <div class="product-rating-container">
          <img class="product-rating-stars" src="${starsUrl}">
          <div class="product-rating-count link-primary">
            ${product.rating?.count || 0}
          </div>
        </div>
        <div class="product-price">
          ${price}
        </div>
        
        <!-- ✅ Add size chart link for clothing -->
        <div class="product-extra-info">
          ${extraInfo}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector">
            ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
          </select>
        </div>
        <div class="product-spacer"></div>
        <div class="added-to-cart">
          <img src="images/icons/checkmark.png">
          Added
        </div>
        <button class="js-add-to-cart add-to-cart-button button-primary" data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHTML;
document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;

    // Find the closest product container
    const productContainer = button.closest(".product-container");
    if (!productContainer) {
      console.error("Error: Could not find product container for this button.");
      return;
    }

    // Find the quantity selector within the product container
    const quantitySelector = productContainer.querySelector(".js-quantity-selector");
    if (!quantitySelector) {
      console.error("Error: Could not find quantity selector for this product.");
      return;
    }

    // Get the selected quantity
    const quantity = parseInt(quantitySelector.value, 10);
    if (isNaN(quantity) || quantity <= 0) {
      console.error("Error: Invalid quantity selected.");
      return;
    }

    console.log(`Adding product ID: ${productId} with quantity: ${quantity} to cart`);
    for (let i = 0; i < quantity; i++) {
      addToCart(productId); // Add the product to the cart multiple times based on quantity
    }
    updateCartCount(); // Update the cart count dynamically
  });
});
}
