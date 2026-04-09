export let orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

export function getOrderById(orderId) {
  const directMatch = orders.find((order) => order.id === orderId);
  if (directMatch) {
    return directMatch;
  }

  const fallbackIndex = orders.findIndex((_, index) => `ORD-${index + 1}` === orderId);
  return fallbackIndex === -1 ? null : orders[fallbackIndex];
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}
