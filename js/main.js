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


// http://nodejs.org/api.html#_child_processes
var exec = require('child_process').exec;
var child;
// executes `pwd`
var command = "curl 'https://content.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&showDeleted=false&singleEvents=true&timeMin=2015-11-21T13%3A38%3A53.064Z' -H 'Authorization: Bearer ya29.MwI6CvP5iAN8FvsXKZgXkwCUWJJSWgGt5_Ul_Fe9shRH1bilq5OQEOYswSwcD8pt8Ixx' -H 'X-Goog-Encode-Response-If-Executable: base64' -H 'X-Origin: http://localhost:8080' -H 'X-ClientDetails: appVersion=5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F46.0.2490.80%20Safari%2F537.36&platform=Linux%20x86_64&userAgent=Mozilla%2F5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F46.0.2490.80%20Safari%2F537.36' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' -H 'Referer: https://content.googleapis.com/static/proxy.html?jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_GB.Rx51stRkYnQ.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Ft%3Dzcms%2Frs%3DAGLTcCM5XUrLkPZ9aFXqtSLivsifryqsUA' -H 'X-JavaScript-User-Agent: google-api-javascript-client/1.1.0-beta' -H 'X-Referer: http://localhost:8080' --compressed"

child = exec(command, function (error, stdout, stderr) {
  console.log('stdout: ' + stdout);
  console.log('stderr: ' + stderr);
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
