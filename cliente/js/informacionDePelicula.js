(function () {
    var server = 'http://localhost:8080';
    var params = location.search;
    var id = (params.split('='))[1];

    var controladorInformacionDePelicula = new ControladorInformacionDePelicula();
    controladorInformacionDePelicula.obtenerPelicula(id);

    function ControladorInformacionDePelicula() {
        this.cargarDetalle = data => {
                console.log(data);
                let pelicula = data.pelicula;

                $('.imagen').attr('src', pelicula.poster);
                $('.titulo, title').html(pelicula.titulo + ' (' + pelicula.anio + ')');
                $('.trama').html(pelicula.trama);
                var fecha = new Date(pelicula.fecha_lanzamiento);
                $('.lanzamiento').html(fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getUTCFullYear());
                $('.genero').html(data.genero);
                $('.director').html(pelicula.director);
                $('.duracion').html(pelicula.duracion);
                $('.rank').html(pelicula.puntuacion + '/10');

                var actores_string = '';

                Object.keys(data.actores).map(key => actores_string += data.actores[key].nombre + ', ');

                $('.actores').html(actores_string.slice(0, -2));
            },

            this.obtenerPelicula = id => {
                var self = this;
                $.getJSON(server + '/pelicula/' + id, data => {
                    self.cargarDetalle(data);
                }).fail(() => window.location.href = 'error.html');
            }
    }
})();