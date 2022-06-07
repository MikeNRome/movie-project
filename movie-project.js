"use strict";

const getMovies = () => {
    const URL = "https://upbeat-pear-feeling.glitch.me/movies";
    return fetch(URL).then(res => res.json());
}
getMovies().then(data => console.log(data))

const deleteMovie = (id) => {
    const URL = "https://upbeat-pear-feeling.glitch.me/movies";
    let options = {
        method: "DELETE",
        headers: {
            'Content-type': 'application/json'
        }
    }
    return fetch(`${URL}/${id}`, options).then(data => data.json()).then(renderMovies)
}

const renderMovies = () => {
    getMovies().then(data => {
        let movies = data.map(movie => {
            return `
            <div>
            <h4>Title: ${movie.title}</h4>
            <p>Director: ${movie.director}</p>
            <p>Rating: ${movie.rating}</p>
            <p>Genre: ${movie.genre}</p>
            <label for="edit-title-box">Edit Title: </label>
            <input type="text" class="edit-title-box" name="asdfdsf"  data-id="${movie.id}" placeholder="${movie.title}">
            <label for="edit-director-box">Edit Director: </label>
            <input type="text" class="edit-director-box" data-id="${movie.id}" placeholder="${movie.director}">
            <label for="edit-rating-box">Edit Rating: </label>
            <input type="text" class="edit-rating-box" data-id="${movie.id}" placeholder="${movie.rating}">
            <label for="edit-genre-box">Edit Genre: </label>
            <input type="text" class="edit-genre-box" data-id="${movie.id}" placeholder="${movie.genre}">
            <button data-id="${movie.id}" class="edit">Edit</button>
            <button data-id="${movie.id}" class="delete">Delete</button>       
            </div>`
        })
        $('#main-body').html(movies.join(""));
    }).then(result => {
        $('.edit').each(function () {
            $(this).click(function () {
                if ($(this).parent().children('.edit-title-box').attr('data-id') === $(this).attr('data-id')) {
                    let newMovie = {
                        id: $(this).attr('data-id'),
                        title: $(this).parent().children('.edit-title-box').val()
                    }
                    if (newMovie.title !== '') {
                        editMovie(newMovie)
                    }
                }
                if ($(this).parent().children('.edit-director-box').attr('data-id') === $(this).attr('data-id')) {
                    let newMovie = {
                        id: $(this).attr('data-id'),
                        director: $(this).parent().children('.edit-director-box').val()
                    }
                    if (newMovie.director !== '') {
                        editMovie(newMovie)
                    }
                }
                if ($(this).parent().children('.edit-rating-box').attr('data-id') === $(this).attr('data-id')) {
                    let newMovie = {
                        id: $(this).attr('data-id'),
                        rating: $(this).parent().children('.edit-rating-box').val()
                    }
                    if (newMovie.rating !== '') {
                        editMovie(newMovie)
                    }
                }
                if ($(this).parent().children('.edit-genre-box').attr('data-id') === $(this).attr('data-id')) {
                    let newMovie = {
                        id: $(this).attr('data-id'),
                        genre: $(this).parent().children('.edit-genre-box').val()
                    }
                    if (newMovie.genre !== '') {
                        editMovie(newMovie)
                    }
                }
            })
        })
        $('.delete').each(function () {
            $(this).click(function () {
                deleteMovie($(this).attr('data-id')).then(renderMovies)
            })
        });
    })
}
renderMovies()

const addMovie = (movie) => {
    const URL = "https://upbeat-pear-feeling.glitch.me/movies";
    let options = {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(movie)
    }
    return fetch(URL, options).then(data => data.json()).then(data => console.log(data))
};

$("#add-movie-btn").click(function () {
    let newMovie = {
        title: $("#add-movie").val(),
        director: $('#add-director').val(),
        rating: $('#add-rating').val(),
        genre: $('#add-genre').val()
    };
    // let posterURL = getPosters($("#add-movie").val()).then(posterUrl => {
    //     console.log(posterUrl)
    //     // const {Poster} = data;
    //     $('img').each(function () {
    //         if ($(this).attr('data-id') === $(this).parent().children('.edit-director-box').attr('data-id')) {
    //             $(this).attr('src', posterUrl)
    //         }
    //     })
    // })
    // console.log(posterURL);
    addMovie(newMovie).then(renderMovies);
    $("#add-movie").val('')
    $('#add-director').val('')
    $('#add-rating').val('')
    $('#add-genre').val('')
})

const editMovie = (movie) => {
    const URL = "https://upbeat-pear-feeling.glitch.me/movies";
    let options = {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(movie)
    }
    return fetch(`${URL}/${movie.id}`, options).then(data => data.json()).then(renderMovies)
}

// const getPosters = (movie) => {
//     const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
//     return fetch(URL).then(res => res.json()).then(data => data.Poster);
// }
// getPosters('Step Brothers').then(data => console.log(data))
