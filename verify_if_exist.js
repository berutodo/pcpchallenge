import sqlite3 from "sqlite3";
const db = new sqlite3.Database('users.db');


const username = "joaocleber";

// Consulta preparada
const sql = 'SELECT * FROM users WHERE username = ?';

db.get(sql, [username], (err, row) => {
    if (err) {
        console.error('Erro ao consultar o banco de dados:', err);
        // Lida com o erro de acordo com suas necessidades
    } else {
        if (row) {
            // O username existe no banco de dados
            console.log('Username encontrado no banco de dados:', row);
            // Execute a lógica correspondente aqui
        } else {
            // O username não existe no banco de dados
            console.log('Username não encontrado no banco de dados');
            // Execute a lógica correspondente aqui
        }
    }
});