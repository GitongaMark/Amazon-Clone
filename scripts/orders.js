// orders.js
import { getOrders } from "../data/orders.js"; // Assume orders are stored here
import { formatCurrency } from "../data/money.js"; // Import currency formatting

function renderOrders() {
  const orders = getOrders() || []; // Default to empty array if no orders exist
  let ordersHTML = "";

  if (orders.length === 0) {
    ordersHTML = "<p>No orders found.</p>";
  } else {
    orders.forEach((order) => {
      const orderDate = new Date(order.date);
      const formattedDate = orderDate.toLocaleDateString();

      ordersHTML += `
        <div class="order-item js-order-item" data-order-id="${order.id}">
          <div class="order-header">
            <span class="order-date">${formattedDate}</span>
            <span class="order-total">$${formatCurrency(order.total)}</span>
          </div>
          <div class="order-details js-order-details" id="order-details-${order.id}" style="display: none;">
            <ul>
              ${order.items
                .map((item) => `<li>${item.name} x ${item.quantity}</li>`)
                .join("")}
            </ul>
          </div>
        </div>
      `;
    });
  }

  document.querySelector(".js-orders-list").innerHTML = ordersHTML;
  setOrderDetailListeners();
}

// Toggle order details on click
function setOrderDetailListeners() {
  document.querySelectorAll(".js-order-item").forEach((orderItem) => {
    orderItem.addEventListener("click", () => {
      const orderId = orderItem.dataset.orderId;
      const orderDetails = document.getElementById(`order-details-${orderId}`);
      const isVisible = orderDetails.style.display === "block";
      orderDetails.style.display = isVisible ? "none" : "block";
    });
  });
}

renderOrders();