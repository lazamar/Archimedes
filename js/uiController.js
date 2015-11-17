var uiController,
    moment = require('moment');

uiController = (function () {
    var mainTextContainer = document.getElementById("main-text-container"),
        weatherContainer = document.getElementById("weather-container"),
        widgetsContainer = document.getElementById("widgets-container"),
        widgetsContainerStatus = {
            'scroll': 0,
            'lastWidgetTime': new Date()
        },
        FADE_DURATION = 0.4,
        WIDGET_DURATION = 60000;

    function scrollWidgets(val) {
        if (val === 0) { //Reset scroll
            widgetsContainerStatus.scroll = 0;
        } else if (val === undefined) { //Scroll a bit
            widgetsContainerStatus.scroll -= 500;
        } else { //Scroll an exact amount
            widgetsContainerStatus.scroll -= val;
        }
        widgetsContainer.style.transform = 'translateY(' + widgetsContainerStatus.scroll + 'px)';
    }

    function removeWidgets() {
        var somethingToRemove = false,
            lastWidget = widgetsContainer.firstElementChild;
        if (lastWidget) {
            lastWidget.classList.remove('animated');
            lastWidget.classList.remove('fadeInDown');
            lastWidget.classList.add('animated');
            lastWidget.classList.add('fadeOutUp');
            setTimeout(function () {
                widgetsContainer.removeChild(lastWidget);
                scrollWidgets(0);
            }, FADE_DURATION * 1000);
            somethingToRemove = true;
        }
        return somethingToRemove;
    }

    function setWidget(elem, stayInScreen) {
        var delay = removeWidgets() ? FADE_DURATION * 1000 : 0,
            insertTime = new Date();
        widgetsContainerStatus.lastWidgetTime = insertTime;
        setTimeout(function () {
            elem.classList.add('widget');
            elem.classList.add('animated');
            elem.classList.add('fadeInDown');
            widgetsContainer.appendChild(elem);
        }, delay);

        //Auto remove widget
        if (!stayInScreen) {
            setTimeout(function () {
                if (widgetsContainerStatus.lastWidgetTime === insertTime) {
                    removeWidgets();
                }
            }, WIDGET_DURATION);
        }
    }

    function createStopCard(stopObj, showLines) {
        var elem, title, direction, lines;
        elem = document.createElement('div');
        elem.classList.add("trans-stop");
        elem.classList.add("cascade");

        title = document.createElement('h2');
        title.innerHTML = stopObj.stopLetter || stopObj.commonName;
        elem.appendChild(title);

        if (stopObj.towards) {
            direction = document.createElement('p');
            direction.classList.add("trans-direction");
            direction.innerHTML = "Towards " + stopObj.towards;
            elem.appendChild(direction);
        }
        if (showLines) {
            lines = document.createElement('p');
            lines.classList.add("trans-lines");
            lines.innerHTML = stopObj.lines.join(', ');
            elem.appendChild(lines);
        }
        return elem;
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
        scrollWidgets: function (val) {
            scrollWidgets(val);
        },
        showTransportWidget: function (stops) {
            var i, transportContainer, elem;
            transportContainer = document.createElement('div');
            for (i = 0; i < stops.length; i++) {
                elem = createStopCard(stops[i], true);
                transportContainer.appendChild(elem);
            }
            setWidget(transportContainer);
            return;
        },
        showBusTimes: function (stopPoint, busTimes) {
            var i, container, stopElem, busTimeElem, stopTimes;
            stopElem = createStopCard(stopPoint);
            stopElem.classList.add('selected');

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
