const { check } = require("express-validator");

module.exports.validatePostAuth = () => {
  const validationMiddlewares = [
    check("email").isEmail().withMessage("User email is invalid."),
  ];
  return validationMiddlewares;
};
