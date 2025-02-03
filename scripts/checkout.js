import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js"; 
import { getCartItems } from "../data/cart.js"; 

async function loadPage() {
  try {
    // Load local product data
    loadProducts();  

    // Retrieve cart items from local storage
    const cartItems = getCartItems(); 

    // Render summaries using retrieved cart data
    renderOrderSummary(cartItems);
    renderPaymentSummary(cartItems);
  } catch (error) {
    console.log('Unexpected error. Please try again later:', error);
  }
}

// Set event listener for placing an order
function setPlaceOrderListener() {
  const placeOrderButton = document.querySelector('.js-place-order');
  placeOrderButton.addEventListener('click', () => {
    const cartItems = getCartItems(); // Get the latest cart items
    console.log('Order placed:', cartItems);

    // Store order data in local storage (or another method)
    localStorage.setItem('order', JSON.stringify(cartItems));

    // Redirect to orders page
    window.location.href = 'orders.html';
  });
}

// Initialize the page
loadPage();
setPlaceOrderListener();
