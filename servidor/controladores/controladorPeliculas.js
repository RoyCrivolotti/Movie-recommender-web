const connection = require('../lib/conexionbd');

function buscarPeliculas(req, res) {
	const mainParams = {
		genero: {
			value: [req.query.genero],
			query: queryParamExists(req.query.genero)
                ? ` genero_id = ${req.query.generos[req.query.genero]} ` : ' genero_id ',
		},
		titulo: {
			value: [req.query.titulo],
			query: ` titulo LIKE '%${req.query.titulo}%' `,
		},
		anio: {
			value: [req.query.anio],
			query: ` pelicula.anio LIKE '%${req.query.anio}%' `,
		},
	};

	const secondaryParams = {
		orden: {
			value: [req.query.columna_orden, req.query.tipo_orden],
			query: ` ORDER BY ${req.query.columna_orden} ${req.query.tipo_orden} `,
		},
		limit: {
			value: [req.query.pagina, req.query.cantidad],
			query: ` LIMIT ${(req.query.pagina - 1) * req.query.cantidad}, ${req.query.cantidad} `,
		},
	};

	let queryLength = 0;

	Object.keys(mainParams).forEach(key => {
		if (mainParams[key].value.every(queryParamExists)) queryLength++;
	});

	let iteration = 0;

	let query = ' SELECT * FROM pelicula ';
	if (queryLength > 0) query += ' WHERE ';

	Object.keys(mainParams).forEach(key => {
		if (mainParams[key].value.every(queryParamExists)) {
			query += mainParams[key].query;
			iteration += mainParams[key].value.length;
			if (queryLength > iteration) query += ' AND ';
		}
	});

	query += secondaryParams.orden.query;
	query += secondaryParams.limit.query;

	console.log(query);

	connection.query(query, (error, response) => {
		if (error) {
			console.log(`Error: ${error}`);
			return res.status(404).send('Hubo un error en la consulta');
		}

		res.send(JSON.stringify({
			peliculas: response,
		}));

		return true;
	});
}

function buscarGeneros(req, res) {
	const query = 'SELECT * FROM genero';

	connection.query(query, (error, response) => {
		if (error) {
			console.log(`Error: ${error.message}`);
			return res.status(404).send('The query could not be executed properly');
		}

		console.log(query);

		res.send(JSON.stringify({
			generos: response,
		}));
	});
}

function buscarInfoPelicula(req, res) {
	if (req.params.id === 'recomendacion') return;
	const id = req.params.id;

	let query = `SELECT * FROM pelicula INNER JOIN genero ON genero_id = genero.id WHERE pelicula.id = ${id}`;

	connection.query(query, (error, response) => {
		if (error) return res.status(404).send('There was an issue with the query');

		query = `SELECT * FROM actor_pelicula INNER JOIN actor ON actor_id = actor.id WHERE pelicula_id = ${id}`;

		connection.query(query, (error_, response_) => {
			if (error_) return res.status(404).send('There was an issue with the query');

			res.send(JSON.stringify({
				pelicula: response[0],
				genero: response[0].nombre,
				actores: response_,
			}));
		});
	});
}

function recomendarPelicula(req, res) {
	let query = 'SELECT * FROM pelicula ';
	const params = {
		genero: {
			value: [req.query.genero],
			query: ` INNER JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre = \'${req.query.genero}\' `,
		},
		anio: {
			value: [req.query.anio_inicio, req.query.anio_fin],
			query: ` pelicula.anio BETWEEN ${req.query.anio_inicio} AND ${req.query.anio_fin} `,
		},
		puntuacion: {
			value: [req.query.puntuacion],
			query: ` pelicula.puntuacion = ${req.query.puntuacion} `,
		},
	};


	const queryLength = Object.keys(req.query).length;
	let iteration = 0;
	if (!(params.genero.value.every(queryParamExists)) && queryLength > 0) query += ' WHERE ';

	Object.keys(params).forEach(key => {
		if (params[key].value.every(queryParamExists)) {
			query += params[key].query;
			iteration += params[key].value.length;
			if (queryLength > iteration) query += ' AND ';
		}
	});

	console.log(query);

	connection.query(query, (error, response) => {
		if (error) return res.status(404).send('Hubo un error en la consulta');
		res.send(JSON.stringify({
			peliculas: response,
		}));
	});
}

function queryParamExists(value) {
	return value != undefined && isStringNotEmpty(value);
}

function isStringNotEmpty(value) {
	return value.trim().length > 0;
}

module.exports = {
	buscarPeliculas,
	buscarGeneros,
	buscarInfoPelicula,
	recomendarPelicula,
};
