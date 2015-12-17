function featPrediction() {
  "use strict";
  var history = [],
    sums = [], //Array of training examples
    sumUpToDate = false;

  function addExample(timeArray) {
    if (history > 500) { //Keep history to up to 500 examples.
      history.pop();
    }
    history.push(timeArray);
    sumUpToDate = false;
  }

  function learn() {
    var i,
      timeArray = [],
      hour = new Date().getHours();
    //Turn the hour into a one-hot vector.
    for (i = 0; i < 24; i++) {
      timeArray[i] = (i === hour) ? 1 : 0;
    }
    addExample(timeArray);
  }

  function calculateFrequencies() {
    var i, j;

    //Sum all call times (measured as discrete hourly values)
    for (i = 0; i < history.length; i++) {
      for (j = 0; j < history[i].length; j++) {
        sums[j] = history[i][j] + (sums[i] || 0);
      }
    }
    sumUpToDate = true;
    return sums;
  }

  //Get up to the three most frequent time slots.
  function getMostFrequentHours() {
    var i, j, indexes = [0];

    if (!sumUpToDate) {
      calculateFrequencies();
    }

    for (i = 0; i < sums.length; i++) {
      j = 0;
      while (j < 3 && j < indexes.length) {
        indexes[j] = (sums[i] > sums[indexes[j]]) ? i : indexes[j];
        j++;
      }
    }
    return indexes;
  }

  function predict(hour) {
    var i,
      isTrue = false,
      trueCases = getMostFrequentHours();
    for (i = 0; i < trueCases.length; i++) {
      if (trueCases[i] === hour) {
        isTrue = true;
        break;
      }
    }
    return isTrue;
  }

  return {
    'learn': learn,
    'predict': predict
  };
}

//Prediction functions
function createUsageLogger() {
  "use strict";
  var predictFor = {}; // predict.js objects

  function log(funcName) {
    if (!predictFor[funcName]) {
      predictFor[funcName] = featPrediction();
    }
    predictFor[funcName].learn(); //Register usage time;
    console.log("Logged function " + funcName);
  }

  function predictFunc(funcName, time) {
    if (!predictFor[funcName]) {
      return false;
    }
    return predictFor[funcName].predict(time);
  }

  function predict() {
    var i,
      functions = Object.keys(predictFor),
      res = [],
      hourNow = new Date().getHours();
    for (i = 0; i < functions.length; i++) {
      // if should be displayed at this time:
      if (predictFor[functions[i]].predict(hourNow)) {
        res.push(functions[i]);
      }
    }
    return res;
  }
  return {
    'log': log,
    'predictFunc': predictFunc,
    'predict' : predict
  };
}
// Export function
exports.createUsageLogger = createUsageLogger;
