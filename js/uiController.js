var uiController;
uiController = (function () {
    var mainTextContainer = document.getElementById("main-text-container"),
        weatherContainer = document.getElementById("weather-container");

    return {
        setWeather: function () {

        },
        showWeather: function () {

        },
        setMainText: function (text) {
            var oldElem = mainTextContainer.getElementsByTagName('h1')[0],
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
