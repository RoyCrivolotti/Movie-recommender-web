(function() {
    const server = 'http://localhost:8080';
    const params = window.location.search;
    const id = (params.split('='))[1];

    const controladorInformacionDePelicula = new ControladorInformacionDePelicula();
    controladorInformacionDePelicula.obtenerPelicula(id);

    function ControladorInformacionDePelicula() {
        this.cargarDetalle = ({ pelicula, genero, actores }) => {
            $('.imagen').attr('src', pelicula.poster);
            $('.titulo, title').html(`${pelicula.titulo} (${pelicula.anio})`);
            $('.trama').html(pelicula.trama);
            const fecha = new Date(pelicula.fecha_lanzamiento);
            $('.lanzamiento').html(`${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getUTCFullYear()}`);
            $('.genero').html(genero);
            $('.director').html(pelicula.director);
            $('.duracion').html(pelicula.duracion);
            $('.rank').html(`${pelicula.puntuacion}/10`);

            let actorsString = '';

            Object.keys(actores).forEach(key => { actorsString += `${actores[key].nombre}, `; });

            $('.actores').html(actorsString.slice(0, -2));
        };

        this.obtenerPelicula = id => {
            const self = this;
            $.getJSON(`${server}/pelicula/${id}`, data => {
                self.cargarDetalle(data);
            }).fail(() => { window.location.href = 'error.html'; });
        };
    }
}());