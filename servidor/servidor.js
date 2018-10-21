var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controladorPeliculas = require('./controladores/controladorPeliculas');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas', controladorPeliculas.buscarPeliculas);
app.get('/generos', controladorPeliculas.buscarGeneros);
app.get('/pelicula/:id', controladorPeliculas.buscarInfoPelicula);
app.get('/peliculas/recomendacion', controladorPeliculas.recomendarPelicula);

let port = '8080';

app.listen(port, (e) => {
  console.log('Escuchando en el puerto ' + port);
});