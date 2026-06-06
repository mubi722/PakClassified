// Test email service with Ethereal Email
require('dotenv').config();
const { sendOTP } = require('./tools/emailService');

async function testEmail() {
    try {
        console.log('🧪 Testing email service with Ethereal Email...');
        console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
        console.log('EMAIL_PORT:', process.env.EMAIL_PORT);

        await sendOTP('test@example.com', '123456');
        console.log('✅ Email sent successfully!');
        console.log('📧 Check your console for the preview URL');
    } catch (error) {
        console.error('❌ Email failed:', error.message);
        console.error('Full error:', error);
    }
}

testEmail();