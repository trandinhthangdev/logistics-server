const UserModel = require("../models/user.model");
const OrderModel = require("../models/order.model");
const httpStatus = require("../utils/httpStatus");

const UserController = {
    getUsers: async (req, res) => {
        try {
            const { page = 1, limit = 10, search = "" } = req.query;
            const userId = req.user?.user_id ?? null;
            console.log("req.user", req.user);
            const query = search
                ? {
                      //   uid: userId,
                      $text: { $search: search },
                  }
                : {
                      //   uid: userId,
                  };
            const users = await UserModel.find(query)
                .skip((parseInt(page) - 1) * parseInt(limit))
                .limit(parseInt(limit));
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({
                error: "Error fetching orders from the database",
            });
        }
    },
    getUser: async (req, res) => {
        const { uid } = req.params;

        try {
            const isAdmin = !!req.user?.email;
            if (!isAdmin) {
                res.status(httpStatus.FORBIDDEN).json({
                    error: "FORBIDDEN",
                });
            }
            const user = await UserModel.findOne({ uid: uid });

            if (!user) {
                return res.status(404).json({ error: "Order not found" });
            }

            return res.status(200).json(user);
        } catch (err) {
            console.error("Error fetching order:", err);
            return res.status(500).json({ error: "Server error" });
        }
    },
    saveMe: async (req, res) => {
        try {
            const userId = req.user?.user_id ?? null;
            const {
                name,
                addressProvince,
                addressDistrict,
                addressWard,
                addressDescription,
            } = req.body;
            let user;

            const existingUser = await UserModel.findOne({
                uid: userId,
            });
            if (existingUser) {
                user = await UserModel.findOneAndUpdate(
                    { uid: userId },
                    {
                        name,
                        addressProvince,
                        addressDistrict,
                        addressWard,
                        addressDescription,
                    },
                    { new: true }
                );
            } else {
                user = new UserModel({
                    uid: userId,
                    name,
                    addressProvince,
                    addressDistrict,
                    addressWard,
                    addressDescription,
                });
                await user.save();
            }
            res.status(201).json({
                name,
                addressProvince,
                addressDistrict,
                addressWard,
                addressDescription,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getMe: async (req, res) => {
        try {
            const userId = req.user?.user_id ?? null;

            const user = await UserModel.findOne({
                uid: userId,
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

module.exports = UserController;
