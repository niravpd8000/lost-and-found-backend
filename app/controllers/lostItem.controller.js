const config = require("../config/auth.config");
const db = require("../models");
const LostItem = db.lostItem;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.getLostItemList = (req, res) => {

    LostItem.find((err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({
            data: lostItem.reverse(), message: "LostItem list successfully!"
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
    LostItem.find({"claims.senderId": req.userId}, (err, lostItem) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }
        res.send({
            data: lostItem, message: "LostItem list successfully!"
        });
    });
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

exports.creatLostItem = (req, res) => {
    const lostItem = new LostItem({
        title: req.body.title.toLowerCase(),
        images: req.body.images,
        category: req.body.category,
        subCategory: req.body.subCategory,
        place: req.body.place,
        description: req.body.description.toLowerCase(),
        userId: req.body.userId,
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

exports.signin = (req, res) => {
    LostItem.findOne({
        username: req.body.username
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }
            if (!user) {
                return res.status(404).send({message: "LostItem Not found."});
            }

            let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null, message: "Invalid Password!"
                });
            }

            let token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            let authorities = [];

            for (let i = 0; i < user.roles.length; i++) {
                authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user._id, username: user.username, email: user.email, roles: authorities, accessToken: token
            });
        });
};
