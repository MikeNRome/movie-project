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
        let movies = Promise.all(data.map(async movie => {
            const srcUrl = await getPosters(movie.title)
            const director = await getDirector(movie.title)
            const genre = await getGenre(movie.title)
            const ratingSource = await getRatingSource(movie.title)
            const ratingValue = await getRatingValue(movie.title)
            const plot = await getPlot(movie.title)
            const releaseDate = await getReleaseDate(movie.title)
            const actors = await getActors(movie.title)
            // const awards = await getAwards(movie.title)
            return `
            <div>
            <h4>Title: ${movie.title}</h4>
            <img style="height: 150px; width: 120px" src="${srcUrl}" >
            <p>Release Date: ${releaseDate}</p>
            <p>Rating: ${ratingSource} ${ratingValue}</p>
            <p>Genre: ${genre}</p>
            <p>Plot: ${plot}</p>
            <p>Actors: ${actors}</p>
            <p>Director: ${director}</p>
            <label for="edit-title-box">Edit Title: </label>
            <input type="text" class="edit-title-box" data-id="${movie.id}" placeholder="${movie.title}">
            <button data-id="${movie.id}" class="edit">Edit</button>
            <button data-id="${movie.id}" class="delete">Delete</button>       
            </div>`
        }));
        return movies.then(data => {

        $('#main-body').html(data);
        })
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
            })
        })
        $('.delete').each(function () {
            $(this).click(function () {
                console.log('delete');
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

const getPosters = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Poster);
}
const getDirector = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Director);
}
const getGenre = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Genre);
}
const getRatingSource = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Ratings[1].Source);
}
const getRatingValue = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Ratings[1].Value);
}
const getPlot = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Plot);
}
const getReleaseDate = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Released);
}
const getActors = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Actors);
}
// const getAwards = (movie) => {
//     const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
//     return fetch(URL).then(res => res.json()).then(data => data.Awards);
// }
