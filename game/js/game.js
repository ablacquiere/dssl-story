(function Game(){
  "use strict";

  var viewportDims = {},

		/*
    // Maybe use these to access div elements below, rather than vars
    $window = $(window),
		$document = $(document),
    */

    hook = document.getElementById('hook'),
    scenario = document.getElementById('scenario'),
    options = document.getElementById('options'),
    response = document.getElementById('response'),

		orientationLocked = false,
		lockOrientation =
			(window.screen.lockOrientation ?
				window.screen.lockOrientation.bind(window.screen) : null
			) ||
			(window.screen.mozLockOrientation ?
				window.screen.mozLockOrientation.bind(window.screen) : null
			) ||
			(window.screen.msLockOrientation ?
				window.screen.msLockOrientation.bind(window.screen) : null
			) ||
			((window.screen.orientation && window.screen.orientation.lock) ?
				window.screen.orientation.lock.bind(window.screen.orientation) : null
			) ||
			null,

		gameState = {},

		touch_disabled = false,

		DEBUG = true;

	// initialize UI
	Promise.all([
		//Include function here for making sure document is loaded?
		//Include function here to make sure all external scripts are loaded?
		checkOrientation(),
	])
	//then for checking viewport and size?
	.then(setupGame);


	// respond to window resizes
  // NEEDED: onResize function
	//$window.on("resize",onResize);


  //Not entirely sure how this works... or if it works...
  function checkOrientation() {
		return Promise.resolve(
				lockOrientation ?
					lockOrientation("landscape") :
					Promise.reject()
			)
			.then(
				function onLocked() {
					orientationLocked = true;
				},
				function onNotLocked() {}
			);
	}


  /*  This fucntion assumes that the data available is structured as a large
      array of objects. Each object includes an 'era' key which is used to
      determine membership to a specific category. This is useful in the case
      where there are 'buckets' of questions to pull from - as in SotK - but
      perhaps less so in a generalized version. Rather, might be better to
      assume that all questions created will be asked. */
  function filterByCategory(num) {
    return questionBank.filter(function(el) {
      if (el.era === num) {
        return el;
      }
    });
  }

  //Is there a better way to manage the div here?
  function generateParaText(text, div) {
    var pElement = document.createElement("p");
    var pText = document.createTextNode(text);
    pElement.style.cursor = "default";
    pElement.appendChild(pText);
    gameState.textElements.push(pElement);
    div.appendChild(pElement);
    return pElement;
  }
  //I feel like there is a better way to go about this...
  function generateClickText(text, div) {
    var t = generateParaText(text, div);
    t.style.cursor = "pointer";
    return t;
  }

  function removeParaTextPointer() {
    for (let i=0; i<gameState.textElements.length; i++) {
      gameState.textElements[i].style.cursor = "default";
    }
  }

  function clearDiv(arr) {
    for (let i=0; i<arr.length; i++) {
      arr[i].innerHTML = "";
    }
  }

  /*  NEEDED: Assuming there is a Twine style question developer/manager will
      need some sort of feature that allows all questions to be sorted by their
      indicated order. This would be a property on each individual object. */


  /*  displayQuestion accepts an object that contains all
      question/options/data/response information for one round. It returns a
      promise generated from this object and resolves it on click. */
  function displayQuestion(obj) {
    //generate the new promise based on the question
    return new Promise(function(resolve,reject) {
      var scenarioText = generateParaText(obj.scenario, scenario);
      for (let i=0; i<obj.answers.length; i ++) {
        var clickText = generateClickText(obj.answers[i].option, options);
        clickText.addEventListener("click", function() {
          gameState.chosenOption = obj.answers[i];
          resolve(obj.answers[i])
        });
      }
    })
  }

  function replyQuestion(obj) {
    return new Promise(function(resolve, reject) {
      removeParaTextPointer();
      var clickText = generateClickText(obj.response, response);
      clickText.addEventListener("click", function() {
        resolve();
      });
    });
  }

  function replyResponse() {
    //I don't like calling this here - better if this is handled by other logic
    completeScenario();
  }

  function initGame() {
    //use this space to call on the arrays from questionBank - or maybe put
    //it in a seperate function and use Promise.all in setupGame then this
    //becomes initGameState

    gameState.econ = 0;
    gameState.rep = 0;
    gameState.sol = 0;
    gameState.pop = 0;

    gameState.winner = false;
    gameState.playEntering = false;
    gameState.playing = false;
    gameState.playLeaving = false;

    //not sure if I want this here or not
    gameState.iterator = 0;

    gameState.textElements = [];

    gameState.chosenOption = {};

    //NEEDED: state for max questions, and max eras?

    gameState.scenario = {};
  }

  function startScenario() {
    //set state
    gameState.playEntering = true;
    //grab new object
    gameState.scenario = getNewScenario(questionBank);
    //start run state
    //Does it make sense to pass this state parameter in? Or just use it as
    //a 'global'
    runScenario(gameState.scenario);
  }

  function runScenario(obj) {
    //async tasks - basically newState below
    gameState.playEntering = false;
    gameState.playing = true;

    //do I need to return all tasks to here?
    var r = setupScenarioInteraction(obj);
  }

  //This isn't the right name for this function... Sounds too much like the
  //game is over
  function completeScenario() {
    gameState.playing = false;
    gameState.playLeaving = true;
    //clear div
    clearDiv([hook,scenario,options,response]);
    gameState.iterator++;
    //save out object
    //[[TODO]]
    //save out state and send to data collection
    //[[TODO]]
    //call stateEnded?
    //check win conditions if (gameState.winner = true)... else:
    startScenario();
  }

  //necessary???
  function gameExit() {
    //check that everything is good
    //Start new state
  }

  //should I pass in the entire question bank, or part of it?
  function getNewScenario(qb) {
    return qb[gameState.iterator];
  }

  function setupScenarioInteraction(obj) {
    function logError(e) {
        console.error(e);
        throw e;  // reject the Promise returned by then
    }
    //check that the object is properly constructed
    //would this be better handled through a try...catch block?
    if (obj && obj !== null && obj !== undefined) {
      var task1 = displayQuestion(obj);
      var task2 = task1.then(replyQuestion);
      var task3 = task2.then(replyResponse);
      var allTasks = task2.then(null, logError);
      return allTasks;
    }
  }

  function setupGame() {
    return Promise.resolve(initGame())
		.then(startScenario);
	}

})();
