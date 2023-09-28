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


    const sql = 'SELECT * FROM users WHERE username = ?';
    const verificarUsuario = db.get(sql, [username], (err, row) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
        } else {
            if (row) {
                console.log('Username encontrado no banco de dados:', row);
                return true
            } else {
                // O username não existe no banco de dados
                console.log('Username não encontrado no banco de dados');
                return false
            }
        }
    });

    if (verificarUsuario) {
        reply.code(409).send({ error: "Usuario existe" })
    } else {
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        const createUser = db.run(insertQuery, [username, email, password], function(insertErr) {
            if (insertErr) {
                console.error('Erro ao inserir dados', insertErr.message);
            } else {
                console.log(`Dados inseridos com sucesso. ID do usuário: ${this.lastID}`);
            }
        });
    }
});


// Run the server
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info('Server is running on port 3000');
});