const { stat } = require("fs");
const httpStatus = require("../utils/httpStatus");
const OrderModel = require("./../models/order.model");
const { OrderStatusEnum } = require("../utils/constants");

const OrderController = {
    getAllOrders: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                search = "",
                status = undefined,
                review = undefined,
            } = req.query;

            const userId = req.user?.user_id ?? null;
            const isAdmin = !!req.user?.email;
            const query = {
                ...(isAdmin ? {} : { uid: userId }),
                ...(search
                    ? {
                          $text: { $search: search },
                      }
                    : {}),
                ...(status ? { status: { $in: status.split(",") } } : {}),
                ...(review
                    ? {
                          review: {
                              $in: review
                                  .split(",")
                                  .map((item) => (item == 0 ? "" : item)),
                          },
                      }
                    : {}),
            };
            const orders = await OrderModel.find(query)
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .sort({ createdAt: -1 });
            res.status(httpStatus.OK).json(orders);
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error fetching orders from the database",
            });
        }
    },
    createOrder: async (req, res) => {
        try {
            const {
                senderName,
                senderPhone,
                senderAddressProvince,
                senderAddressDistrict,
                senderAddressWard,
                senderAddressDescription,
                shippingDate,
                recipientName,
                recipientPhone,
                recipientAddressProvince,
                recipientAddressDistrict,
                recipientAddressWard,
                recipientAddressDescription,
                expectedDeliveryDate,
                note,
            } = req.body;
            const newOrder = new OrderModel({
                senderName,
                senderPhone,
                senderAddressProvince,
                senderAddressDistrict,
                senderAddressWard,
                senderAddressDescription,
                // shippingDate,
                recipientName,
                recipientPhone,
                recipientAddressProvince,
                recipientAddressDistrict,
                recipientAddressWard,
                recipientAddressDescription,
                // expectedDeliveryDate,
                // orderNumber: '2323',
                note,
                uid: req.user?.user_id ?? null,
            });
            const data = await newOrder.save();
            res.status(httpStatus.OK).json(data);
        } catch (err) {
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error creating the order",
            });
        }
    },
    updateOrder: async (req, res) => {
        const { orderNumber } = req.params;

        try {
            const userId = req.user?.user_id ?? null;

            const orderExist = await OrderModel.findOne({
                orderNumber,
            });
            if (!orderExist) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .json({ message: "Order not found" });
            }
            if (orderExist.uid !== userId) {
                return res.status(httpStatus.FORBIDDEN).json({
                    message:
                        "You do not have the permission to update this order",
                });
            }
            const fields = [
                "senderName",
                "senderPhone",
                "senderAddressProvince",
                "senderAddressDistrict",
                "senderAddressWard",
                "senderAddressDescription",
                "recipientName",
                "recipientPhone",
                "recipientAddressProvince",
                "recipientAddressDistrict",
                "recipientAddressWard",
                "recipientAddressDescription",
                "note",
            ];
            let dataUpdate = {};
            fields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    dataUpdate = {
                        ...dataUpdate,
                        [field]: req.body[field],
                    };
                }
            });
            const order = await OrderModel.findOneAndUpdate(
                { orderNumber },
                { ...dataUpdate }
            );

            return res.status(httpStatus.OK).json(order);
        } catch (err) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Server error" });
        }
    },
    deleteOrder: async (req, res) => {
        const { orderNumber } = req.params;

        try {
            const userId = req.user?.user_id ?? null;

            const orderExist = await OrderModel.findOne({ orderNumber });

            const isAdmin = !!req.user?.email;
            if (!orderExist) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .json({ message: "Order not found" });
            }

            if (!(isAdmin || orderExist.uid === userId)) {
                return res.status(httpStatus.FORBIDDEN).json({
                    message: "forbidden",
                });
            }

            await OrderModel.deleteOne({
                orderNumber,
            });
            return res
                .status(httpStatus.OK)
                .json({ message: "Delete order success!" });
        } catch (err) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Server error" });
        }
    },
    getOrder: async (req, res) => {
        const { orderNumber } = req.params;

        try {
            const order = await OrderModel.findOne({ orderNumber });

            if (!order) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .json({ message: "Order not found" });
            }

            return res.status(httpStatus.OK).json(order);
        } catch (err) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Server error" });
        }
    },
    changeOrderStatus: async (req, res) => {
        try {
            const { orderNumber } = req.params;
            const { status } = req.body;
            const isAdmin = !!req.user?.email;
            if (!isAdmin) {
                res.status(httpStatus.FORBIDDEN).json({
                    message: "forbidden",
                });
            }
            const orderExist = await OrderModel.findOne({
                orderNumber,
            });
            if (!orderExist) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .json({ message: "Order not found" });
            }
            let dataUpdate = {};
            switch (orderExist.status) {
                case OrderStatusEnum.PENDING:
                    if (status === OrderStatusEnum.SHIPPED) {
                        dataUpdate = {
                            status: status,
                            shippingDate: new Date(),
                        };
                    } else if (status === OrderStatusEnum.CANCELLED) {
                        dataUpdate = {
                            status: status,
                        };
                    }
                    break;
                case OrderStatusEnum.SHIPPED:
                    if (status === OrderStatusEnum.DELIVERED) {
                        dataUpdate = {
                            status: status,
                            deliveryDate: new Date(),
                        };
                    } else if (status === OrderStatusEnum.CANCELLED) {
                        dataUpdate = {
                            status: status,
                        };
                    }
                    break;
                case OrderStatusEnum.DELIVERED:
                    if (status === OrderStatusEnum.CANCELLED) {
                        dataUpdate = {
                            status: status,
                        };
                    }
                    break;
                default:
                    break;
            }
            if (Object.keys(dataUpdate).length > 0) {
                const order = await OrderModel.findOneAndUpdate(
                    { orderNumber },
                    { ...dataUpdate }
                );
                res.status(httpStatus.OK).json(order);
            } else {
                return res
                    .status(httpStatus.BAD_REQUEST)
                    .json({ message: "Status has not been changed" });
            }
        } catch (err) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Server error" });
        }
    },
    reviewOrder: async (req, res) => {
        try {
            const { orderNumber } = req.params;

            const { review, comment } = req.body;
            const userId = req.user?.user_id ?? null;

            const orderExist = await OrderModel.findOne({
                orderNumber,
            });
            if (!orderExist) {
                return res
                    .status(httpStatus.NOT_FOUND)
                    .json({ message: "Order not found" });
            }
            if (orderExist.uid !== userId) {
                return res.status(httpStatus.FORBIDDEN).json({
                    message:
                        "You do not have the permission to rate this order",
                });
            }
            const order = await OrderModel.findOneAndUpdate(
                { orderNumber },
                {
                    review: review,
                    comment: comment,
                }
            );
            res.status(httpStatus.OK).json(order);
        } catch (err) {
            return res
                .status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Server error" });
        }
    },
};

module.exports = OrderController;
