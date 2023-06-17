// import the validationResult method from express validator
const ordersService = require("../services/orders");

module.exports.getOrders = async (req, res) => {
  try {
    var orders;
    if (req.query.email)
      orders = await ordersService.findOrders(req.query.email);
    else if (req.query.orderId)
      orders = await ordersService.getOrder(req.query.orderId);
    else throw new Error("No queries supplied");
    return res.send({ orders });
  } catch (err) {
    // this denotes a server error, therefore status code should be 500.
    res.status(500);
    return res.send({
      error: err.message,
    });
  }
};

module.exports.postOrder = async (req, res) => {
  // get validation errors in the form of an array.
  // const validationErrors = validationResult(req).array();
  // if (validationErrors.length > 0) {
  //   const firstError = validationErrors[0];
  //   return res.status(422).send({
  //     error: firstError.msg,
  //   });
  // }
  const orderInfo = {
    deliveryNote: req.body.deliveryNote,
    userId: req.body.userId,
    productId: req.body.productId,
    quantity: req.body.quantity,
    size: req.body.size,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
  };

  try {
    // const supplierCoords = await azMapsService.geocodeAddress(req.body.address);
    // if supplierCoords is null, which means that no location is found using the given address
    // if (!supplierCoords) {
    //   return res.status(422).send({
    //     error: "Could not find a valid location using the given address.",
    //   });
    // }

    const addedOrder = await ordersService.addNewOrder(orderInfo);

    res.send({
      msg: "Order added successfully.",
      orderId: addedOrder._id,
    });
  } catch (err) {
    res.status(500);
    res.send({
      error: `Couldn't add order ${err.message}`,
    });
  }
};

module.exports.editOrder = async (req, res) => {
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
