import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PAYPAL_API_KEY = os.getenv('PAYPAL_API_KEY')
    VISA_API_KEY = os.getenv('VISA_API_KEY')
    MPESA_API_KEY = os.getenv('MPESA_API_KEY')
    AIRTEL_API_KEY = os.getenv('AIRTEL_API_KEY')

    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_PORT = os.getenv('EMAIL_PORT')
    EMAIL_USER = os.getenv('EMAIL_USER')
    EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')