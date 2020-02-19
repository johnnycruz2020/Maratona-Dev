const express = require('express');
const nunjucks = require('nunjucks');

const Pool = require('pg').Pool;
const db = new Pool({
	user: 'postgres',
	password: 'docker',
	host: 'localhost',
	port: 5434,
	database: 'doe'
});

const server = express();

server.use(express.static('public'));

server.use(express.urlencoded({ extended: true }));

nunjucks.configure('./', {
	express: server,
	noCache: true,
});

server.get('/', (req, res) => {
	db.query("SELECT * FROM donors", (err, result) => {
		if(err) return res.send('Erro de banco de dados.');

		const donors = result.rows;
		return res.render('index.html', { donors });
	})
});

server.post('/', (req, res) => {
	const { name, email, blood } = req.body;

	if( name == "" || email == "" || blood == "") {
		return res.send('Todos os campos são obrigatórios.')
	}

	const query = `
		INSERT INTO donors ("name", "email", "blood") 
		VALUES ($1, $2, $3)`;

	const values = [name, email, blood]

	db.query(query, values, (err) => {
		if(err) return res.send('erro no banco de dados.');

		return res.redirect('/');
	});
});

server.listen(3000);