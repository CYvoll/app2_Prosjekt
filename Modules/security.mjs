import { createHmac } from 'node:crypto';

function securityAudit(req, res, next) {

    if (req.method === "post") {
        if (req.body.password) {
            let psw = req.body.password;
            req.body.password = "";
            let securityToken = createSecurePassToken(psw, process.env.SECRET);
            req.token = securityToken;
        }
    }

}


function createSecurePassToken(psw, secret) {
    return {
        psw: hashPassword(psw, secret),
        token: {placeholder: "placeholder"}
    }
}

function hashPassword(psw, secret) {
    const hmac = createHmac("sha256", secret);
    hmac.update(psw);
    return hmac.digest("hex");
}

export default securityAudit;