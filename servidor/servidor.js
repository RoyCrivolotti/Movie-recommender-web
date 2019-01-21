const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controladorPeliculas = require('./controladores/controladorPeliculas');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
	extended: true,
}));

app.use(bodyParser.json());

app.get('/peliculas', controladorPeliculas.buscarPeliculas);
app.get('/generos', controladorPeliculas.buscarGeneros);
app.get('/pelicula/:id', controladorPeliculas.buscarInfoPelicula);
app.get('/peliculas/recomendacion', controladorPeliculas.recomendarPelicula);

const port = '8080';

app.listen(port, () => console.log(`Escuchando en el puerto ${port}`));
