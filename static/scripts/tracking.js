import { getOrderById } from "../data/orders.js";

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

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    orderId: params.get("orderId"),
    productId: params.get("productId"),
  };
}

function getStatusIndex(orderTimestamp) {
  if (!orderTimestamp) {
    return 1;
  }

  const orderTime = new Date(orderTimestamp).getTime();
  if (Number.isNaN(orderTime)) {
    return 1;
  }

  const elapsedDays = Math.floor((Date.now() - orderTime) / (1000 * 60 * 60 * 24));
  if (elapsedDays <= 0) {
    return 0;
  }
  if (elapsedDays <= 2) {
    return 1;
  }
  return 2;
}

function renderProgress(statusIndex) {
  const progressLabels = document.querySelectorAll(".progress-label");
  progressLabels.forEach((label, index) => {
    label.classList.toggle("current-status", index === statusIndex);
  });

  const progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    const widths = ["10%", "55%", "100%"];
    progressBar.style.width = widths[statusIndex] || "10%";
  }
}

function renderTrackingPage(orderId, productId) {
  const order = getOrderById(orderId);
  if (!order) {
    alert("Order not found.");
    window.location.href = "orders.html";
    return;
  }

  const orderItems = Array.isArray(order.cart) ? order.cart : [];
  const item = orderItems.find((orderItem) => orderItem.productId === productId) || orderItems[0];

  if (!item) {
    alert("No items found for this order.");
    window.location.href = "orders.html";
    return;
  }

  const deliveryDateElement = document.getElementById("delivery-date");
  const productInfoElement = document.getElementById("product-info");
  const quantityInfoElement = document.getElementById("quantity-info");
  const productImageElement = document.getElementById("product-image");

  deliveryDateElement.innerText = `Arriving on ${item.deliveryDate || "N/A"}`;
  productInfoElement.innerText = item.name || "Unknown product";
  quantityInfoElement.innerText = `Quantity: ${item.quantity || 0}`;
  productImageElement.src = item.image || "";
  productImageElement.alt = item.name || "Tracked Product";

  renderProgress(getStatusIndex(order.timestamp));
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartQuantity();

  const { orderId, productId } = getQueryParams();
  if (!orderId) {
    alert("Invalid order ID.");
    window.location.href = "orders.html";
    return;
  }

  renderTrackingPage(orderId, productId);
});
