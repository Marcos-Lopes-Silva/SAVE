import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { to, subject, text } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
    //   port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
    
    try {
      await transporter.sendMail({
        from: process.env.GMAIL_EMAIL,
        to: to,
        subject: subject,
        text: text,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false });
    }
  } else {
    res.status(404).json({ message: 'This endpoint requires a POST request.' });
  }
}