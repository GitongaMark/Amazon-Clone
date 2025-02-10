import requests
from config import Config

def process_airtel_money_payment(order_id, amount, phone_number):
    url = "https://api.airtelmoney.com/pay"
    headers = {
        "Authorization": f"Bearer {Config.AIRTEL_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "amount": str(amount),
        "phone_number": phone_number,
        "description": f"Order #{order_id}"
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Payment failed")