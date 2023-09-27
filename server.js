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

fastify.post('/register', async(request, reply) => {
    let db = new sqlite3.Database('./users.db');

    const username = request.body.username;
    const email = request.body.email;
    const password = request.body.password;

    const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    db.run(insertQuery, [username, email, password], function(insertErr) {
        if (insertErr) {
            console.error('Erro ao inserir dados', insertErr.message);
        } else {
            console.log(`Dados inseridos com sucesso. ID do usuário: ${this.lastID}`);
        }
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