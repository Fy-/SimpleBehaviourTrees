/**
 * Created by Pietro Polsinelli && Matteo Bicocchi on 15/05/2015.
 *
 * Fisrt inspired by the simplicity of
 * http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 * Follow us on Twitter @ppolsinelli @pupunzi where we post about game design, game development, Unity3d 2D, HTML5, CSS3, jquery, applied games.
 *
 */


/**
 * Utility functions
 */

function writeOnConsole(text) {
	var node = document.createElement("LI");                 // Create a <li> node
	var textnode = document.createTextNode(text);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.getElementById("console").appendChild(node);     // Append <li> to <ul> with id="myList"
//	console.debug(text)
}

var totalKidsWondering = 20;

function example() {
	/**
	 *  PolicemanManager is like a static instance that processes actions on a given actor
	 *  through a behaviour tree instance.
	 */
	var PolicemanManager = {};

	PolicemanManager.ifKidInSight = function (behaviourTreeInstanceState) {

		behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_COMPLETED);

		if (totalKidsWondering > 0) {
			writeOnConsole("total kids wandering: " + totalKidsWondering);
			var b = Math.random() > 0;
			writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "see kid? " + (b ? "yes" : "no"));
			return  b;
		} else {
			writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "No more kids");
			return false;
		}
	};

	PolicemanManager.ifChaseGotKid = function (behaviourTreeInstanceState) {

		writeOnConsole("ifChaseGotKid 1 ->" + new Date());

		writeOnConsole("ifChaseGotKid state: "+behaviourTreeInstanceState.findStateForNode(behaviourTreeInstanceState.currentNode));

		if (behaviourTreeInstanceState.hasToStart()) {

			writeOnConsole("ifChaseGotKid 2 ->" + new Date());

			writeOnConsole("running after kid");

			behaviourTreeInstanceState.waitUntil(function () {
				setTimeout(function () {
					writeOnConsole("ifChaseGotKid 2.5 ->" + new Date());
					behaviourTreeInstanceState.completedAsync();
				}, 3000);
			});

		} else if (behaviourTreeInstanceState.hasToComplete()) {

			writeOnConsole("ifChaseGotKid 3 ->" + new Date());

			var b = Math.random() > 0.5;
			writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " got child: " + b);
			return  b;

		} else {

			writeOnConsole("ifChaseGotKid 4 ->" + new Date());

			writeOnConsole("running after kid doing nothing");
		}

		writeOnConsole("ifChaseGotKid 5 ->" + new Date());

	};

	PolicemanManager.ifChaseGotKidCases = function (behaviourTreeInstanceState) {

		if (behaviourTreeInstanceState.hasToStart()) {

			writeOnConsole("running after kid");

			console.debug("ifChaseGotKid currentNode ", behaviourTreeInstanceState.currentNode);

			behaviourTreeInstanceState.waitUntil(function () {
				setTimeout(function () {
					behaviourTreeInstanceState.completedAsync();
				}, 3000);
			});

		} else if (behaviourTreeInstanceState.hasToComplete()) {

			var random = Math.random();
			var b = random > 0.6 ? 2 : (random > 0.3 ? 1 : 0);
			writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " got child: " + b);
			return  b;

		} else {
			writeOnConsole("running after kid doing nothing");
		}

	};

	PolicemanManager.actionBringChildToStation = function (behaviourTreeInstanceState) {

		if (behaviourTreeInstanceState.hasToStart()) {

			writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Bring child to station");

			behaviourTreeInstanceState.waitUntil(function () {
				setTimeout(function () {
					writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " child in station");
					behaviourTreeInstanceState.completedAsync();
				}, 3000);
			});

			totalKidsWondering--;
		}

	};

	PolicemanManager.actionBringChildHome = function (behaviourTreeInstanceState) {
		totalKidsWondering--;
		writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Bring child home");
	};

	PolicemanManager.actionSmoke = function (behaviourTreeInstanceState) {
		writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Smoke");
	};

	PolicemanManager.actionImHurt = function (behaviourTreeInstanceState) {
		writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "  I'm hurt!");
	};


	PolicemanManager.actionWanderAround = function (behaviourTreeInstanceState) {
		writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Wander around");
	};

	// Behaviour Tree Instance BEGIN
	/**
	 * Here are several examples of behaviour tree definitions. You can create your own.
	 */

/*
	var patrollingPoliceBehaviourTreeTwoResults =

			new SelectorNode(
					PolicemanManager.ifKidInSight,
					new ActionNode(PolicemanManager.actionSmoke),
					new ActionNode(PolicemanManager.actionWanderAround)
			);
*/

	var patrollingPoliceBehaviourTreeTwoResults =
			(new SelectorNode(
					PolicemanManager.ifKidInSight,
					new SelectorNode(
							PolicemanManager.ifChaseGotKid,
							new ActionNode(PolicemanManager.actionBringChildToStation),
							new SequencerNode([new ActionNode(PolicemanManager.actionWanderAround), new ActionNode(PolicemanManager.actionSmoke)])
					),
					new ActionNode(PolicemanManager.actionSmoke)
			));

	var patrollingPoliceBehaviourSimpleTreeTwoResults =
			(new
					SelectorNode(
					new ActionNode(PolicemanManager.ifKidInSight),
					new ActionNode(PolicemanManager.actionWanderAround),

					new ActionNode(PolicemanManager.actionSmoke)
			));

	var patrollingPoliceBehaviourTreeRandomWeightedResults =
			( new SelectorWeightedRandomNode(
					[
						[0.2, new ActionNode(PolicemanManager.actionSmoke)],
						[0.8, new ActionNode(PolicemanManager.actionWanderAround)]
					]
			));

	var patrollingPoliceBehaviourTreeRandomProbabilityResults =
			( new SelectorRandomProbabilityNode(
					[
						[22, new ActionNode(PolicemanManager.actionSmoke)],
						[100, new ActionNode(PolicemanManager.actionWanderAround)]
					]
			));

	var patrollingPoliceBehaviourTreeMultiResults =
			new SelectorArrayNode(
					new IfNode(PolicemanManager.ifChaseGotKidCases),
					[
						new ActionNode(PolicemanManager.actionBringChildToStation),
						new SequencerNode([new ActionNode(PolicemanManager.actionWanderAround), new ActionNode(PolicemanManager.actionSmoke)]),
						new ActionNode(PolicemanManager.actionImHurt)
					]
			);


	var patrollingPoliceBehaviourTreeRandomResults =
			new SelectorRandomNode(
					[
						new ActionNode(PolicemanManager.actionBringChildToStation),
						new SequencerRandomNode([new ActionNode(PolicemanManager.actionWanderAround), new ActionNode(PolicemanManager.actionSmoke)]),
						new ActionNode(PolicemanManager.actionImHurt)
					]
			);

	var patrollingPoliceBehaviourTreeRandom =
			new SequencerRandomNode([new ActionNode(PolicemanManager.actionWanderAround), new ActionNode(PolicemanManager.actionSmoke)]);
	// Behaviour Tree Instance END

	/**
	 * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
	 * and get them acting on a certain behaviour tree instance.
	 */
	var policeman1 = {};
	policeman1.name = "Bobby";
	policeman1.haveBeenChasing = 0;

//	var bti1 = new BehaviourTreeInstance(patrollingPoliceBehaviourSimpleTreeTwoResults,policeman1,1);
	var bti1 = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeMultiResults, policeman1, 1);

	tick(bti1);

	/*	var policeman2 = {};
	 policeman2.name = "Jimmy";
	 var bti2 = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeTwoResults,policeman2,1);


	 tick(bti2);*/

}


/**
 * This is what makes all your behaviour trees instances run. (implement your own tick)
 */
function tick(behaviourTreeInstance) {
	var tick = setInterval(function () {
		behaviourTreeInstance.executeBehaviourTree();

		if(behaviourTreeInstance.finished){
			writeOnConsole(behaviourTreeInstance.actor.name + " has finished.");
			clearTimeout(tick);
		}
				}, 100);
}



