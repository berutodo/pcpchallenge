import sqlite3 from "sqlite3";

let db = new sqlite3.Database('./users.db');

export function testing(request, reply) {
    db.all("SELECT * FROM users", (err, users) => {
        if (err) {
            reply.status(500).send({ error: "Deu erro ae pvt" });
        } else {
            console.log(users);
        }
    });
}

db.serialize(() => {
    testing();
});