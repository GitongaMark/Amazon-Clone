import { products } from "../data/products.js";
import { addToCart } from "../data/cart.js";

console.log("Products loaded successfully");
renderProductsGrid(products);

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
          <select>
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

  // ✅ Add event listeners for "Add to Cart" buttons
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      console.log(`Adding product ID: ${productId} to cart`);
      addToCart(productId); // Import this function from cart.js
    });
  });
}
