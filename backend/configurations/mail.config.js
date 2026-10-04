import nodemailer from 'nodemailer';

export default async function sendMail(to, subject = "OTP from Brij Deals", message = `YOUR OTP is 123456`) {

    // CREATE A EMAIL TRANSPORTER
    const transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
    });
    // CONFIGURE EMAIL CONTENT 
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: to,
        subject: subject,
        html: message,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("EMAIL SENT SUCCESSFULY =>", response);
        return response;
    } catch (err) {
        console.log("FAILED TO SEND EMAIL =>", err.message);
        throw err;
    };

}