const nodemailer = require('nodemailer');
const smtpTransport = nodemailer.createTransport({
	host:"smtp.gmail.com",
	auth: require('./settings.js').mailAccount
});

module.exports = smtpTransport;
