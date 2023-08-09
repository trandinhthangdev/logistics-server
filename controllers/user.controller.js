const UserModel = require("../models/user.model");

const UserController = {
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
