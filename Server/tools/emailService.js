const nodemailer = require('nodemailer');

let transporterPromise = null;

const getTransporter = async () => {
    if (transporterPromise) {
        return transporterPromise;
    }

    transporterPromise = (async () => {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_HOST) {
            const port = Number(process.env.EMAIL_PORT) || 587;
            const isGmail = process.env.EMAIL_HOST.includes('gmail.com');
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port,
                secure: port === 465,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                service: isGmail ? 'gmail' : undefined,
                tls: {
                    rejectUnauthorized: false,
                },
            });
        }

        console.log('No SMTP credentials found in .env. Creating Ethereal test account for email sending.');
        const testAccount = await nodemailer.createTestAccount();
        console.log('Ethereal account created:', testAccount.user);

        return nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    })();

    return transporterPromise;
};

const sendOTP = async (email, otp) => {
    try {
        const transporter = await getTransporter();
        const mailOptions = {
            from: process.env.EMAIL_USER || 'no-reply@pakclassified.local',
            to: email,
            subject: 'Your OTP for PakClassified',
            text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
            html: `<p>Your OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);

        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log(`Preview URL: ${previewUrl}`);
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendOTP };