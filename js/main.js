// Module to make AJAX requests.
var request = require('request'),
    geoService = require('./js/geo.js'),
    transport = require('./js/transport.js'),
    moment = require('moment');

function say(astring) {
    astring = astring.replace(/Chomsky/gi, "Archimedes");
    astring = astring.replace(/Peter/gi, "Marcelo");
    responsiveVoice.speak(astring, "UK English Male");
    uiController.setMainText(astring);
}
function askChatBot(question) {
    var aPromise = Promise.defer(),
        result;
    request.post('http://demo.vhost.pandorabots.com/pandora/talk?botid=b0dafd24ee35a477', {
        form: {
            'submit': 'Ask Chomsky',
            'input': question
        }
    },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                result = body.match(/<b>Chomsky:<\/b>\s*<br\/><br\/>\s*([^<]*)/);
                response = result[1].trim();
                console.log(response); // Show the HTML for the Google homepage.
                aPromise.resolve(response);
            }
        });
    return aPromise.promise;
}




// Command functions
function showCalendar() {
    console.log("Imagine a calendar is being shown");
}

function helloWorld() {
    uiController.setMainText("Hello there");
}

function weather(day) {
    console.log('Imagine the weather for ' + day + ' is appearing.');
}

function mirror(adjective) {
    uiController.setMainText("No, my friend. You are the most " + adjective);
}

function showAgenda() {
    var agenda = document.createElement("div"),
        weekday = document.createElement("h2"),
        activity = document.createElement("p");
    agenda.id = "agenda";
    agenda.className = "animated zoomInUp";

    weekday.innerHTML = "Sat 17 Oct";
    agenda.appendChild(weekday);

    activity.innerHTML = "Absolutely nothing.";
    agenda.appendChild(activity);
    document.body.appendChild(agenda);
    setTimeout(function () {
        agenda.className = "animated fadeOutDown";
        setTimeout(function () {
            document.body.removeChild(agenda);
        }, 1500);
    }, 3000);
}

function scrollWidgets(val) {
    uiController.scrollWidgets(val);
}

function showNearbyBusStops() {
    var lat, lon;
    lat = geoService.getLat();
    lon = geoService.getLon();
    transport.nearbyStops(lat, lon).then(function (stopPoints) {
        uiController.showTransportWidget(stopPoints);
    });
}

// For testing purposes.
function handleQuestion(question) {
    switch (true) {
    case /show[a-zA-Z\s]*?nearby[a-zA-Z\s]*?bus\sstop/i.test(question):
        showNearbyBusStops();
        break;
    case /scroll\s(up|down)/i.test(question):
        if (question.match(/(up|down)/i)[1] === "up") {
            scrollWidgets(500);
        } else {
            scrollWidgets(-500);
        }
        break;
    default:
        askChatBot(question).then(function (response) {
            say(response);
        });
    }
    // question = arguments[0];
}

//Voice recognition bit.
if (annyang) {
    // Let's define a command.
    var commands = {
        'hello (world)': helloWorld,
        'What is the weather (like) (for) (gonna be) (going to be) (:day)': weather,
        'mirror mirror is there (anyone) (anybody) more :adjective than me': mirror,
        'Ok show me *quarter': showAgenda,
        '*anything': {
            'regexp': /^.*?Archimedes\s(.*)$/,
            'callback': handleQuestion
        },

    };

    // Add our commands to annyang
    annyang.addCommands(commands);
    // Set Language
    annyang.setLanguage('en-GB');
    //Print everything that is being recognised
    annyang.debug();
    // Start listening.
    annyang.start();
}

// Set Weather
geoService.ready().then(function (status) {
    uiController.setWeather(status);
    // var lat, lon;
    // lat = geoService.getLat();
    // lon = geoService.getLon();
    // transport.nearbyStops(lat, lon).then(function (stopPoints) {
    //     uiController.showTransportWidget(stopPoints);
    //     setTimeout(function () {
    //         transport.getBusTimes(stopPoints[5].id).then(function (busTimes) {
    //             uiController.showBusTimes(stopPoints[5], busTimes);
    //         });
    //     }, 5000);
    // });
});
