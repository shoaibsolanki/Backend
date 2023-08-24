const { admin } = require("./firebaseconfig");

async function sendFireBaseNOtificationFCM(tokens, message, options = {}) {
    console.log("array wala token",tokens)
    Array.isArray(tokens) && tokens.forEach(async (token) => {
        console.log("bina array wala token😒😒😒😒",token)
        token && await admin.messaging().send({
            token,
            notification: message,
            data: options
        }).then((response) => {
            console.log('Successfully sent message:', response);
        }).catch((error) => {
            console.log('Error sending message:', error);
        });
    });
}

exports.sendFireBaseNOtificationFCM = sendFireBaseNOtificationFCM