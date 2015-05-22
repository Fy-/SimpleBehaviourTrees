/**
 * Created by Pietro Polsinelli on 15/05/2015.
 *
 * Fisrt inspired by the simplicity of
 * http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 * Follow me on Twitter @ppolsinelli where I post about game design, game development, Unity3d 2D, HTML5, applied games.
 *
 */


/**
 * Utility functions
 */
function writeOnConsole(text){
	var node = document.createElement("LI");                 // Create a <li> node
	var textnode = document.createTextNode(text);         // Create a text node
	node.appendChild(textnode);                              // Append the text to <li>
	document.getElementById("console").appendChild(node);     // Append <li> to <ul> with id="myList"

}



function secondExample() {

    var totalKidsWondering = 20;

	var PolicemanManager = {};


	/*PolicemanManager.ifKidInSight = function (behaviourTreeInstanceState) {
		if (totalKidsWondering>0) {
			writeOnConsole("total kids wandering: " + totalKidsWondering);
			var b = Math.random() > 0.4;
			writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"see kid? " + (b ? "yes" : "no"));
			return  b;
		} else {
			writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"No more kids");
			return false;
		}
	};  */

	/*PolicemanManager.ifIsKidInControl = function (behaviourTreeInstanceState) {
		behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_COMPLETED);
		var b = Math.random() > 0.5;
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Hi kid, where do you live? " + (b ? "F**k you" : "Home"));
		return  b;
	};*/

	PolicemanManager.ifChaseGotKid = function (behaviourTreeInstanceState) {

        var state = behaviourTreeInstanceState.findStateForNode(behaviourTreeInstanceState.currentNode);

        console.debug("ifChaseGotKid entering state ",state);
        if (state != BehaviourTreeInstance.STATE_EXECUTING && state != BehaviourTreeInstance.STATE_COMPUTE_RESULT) {

            writeOnConsole("running after kid");

            console.debug("ifChaseGotKid currentNode ", behaviourTreeInstanceState.currentNode);

            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_EXECUTING);

            setTimeout(function () {

                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_COMPUTE_RESULT);

                writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " got child");
            }, 5000);

        } else if (state == BehaviourTreeInstance.STATE_COMPUTE_RESULT) {

            var b = Math.random() > 0.5;
            return  b;

        } else {
            writeOnConsole("running after kid doing nothing");
        }

	};

	PolicemanManager.actionBringChildToStation = function (behaviourTreeInstanceState) {

        var state = behaviourTreeInstanceState.findStateForNode(behaviourTreeInstanceState.currentNode);

        if (state != BehaviourTreeInstance.STATE_EXECUTING && state != BehaviourTreeInstance.STATE_COMPUTE_RESULT) {

            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Bring child to station");

            behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_EXECUTING);

            setTimeout(function () {
                behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_COMPLETED);
                writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " child in station");
            }, 5000);

            totalKidsWondering--;
        }

	};

	PolicemanManager.actionBringChildHome = function (behaviourTreeInstance) {
		totalKidsWondering--;
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Bring child home");
	};

	PolicemanManager.actionSmoke = function (behaviourTreeInstance) {
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Smoke");
	};

	PolicemanManager.actionWanderAround = function (behaviourTreeInstanceState) {
		behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_COMPUTE_RESULT);
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Wander around");
	};

	PolicemanManager.amOutside = function (behaviourTreeInstance) {
		return behaviourTreeInstance.actor.isOutside;
	};

	// Behaviour Tree Instance BEGIN
	var patrollingPoliceBehaviourTree = new
			SelectorNode(
			new ActionNode(PolicemanManager.ifChaseGotKid),
			new ActionNode(PolicemanManager.actionBringChildToStation),
			new ActionNode(PolicemanManager.actionWanderAround)
	);
	// Behaviour Tree Instance END


	/**
	 * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
	 * and get them acting on a certain behaviour tree instance.
	 */
	var policeman1 = {};
	policeman1.name = "Bobby";
	policeman1.haveBeenChasing=0;

    bti = new BehaviourTreeInstance(patrollingPoliceBehaviourTree,policeman1,1);

	tick(bti);

	/*var policeman2 = {};
	 policeman2.name = "Jimmy";
	 tick(patrollingPoliceBehaviourTree, policeman2);

	 var socialWorker1 = {};
	 socialWorker1.name = "Helping Dude";
	 tick(socialWorkerBehaviourTree, socialWorker1);*/

}

