import { orders } from "../data/orders.js";
import { addToCart } from "../data/cart.js";
import { formatCurrency } from "./utils/money.js";

function getCartQuantity() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
}

function updateCartQuantity() {
  const cartQuantityElement = document.getElementById("cart-quantity");
  if (cartQuantityElement) {
    cartQuantityElement.innerText = getCartQuantity();
  }
}

function handleBuyAgain(productId) {
  if (!productId) {
    alert("Product not found.");
    return;
  }

  addToCart(productId);
  updateCartQuantity();
  alert("Item added to cart.");
}

function displayOrders() {
  const ordersGrid = document.getElementById("orders-grid");
  if (!ordersGrid) {
    return;
  }

  ordersGrid.innerHTML = "";

  if (orders.length === 0) {
    ordersGrid.innerHTML = '<div class="empty-orders-message">No orders found.</div>';
    return;
  }

  orders.forEach((order, index) => {
    const orderContainer = document.createElement("div");
    orderContainer.classList.add("order-container");

    const orderId = order.id || `ORD-${index + 1}`;
    const orderTotalCents = order.total || 0;
    const formattedTotal = `$${formatCurrency(orderTotalCents)}`;
    const orderDate = order.timestamp ? new Date(order.timestamp).toLocaleDateString() : "N/A";

    const orderHeaderHTML = `
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${orderDate}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>${formattedTotal}</div>
          </div>
        </div>
        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${orderId}</div>
        </div>
      </div>
    `;

    const orderItems = Array.isArray(order.cart) ? order.cart : [];
    const orderDetailsHTML = `
      <div class="order-details-grid">
        ${orderItems
          .map((item) => {
            const productId = item.productId || "";
            const trackingUrl = `tracking.html?orderId=${encodeURIComponent(orderId)}&productId=${encodeURIComponent(productId)}`;

            return `
              <div class="product-image-container">
                <img src="${item.image}" alt="${item.name}">
              </div>
              <div class="product-details">
                <div class="product-name">${item.name} (Quantity: ${item.quantity || 0})</div>
                <div class="product-delivery-date">Arriving on: ${item.deliveryDate || "N/A"}</div>
                <div class="product-payment-method">Payment Method: ${order.payment_method || order.paymentMethod || "N/A"}</div>
                <button class="buy-again-button button-primary js-buy-again" data-product-id="${productId}">
                  <img class="buy-again-icon" src="images/icons/buy-again.png" alt="Buy Again Icon">
                  <span class="buy-again-message">Buy it again</span>
                </button>
              </div>
              <div class="product-actions">
                <a href="${trackingUrl}">
                  <button class="track-package-button button-secondary">
                    Track package
                  </button>
                </a>
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    orderContainer.innerHTML = orderHeaderHTML + orderDetailsHTML;
    ordersGrid.appendChild(orderContainer);
  });

  document.querySelectorAll(".js-buy-again").forEach((button) => {
    button.addEventListener("click", () => {
      handleBuyAgain(button.dataset.productId);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartQuantity();
  displayOrders();
});
