/* eslint-disable no-use-before-define */
const server = 'http://localhost:8080';
const genres = {};

$(document).ready(() => {
	// Se piden los generos al backend para cargalos en la UI
	$.getJSON(`${server}/generos`, data => {
		Object.keys(data.generos).forEach((key, index) => {
			const option = $('.genero-select option[value=\'0\']').clone();
			genres[`${data.generos[key].nombre}`] = index;
			option.attr('value', data.generos[key].nombre);
			option.html(data.generos[key].nombre);
			$('.genero-select').append(option);
		});
	});

	const controladorPeliculas = new ControladorPeliculas();

	$('.buscar').click(() => {
		$('.alerta-resultados').hide();
		controladorPeliculas.buscarPeliculas();
	});

	// Se ejecuta la funcion para cargar la primera pagina de la lista
	controladorPeliculas.buscarPeliculas();
});

function ControladorPeliculas() {
	// Recibe la pagina y la cantidad de resultados a mostrar y arma el pedido que se le va a hacer al backend para obtener las peliculas
	this.buscarPeliculas = function (pagina, cantidad) {
		const self = this;
		const titulo = $('.titulo-busqueda').val();
		const genero = $('.genero-select option:selected').attr('value');
		const orden = $('.orden-select option:selected').attr('value');
		const año = $('.año-busqueda').val();
		const requestedPage = (pagina) || 1;

		// El objeto que tiene como atributos los parámetros que se le pasan al backend
		const queryParams = { pagina: requestedPage };

		// Si el value de género es 0, se seleccionó la opcion 'Todos'. Si se elige ver todos los generos, no se envia ese parametro de filtro.
		if (genero != 0) {
			queryParams.genero = genero;
			queryParams.generos = genres;
		}

		if (año) queryParams.año = año;
		if (titulo) queryParams.titulo = titulo;

		queryParams.cantidad = (cantidad) || 52;

		// El value de cada opcion de la lista de seleccion de 'Ordenar por' esta formado por el nombre de la columna por la que se va a ordenar y tipo de orden, descendente o ascendente)

		const ordenArray = orden.split('-');
		[queryParams.columna_orden, queryParams.tipo_orden] = ordenArray;

		// Se piden las peliculas al backend
		$.getJSON(`${server}/peliculas?${$.param(queryParams)}`, data => {
			self.cargarListado(data.peliculas);
			self.cargarBotones(data.total);
		});
	};

	// Función que recibe las películas que se quieren mostrar y crea los elementos html correspondientes
	this.cargarListado = peliculas => {
		// Se vacia el contenedor de las peliculas
		$('.contenedor-peliculas').empty();
		// Si no hay resultados, se muestra la alerta
		if (peliculas.length === 0) $('.alerta-resultados').show();
		else {
			Object.keys(peliculas).forEach(key => {
				// Se cargan los datos de las películas
				const pelicula = $('.ejemplo-pelicula').clone();
				pelicula.find('.imagen').attr('src', peliculas[key].poster);
				pelicula.find('.trama').html(peliculas[key].trama);
				pelicula.find('.titulo').html(peliculas[key].titulo);
				pelicula.attr('id', peliculas[key].id);

				// Cuando se clickea una película, se redirige la aplicación a info.html
				pelicula.click(function () {
					window.location.href = `info.html?id=${this.id}`;
				});

				pelicula.appendTo($('.contenedor-peliculas'));
				pelicula.removeClass('ejemplo-pelicula');
				pelicula.show();
			});
		}
	};

	// Función que recibe la cantidad de peliculas que se obtienen como resultado y crea los botones de la paginación y les da la funcionalidad correspondientese
	this.cargarBotones = total => {
		const amtPerPage = 52;
		const self = this;
		// La cantidad de paginas es la cantidad de resultados totales dividido por la cantidad de resultados mostrados por pagina
		const amtOfPages = Math.ceil(total / amtPerPage);

		$('.btn-group').empty();
		for (let i = 0; i < amtOfPages; i++) {
			const boton = $('.ejemplo-boton').clone();
			// Se le asigna al botón el numero de pagina
			boton.html(i + 1);
			// Se le asigna el atributo numero de pagina
			boton.attr('numero-pagina', i + 1);
			// Se agrega el botón al contenedor de botones
			boton.appendTo($('.btn-group'));
			boton.removeClass('ejemplo-boton');
			boton.show();
		}

		$('.boton-pagina').click(() => {
			// Cada boton tiene como funcionalidad buscarPeliculas()
			self.buscarPeliculas($(this).attr('numero-pagina'));
			scroll(0, 0);
		});
	};
}
