import { getOrderById } from "../data/orders.js"; // Assume this fetches orders by ID

function renderTrackingPage(orderId) {
  const order = getOrderById(orderId);

  if (!order) {
    document.querySelector('.js-tracking-status').innerHTML = "Order not found.";
    return;
  }

  const trackingStages = ['Order Placed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentStage = trackingStages[order.status]; // assuming `status` is an integer representing the stage

  document.querySelector('.js-tracking-status').innerHTML = `
    <div class="tracking-stage">
      Current Status: <strong>${currentStage}</strong>
    </div>
    <div class="tracking-progress-bar" style="width: ${(order.status / trackingStages.length) * 100}%"></div>
  `;
}

function getOrderIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('orderId');
}

const orderId = getOrderIdFromURL();
renderTrackingPage(orderId);
