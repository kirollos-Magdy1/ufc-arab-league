const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, email, verificationCode }) => {
  const message = `<p>Please login to your account by the following verification code
  ${verificationCode} in no more than 5 minutes</a> </p>`;

  return sendEmail({
    to: email,
    subject: "UFC-Arab-League Email Confirmation",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
