const mongoose = require("mongoose");

const Notification = mongoose.model(
    "Notification",
    new mongoose.Schema({
        userId: String,
        notifications: [
            {
                message: String,
                senderId: String,
                itemId: String,
                markAsRead: {
                    type: Boolean,
                    default: false
                },
                createdDate: {
                    type: Date,
                    default: Date.now()
                }
            }
        ]
    })
);

module.exports = Notification;
