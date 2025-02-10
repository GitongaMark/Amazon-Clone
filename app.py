from flask import Flask, render_template, request, redirect, url_for, flash
from payments.paypal import process_paypal_payment
from payments.visa_master import process_card_payment
from payments.mpesa import process_mpesa_payment
from payments.airtel_money import process_airtel_money_payment
from utils import send_order_confirmation_email
from config import Config

app = Flask(__name__)
app.secret_key = "your_secret_key"

# Sample orders database (replace with a real database later)
orders_db = {}

@app.route('/place-order', methods=['POST'])
def place_order():
    order_id = request.form['order_id']
    amount = float(request.form['amount'])
    payment_method = request.form['payment_method']

    try:
        if payment_method == 'paypal':
            result = process_paypal_payment(order_id, amount)
        elif payment_method == 'visa_master':
            card_details = {
                "number": request.form['card_number'],
                "expiry": request.form['card_expiry'],
                "cvv": request.form['card_cvv']
            }
            result = process_card_payment(order_id, amount, card_details)
        elif payment_method == 'mpesa':
            phone_number = request.form['phone_number']
            result = process_mpesa_payment(order_id, amount, phone_number)
        elif payment_method == 'airtel_money':
            phone_number = request.form['phone_number']
            result = process_airtel_money_payment(order_id, amount, phone_number)
        else:
            raise ValueError("Invalid payment method")

        # Save order details
        orders_db[order_id] = {
            "status": "Paid",
            "amount": amount,
            "payment_method": payment_method,
            "result": result
        }

        # Send email confirmation
        customer_email = request.form['email']
        send_order_confirmation_email(customer_email, order_id, amount, payment_method)

        flash("Payment successful! You will receive a confirmation email shortly.")
        return redirect(url_for('orders', order_id=order_id))

    except Exception as e:
        flash(f"Payment failed: {str(e)}")
        return redirect(url_for('payment'))

@app.route('/payment', methods=['GET', 'POST'])
def payment():
    if request.method == 'POST':
        return render_template('payment.html', order_id=request.form['order_id'], amount=request.form['amount'])
    return render_template('payment.html')

@app.route('/orders/<order_id>')
def orders(order_id):
    order = orders_db.get(order_id)
    if not order:
        return "Order not found", 404
    return render_template('orders.html', order=order)

if __name__ == '__main__':
    app.run(debug=True)