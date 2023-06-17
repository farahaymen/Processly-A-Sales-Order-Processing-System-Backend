// import Express Router from express
const { Router } = require("express");

// import the auth validator
const authValidator = require("../validators/auth");

// import our productsController
const authController = require("../controllers/auth");

// create an instance of Express Router.
const authRouter = Router();

// whenever we receive a POST request on auth route '/signup',
// we will invoke the postUser method in the auth controller.
authRouter.post("/signup", authController.postUser);

// whenever we receive a POST request on auth route '/signin',
// we will invoke the postLogin method in the auth controller.
authRouter.post("/signin", authController.postLogin);

authRouter.post(
  "/",
  authValidator.validatePostAuth(), // call our function that returns an array of middlewares for valdiation
  authController.postUser
);

// export the router instance we created.
module.exports = authRouter;
