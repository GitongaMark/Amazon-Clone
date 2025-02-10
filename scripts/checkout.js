import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, getProductById } from "../data/products.js";
import { getCartItems, addToCart, getTotalItemsInCart, removeFromCart } from "../data/cart.js";
import { addOrder } from "../data/orders.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

function updateCartCount() {
  const totalItems = getTotalItemsInCart();
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

// Function to handle removing products
function setupRemoveFromCartListeners() {
  document.querySelectorAll('.remove-from-cart-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId; // Get the product ID from the button's data attribute
      removeFromCart(productId); // Remove the product from the cart
      updateCartCount(); // Update the cart count dynamically
      reRenderOrderSummary(); // Re-render the order summary
    });
  });
}

// Function to handle updating quantities
function setupUpdateQuantityListeners() {
  document.querySelectorAll('.update-quantity-button').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId; // Get the product ID
      const quantitySelector = button.closest(".cart-item").querySelector(".js-quantity-selector");
      const newQuantity = parseInt(quantitySelector.value, 10); // Get the new quantity

      if (isNaN(newQuantity) || newQuantity <= 0) {
        alert("Please select a valid quantity.");
        return;
      }

      // Clear the existing product from the cart
      removeFromCart(productId);

      // Add the product back with the new quantity
      for (let i = 0; i < newQuantity; i++) {
        addToCart(productId);
      }

      updateCartCount(); // Update the cart count dynamically
      reRenderOrderSummary(); // Re-render the order summary
    });
  });
}

// Function to re-render the order summary
function reRenderOrderSummary() {
  const cartItems = getCartItems();
  renderOrderSummary(cartItems); // Re-render the order summary with updated cart items
}

window.onload = function () {
  updateCartCount(); // Update the cart count on page load
  setupRemoveFromCartListeners(); // Set up event listeners for removing products
  setupUpdateQuantityListeners(); // Set up event listeners for updating quantities
};

async function loadPage() {
  try {
    // Load local product data
    loadProducts();

    // Retrieve cart items from local storage
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      window.location.href = "amazon.html";
      return;
    }

    // Render summaries using retrieved cart data
    renderOrderSummary(cartItems);
    renderPaymentSummary(cartItems);
  } catch (error) {
    console.error("Unexpected error. Please try again later:", error);
  }
}

// Set event listener for placing an order
// Set event listener for placing an order
export function setPlaceOrderListener() {
  const placeOrderButton = document.querySelector(".js-place-order");
  placeOrderButton.addEventListener("click", () => {
    const cartItems = getCartItems(); // Get the latest cart items
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      return;
    }

    const total = getTotalCartTotal();

    // Create the order object
    const order = {
      cart: cartItems.map(item => {
        const product = getProductById(item.productId);
        const deliveryOption = getDeliveryOption(item.deliveryOptionId); // Get the selected delivery option

        return {
          productId: item.productId,
          name: product?.name || "Unknown Product",
          image: product?.image || "default-image.jpg",
          quantity: item.quantity,
          deliveryDate: calculateDeliveryDate(deliveryOption.deliveryDays), // Calculate delivery date
          priceCents: product?.priceCents || 0,
        };
      }),
      total: total,
      timestamp: new Date().toISOString(),
    };

    console.log("Order placed:", order);

    // Add the order to localStorage
    addOrder(order);

    // Redirect to orders page
    window.location.href = "orders.html";
  });
}

// Function to calculate the total cart total
// Function to get the total cart amount in cents
function getTotalCartTotal() {
  const cartItems = getCartItems(); // Assume this function retrieves the cart items
  return cartItems.reduce((total, item) => {
    const product = getProductById(item.productId); // Assume this function retrieves product details
    return total + (product?.priceCents || 0) * item.quantity;
  }, 0);
}

// Function to generate a unique order ID (for demonstration purposes)
function generateOrderId() {
  return Math.random().toString(36).substr(2, 9); // Generate a random string
}

// Function to redirect to the payment page with the required data
function redirectToPaymentPage() {
  const totalCents = getTotalCartTotal(); // Get the total cart amount in cents
  const totalDollars = (totalCents / 100).toFixed(2); // Convert cents to dollars

  // Generate a unique order ID
  const orderId = generateOrderId();

  // Redirect to the payment page with query parameters
  const paymentUrl = `/payment?order_id=${encodeURIComponent(orderId)}&totalAfterTax=${encodeURIComponent(totalDollars)}`;
  window.location.href = paymentUrl;
}

// Example: Call redirectToPaymentPage when the user clicks the "Proceed to Checkout" button
document.getElementById("proceed-to-checkout-btn").addEventListener("click", function () {
  if (confirm("Are you sure you want to proceed to checkout?")) {
    redirectToPaymentPage();
  }
});

function calculateDeliveryDate(deliveryDays) {
  const today = dayjs(); // Get today's date
  const deliveryDate = today.add(deliveryDays, "days").format("YYYY-MM-DD"); // Add delivery days and format as YYYY-MM-DD
  return deliveryDate;
}

// Initialize the page
loadPage();
setPlaceOrderListener();