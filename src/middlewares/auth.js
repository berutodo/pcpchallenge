import jwt from "jsonwebtoken";

async function auth(request, reply) {
    const apiKey = request.headers["x-acess-token"];
    const authSecret = "Bearer";

    try {
        await new Promise((resolve, reject) => {
            jwt.verify(apiKey, authSecret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    } catch (err) {
        reply.code(401).send({ error: "Unauthorized" });
        throw new Error("Unauthorized");
    }
}

export default auth;