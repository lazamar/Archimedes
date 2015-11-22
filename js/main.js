 /* jslint white: true*/
var request = require('request'),// Module to make AJAX requests.
    geoService = require('./js/geo.js'),
    transport = require('./js/transport.js'),
    moment = require('moment'),
    exec = require('child_process').exec,
    widgetShowing = {},
    //Language interpretation
    regShowNearbyBusStops = /^show[\s\S]*?nearby[a-zA-Z\s]*?bus\sstop/i,
    regShowCalendar = /^show[\s\S]*?calendar/i,
    regSelectNumberCapturing = /^select[\s\S]*?number([\s\S]+)/i,
    regSelectNumberNonCapturing = /^select[\s\S]*?number[\s\S]+/i,
    one = /(?:\s|^)(one|1)(\s|$)/i,
    two = /(?:\s|^)(two|2)(\s|$)/i,
    tree = /(?:\s|^)(tree|3)(\s|$)/i,
    four = /(?:\s|^)(four|4)(\s|$)/i,
    five = /(?:\s|^)(five|5)(\s|$)/i,
    six = /(?:\s|^)(six|6)(\s|$)/i,
    seven = /(?:\s|^)(seven|7)(\s|$)/i,
    eight = /(?:\s|^)(eight|8)(\s|$)/i,
    nine = /(?:\s|^)(nine|9)(\s|$)/i,
    ten = /(?:\s|^)(ten|10)(\s|$)/i,
    eleven = /(?:\s|^)(eleven|11)(\s|$)/i,
    twelve = /(?:\s|^)(twelve|12)(\s|$)/i,
    thirteen = /(?:\s|^)(thirteen|13)(\s|$)/i,
    fourteen = /(?:\s|^)(fourteen|14)(\s|$)/i,
    fifteen = /(?:\s|^)(fifteen|15)(\s|$)/i,
    sixteen = /(?:\s|^)(sixteen|16)(\s|$)/i,
    seventeen = /(?:\s|^)(seventeen|17)(\s|$)/i,
    eighteen = /(?:\s|^)(eighteen|18)(\s|$)/i,
    nineteen = /(?:\s|^)(nineteen|19)(\s|$)/i,
    twenty = /(?:\s|^)(twenty|20)(\s|$)/i;

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
        widgetShowing.name = "busStops";
        widgetShowing.data = stopPoints;
    });
}

// For testing purposes.
function handleQuestion(question) {
    switch (true) {
        //Show nearby bus stops
    case regShowNearbyBusStops.test(question):
        showNearbyBusStops();
        break;
        //Show upcoming calendar events
    case regShowCalendar.test(question):
        showCalendar();
        break;
    case regSelectNumberNonCapturing.test(question):
        var matches = question.match(regSelectNumberCapturing),
            numberPart = matches[1],
            number = null;
        switch (true) {
        case one.test(numberPart): number = 1; break;
        case two.test(numberPart): number = 2; break;
        case tree.test(numberPart): number = 3; break;
        case four.test(numberPart): number = 4; break;
        case five.test(numberPart): number = 5; break;
        case six.test(numberPart): number = 6; break;
        case seven.test(numberPart): number = 7; break;
        case eight.test(numberPart): number = 8; break;
        case nine.test(numberPart): number = 9; break;
        case ten.test(numberPart): number = 10; break;
        case eleven.test(numberPart): number = 11; break;
        case twelve.test(numberPart): number = 12; break;
        case thirteen.test(numberPart): number = 13; break;
        case fourteen.test(numberPart): number = 14; break;
        case fifteen.test(numberPart): number = 15; break;
        case sixteen.test(numberPart): number = 16; break;
        case seventeen.test(numberPart): number = 17; break;
        case eighteen.test(numberPart): number = 18; break;
        case nineteen.test(numberPart): number = 19; break;
        case twenty.test(numberPart): number = 20; break;
        }

        if (number !== null
            && widgetShowing.name === "busStops"
            && widgetShowing.data.length >= number) {
                transport.getBusTimes(widgetShowing.data[number - 1].id)
                .then(function (busTimes) {
                    uiController.showBusTimes(widgetShowing.data[number - 1], busTimes);
                });
        }
        break;
        //Control scrolling. matches 'screw up' and 'scroll up' or down.
    case /^scr(ew|oll)\s(up|down)/i.test(question):
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



function getRefreshTokenCommand() {
    var headers = ' -H "POST /oauth2/v3/token HTTP/1.1" ' + ' -H "Host: www.googleapis.com" ' + ' -H "Content-Type: application/x-www-form-urlencoded" ',
        clientId = AppKeys.calendarAPI.clientId,
        clientSecret = AppKeys.calendarAPI.clientSecret,
        refreshToken = AppKeys.calendarAPI.refreshToken,
        data = '--data "' + 'client_id=' + clientId + '&client_secret=' + clientSecret + '&refresh_token=' + refreshToken + '&grant_type=refresh_token' + '" ',
        url = 'https://www.googleapis.com/oauth2/v3/token',
        curl = 'curl ' + headers + data + url;
    // curl = 'curl -H "POST /oauth2/v3/token HTTP/1.1" -H "Host: www.googleapis.com" -H "Content-Type: application/x-www-form-urlencoded" --data "client_id=119974853322-gbvi7p9nbsbre8trghacs451jn5571s5.apps.googleusercontent.com&client_secret=Xo2ZvAf4w9aODypptHV1aL5K&refresh_token=1/7db8jLv1LgMy9-pgrJ9LisyvN3hqH7xzFofKABKFcLpIgOrJDtdun6zK6XiATCKT&grant_type=refresh_token" https://www.googleapis.com/oauth2/v3/token'
    return curl;
}

function getCalendarCommand() {
    var url = ' "' + 'https://content.googleapis.com/calendar/v3/calendars/primary/events?' + 'maxResults=10' + '&orderBy=startTime' + '&showDeleted=false' + '&singleEvents=true' + '&timeMin=' + encodeURIComponent(moment(new Date()).add(1, 'day').toJSON()) //Tomorrow's date;
        + '"',
        accessToken = AppKeys.calendarAPI.accessToken,
        headers = " -H 'Authorization: Bearer " + accessToken + "' " + "-H 'X-Goog-Encode-Response-If-Executable: base64' " + "-H 'X-Origin: http://localhost:8080' " + "-H 'X-ClientDetails: appVersion=5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F46.0.2490.80%20Safari%2F537.36&platform=Linux%20x86_64&userAgent=Mozilla%2F5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F46.0.2490.80%20Safari%2F537.36' " + "-H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' " + "-H 'Referer: https://content.googleapis.com/static/proxy.html?jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_GB.Rx51stRkYnQ.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Ft%3Dzcms%2Frs%3DAGLTcCM5XUrLkPZ9aFXqtSLivsifryqsUA' " + "-H 'X-JavaScript-User-Agent: google-api-javascript-client/1.1.0-beta' " + "-H 'X-Referer: http://localhost:8080' --compressed",
        curl = 'curl ' + url + headers;
    // curl = "curl 'https://content.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&showDeleted=false&singleEvents=true&timeMin=2015-11-21T13%3A38%3A53.064Z' -H 'Authorization: Bearer ya29.MwI6CvP5iAN8FvsXKZgXkwCUWJJSWgGt5_Ul_Fe9shRH1bilq5OQEOYswSwcD8pt8Ixx' -H 'X-Goog-Encode-Response-If-Executable: base64' -H 'X-Origin: http://localhost:8080' -H 'X-ClientDetails: appVersion=5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F46.0.2490.80%20Safari%2F537.36&platform=Linux%20x86_64&userAgent=Mozilla%2F5.0%20(X11%3B%20Linux%20x86_64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F46.0.2490.80%20Safari%2F537.36' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' -H 'Referer: https://content.googleapis.com/static/proxy.html?jsh=m%3B%2F_%2Fscs%2Fapps-static%2F_%2Fjs%2Fk%3Doz.gapi.en_GB.Rx51stRkYnQ.O%2Fm%3D__features__%2Fam%3DAQ%2Frt%3Dj%2Fd%3D1%2Ft%3Dzcms%2Frs%3DAGLTcCM5XUrLkPZ9aFXqtSLivsifryqsUA' -H 'X-JavaScript-User-Agent: google-api-javascript-client/1.1.0-beta' -H 'X-Referer: http://localhost:8080' --compressed"
    return curl;
}

function refreshToken() {
    var response = Promise.defer();
    exec(getRefreshTokenCommand(), function (error, stdout) {
        if (error) {
            response.reject("CURL execution error:");
            return;
        }
        var tokenUpdate = JSON.parse(stdout);
        if (tokenUpdate.error) {
            response.reject("Failed to renew calendar access token");
            return;
        }
        AppKeys.calendarAPI.accessToken = tokenUpdate.access_token;
        response.resolve();
    });
    return response.promise;
}

function handleCalendar(error, stdout) {
    if (error) {
        console.error("CURL execution error:" + error);
        return;
    }
    var calEvents = JSON.parse(stdout);
    if (calEvents.error) {
        refreshToken().then(function () {
            exec(getCalendarCommand(), handleCalendar);
        });
        return;
    }
    uiController.showCalendar(calEvents.items);
    widgetShowing.name = "calendar";
    widgetShowing.data = calEvents.items;
}

function showCalendar() {
    exec(getCalendarCommand(), handleCalendar);
}
