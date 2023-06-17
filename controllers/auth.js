// import the validationResult method from express validator
const { validationResult } = require("express-validator");
const AuthService = require("../services/auth");

module.exports.postUser = async (req, res) => {
  try {
    const userInfo = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
    };

    const userExists = await AuthService.doesUserExist(userInfo.email);
    if (userExists) {
      return res.status(422).send({
        error: "A user with the same email already exists.",
      });
    }
    const validationErrors = validationResult(req).array();
    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      return res.status(422).send({
        error: firstError.msg,
      });
    } else {
      var user = await AuthService.createUser(userInfo);
      const jwt = await AuthService.generateJWT(user);

      res.send({
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        token: jwt,
        message: "Account created successfully.",
      });
    }
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};

module.exports.postLogin = async (req, res) => {
  // extract the email and password from the request body.
  const { email, password } = req.body;
  try {
    const user = await AuthService.checkCredentials(email, password);

    if (!user) {
      return res.status(401).send({
        error:
          "Invalid credentials, please enter the correct email and password.",
      });
    }
    const jwt = await AuthService.generateJWT(user);
    res.send({
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      token: jwt,
      message: "Logged in successfully.",
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
