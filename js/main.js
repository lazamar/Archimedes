// Module to make AJAX requests.
  var request = require('request');


//Voice recognition bit.
if (annyang) {
  // Let's define a command.
  var commands = {
    'hello (world)': helloWorld,
    'What is the weather (like) (for) (gonna be) (going to be) (:day)': weather,
    'mirror mirror is there (anyone) (anybody) more :adjective than me' : mirror,
    'calculate :quarter stats': {'regexp': /^calculate (January|March|July|October) stats$/, 'callback': printArgs},
    '*anything': {'regexp': /^.*Archimedes\s(.*)$/, 'callback': printArgs},

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
function printArgs(){
  for (var i = 0; i < arguments.length; i++) {
    console.log('Argument '+i+': '+arguments[i]);
  }
  question = arguments[0];
  ask(question).then(function(response){
    console.log("Yes it is working!");
    showOnScreen(response);
  })
}
// Command functions
function showCalendar(day){
  console.log("Imagine a calendar is being shown");
}
function helloWorld() {
  showOnScreen("Hello there");
}
function weather(day){
  console.log('Imagine the weather for '+ day+' is appearing.');
}
function mirror(adjective){
  showOnScreen("No, my friend. You are the most "+ adjective);
}

function showOnScreen(text){
  var textElem = document.createElement("h1");
  textElem.className = "animated zoomInDown"
  textElem.innerHTML = text;
  document.body.appendChild(textElem);
}



function ask(question){
  var aPromise = Promise.defer()
  request.post('http://demo.vhost.pandorabots.com/pandora/talk?botid=b0dafd24ee35a477',
   {form:{'submit':'Ask Chomsky', 'input': question}},
   function (error, response, body) {
    if (!error && response.statusCode == 200) {
      result = body.match(/<b>Chomsky:<\/b>\s*<br\/><br\/>\s*([^<]*)/);
      response = result[1].trim();
      console.log(response) // Show the HTML for the Google homepage.
      aPromise.resolve(response);
    }
  });
  return aPromise.promise;
}


// ask("Do you work?").then(function(response){
//   console.log("Yes it is working!");
// })





console.log("Hi?");
