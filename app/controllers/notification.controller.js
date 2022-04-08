const db = require("../models");
const Notification = db.Notification;

exports.getUserNotifications = (req, res) => {
    console.log(req?.userId)
    Notification.findOne({userId: req?.userId}, (err, notification) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({
            data: notification.reverse(), message: "Notification list successfully!"
        });

    });
};

exports.NotificationList = (req, res) => {
    Notification.find({userId: req.userId}, (err, notification) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({
            data: notification.reverse(), message: "Notification list successfully!"
        });

    });
};

exports.NotificationClaimList = (req, res) => {
    Notification.find({"claims.senderId": req.userId}, (err, notification) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({
            data: notification, message: "Notification list successfully!"
        });
    });
};

exports.NotificationClaimById = (req, res) => {
    if (req.params.id)
        Notification.findById(req.params.id, (err, notification) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            res.send({
                data: notification, message: "Notification not found!"
            });
        });
    else {
        res.status(500).send({message: "Item Id is missing!!!"});

    }
};

exports.notificationClaim = (req, res) => {
    if (req?.body?.id) Notification.findById(req?.body?.id, (err, notification) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        notification.claims = [...notification.claims, {
            senderId: req.userId, message: req?.body?.message
        }]
        notification.save();
        res.send({
            message: "Notification list successfully!"
        });
    }); else res.status(500).send({message: "Please enter Item Id"});
};

exports.Notification = (req, res) => {
    const notification = new Notification({
        title: req.body.title.toLowerCase(),
        images: req.body.images,
        category: req.body.category,
        subCategory: req.body.subCategory,
        place: req.body.place,
        description: req.body.description.toLowerCase(),
        userId: req.body.userId,
        shareContact: req.body.shareContact,
    });

    notification.save((err, notification) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({message: "Notification registered successfully!"});

    });
};

exports.Notification = (req, res) => {
    const notification = new Notification({
        title: req.body.title.toLowerCase(),
        images: req.body.images,
        category: req.body.category,
        subCategory: req.body.subCategory,
        place: req.body.place,
        description: req.body.description.toLowerCase(),
        shareContact: req.body.shareContact,
    });

    notification.save((err, notification) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({message: "Notification registered successfully!"});

    });
};