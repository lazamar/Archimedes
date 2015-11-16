// Module to make AJAX requests.
var request = require('request'),
    geoService = require('./js/geo.js'),
    transport = require('./js/transport.js'),
    moment = require('moment');

function askChatBot(question) {
    var aPromise = Promise.defer(),
        result;
    request.post('http://demo.vhost.pandorabots.com/pandora/talk?botid=b0dafd24ee35a477',
        {
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

// For testing purposes.
function printArgs(question) {
    var i;
    for (i = 0; i < arguments.length; i++) {
        console.log('Argument ' + i + ': ' + arguments[i]);
    }
    // question = arguments[0];
    askChatBot(question).then(function (response) {
        console.log("Yes it is working!");
        response = response.replace(/Chomsky/gi, "Archimedes");
        response = response.replace(/Peter/gi, "Marcelo");
        responsiveVoice.speak(response, "UK English Male");
        uiController.setMainText(response);
    });
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

//Voice recognition bit.
if (annyang) {
    // Let's define a command.
    var commands = {
        'hello (world)': helloWorld,
        'What is the weather (like) (for) (gonna be) (going to be) (:day)': weather,
        'mirror mirror is there (anyone) (anybody) more :adjective than me': mirror,
        'Ok show me *quarter': showAgenda,
        '*anything': {
            'regexp': /^.*Archimedes\s(.*)$/,
            'callback': printArgs
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
});

transport.nearbyStops(51.535980, -0.359031).then(function (stopPoints) {
    console.log(stopPoints);
});
