var server = 'http://localhost:8080';
let genres = {};

$(document).ready(function() {
    // Se piden los generos al backend para cargalos en la UI
    $.getJSON(server + '/generos', data => {
        let i = 1;
        Object.keys(data.generos).map(key => {
            var option = $('.genero-select option[value=\'0\']').clone();
            genres[`${data.generos[key].nombre}`] = i;
            i++;
            option.attr('value', data.generos[key].nombre);
            option.html(data.generos[key].nombre);
            $('.genero-select').append(option);
        });
        console.log('Genres: ' + JSON.stringify(genres));
    });


    var controladorPeliculas = new ControladorPeliculas();

    $('.buscar').click(e => {
        $('.alerta-resultados').hide();
        controladorPeliculas.buscarPeliculas();
    });

    // Se ejecuta la funcion para cargar la primera pagina de la lista
    controladorPeliculas.buscarPeliculas();
});

function ControladorPeliculas() {
    // Recibe la pagina y la cantidad de resultados a mostrar y arma el pedido que se le va a hacer al backend para obtener las peliculas
    this.buscarPeliculas = function(pagina, cantidad) {
            var self = this;
            var titulo = $('.titulo-busqueda').val();
            var genero = $('.genero-select option:selected').attr('value');
            var orden = $('.orden-select option:selected').attr('value');
            var anio = $('.anio-busqueda').val();
            var pagina_solicitada = (pagina) ? pagina : 1;

            // El objeto que tiene como atributos los parámetros que se le pasan al backend
            var query_params = {
                pagina: pagina_solicitada
            };

            // Si el value de género es 0, se seleccionó la opcion 'Todos'. Si se elige ver todos los generos, no se envia ese parametro de filtro.
            if (genero != 0) {
                query_params.genero = genero;
                query_params.generos = genres;
            }
            if (anio) query_params.anio = anio;
            if (titulo) query_params.titulo = titulo;

            query_params.cantidad = (cantidad) ? cantidad : 52;

            // El value de cada opcion de la lista de seleccion de 'Ordenar por' esta formado por el nombre de la columna por la que se va a ordenar y tipo de orden, descendente o ascendente)

            var orden_array = orden.split('-');
            query_params.columna_orden = orden_array[0];
            query_params.tipo_orden = orden_array[1];

            console.log($.param(query_params));

            // Sepiden las  peliculas al backend
            $.getJSON(server + '/peliculas?' + $.param(query_params), data => {
                self.cargarListado(data.peliculas);
                self.cargarBotones(data.total);
            });
        },

        // Función que recibe las películas que se quieren mostrar y crea los elementos html correspondientes
        this.cargarListado = peliculas => {
            // Se vacia el contenedor de las peliculas
            $('.contenedor-peliculas').empty();
            // Si no hay resultados, se muestra la alerta
            if (peliculas.length == 0) $('.alerta-resultados').show();
            else {
                Object.keys(peliculas).map(key => {
                    // Se cargan los datos de las películas
                    var pelicula = $('.ejemplo-pelicula').clone();
                    pelicula.find('.imagen').attr('src', peliculas[key].poster);
                    pelicula.find('.trama').html(peliculas[key].trama);
                    pelicula.find('.titulo').html(peliculas[key].titulo);
                    pelicula.attr('id', peliculas[key].id);

                    // Cuando se clickea una película, se redirige la aplicación a info.html
                    pelicula.click(function() {
                        console.log(`pelicula: ${peliculas[key]}, id: ${peliculas[key].id}, nombre: ${peliculas[key].titulo}`);
                        window.location.href = 'info.html?id=' + this.id;
                    });

                    pelicula.appendTo($('.contenedor-peliculas'));
                    pelicula.removeClass('ejemplo-pelicula');
                    pelicula.show();
                });
            }
        },

        // Función que recibe la cantidad de peliculas que se obtienen como resultado y crea los botones de la paginación y les da la funcionalidad correspondientese
        this.cargarBotones = total => {
            var cantidad_por_pagina = 52;
            var self = this;
            // La cantidad de paginas es la cantidad de resultados totales dividido por la cantidad de resultados mostrados por pagina
            cantidad_paginas = Math.ceil(total / cantidad_por_pagina);

            $('.btn-group').empty();
            for (i = 0; i < cantidad_paginas; i++) {
                var boton = $('.ejemplo-boton').clone();
                // Se le asigna al botón el numero de pagina
                boton.html(i + 1);
                // Se le asigna el atributo numero de pagina
                boton.attr('numero-pagina', i + 1);
                // Se agrega el botón al contenedor de botones
                boton.appendTo($('.btn-group'));
                boton.removeClass('ejemplo-boton');
                boton.show();
            }

            $('.boton-pagina').click(event => {
                // Cada boton tiene como funcionalidad buscarPeliculas()
                self.buscarPeliculas($(this).attr('numero-pagina'));
                scroll(0, 0);
            });
        }
}