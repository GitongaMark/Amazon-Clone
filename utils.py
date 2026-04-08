import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import Config

def send_order_confirmation_email(email, order_id, amount, payment_method):
    msg = MIMEMultipart()
    msg['From'] = Config.EMAIL_USER
    msg['To'] = email
    msg['Subject'] = "Order Confirmation"

    body = f"""
    <h2>Thank you for your order!</h2>
    <p>Your order has been successfully processed.</p>
    <ul>
        <li><strong>Order ID:</strong> {order_id}</li>
        <li><strong>Amount:</strong> ${amount:.2f}</li>
        <li><strong>Payment Method:</strong> {payment_method}</li>
    </ul>
    """
    msg.attach(MIMEText(body, 'html'))

    with smtplib.SMTP(Config.EMAIL_HOST, Config.EMAIL_PORT) as server:
        server.starttls()
        server.login(Config.EMAIL_USER, Config.EMAIL_PASSWORD)
        server.sendmail(Config.EMAIL_USER, email, msg.as_string())