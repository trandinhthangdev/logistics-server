// Enum for Order statuses
const OrderStatusEnum = Object.freeze({
    PENDING: "PENDING",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED",
});
const MONGODB_URI = 'mongodb+srv://tonytran99no1:thang08021999@cluster0.obsqoff.mongodb.net/'
module.exports = {
    OrderStatusEnum,
    MONGODB_URI
}
