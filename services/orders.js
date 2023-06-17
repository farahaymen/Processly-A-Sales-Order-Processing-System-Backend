const OrderModel = require("../models/Order");
module.exports.addNewOrder = async (orderInfo) => {
  const order = new OrderModel({
    deliveryNote: orderInfo.deliveryNote,
    userId: orderInfo.userId,
    productId: orderInfo.productId,
    quantity: orderInfo.quantity,
    status: orderInfo.status,
    totalPrice: orderInfo.totalPrice,
    size: orderInfo.size,
  });
  try {
    const addedOrder = await order.save();
    return addedOrder;
  } catch (error) {
    throw new Error("Could not add order.", error);
  }
};

module.exports.findOrders = async (user_email) => {
  try {
    const orders =
      user_email === "all"
        ? await OrderModel.find().populate("productId")
        : await OrderModel.find({ email: user_email }).populate("productId");
    orders;
    return orders;
  } catch (err) {
    console.log(err);
    throw new Error("Could not retrieve orders.", err);
  }
};

module.exports.getOrder = async (order_id) => {
  try {
    const order = await OrderModel.findById(order_id);
    console.log(order);
    return order;
  } catch (err) {
    console.log(err);
    throw new Error("Could not retrieve order of id .", order_id);
  }
};

module.exports.editOrder = async (req) => {
  try {
    const order = await OrderModel.findByIdAndUpdate(
      req.query.orderId,
      { deliveryNote: req.body.deliveryNote, status: req.body.status },
      { returnDocument: "after" }
    );
    return order;
  } catch (err) {
    throw new Error("Could not update order .", err);
  }
};
