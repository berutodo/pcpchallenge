import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import formBody from '@fastify/formbody';
import path from 'path';
import sqlite3 from "sqlite3";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const fastify = Fastify({ logger: true });

// Serve static files from the "public" directory
fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
});
fastify.register(formBody);

// Route for the root ("/") URL
fastify.get('/', async(request, reply) => {
    return reply.sendFile('index.html');
});

// Route for handling user registration
fastify.post('/register', async(request, reply) => {
    let db = new sqlite3.Database('./users.db');
    const { username, email, password } = request.body;

    // Use the registerUser function to handle user registration
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            reply.code(500).send({ message: "Deu erro ae pvt" });
        }
        if (user) {
            // Username already exists
            reply.code(400).send({ message: "Username already exists" });
        }
        db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, password], (err) => {
            if (err) {
                reply.code(500).send({ message: "Deu erro ao inserir o usuário" });
            } else {
                reply.code(200).send({ message: "User registered successfully" });
            }
        });
    });
    return reply.send(request.body)
});


// Run the server
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info('Server is running on port 3000');
});