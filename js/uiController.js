var uiController,
    moment = require('moment');

uiController = (function () {
    var mainTextContainer = document.getElementById("main-text-container"),
        weatherContainer = document.getElementById("weather-container"),
        widgetsContainer = document.getElementById("widgets-container"),
        FADE_DURATION = 0.4;

    function setWidget(elem) {
        var lastWidget = widgetsContainer.firstElementChild;
        if (lastWidget) {
            lastWidget.classList.remove('animated');
            lastWidget.classList.remove('fade-in');
            lastWidget.classList.add('animated');
            lastWidget.classList.add('fadeOut');
            setTimeout(function () {
                widgetsContainer.removeChild(lastWidget);
            }, FADE_DURATION * 1000);
        }
        setTimeout(function () {
            elem.classList.add('widget');
            elem.classList.add('animated');
            elem.classList.add('fadeIn');
            widgetsContainer.appendChild(elem);
        }, FADE_DURATION * 1000);
    }
    return {
        setWeather: function (status) {
            weatherContainer.style.animationName = 'fadeOut';
            weatherContainer.children[0].firstElementChild.className = "wi wi-" + status.icon + " wi-fi";
            weatherContainer.children[1].innerHTML = status.description;
            weatherContainer.children[2].innerHTML = status.temp + '&deg;';
            weatherContainer.style.animationName = 'fadeIn';
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
                elem.classList.add("cascade");
                elem.appendChild(title);
                elem.appendChild(direction);
                elem.appendChild(lines);
                transportContainer.appendChild(elem);
            }
            setWidget(transportContainer);
            return;
        },
        showBusTimes: function (stopPoint, busTimes) {
            var i, title, direction, container, stopElem, busTimeElem, stopTimes;

            title = document.createElement('h2');
            title.innerHTML = stopPoint.stopLetter;

            direction = document.createElement('p');
            direction.classList.add("trans-direction");
            direction.innerHTML = "Towards " + stopPoint.towards;

            stopElem = document.createElement('div');
            stopElem.classList.add("trans-stop");
            stopElem.classList.add("selected");
            stopElem.appendChild(title);
            stopElem.appendChild(direction);

            stopTimes = document.createElement('div');
            for (i = 0; i < busTimes.length; i++) {
                busTimeElem = document.createElement('p');
                busTimeElem.classList.add('trans-bus-time');
                busTimeElem.innerHTML = busTimes[i].line + ': ' + moment(busTimes[i].arrival).fromNow();
                stopTimes.appendChild(busTimeElem);
            }
            container = document.createElement('div');
            container.appendChild(stopElem);
            container.appendChild(stopTimes);
            setWidget(container);
        }
    };
}());
