var uiController;
uiController = (function () {
    var mainTextContainer = document.getElementById("main-text-container"),
        weatherContainer = document.getElementById("weather-container");
    function showWidget() {

    }
    return {
        setWeather: function (status) {
            weatherContainer.style.animationName = 'fade-out';
            setTimeout(function () {
                weatherContainer.children[0].className = "wi wi-" + status.icon + " wi-fi";
                weatherContainer.children[1].innerHTML = status.description;
                weatherContainer.children[2].innerHTML = status.temp + '&deg;';
                weatherContainer.style.animationName = 'fade-in';
            }, weatherContainer.style.animationDuration * 1000);
        },
        showWeather: function () {

        },
        setMainText: function (text) {
            var oldElem = mainTextContainer.firstElementChild,
                textElem = document.createElement("h1");
            oldElem.className = "animated fadeOut";
            setTimeout(function () {
                mainTextContainer.removeChild(oldElem);
            }, 1000);
            textElem.innerHTML = text;
            textElem.className = "animated fadeIn";
            mainTextContainer.appendChild(textElem);
        },
        minimiseMainText: function () {

        },
        maximiseMainText: function () {

        }
    };
}());
