export const deliveryOptions = [
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },
  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },
  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

export function getDeliveryOption(deliveryOptionId) {
  // Corrected: Access the external array 'deliveryOptions'
  let matchedOption = null;

  // Use the correct variable name to iterate over the array
  deliveryOptions.forEach((deliveryOption) => {
    if (deliveryOption.id === deliveryOptionId) {
      matchedOption = deliveryOption;
    }
  });

  // If no match is found, return the first option by default
  return matchedOption || deliveryOptions[0];
}
