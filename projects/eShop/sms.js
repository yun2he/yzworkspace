const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendOrderConfirmationSMS(phoneNumber, orderDetails) {
    client.messages
        .create({
            body: `Your order has been confirmed. Order details: ${orderDetails}`,
            from: 'YOUR_TWILIO_PHONE_NUMBER',
            to: phoneNumber
        })
        .then(message => console.log(message.sid))
        .catch(error => console.error('Error sending SMS:', error));
}

module.exports = { sendOrderConfirmationSMS };
