import { cart, updateDeliveryOption, removeFromCart } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  // Iterate through each item in the cart
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    // Check if the product exists
    if (!matchingProduct) {
      console.error(`Product with ID ${productId} not found!`);
      return; // Skip the current iteration if product not found
    }

    // Get the selected delivery option for the product
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');

    // Generate the delivery options HTML for the product
    const deliveryOptionsHTML = (product, cartItem) => {
      let html = '';
      deliveryOptions.forEach((option) => {
        const deliveryDate = today.add(option.deliveryDays, 'days');
        const dateString = deliveryDate.format('dddd, MMMM D');
        //const priceString = option.priceCents === 0 ? 'FREE' : `$${formatCurrency(option.priceCents)} -`;
        const formattedPrice = matchingProduct.price ? formatCurrency(matchingProduct.price) : 'N/A';
        const isChecked = option.id === cartItem.deliveryOptionId;

        html += `
          <div class="delivery-option js-delivery-option" 
               data-product-id="${product.id}"
               data-delivery-option-id="${option.id}">
            <input type="radio" 
                   ${isChecked ? 'checked' : ''} 
                   class="delivery-option-input"
                   name="delivery-option-${product.id}">
            <div>
              <div class="delivery-option-date">${dateString}</div>
              <div class="delivery-option-price">${priceString} Shipping</div>
            </div>
          </div>
        `;
      });
      return html;
    };

    // Append the product details to the cart summary HTML
    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: ${dateString}</div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}" alt="${matchingProduct.name}">
          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">${formatCurrency(formattedPrice)}</div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
              <span class="update-quantity-link link-primary">Update</span>
              <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Delete</span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  // Render the generated HTML into the order summary container
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // Add event listeners for delete links
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      renderPaymentSummary();
    });
  });

  // Add event listeners for delivery option changes
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}