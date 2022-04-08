const {authJwt} = require("../middlewares");
const controller = require("../controllers/lostItem.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/test/all", controller.creatLostItem);

    app.post("/api/lostItem/create", [authJwt.verifyToken], controller.creatLostItem);

    app.post("/api/lostItem/search", [authJwt.verifyToken], controller.searchLostItem);

    app.get("/api/lostItem/list", [authJwt.verifyToken], controller.getLostItemList);

    app.get("/api/lostItem/list/currentUser", [authJwt.verifyToken], controller.getCurrentUserLostItemList);

    app.post("/api/lostItem/claim", [authJwt.verifyToken], controller.lostItemClaim);

    app.post("/api/lostItem/claim/response", [authJwt.verifyToken], controller.lostItemClaimResponse);

    app.post("/api/lostItem/claimed/success", [authJwt.verifyToken], controller.lostItemMarkAsFound);

    app.get("/api/lostItem/claimed", [authJwt.verifyToken], controller.getLostItemClaimList);

    app.get("/api/lostItem/claimed/getById/:id", [authJwt.verifyToken], controller.getLostItemClaimById);

    app.get(
        "/api/test/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        controller.creatLostItem
    );

    app.get(
        "/api/test/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.creatLostItem
    );
};
