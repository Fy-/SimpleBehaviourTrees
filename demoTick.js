/**
 * Created by Pietro Polsinelli on 15/05/2015. Twitter: @ppolsinelli
 *
 * Fisrt inspired by the simplicity of
 * http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 */

function SelectorNode(conditionFunction, actionIfTrue, actionIfFalse) {
	this.conditionFunction = conditionFunction;
	this.actionIfTrue = actionIfTrue;
	this.actionIfFalse = actionIfFalse;
}

function SelectorArrayNode(conditionFunction, actionArray) {
	this.conditionFunction = conditionFunction;
	this.actionArray = actionArray;
}

function SequencerNode(actionArray) {
	this.actionArray = actionArray;
}

function SelectorRandomNode(actionArray) {
	this.actionArray = actionArray;
}

function SequencerRandomNode(actionArray) {
	this.actionArray = actionArray;
}

/**
 * Utility functions
 */

/**
 * From http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function executeBehaviourTreeWithTick(behaviourTreeNode, actor) {

	if (actor.completedCurrentAction === undefined || actor.completedCurrentAction === true) {

		if (Object.getPrototypeOf(behaviourTreeNode) === SelectorNode.prototype) {
			selector(behaviourTreeNode, actor);

		} else if (Object.getPrototypeOf(behaviourTreeNode) === SequencerNode.prototype)  {
			sequencer(behaviourTreeNode, actor);

		} else if (Object.getPrototypeOf(behaviourTreeNode) === SequencerRandomNode.prototype)  {
			sequencerRandom(behaviourTreeNode, actor);

		} else if (Object.getPrototypeOf(behaviourTreeNode) === SelectorRandomNode.prototype)  {
			selectorRandom(behaviourTreeNode, actor);

		} else if (Object.getPrototypeOf(behaviourTreeNode) === SelectorArrayNode.prototype)  {
			selectorArray(behaviourTreeNode, actor);

		} else {
			return behaviourTreeNode(actor);
		}
	}
}

function selector(selectorNode, actorInstance) {

	if (executeBehaviourTreeWithTick(selectorNode.conditionFunction, actorInstance)) {

		executeBehaviourTreeWithTick(selectorNode.actionIfTrue, actorInstance);

	} else {

		executeBehaviourTreeWithTick(selectorNode.actionIfFalse, actorInstance);
	}
}

function sequencer(sequencerNode, actorInstance) {
	for (i = 0; i < sequencerNode.actionArray.length; i++) {

		executeBehaviourTreeWithTick(sequencerNode.actionArray[i], actorInstance);
	}
}

function sequencerRandom(sequencerRandomNode, actorInstance) {

	shuffle(sequencerRandomNode.actionArray);
	for (i = 0; i < sequencerRandomNode.actionArray.length; i++) {

		executeBehaviourTreeWithTick(sequencerRandomNode.actionArray[i], actorInstance);
	}
}

function selectorRandom(selectorRandomNode, actorInstance) {

	var randomIndex = Math.floor(Math.random() * selectorRandomNode.actionArray.length);

	executeBehaviourTreeWithTick(selectorRandomNode.actionArray[randomIndex], actorInstance);
}

function selectorArray(selectorArrayNode, actorInstance) {
	executeBehaviourTreeWithTick(selectorArrayNode.actionArray[executeBehaviourTreeWithTick(selectorArrayNode.conditionFunction, actorInstance)], actorInstance);
}



function tick(behaviourTreeNode, actor) {
	setInterval(function () {
		executeBehaviourTreeWithTick(behaviourTreeNode, actor);
	}, 1000);
}


function writeOnConsole(text){
	var node = document.createElement("LI");                 // Create a <li> node
	var textnode = document.createTextNode(text);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.getElementById("console").appendChild(node);     // Append <li> to <ul> with id="myList"

}


function firstExample() {

	var patrollingModel = {};

	patrollingModel.ifPlayerIsInSight = function (actorInstance) {
		var b = Math.random() > 0.2;
		writeOnConsole("see player? " + (b ? "yes" : "no"));
		return  b;
	};

	patrollingModel.actionShootAtPlayer = function (actorInstance) {
		writeOnConsole("bang!");
	};

	patrollingModel.ifUnderFire = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole("under fire? " + (b ? "yes" : "no"));
		return  b;
	};

	patrollingModel.actionTakeCover = function (actorInstance) {
		//actorInstance.inCover=true;
		writeOnConsole("Took cover");
	};

	patrollingModel.actionWalkBackAndForthGuardingDoorway = function (actorInstance) {
		actorInstance.goingUp=!actorInstance.goingUp;
		writeOnConsole("Patrolling " + (actorInstance.goingUp ? "north" : "south"));
		actorInstance.completedCurrentAction = false;

		//launch patrolling completed check
		setTimeout(function () {
			actorInstance.completedCurrentAction = true;
			writeOnConsole("Patrolling " + (actorInstance.goingUp ? "north" : "south") + " completed.");
		}, 3000);

	};

	//general behaviour definition
	var patrollingGuardBehaviourTree = new
		//shoot or other
			SelectorNode(
			patrollingModel.ifPlayerIsInSight,
			//always shoot twice
			new SequencerNode([patrollingModel.actionShootAtPlayer, patrollingModel.actionShootAtPlayer]),
			//cover or patrol
			new SelectorNode(patrollingModel.ifUnderFire, patrollingModel.actionTakeCover, patrollingModel.actionWalkBackAndForthGuardingDoorway)
	);


	var guard1 = {};

	//executeBehaviourTreeWithTick(patrollingGuardBehaviourTree, guard1);
	tick(patrollingGuardBehaviourTree, guard1);
}

//firstExample();

function secondExample() {

	var totalKidsWondering = 20;

	var policemanModel = {};
	policemanModel.name = "Bobby";

	policemanModel.ifKidInSight = function (actorInstance) {
		if (totalKidsWondering>0) {
			writeOnConsole("total kids wandering: " + totalKidsWondering);
			var b = Math.random() > 0.5;
			writeOnConsole(actorInstance.name+": "+"see kid? " + (b ? "yes" : "no"));
			return  b;
		} else {
			writeOnConsole(actorInstance.name+": "+"No more kids");
			return false;
		}
	};

	policemanModel.chatToKidAndSo = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole(actorInstance.name+": "+"Hi kid, where do you live? " + (b ? "F**k you" : "Home"));
		return  b;
	};

	policemanModel.bringChildToStation = function (actorInstance) {
		totalKidsWondering--;
		writeOnConsole(actorInstance.name+": "+"Bring child to station");
	};

	policemanModel.bringChildHome = function (actorInstance) {
		totalKidsWondering--;
		writeOnConsole(actorInstance.name+": "+"Bring child home");
	};

	policemanModel.smoke = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Smoke");
	};

	policemanModel.wanderAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Wander around");
	};

	policemanModel.amOutside = function (actorInstance) {
		return actorInstance.isOutside;
	};

	var kidInsightAction = new SelectorNode(
			policemanModel.chatToKidAndSo,
			policemanModel.bringChildToStation,
			new SelectorRandomNode([policemanModel.bringChildHome, policemanModel.smoke]));

//general behaviour definition
	var patrollingPoliceBehaviourTree = new
			SelectorNode(policemanModel.ifKidInSight,
			kidInsightAction,
			policemanModel.wanderAround
	);



	var policeman1 = {};
	policeman1.name = "Bobby";
	tick(patrollingPoliceBehaviourTree, policeman1);

	var policeman2 = {};
	policeman2.name = "Jimmy";
	tick(patrollingPoliceBehaviourTree, policeman2);

	var socialSecurityWorkerModel = {};

	var myConsole = document.getElementById("console");


	socialSecurityWorkerModel.ifKidInSight = function (actorInstance) {
		if (totalKidsWondering > 0) {
			var b = Math.random() > 0.5 ? 0 : Math.random() > 0.7 ? 1 : 2;

			myConsole.append =
			writeOnConsole(actorInstance.name+": "+"see kid? " + b);
			return  b;
		} else {
			writeOnConsole(actorInstance.name+": "+"No more kids");
			return 2;
		}
	};

	socialSecurityWorkerModel.chatToKidAndSo = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole(actorInstance.name+": "+"Hi kid, having a good time? " + (b ? "F**k you" : "OK"));
		return  b;
	};

	socialSecurityWorkerModel.bringChildHome = function (actorInstance) {
		totalKidsWondering--;
		writeOnConsole(actorInstance.name+": "+"Bring child home");

	};

	socialSecurityWorkerModel.chatWithKid = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"How is school?");
	};

	socialSecurityWorkerModel.lazyAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Smoke weed");
	};

	socialSecurityWorkerModel.wanderAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Wander around");
	};

	socialSecurityWorkerModel.amOutside = function (actorInstance) {
		return actorInstance.isOutside;
	};

	var socialSecurityKidInsightAction = new SelectorNode(
			socialSecurityWorkerModel.chatToKidAndSo,
			socialSecurityWorkerModel.bringChildHome,
			new SelectorRandomNode([socialSecurityWorkerModel.chatWithKid, socialSecurityWorkerModel.lazyAround]));

	//general behaviour definition
	var socialWorkerBehaviourTree = new SelectorArrayNode(socialSecurityWorkerModel.ifKidInSight,[socialSecurityKidInsightAction, socialSecurityWorkerModel.wanderAround, socialSecurityWorkerModel.lazyAround]);

	var socialWorker1 = {};
	socialWorker1.name = "Helping Dude";
	tick(socialWorkerBehaviourTree, socialWorker1);

}

secondExample();
