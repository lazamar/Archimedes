// This file is the JavaScript bit of the application that goes outside of angularJS.

//Voice recognition bit.
if (annyang) {
  // Let's define a command.
  var commands = {
    'hello (world)': helloWorld,
    'What is the weather (like) (for) (gonna be) (going to be) (:day)': weather,
    'mirror mirror is there (anyone) (anybody) more :adjective than me' : mirror

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
