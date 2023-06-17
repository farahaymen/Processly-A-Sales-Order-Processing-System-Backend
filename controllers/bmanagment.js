// import the validationResult method from express validator
const bmanagmentService = require("../services/bmanagment");
const ordersService = require("../services/orders");
const nodemailer = require("nodemailer");
const axios = require("axios");

var cron = require("node-cron");

module.exports.generateReport = async (req, res) => {
  try {
    // Get all orders for the past week
    const orders = await bmanagmentService.getWeeksOrders();
    console.log(orders);
    // initialize the object
    report = {
      totalRevenue: 0,
      numOfOrders: 0,
      mostSoldProduct: "",
      highestPurchaser: "",
      products: {},
    };
    let maxTotal = 0;
    let productsObj = {};
    // Get the number of orders
    report.numOfOrders = orders.length;
    orders.forEach((order) => {
      // Calculate total revenue
      report.totalRevenue += order.totalPrice;
      // Get the email of the user with the highest purchase
      if (maxTotal < order.totalPrice) {
        maxTotal = order.totalPrice;
        order.totalPrice;
        report.highestPurchaser = order.userId.email;
      }
      // Get
      productsObj[order.productId.name] = productsObj[order.productId.name]
        ? [
            productsObj[order.productId.name][0] + 1,
            productsObj[order.productId.name][1] + order.totalPrice,
          ]
        : [1, order.totalPrice];
    });
    report.products = productsObj;
    maxTotal = 0;
    for (prod in productsObj) {
      if (maxTotal < productsObj[prod][0]) {
        maxTotal = productsObj[prod][0];
        report.mostSoldProduct = prod;
      }
    }

    const addedReport = await bmanagmentService.addNewReport(report);

    return res.send({
      msg: "Report added successfully.",
      report: addedReport,
    });
  } catch (err) {
    res.status(500);
    res.send({
      error: `Couldn't add report ${err.message}`,
    });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await ordersService.editOrder(req);
    return res.send({ order });
  } catch (err) {
    // this denotes a server error, therefore status code should be 500.
    res.status(500);
    return res.send({
      error: err.message,
    });
  }
};

// Prepare the html string of the email
const compileHTMLEmail = (lateOrders) => {
  var now = new Date();

  var htmlEmail = `<head></head>
  <body style="background-color: #eee; padding-top: 20px; padding-left: 20px">
    <!-- this ensures Gmail doesn't trim the email -->
    <span style="opacity: 0; width: 0; height: 0"> ${now} </span>
    <img src="https://i.imgur.com/HTlV5fc.png" width="70" height="70" style="display:block; background-color: #000; padding: 15px; margin-bottom: 30px;" alt="Processly logo"/>
    <h2 style="font-family: 'Open Sans',sans-serif; color: #1a2942;">Here are the orders that are requested 2 days ago and still pending. Please look into them</h2>
    <ul style="padding: 0;">`;
  lateOrders.forEach((order) => {
    htmlEmail += `
    <li style="font-family: 'Open Sans',sans-serif; color: #000000;">Order ${order["_id"]}: <br> Note: ${order["deliveryNote"]} <br> Total price: ${order["totalPrice"]} <br> Quantity: ${order["quantity"]} <br> Client email: ${order["userId"]["email"]}</li>
    `;
  });
  htmlEmail += `
    </ul>
    <h3 style="font-family: 'Open Sans',sans-serif; color: #1a2942;">Call Bavly at 0102 311 2000 to inquire about any of these orders</h3>
    <!-- this ensures Gmail doesn't trim the email -->
    <span style="opacity: 0; width: 0; height: 0"> ${now} </span>    
  </body>
  `;
  return htmlEmail;
};

module.exports.sendReminderEmail = async (req, res) => {
  try {
    var fromEmail = "bavshehata@gmail.com";
    var toEmail = "bavly@bavlifyweb.com";
    //toEmail = "ashrafadel54@gmail.com";
    var subjectEmail = "Reminder";
    var orders = await bmanagmentService.getLateOrders();
    var htmlEmail = compileHTMLEmail(orders);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    var mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subjectEmail,
      html: htmlEmail,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("ERROR SENDING EMAIL");
        console.log(err);
      } else {
        console.log("EMAIL SENT SUCCESSFULLY");
        console.log(info);
        res.send({ info });
      }
    });
  } catch (err) {
    // this denotes a server error, therefore status code should be 500.
    res.status(500);
    return res.send({
      error: err.message,
    });
  }
};

// Will execute every day at midnight GMT-5
var automatedScript = cron.schedule(
  "0 0 0 * * *",
  () => {
    axios.get("https://processly.azurewebsites.net/bmanagment/reminder");
  },
  {
    scheduled: true,
    timezone: "Etc/GMT+2",
  }
);
