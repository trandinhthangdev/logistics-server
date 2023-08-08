const { auth } = require("../services");
const httpStatus = require("../utils/httpStatus");

const authMiddleware = (strict) => async (req, res, next) => {
    const { accesstoken } = req.headers;

    if (!strict && (!accesstoken || accesstoken == "null")) {
        req.user = null;
        return next();
    }

    if (!accesstoken || accesstoken == "null") {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ message: "UNAUTHORIZED" });
    }

    try {
        const user = await auth.verifyIdToken(accesstoken);
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json({ message: error?.message });
    }
};

module.exports = (strict = true) => authMiddleware(strict);
