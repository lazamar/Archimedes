var uiController;
uiController = (function () {
    var mainTextContainer = document.getElementById("main-text-container"),
        weatherContainer = document.getElementById("weather-container"),
        widgetsContainer = document.getElementById("widgets-container"),
        FADE_DURATION = 2;

    function setWidget(elem) {
        var lastWidget = widgetsContainer.firstElementChild;
        if (lastWidget) {
            lastWidget.style.animationName = 'fade-out';
            setTimeout(function () {
                widgetsContainer.removeChild(lastWidget);
            }, FADE_DURATION);
        }
        setTimeout(function () {
            elem.classList.add('widget');
            elem.style.animationName = 'fade-in';
            widgetsContainer.appendChild(elem);
        }, FADE_DURATION);
    }
    return {
        setWeather: function (status) {
            weatherContainer.style.animationName = 'fade-out';
            setTimeout(function () {
                weatherContainer.children[0].firstElementChild.className = "wi wi-" + status.icon + " wi-fi";
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
        showTransportWidget: function (stops) {
            var i, transportContainer, elem, title, direction, lines;
            transportContainer = document.createElement('div');
            for (i = 0; i < stops.length; i++) {
                title = document.createElement('h2');
                title.innerHTML = stops[i].stopLetter;

                direction = document.createElement('p');
                direction.classList.add("trans-direction");
                direction.innerHTML = "Towards " + stops[i].towards;

                lines = document.createElement('p');
                lines.classList.add("trans-lines");
                lines.innerHTML = stops[i].lines.join(', ');

                elem = document.createElement('div');
                elem.classList.add("trans-stop");
                elem.appendChild(title);
                elem.appendChild(direction);
                elem.appendChild(lines);
                transportContainer.appendChild(elem);
            }
            setWidget(transportContainer);
            return;
        }
    };
}());
