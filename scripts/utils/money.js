

export function formatCurrency(priceCents) {
  return (priceCents / 100).toFixed(2); // Convert cents to dollars and round to 2 decimal places
}

export default formatCurrency;