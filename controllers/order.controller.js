const OrderModel = require("./../models/order.model");

const OrderController = {
    getAllOrders: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = "" } = req.query;
            const userId = req.user?.user_id ?? null;
            const query = search
                ? {
                      uid: userId,
                      $text: { $search: search },
                  }
                : { uid: userId };
            const orders = await OrderModel.find(query)
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit));
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
            console.log(req.body);
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
            await newOrder.save();
            res.status(201).json({ message: "Order created successfully" });
        } catch (err) {
            console.log("err", err);
            res.status(500).json({ error: "Error creating the order" });
        }
    },
    getOrder: async (req, res) => {
        const { orderNumber } = req.params;

        try {
            const order = await OrderModel.findOne({ orderNumber });

            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            return res.status(200).json(order);
        } catch (err) {
            console.error("Error fetching order:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },
    // Add other controller functions for updating and deleting orders
};

module.exports = OrderController;
