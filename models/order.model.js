const mongoose = require("mongoose");
const { Schema } = mongoose;

// Enum for Order statuses
const OrderStatusEnum = Object.freeze({
    PENDING: "PENDING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
});

const orderSchema = new Schema(
    {
        senderName: { type: String, required: true },
        senderPhone: { type: String, required: true },
        senderAddressProvince: { type: String, required: true },
        senderAddressDistrict: { type: String, required: true },
        senderAddressWard: { type: String, required: true },
        senderAddressDescription: { type: String, required: true },
        shippingDate: { type: Date },
        recipientName: { type: String, required: true },
        recipientPhone: { type: String, required: true },
        recipientAddressProvince: { type: String, required: true },
        recipientAddressDistrict: { type: String, required: true },
        recipientAddressWard: { type: String, required: true },
        recipientAddressDescription: { type: String, required: true },
        expectedDeliveryDate: { type: Date },
        note: { type: String },
        orderNumber: { type: String, unique: true, required: true },
        uid: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: Object.values(OrderStatusEnum),
            default: OrderStatusEnum.PENDING,
        },
    },
    { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
