/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
const servidor = 'http://localhost:8080';
$(document).ready(() => {
	const controladorRecomendaciones = new ControladorRecomendaciones();
	controladorRecomendaciones.inicializarPreguntas();
});

function ControladorRecomendaciones() {
	this.genero = '';

	this.inicializarPreguntas = () => {
		const self = this;

		$('.paso-1').show();

		$('.paso-1 .boton-estreno').click(() => {
			self.año_inicio = 2005;
			self.año_fin = 2020;
			self.cargarSegundaPregunta();
		});

		$('.paso-1 .boton-bien-puntuada').click(() => {
			self.puntuacion = 7;
			self.cargarSegundaPregunta();
		});

		$('.paso-1 .boton-clasico').click(() => {
			self.año_inicio = 1900;
			self.año_fin = 2005;
			self.cargarSegundaPregunta();
		});

		$('.paso-1 .boton-cualquiera').click(() => {
			self.cargarSegundaPregunta();
		});

		$('.paso-1 .btn-film').click(function () {
			$('.paso-1 .btn-film').removeClass('active');
			$('.paso-1 .btn-film').css('opacity', '.3');
			$(this).addClass('active');
		});

		$('.paso-2-links .pregunta').click(function () {
			self.genero = $(this).data('genero');
			self.pedirRecomendacion();
		});

		$('.paso-2 select').change(function () {
			self.genero = $(this).data('genero');
			self.pedirRecomendacion();
		});

		// Se le asigna funcionalidad al boton 'Ver mas' que se va a mostrar debajo de la pelicula recomendada.
		$('.botones-resultado .ver-mas').click(() => {
			const { id } = self.pelicula_actual;
			window.location.href = `info.html?id=${id}`;
		});

		// Se le asigna funcionalidad al boton 'Otra opcion' que se va a mostrar debajo de la pelicula recomendada.
		$('.botones-resultado .otra-opcion').click(() => {
			self.seleccionarPelicula();
		});

		// Se le asigna funcionalidad al boton 'Volver' que va a reiniciar la recomendacion
		$('.botones-resultado .reiniciar, .datos-pelicula-info a.close').click(() => {
			self.reiniciarRecomendacion();
			$('.header-title h1').removeClass('small');
		});

		// Se le asigna funcionalidad a la alerta que se muestra cuando no hay mas peliculas para recomendar
		$('.alerta-recomendacion .alert-link').click(() => {
			self.reiniciarRecomendacion();
			$('.alerta-recomendacion').hide();
			$('.header-title h1').removeClass('small');
		});
	};

	// Esta funcion carga la segunda pregunta; oculta el paso 1 y muestra el paso 2
	this.cargarSegundaPregunta = () => {
		$('.paso-2').addClass('active');
		$('.paso-2-links').addClass('active');
	};

	this.pedirRecomendacion = () => {
		const self = this;

		// Se setean los parametros que luego serán enviados al servidor
		const queryParams = {};

		if (this.genero) queryParams.genero = this.genero;
		if (this.año_inicio) queryParams.año_inicio = this.año_inicio;
		if (this.año_fin) queryParams.año_fin = this.año_fin;
		if (this.puntuacion) queryParams.puntuacion = this.puntuacion;

		let query = '';

		let ruta = '/peliculas/recomendacion';

		if (Object.keys(queryParams).length !== 0) {
			query = $.param(queryParams);
			ruta += '?';
		}

		// Se realiza el pedido de recomendacion al backend
		$.getJSON(servidor + ruta + query, data => {
			// La respuesta del back es un array del peliculas, que acá se mezcla
			self.resultados = self.desordenarArray(data.peliculas);
			self.seleccionarPelicula();
		});
	};

	this.seleccionarPelicula = () => {
		if (this.resultados.length === 0) this.noHayResultados('No se encontró ninguna película para recomendar');
		else {
			const movieToDisplay = this.resultados[0];
			// Se elimina el primer resultado para que no vuelva a mostrarse
			this.resultados.shift();
			// Se guardan los datos de la pelicula que se esta mostrando actualmente y se ejecuta la funcion mostrarPelicula() con la pelicula que debe mostrar
			this.pelicula_actual = movieToDisplay;
			this.mostrarPelicula(movieToDisplay);
		}
	};

	// Recibe una pelicula y se encarga de mostrarla
	this.mostrarPelicula = data => {
		$('.pregunta').hide();
		$('.header-title h1').addClass('small');
		$('.datos-pelicula').show();
		$('.datos-pelicula .imagen').attr('src', data.poster);
		$('.datos-pelicula .trama').html(data.trama);
		$('.datos-pelicula .titulo').html(data.titulo);
		$('.datos-pelicula .genero').html(data.nombre);
	};

	// Se muestra una alerta cuando no hay mas resultados
	this.noHayResultados = mensaje => {
		$('.datos-pelicula').hide();
		$('.alerta-recomendacion').show();
		console.log(mensaje);
	};

	// Se encarga de reiniciar una recomendacion
	this.reiniciarRecomendacion = () => {
		// Se borran los resultados y las respuestas anteriores
		this.resultados = [];
		this.año_fin = '';
		this.año_inicio = '';
		this.genero = '';
		this.puntuacion = '';
		$('.datos-pelicula').hide();
		$('.paso-1, .pregunta').show();
	};

	// Se desordena levemente un array
	this.desordenarArray = array => {
		array.forEach((element, index) => {
			const j = Math.floor(Math.random() * (index + 1));
			const temp = element;
			element = array[j];
			array[j] = temp;
		});

		return array;
	};
}
