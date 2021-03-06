//query params
var params = new URLSearchParams(document.location.search);
var searchTerm = params.get('q');
//openweathertoken
var weatherToken = `dada7bf4d9f14d708e8eabdc7768b323`;
//queryselectors
var searchFormElement = document.querySelector('form')
var searchInput = document.querySelector('#search-field')

var currentWeather = document.querySelector('#current-weather')
var currentWeatherLocation = document.querySelector('#current-weather h1')
var currentWeatherTemp = document.querySelector('#current-weather h2')

var songRecommendation = document.querySelector('#song-recommendation')
var songRecommendationName = document.querySelector('#song-recommendation h1')
var searchInfo = document.querySelector('#song-recommendation h2')
var songRecommendationBio = document.querySelector('#artist-bio')

var errorModal = document.querySelector('#error-modal')
var errorContent = document.querySelector('#error-content')
var errorButton = document.querySelector('#error-button')

var prevSearchElement = document.querySelector('#prev-search');
var prevSearchElementBtn = document.querySelectorAll('#prev-search button');

var artistBioCard = document.querySelector('#artist-bio-card')
var artistBioDiv = document.querySelector('#artist-bio-div')

//fetch for weather
function getWeatherData() {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${weatherToken}&units=imperial`

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        store(searchTerm)
        return response.json();
      }
      else {
        errorModal.classList.add("is-active")
        errorContent.textContent = `Error: ${response.statusText}`
      }
    })
    .then(function (data) {
      displayCurrentWeather(data);
      getSongRecommendation(data);
    })
    .catch(function (error) {
      errorModal.classList.add("is-active")
      errorContent.textContent = error
    });
  ;
};
//fetch and seed for song
function getSongRecommendation(data) {
  var recommendation;
  //conditional checks for seeds
  if (Math.floor(data.main.temp) === 69) {
    recommendation = [{
      artist: '112884',
      spotifyID: '0gxyHStUsqpMadRV0Di1Qt'
    }];
  } else {
    switch (data.weather[0].main) {
      case "Clouds": recommendation = [{
        artist: '134694',
        spotifyID: '2qnpHrOzdmOo1S4ox3j17x'
      }, {
        artist: '126251',
        spotifyID: '5vSQUyT33qxr1xAX2Tkf3A'
      }, {
        artist: '111614',
        spotifyID: '6FXMGgJwohJLUSr5nVlf9X'
      }];
        break;
      case "Thunderstorm": recommendation = [{
        artist: '119231',
        spotifyID: '711MCceyCBcFnzjGY4Q7Un'
      }, {
        artist: '111619',
        spotifyID: '7w29UYBi0qsHi5RTcv3lmA'
      }, {
        artist: '111641',
        spotifyID: '6kBDZFXuLrZgHnvmPu9NsG'
      }, {
        artist: '117618',
        spotifyID: '4frXpPxQQZwbCu3eTGnZEw'
      }, {
        artist: '112125',
        spotifyID: '05fG473iIaoy82BF1aGhL8'
      }, {
        artist: '136341',
        spotifyID: '6MoQZOH2KnQrJhVtO9VoXC'
      }];
        break;
      case "Drizzle": recommendation = [{
        artist: '166553',
        spotifyID: '6mrOjLZyPub9LcecUarcMD'
      }, {
        artist: '148190',
        spotifyID: '5NtMqQLCzdVvL7F8vFp3zM'
      }];
        break;
      case "Rain": recommendation = [{
        artist: '126777',
        spotifyID: '0xBkYJzwFzcIYev4fOkvk0'
      }, {
        artist: '149696',
        spotifyID: '2sSGPbdZJkaSE2AbcGOACx'
      }];
        break;
      case "Snow": recommendation = [{
        artist: '143813',
        spotifyID: '65dGLGjkw3UbddUg2GKQoZ'
      }, {
        artist: '119636',
        spotifyID: '4uFZsG1vXrPcvnZ4iSQyrx'
      }, {
        artist: '126761',
        spotifyID: '4bbjivSh1oG4NOc7uYHfw5'
      }, {
        artist: '154185',
        spotifyID: '4iom7VVRU6AHRIu1JUXpLG'
      }];
        break;
      case "Ash" || "Tornado": recommendation = [{ //so people seek shelter
        artist: '114415',
        spotifyID: '53XhwfbYqKCa1cC15pYq2q'
      }, {
        artist: '111365',
        spotifyID: '6deZN1bslXzeGvOLaLMOIF'
      }];
        break;
      case "Clear": recommendation = [{
        artist: '111555',
        spotifyID: '5nPOO9iTcrs9k6yFffPxjH'
      }, {
        artist: '115062',
        spotifyID: '7Gh6fW49xfXLP8DTWaLVJP'
      }];
        break;
      case "Mist" || "Haze" || "Fog": recommendation = [{
        artist: '112059',
        spotifyID: '7hJcb9fa4alzcOq3EaNPoG'
      }, {
        artist: '111363',
        spotifyID: '5W5bDNCqJ1jbCgTxDD0Cb3'
      }, {
        artist: '111468',
        spotifyID: '776Uo845nYHJpNaStv1Ds4'
      }];
        break;
      default: recommendation = [{
        artist: '112884',
        spotifyID: '0gxyHStUsqpMadRV0Di1Qt'
      }]
        break;
    }
  }
  //randomizes seed artists
  var randArtist = recommendation[Math.floor(Math.random() * recommendation.length)]
  var apiUrl = `https://theaudiodb.com/api/v1/json/2/artist.php?i=${randArtist.artist}`
  //audiodb fetch
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) return response.json();
      else {
        errorModal.classList.add("is-active")
        errorContent.textContent = `Error: ${response.statusText}`
      }
    })
    .then(function (data) {
      displaySongRecommendation(data, randArtist.spotifyID);
    })
    .catch(function (error) {
      errorModal.classList.add("is-active")
      errorContent.textContent = error
    });
  ;
};



//displays audiodb info and spotify iframe
function displaySongRecommendation(data, spotifyID) {
  artist = data.artists[0]
  currentWeather.style.display = 'flex';
  searchInfo.style.display = 'none';
  artistBioCard.classList.remove('is-hidden');
  if (artist.strArtistBanner) {
    var artistBannerDiv = document.createElement('div');
    artistBannerDiv.classList = 'has-text-centered';
    songRecommendation.prepend(artistBannerDiv);
    var artistBanner = document.createElement('img');
    artistBanner.src = `${artist.strArtistBanner}`;
    artistBannerDiv.appendChild(artistBanner);
  };
  songRecommendationName.textContent = artist.strArtist;

  if (artist.strBiographyEN) songRecommendationBio.textContent = artist.strBiographyEN;
  else songRecommendationBio.textContent = '';

  var spotifyDiv = document.createElement('div')
  var iframe = document.createElement('iframe')
  iframe.src = `https://open.spotify.com/embed/artist/${spotifyID}?utm_source=generator`;
  iframe.width = `100%`;
  iframe.height = `380`;
  iframe.frameBorder = `0`;
  iframe.allowFullscreen = '';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  songRecommendation.appendChild(spotifyDiv);
  spotifyDiv.appendChild(iframe);
}
//displays current weather data
function displayCurrentWeather(data) {
  currentWeatherLocation.textContent = data.name;

  var weatherIcon = document.createElement('img');
  weatherIcon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
  currentWeather.appendChild(weatherIcon);
  currentWeatherTemp.textContent = `${Math.floor(data.main.temp)} F`;
}

function store(str) {
  var prevSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
  if (!prevSearch.includes(str) && !null) {
    prevSearch.unshift(str);
    if (prevSearch.length > 5) {
      prevSearch.length = 5;
    }
  }
  localStorage.setItem('prevSearch', JSON.stringify(prevSearch));
}
function renderPrevSearch(prevSearch) {
  prevSearchElement.style.display = 'block';
  for (i = 0; i < prevSearch.length; i++) {
    var prevSearchBtn = document.createElement('button');
    prevSearchBtn.textContent = prevSearch[i];
    prevSearchBtn.classList = "button is-primary m-1"
    prevSearchBtn.setAttribute('data-search', prevSearch[i].replace(/\s/g, "+"));
    prevSearchBtn.setAttribute('type', 'button');
    prevSearchBtn.addEventListener('click', function () {
      location.replace(`index.html?q=${this.dataset.search}`);
    })
    prevSearchElement.appendChild(prevSearchBtn);
  }
}
//displays time, grabs search query from URL
function init() {
  var currentTime = document.querySelector('#current-time');
  var prevSearch = JSON.parse(localStorage.getItem("prevSearch")) || [];
  currentTime.textContent = moment().format('LLLL');
  if (searchTerm) {
    getWeatherData();
  } else renderPrevSearch(prevSearch)
}

init();

//event listener for form
searchFormElement.addEventListener('submit',
  function (event) {
    event.preventDefault();
    var search = searchInput.value.replace(/\s/g, "+");
    if (search) location.replace(`index.html?q=${search}`);
  })

errorButton.addEventListener('click', function (event) {
  event.preventDefault();
  errorModal.classList.remove('is-active');
})

artistBioCard.addEventListener('click', function (event) {
  event.preventDefault();
  artistBioDiv.classList.toggle('is-hidden');
})