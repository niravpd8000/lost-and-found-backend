const mongoose = require("mongoose");

const LostItem = mongoose.model(
    "LostItem",
    new mongoose.Schema({
        title: String,
        images: [String],
        category: String,
        subCategory: String,
        brand: String,
        place: String,
        color: String,
        description: String,
        userId: String,
        shareContact: Boolean,
        claims: [{
            senderId: String,
            message: String,
            createdDate: {
                type: Date,
                default: Date.now()
            }
        }]
    }, {timestamps: true})
);

module.exports = LostItem;
