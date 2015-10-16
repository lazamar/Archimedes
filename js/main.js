// This file is the JavaScript bit of the application that goes outside of angularJS.

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
  var greet;
  if(greet = arguments[0].match('/hello\s(.*)/i') && greet.length > 0){
    console.log('Hello to you too' + greet);
  }
}
// Command functions
function showCalendar(day){
  console.log("Imagine a calendar is being shown");
}
function helloWorld() {
  hello = document.createElement("h1");
  hello.className = "animated zoomInDown"
  hello.innerHTML = "Hello there!"
  document.body.appendChild(hello);
  console.log("Hello?");
}
function weather(day){
  console.log('Imagine the weather for '+ day+' is appearing.');
}
function mirror(adjective){
  sentence = document.createElement("h1");
  sentence.className = "animated zoomInDown"
  sentence.innerHTML = "No, my friend. You are the most "+ adjective;
  document.body.appendChild(sentence);
  console.log("Yes!");
}
console.log("Hi?");
