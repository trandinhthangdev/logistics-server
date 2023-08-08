const whitelist = [undefined, "http://localhost:3000", "http://localhost:3001"];
const corsOptions = {
    credentials: true,
    origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || origin.includes("localhost")) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS ${origin}`));
        }
    },
};

module.exports = {
    corsOptions,
};
