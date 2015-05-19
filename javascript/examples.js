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


function firstExample() {


	var patrollingModel = {};

	patrollingModel.ifPlayerIsInSight = function (actorInstance) {
		var b = Math.random() > 0.5;
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
			new ActionNode(patrollingModel.ifPlayerIsInSight),
			//always shoot twice
			new SequencerNode([new ActionNode(patrollingModel.actionShootAtPlayer), new ActionNode(patrollingModel.actionShootAtPlayer)]),
			//cover or patrol
			new SelectorNode(new ActionNode(patrollingModel.ifUnderFire), new ActionNode(patrollingModel.actionTakeCover), new ActionNode(patrollingModel.actionWalkBackAndForthGuardingDoorway))
	);


	var guard1 = {};
	tick(patrollingGuardBehaviourTree, guard1);
}



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

	policemanModel.ifIsKidInControl = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole(actorInstance.name+": "+"Hi kid, where do you live? " + (b ? "F**k you" : "Home"));
		return  b;
	};

	policemanModel.actionBringChildToStation = function (actorInstance) {
		totalKidsWondering--;
		writeOnConsole(actorInstance.name+": "+"Bring child to station");
	};

	policemanModel.actionBringChildHome = function (actorInstance) {
		totalKidsWondering--;
		writeOnConsole(actorInstance.name+": "+"Bring child home");
	};

	policemanModel.actionSmoke = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Smoke");
	};

	policemanModel.actionWanderAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Wander around");
	};

	policemanModel.amOutside = function (actorInstance) {
		return actorInstance.isOutside;
	};

    // Behaviour Tree Instance BEGIN
    /**
     *  This is the key point: define your instance of behaviour tree. Here you can play and make it more complex.
     */
	var kidInsightAction = new SelectorNode(
        new ActionNode(policemanModel.ifIsKidInControl),
            new ActionNode(policemanModel.actionBringChildToStation),
			new SelectorRandomNode([new ActionNode(policemanModel.actionBringChildHome), new ActionNode(policemanModel.actionSmoke)]));

	var patrollingPoliceBehaviourTree = new
			SelectorNode(
                new ActionNode(policemanModel.ifKidInSight),
                kidInsightAction,
                new ActionNode(policemanModel.actionWanderAround)
                );
    // Behaviour Tree Instance END

    var socialSecurityWorkerModel = {};


    /**
     * THis is an interesting method, because it shows how we support a
     * selector which makes a choice between more than 2 cases.
     * It gets modelled and implemented as SelectorArrayNode
     * @param actorInstance
     * @returns {number} (index of array of nodes)
     */
	socialSecurityWorkerModel.ifKidInSight = function (actorInstance) {
		if (totalKidsWondering > 0) {
			var b = Math.random() > 0.5 ? 0 : Math.random() > 0.7 ? 1 : 2;
			writeOnConsole(actorInstance.name+": "+"see kid? " + b);
			return  b;
		} else {
			writeOnConsole(actorInstance.name+": "+"No more kids");
			return 2;
		}
	};

	socialSecurityWorkerModel.ifIsKidInControl = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole(actorInstance.name+": "+"Hi kid, having a good time? " + (b ? "F**k you" : "OK"));
		return  b;
	};

	socialSecurityWorkerModel.actionBringChildHome = function (actorInstance) {
		totalKidsWondering--;
		writeOnConsole(actorInstance.name+": "+"Bring child home");

	};

	socialSecurityWorkerModel.actionChatWithKid = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"How is school?");
	};

	socialSecurityWorkerModel.actionLazyAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Smoke weed");
	};

	socialSecurityWorkerModel.actionWanderAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Wander around");
	};

	socialSecurityWorkerModel.amOutside = function (actorInstance) {
		return actorInstance.isOutside;
	};

    // Behaviour Tree Instance BEGIN
    /**
     *  This is the key point: define your instance of behaviour tree. Here you can play and make it more complex.
     */
	var socialSecurityKidInsightAction = new SelectorNode(
        new ActionNode(socialSecurityWorkerModel.ifIsKidInControl),
        new ActionNode(socialSecurityWorkerModel.actionBringChildHome),
		new SelectorRandomNode([new ActionNode(socialSecurityWorkerModel.actionChatWithKid), new ActionNode(socialSecurityWorkerModel.actionLazyAround)])
    );

	var socialWorkerBehaviourTree = new SelectorArrayNode(
        new ActionNode(socialSecurityWorkerModel.ifKidInSight),
        [socialSecurityKidInsightAction, new ActionNode(socialSecurityWorkerModel.actionWanderAround), new ActionNode(socialSecurityWorkerModel.actionLazyAround)]);
    // Behaviour Tree Instance END

    /**
     * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
     * and get them acting on a certain behaviour tree instance.
     */
    var policeman1 = {};
    policeman1.name = "Bobby";
    tick(patrollingPoliceBehaviourTree, policeman1);

    var policeman2 = {};
    policeman2.name = "Jimmy";
    tick(patrollingPoliceBehaviourTree, policeman2);

	var socialWorker1 = {};
	socialWorker1.name = "Helping Dude";
	tick(socialWorkerBehaviourTree, socialWorker1);

}

