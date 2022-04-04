const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        fullName: String,
        username: String,
        email: String,
        password: String,
        profileImage: String,
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role"
            }
        ]
    })
);

module.exports = User;
