import requests
from config import Config

def process_card_payment(order_id, amount, card_details):
    url = "https://api.visa.com/payment"
    headers = {
        "Authorization": f"Bearer {Config.VISA_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "amount": str(amount),
        "currency": "USD",
        "card": card_details
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Payment failed")