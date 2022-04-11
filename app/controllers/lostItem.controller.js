const config = require("../config/auth.config");
const db = require("../models");
const LostItem = db.lostItem;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.getLostItemList = (req, res) => {

    LostItem.find((err, lostItems) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        lostItems.forEach(item => {
            if (item.userId !== req.userId) {
                item.claims = item.claims.filter(i => i.senderId === req.userId)
            }
        })
        res.send({
            data: lostItems.reverse(), message: "LostItem list successfully!"
        });
    });
};

exports.getCurrentUserLostItemList = (req, res) => {
    LostItem.find({userId: req.userId}, (err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({
            data: lostItem.reverse(), message: "LostItem list successfully!"
        });

    });
};

exports.getLostItemClaimList = (req, res) => {
    LostItem.find({"claims.senderId": req.userId}, (err, lostItems) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        lostItems.forEach(item => {
            if (item.userId !== req.userId) {
                item.claims = item.claims.filter(i => i.senderId === req.userId)
            }
        })
        res.send({
            data: lostItems.reverse(), message: "LostItem list successfully!    "
        });
    });
};

exports.getLostItemClaimById = (req, res) => {
    if (req.params.id)
        LostItem.findById(req.params.id, (err, lostItem) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (lostItem.userId !== req.userId) {
                lostItem.claims = lostItem.claims.filter(i => i.senderId === req.userId)
            }
            res.send({
                data: lostItem, message: "LostItem not found!"
            });
        });
    else {
        res.status(500).send({message: "Item Id is missing!!!"});

    }
};

exports.lostItemClaim = (req, res) => {
    if (req?.body?.id) LostItem.findById(req?.body?.id, (err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        lostItem.claims = [...lostItem.claims, {
            senderId: req.userId, message: req?.body?.message
        }]
        lostItem.save();
        res.send({
            message: "LostItem list successfully!"
        });
    }); else res.status(500).send({message: "Please enter Item Id"});
};


exports.lostItemClaimResponse = (req, res) => {
    if (req?.body?.itemId && req.body?.messageId && req.body?.reply) LostItem.findById(req?.body?.itemId, (err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (lostItem.userId !== req.userId) {
            res.status(401).send({message: "You are not authorised!"});
            return;
        }
        const messageIndex = lostItem.claims.findIndex(i => req.body.messageId === String(i._id))
        console.log(messageIndex)
        if (messageIndex >= 0) {
            lostItem.claims[messageIndex].reply = req.body?.reply;
            lostItem.save();
        } else {
            res.status(404).send({message: "Message not found!"});
            return;
        }
        res.send({
            message: "message replied successfully!"
        });
    }); else res.status(500).send({message: "Please enter Item Id"});
};

exports.lostItemMarkAsFound = (req, res) => {
    if (req?.body?.itemId && req.body?.messageId) LostItem.findById(req?.body?.itemId, (err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        if (lostItem.userId !== req.userId) {
            res.status(401).send({message: "You are not authorised!"});
            return;
        }
        lostItem.itemFound = true;
        const messageIndex = lostItem.claims.findIndex(i => req.body.messageId === String(i._id))
        console.log(messageIndex)
        if (messageIndex >= 0) {
            lostItem.claims[messageIndex].found = true;
            lostItem.save();
        } else {
            res.status(404).send({message: "Message not found!"});
            return;
        }
        res.send({
            message: "Congratulation!!!"
        });
    }); else res.status(500).send({message: "Please enter Item Id"});
};

exports.creatLostItem = (req, res) => {
    const lostItem = new LostItem({
        title: req.body.title.toLowerCase(),
        images: req.body.images,
        category: req.body.category,
        subCategory: req.body.subCategory,
        place: req.body.place,
        description: req.body.description.toLowerCase(),
        userId: req.userId,
        shareContact: req.body.shareContact,
        color:req.body.color,
        brand:req.body.brand,
    });

    lostItem.save((err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({message: "LostItem registered successfully!"});

    });
};


exports.searchLostItem = (req, res) => {
    if (req.body?.searchKey) {
        LostItem.find((err, lostItems) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            const searchObj = (obj) => {
                return !!req.body?.searchKey.split(" ").find(i => obj.includes(i.toLowerCase()))
            }
            lostItems = lostItems.filter(item => searchObj(JSON.stringify(Object.values(item)).toLowerCase()))
            lostItems.forEach(item => {
                if (item.userId !== req.userId) {
                    item.claims = item.claims.filter(i => i.senderId === req.userId)
                }
            })
            res.send({
                data: lostItems.reverse(), message: "LostItem list successfully!"
            });
        });
    } else res.status(500).send({message: "Please provide search key"});
};
exports.updateLostItem = (req, res) => {
    const lostItem = new LostItem({
        title: req.body.title.toLowerCase(),
        images: req.body.images,
        category: req.body.category,
        subCategory: req.body.subCategory,
        place: req.body.place,
        description: req.body.description.toLowerCase(),
        shareContact: req.body.shareContact,
    });

    lostItem.save((err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({message: "LostItem registered successfully!"});

    });
};