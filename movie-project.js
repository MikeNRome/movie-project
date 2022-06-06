"use strict";

const getMovies = () => {
    const URL = "https://upbeat-pear-feeling.glitch.me/movies";
    return fetch(URL).then(res => res.json());
}
getMovies().then(data => console.log(data))

const renderMovies = () => {
    getMovies().then(data => {
        let movies = data.map(movie => {
            return `
            <div>
            <h4>Title: ${movie.title}</h4>
            <p>Director: ${movie.director}</p>
            <p>Rating: ${movie.rating}</p>
            <p>Genre: ${movie.genre}</p>
            </div>`
        })
        $('#main-body').html(movies.join(""));
    })
}
renderMovies();

const addMovie = (movie) => {
    const URL = "https://upbeat-pear-feeling.glitch.me/movies";
    let options = {
        method: "POST",
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(movie)
    }
    return fetch(URL, options).then(res => res.json()).then(data => console.log(data))
};

$("#add-movie-btn").click(function () {
    let newMovie = {
        title: $("#add-movie").val(),
        director: $('#add-director').val(),
        rating: $('#add-rating').val(),
        genre: $('#add-genre').val()
    };
    addMovie(newMovie).then(renderMovies);
})