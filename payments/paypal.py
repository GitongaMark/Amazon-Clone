import requests
from config import Config

def process_paypal_payment(order_id, amount):
    url = "https://api.paypal.com/v2/checkout/orders"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {Config.PAYPAL_API_KEY}"
    }
    data = {
        "intent": "CAPTURE",
        "purchase_units": [{
            "amount": {
                "currency_code": "USD",
                "value": str(amount)
            }
        }]
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        return response.json()
    else:
        raise Exception("Payment failed")