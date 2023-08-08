const OrderModel = require("./../models/order.model");

const OrderController = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await OrderModel.find({});
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({
                error: "Error fetching orders from the database",
            });
        }
    },

    createOrder: async (req, res) => {
        // console.log(req.user.user_id);
        // res.status(201).json({
        //     message: "Order created successfully",
        // });

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
                note,
                uid: req.user?.user_id ?? null,
            });
            await newOrder.save();
            res.status(201).json({ message: "Order created successfully" });
        } catch (err) {
            console.log("err", err);
            res.status(500).json({ error: "Error creating the order" });
        }
    },

    // Add other controller functions for updating and deleting orders
};

module.exports = OrderController;
