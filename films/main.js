// Настройки
const apiKey = 'c2d45313-4638-48ac-815f-5db1b8ec0baa';
const url = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
const optinons = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
};

//
// DOM элементы
const filmsWrapper = document.querySelector('.films');
const loader = document.querySelector('.loader-wrapper');
const btnShowMore = document.querySelector('.show-more');
btnShowMore.onclick = fetchAndRenderFilms;

let page = 1;

// получение и вывод топ 250 фильмов
async function fetchAndRenderFilms() {
    try {
        // показать прелодер

        loader.classList.remove('none');
        // fetch films data
        const data = await fetchData(url + `top?page=${page}`, optinons);

        if (data.pagesCount > 1) page++;

        // отображаем кнопку если страниц больше чем одна
        if (data.pagesCount > 1) {
            // если есть страницы с фильмами, то отображаем кнопку (ещё 20 фильмов)
            btnShowMore.classList.remove('none');
        }
        // hide preloader
        loader.classList.add('none');
        // render films on page
        renderFilms(data.films);
        // скрываем кнопку если показана последняя страница с фильмами
        if (page > data.pagesCount) {
            btnShowMore.classList.add('none');
        }

    } catch(err) {
        console.log(err);
    }
}

/* Получает массив из фильмов и создает для каждого фильма  
карточку, которую помещает в html разметку */

async function fetchData(url, optinons) {
    const responce = await fetch(url, optinons);
    const data = await responce.json();
    return data; // возвращает промис
}

function renderFilms(films) {
    for (film of films) {

        const card = document.createElement('div');

        card.classList.add('card');

        card.id = film.filmId;

        card.onclick = openFilmDetails;

        const html = `
        <img src=${film.posterUrlPreview} alt="Cover" class="card__img">
        <h3 class="card__title">
            ${film.nameRu}
        </h3>
        <p class="card__year">${film.year}</p>
        <p class="card__rate">Рейтинг: ${film.rating}</p>`;

        card.insertAdjacentHTML('afterbegin', html);

        filmsWrapper.insertAdjacentElement('beforeend', card);
    }
}

async function openFilmDetails(event) {
    // достаем id фильма
    const id = event.currentTarget.id;

    // получаем данные фильма
    const data = await fetchData(url + id, optinons);

    // отобразить детали фильма на странице справа
    renderFilmData(data);
}

function renderFilmData(film) {
    console.log('Render!');

    // проверка на уже открытый фильм и его удаление

    if (document.querySelector('.container-right')) {
        document.querySelector('.container-right').remove();
    }

    // 1. отрендерить контейнер container-right

    const containerRight = document.createElement('div');

    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = '<img src="img/cross.svg" alt="close" width="24">';
    containerRight.insertAdjacentElement('afterbegin', btnClose);

    btnClose.onclick = () => {containerRight.remove()};

    const html = `<div class="film">

    <div class="film__title">Название фильма: ${film.nameRu}</div>

    <div class="film__img">
        <img src=${film.posterUrl} alt="${film.nameRu}">
    </div>

    <div class="film__desc">
        <p class="film__details">Год: ${film.year}</p>
        <p class="film__details">Рейтинг: ${film.ratingKinopoisk}</p>
        <p class="film__details">Продолжительность: ${formatFilmLength(film.filmLength)}</p>
        <p class="film__details">Страна: ${formatCountry(film.countries)}</p>
        <p class="film__text">${film.description}</p>
    </div>
</div>`
    containerRight.insertAdjacentHTML('beforeend', html);
}

function formatFilmLength(filmLength) {
    let length = '';
    const hours = Math.floor(filmLength / 60);
    //const minutes = filmLength - hours * 2;
    const minutes = filmLength % 60;
    if (hours > 0) length += hours + ' ч. ';
    if (minutes > 0) length += minutes + ' мин.';

    return length;
}

function formatCountry(filmCountrues) {
    let countries = '';

    for (country of filmCountrues) {
        countries += country.country;
        if (filmCountrues.indexOf(country) + 1 < filmCountrues.length) {
            countries += ', ';
        }
    }

    return countries;
}

fetchAndRenderFilms();
/*
либо без try catch, но надо fetchAndRenderFilms().catch((err) => console.log(err));
*/