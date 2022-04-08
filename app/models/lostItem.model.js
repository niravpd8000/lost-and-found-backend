const mongoose = require("mongoose");

const LostItem = mongoose.model(
    "LostItem",
    new mongoose.Schema({
        title: String,
        images: [String],
        category: String,
        itemTypeFound: Boolean,
        subCategory: String,
        brand: String,
        place: String,
        color: String,
        description: String,
        userId: String,
        shareContact: Boolean,
        hide: {
            type: Boolean,
            default: false
        },
        itemFound: {
            type: Boolean,
            default: false
        },
        claims: [{
            senderId: String,
            message: String,
            reply: String,
            found: {
                type: Boolean,
                default: false
            },
            createdDate: {
                type: Date,
                default: Date.now()
            }
        }]
    }, {timestamps: true})
);

module.exports = LostItem;
