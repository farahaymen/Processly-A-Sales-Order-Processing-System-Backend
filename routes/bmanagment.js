// import Express Router from express
const { Router } = require("express");

// import our productsController
const bmanagmentController = require("../controllers/bmanagment");

// create an instance of Express Router.
const bmanagmentRouter = Router();

// whenever we receive a GET request on products route '/',
// we will invoke the getProducts method in the products controller.
bmanagmentRouter.get("/report", bmanagmentController.generateReport);

bmanagmentRouter.put("/order", bmanagmentController.updateOrderStatus);

bmanagmentRouter.get("/reminder", bmanagmentController.sendReminderEmail);

// export the router instance we created.
module.exports = bmanagmentRouter;
