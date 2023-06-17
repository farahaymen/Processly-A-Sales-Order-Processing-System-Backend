const { model, Schema } = require("mongoose");

const ReportSchema = new Schema(
  {
    totalRevenue: {
      type: "Number",
      required: true,
    },
    numOfOrders: {
      type: "Number",
      required: true,
    },
    mostSoldProduct: {
      type: "String",
      required: true,
    },
    highestPurchaser: {
      type: "String",
      required: true,
    },
    products: {
      type: Schema.Types.Object,
      ref: "order",
      required: true,
    },
  },
  { timestamps: true }
);

const ReportModel = model("report", ReportSchema);

module.exports = ReportModel;
