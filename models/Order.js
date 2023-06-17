const { model, Schema } = require("mongoose");

const OrderSchema = new Schema(
  {
    deliveryNote: {
      type: "String",
      required: true,
      default: "",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: "String",
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    quantity: {
      type: "Number",
      required: true,
    },
    size: {
      type: "String",
      required: false,
    },
    totalPrice: {
      type: "Number",
      required: true,
    },
  },
  { timestamps: true }
);

const OrderModel = model("order", OrderSchema);

module.exports = OrderModel;
