const { customAlphabet } = require('nanoid');
const mongoose = require("mongoose");
const {OrderStatusEnum} = require("../utils/constants");

const { Schema } = mongoose;

// Function to generate a random string of length 10
const generateRandomString = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 10);



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
        deliveryDate: { type: Date },
        expectedDeliveryDate: { type: Date },
        note: { type: String },
        orderNumber: { type: String, unique: true },
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
// Pre-save hook to generate orderNumber before saving a new order
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        let isUnique = false;
        while (!isUnique) {
            const potentialOrderNumber = generateRandomString();
            const existingOrder = await mongoose.model('Order').findOne({ orderNumber: potentialOrderNumber });
            if (!existingOrder) {
                this.orderNumber = potentialOrderNumber;
                isUnique = true;
            }
        }
    }
    next();
});
orderSchema.index({
    senderName: 'text',
    senderPhone: 'text',
    senderAddressProvince: 'text',
    senderAddressDistrict: 'text',
    senderAddressWard: 'text',
    senderAddressDescription: 'text',
    recipientName: 'text',
    recipientPhone: 'text',
    recipientAddressProvince: 'text',
    recipientAddressDistrict: 'text',
    recipientAddressWard: 'text',
    recipientAddressDescription: 'text',
    // ... Add other fields you want to search
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
