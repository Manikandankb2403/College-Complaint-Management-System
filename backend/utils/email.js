const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log('Sending email to:', to);
    console.log('Email config:', {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS ? '****' : 'undefined'
    });
    const info = await transporter.sendMail({
      from: `"Complaint Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error.message);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmail };