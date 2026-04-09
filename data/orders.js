export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

export function getOrderById(orderId) {
  return orders.find((order) => order.id === orderId) || null;
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}
