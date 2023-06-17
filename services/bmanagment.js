const ReportModel = require("../models/Report");
const OrderModel = require("../models/Order");

module.exports.getWeeksOrders = async () => {
  var now = new Date();
  var startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 6
  ).toDateString();
  try {
    const orders = await OrderModel.find({
      createdAt: { $gte: startOfToday },
    }).populate("productId userId", "email name");
    return orders;
  } catch (error) {
    throw new Error("Could not retrieve today's orders.", error);
  }
};

module.exports.getLateOrders = async () => {
  var now = new Date();
  var startOfLate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  ).toDateString();
  try {
    const orders = await OrderModel.find({
      createdAt: { $lte: startOfLate },
      status: "pending",
    }).populate("productId userId");
    return orders;
  } catch (error) {
    throw new Error("Could not retrieve today's orders.", error);
  }
};

module.exports.addNewReport = async (reportInfo) => {
  const report = new ReportModel({
    totalRevenue: reportInfo.totalRevenue,
    numOfOrders: reportInfo.numOfOrders,
    mostSoldProduct: reportInfo.mostSoldProduct,
    highestPurchaser: reportInfo.highestPurchaser,
    products: reportInfo.products,
  });
  try {
    const addedReport = await report.save();
    return addedReport;
  } catch (error) {
    console.log(error);
    throw new Error("Could not add report.", error);
  }
};
