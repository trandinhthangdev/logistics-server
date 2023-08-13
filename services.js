const admin = require("firebase-admin");
const serviceAccount = require("./credentials.firebase.json");
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
module.exports = {
    auth: admin.auth(),
};
