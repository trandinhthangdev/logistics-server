const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        addressProvince: {
            type: String,
            required: true,
        },
        addressDistrict: {
            type: String,
            required: true,
        },
        addressWard: {
            type: String,
            required: true,
        },
        addressDescription: {
            type: String,
        },
    },
    { timestamps: true }
);
userSchema.index({
    name: "text",
});
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
