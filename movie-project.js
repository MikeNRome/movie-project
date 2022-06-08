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
            const title = await getTitle(movie.title)
            // const awards = await getAwards(movie.title)
            //language=HTML
            return `
                <div class="container d-flex flex-column mb-2">
                    <img style="height: 400px; width: 320px" src="${srcUrl}">
                    <div class="column movie-info centered">
                        <h4>${title}</h4>
                        <p><span class="fw-bold">Date:</span> ${releaseDate}</p>
                        <p><span class="fw-bold">${ratingSource}:</span> ${ratingValue}</p>
                        <p><span class="fw-bold">Genre:</span> ${genre}</p>
                        <p><span class="fw-bold">Plot:</span> ${plot}</p>
                        <p><span class="fw-bold">Actors:</span> ${actors}</p>
                        <p><span class="fw-bold">Director:</span> ${director}</p>
                    </div>
                     <a href="#" style="text-decoration: none"><i  class="d-flex fa-solid fa-pen justify-content-center mt-2 mb-2"></i ></a>   
                    <div class="d-flex hide input-group w-100 mx-2" id="hidden-buttons">
                    <input type="text" class="edit-title-box form-control" data-id="${movie.id}" placeholder="${title}">
                    <button data-id="${movie.id}" class="edit btn btn-outline-primary" type="button">Edit</button>
                    <button data-id="${movie.id}" class="delete btn btn-outline-danger" type="button">Delete</button>
                    </div>
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
        $('img').hover(
            function () {
                const movieInfo = $(this).parent().find('.movie-info');
                movieInfo.css('visibility', 'visible')
                $(this).css('opacity', '0.2')

                $(this).parent().on('mouseleave', function (){
                    movieInfo.css('visibility', 'hidden')
                    $(this).find('img').css('opacity', '1.0')
                })
            },

        );
        $('a').each(
            function () {
                $(this).click(function () {
                   const hiddenButtons = $(this).parent().find('#hidden-buttons');
                   hiddenButtons.toggleClass('hide')
                })
            })
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
const getTitle = (movie) => {
    const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
    return fetch(URL).then(res => res.json()).then(data => data.Title);
}


// const getAwards = (movie) => {
//     const URL = `http://www.omdbapi.com/?apikey=564fffa2&t=${encodeURIComponent(movie)}`;
//     return fetch(URL).then(res => res.json()).then(data => data.Awards);
// }
