var uiController;
uiController = (function () {
    var mainTextContainer = document.getElementById("main-text-container"),
        weatherContainer = document.getElementById("weather-container"),
        widgetContainer = document.getElementById("widget-container"),
        FADE_DURATION = 2;

    function showWidget(elem) {
        var lastWidget = widgetContainer.firstElementChild;
        if (lastWidget) {
            lastWidget.style.animationName = 'fade-out';
            setTimeout(function () {
                widgetContainer.removeChild(lastWidget);
            }, FADE_DURATION);
        }
        setTimeout(function () {
            elem.classList.add('widget');
            elem.style.animationName = 'fade-in';
            widgetContainer.appendChild(elem);
        }, FADE_DURATION);
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
        // showWeather: function () {
        //
        // },
        setMainText: function (text) {
            var oldElem = mainTextContainer.firstElementChild,
                newElem = document.createElement("h1");
            oldElem.className = "animated fadeOut";
            setTimeout(function () {
                mainTextContainer.removeChild(oldElem);
            }, 1000);
            newElem.innerHTML = text;
            newElem.style.animationDuration = FADE_DURATION + 's';
            newElem.className = "animated fadeIn";
            mainTextContainer.appendChild(newElem);
        },
        // minimiseMainText: function () {
        //
        // },
        // maximiseMainText: function () {
        //
        // },
        setTransportWidget: function (stopsObj) {
            // var widget = document.createElement("div");

        }
    };
}());
