const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

const user = "Gmail Sender";
const appPass = "APP Password of Google Account";
const recipient = "Email Receiver";

//Create and Config Transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: appPass,
  },
});

//Config the Email Options/Email Message
const mailOptions = ({ name, message, subject }) => {
  const text = `
      Name: ${name}
      Message: ${message}
      `;

  const html = `
      <h1>Hi, my name is ${name}</h1>
      <p>${message}</p>
      `;
  return {
    from: user,
    to: recipient,
    subject,
    text,
    html,
  };
};

//Export the cloud Function
exports.sendEmail = functions.https.onRequest((req, res) => {
  //Enable CORS
  cors(req, res, () => {
    return transporter.sendMail(mailOptions(req.query), (error, info) => {
      if (error) {
        return res.status(500).send({
          data: {
            status: 500,
            message: error.toString(),
          },
        });
      }

      return res.status(200).send({
        data: {
          status: 200,
          message: "Sent Successful",
        },
      });
    });
  });
});
