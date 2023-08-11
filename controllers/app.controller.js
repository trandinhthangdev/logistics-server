const UserModel = require("../models/user.model");
const OrderModal = require("../models/order.model");
const httpStatus = require("../utils/httpStatus");
const {OrderStatusEnum} = require("../utils/constants");

const AppController = {
    getStatis: async (req, res) => {
        try {
            const isAdmin = !!req.user?.email;
            if (!isAdmin) {
                res.status(httpStatus.FORBIDDEN).json({
                    error: "FORBIDDEN",
                });
            }

            const clientCount = await UserModel.countDocuments();
            const orderStatusPendingCount = await OrderModal.countDocuments({
                status: OrderStatusEnum.PENDING
            })
            const orderStatusDeliveredCount = await OrderModal.countDocuments({
                status: OrderStatusEnum.DELIVERED
            })
            const orderStatusShippedCount = await OrderModal.countDocuments({
                status: OrderStatusEnum.SHIPPED
            })
            const orderStatusCancelledCount = await OrderModal.countDocuments({
                status: OrderStatusEnum.CANCELLED
            })
            return res.status(200).json({
                client: clientCount,
                order: {
                    [OrderStatusEnum.PENDING]: orderStatusPendingCount,
                    [OrderStatusEnum.DELIVERED]: orderStatusDeliveredCount,
                    [OrderStatusEnum.SHIPPED]: orderStatusShippedCount,
                    [OrderStatusEnum.CANCELLED]: orderStatusCancelledCount,
                }
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

module.exports = AppController;
