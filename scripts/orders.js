
// Import orders data from the external file
import { orders } from '../data/orders.js';

// Fetch cart item count dynamically
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartQuantityElement = document.getElementById('cart-quantity');
cartQuantityElement.innerText = cartItems.length; // Update cart quantity

// Function to display orders
function displayOrders() {
  const ordersGrid = document.getElementById('orders-grid');
  ordersGrid.innerHTML = ''; // Clear the current orders grid

  if (orders.length === 0) {
    ordersGrid.innerHTML = '<div class="empty-orders-message">No orders found.</div>';
    return;
  }

  orders.forEach((order, index) => {
    const orderContainer = document.createElement('div');
    orderContainer.classList.add('order-container');

    // Generate a unique order ID (for demonstration purposes)
    const orderId = `ORD-${index + 1}`;

    // Format the total price
    const formattedTotal = `$${(order.total / 100).toFixed(2)}`;

    // Create the order header
    const orderHeaderHTML = `
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${new Date(order.timestamp).toLocaleDateString()}</div>
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

    // Create the order details grid
    const orderDetailsHTML = `
      <div class="order-details-grid">
        ${order.cart.map(item => `
          <div class="product-image-container">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="product-details">
            <div class="product-name">${item.name} (Quantity: ${item.quantity})</div>
            <div class="product-delivery-date">Arriving on: ${item.deliveryDate || 'N/A'}</div>
            <div class="product-payment-method">Payment Method: ${order.paymentMethod || 'N/A'}</div>
            <button class="buy-again-button button-primary" onclick="buyAgain('${item.id}')">
              <img class="buy-again-icon" src="images/icons/buy-again.png" alt="Buy Again Icon">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>
          <div class="product-actions">
            <a href="tracking.html?orderId=${orderId}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `).join('')}
      </div>
    `;

    // Combine the order header and details
    orderContainer.innerHTML = orderHeaderHTML + orderDetailsHTML;

    // Append the order container to the grid
    ordersGrid.appendChild(orderContainer);
  });
}

// Function to handle "Buy it again" functionality
function buyAgain(productId) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productToAdd = getProductById(productId);

  if (productToAdd) {
    // Add the product back to the cart
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1; // Increment quantity if already in cart
    } else {
      cart.push({ ...productToAdd, quantity: 1 }); // Add new item to cart
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Added "${productToAdd.name}" to your cart!`);
    updateCartQuantity();
  } else {
    alert('Product not found.');
  }
}

// Helper function to get a product by ID (mocked for demonstration)
function getProductById(id) {
  // Mock product data (replace with actual product data source)
  const products = [
    {
      id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      image: 'images/products/athletic-cotton-socks-6-pairs.jpg',
      name: 'Black and Gray Athletic Cotton Socks - 6 Pairs',
      priceCents: 1090,
    },
    // Add more products here...
  ];

  return products.find(product => product.id === id);
}

// Function to update the cart quantity displayed in the header
function updateCartQuantity() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const cartQuantityElement = document.getElementById('cart-quantity');
  cartQuantityElement.innerText = cartItems.reduce((total, item) => total + item.quantity, 0);
}

// Display orders when the page loads
window.onload = () => {
  displayOrders();
};
