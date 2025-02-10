import { getTotalItemsInCart } from '../../data/cart.js';

export function updateCartCount() {
  const totalItems = getTotalItemsInCart();

  // Update the cart count in amazon.html
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.textContent = totalItems;
  }

  // Update the cart count in checkout.html
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}