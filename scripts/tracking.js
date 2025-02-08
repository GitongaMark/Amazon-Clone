// tracking.js
import { getOrderById } from "../data/orders.js"; // Assume this fetches orders by ID
import { formatCurrency } from "../data/money.js"; // Import currency formatting

function renderTrackingPage(orderId) {
  const order = getOrderById(orderId);

  if (!order) {
    document.querySelector(".js-tracking-status").innerHTML = "Order not found.";
    return;
  }

  const trackingStages = ["Order Placed", "Shipped", "In Transit", "Out for Delivery", "Delivered"];
  const currentStage = trackingStages[order.status] || "Unknown Status"; // Handle invalid status

  document.querySelector(".js-tracking-status").innerHTML = `
    <div class="tracking-stage">
      Current Status: <strong>${currentStage}</strong>
    </div>
    <div class="tracking-progress-bar" style="width: ${(order.status / trackingStages.length) * 100}%"></div>
  `;
}

function getOrderIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("orderId");
}

const orderId = getOrderIdFromURL();
if (!orderId) {
  alert("Invalid order ID.");
  window.location.href = "orders.html";
} else {
  renderTrackingPage(orderId);
}