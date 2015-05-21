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


	var PatrollingGuardManager = {};

	PatrollingGuardManager.ifPlayerIsInSight = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole("see player? " + (b ? "yes" : "no"));
		return  b;
	};

	PatrollingGuardManager.actionShootAtPlayer = function (actorInstance) {
		writeOnConsole("bang!");
	};

	PatrollingGuardManager.ifUnderFire = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole("under fire? " + (b ? "yes" : "no"));
		return  b;
	};

	PatrollingGuardManager.actionTakeCover = function (actorInstance) {
		//actorInstance.inCover=true;
		writeOnConsole("Took cover");
	};

	PatrollingGuardManager.actionWalkBackAndForthGuardingDoorway = function (actorInstance) {
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
			new ActionNode(PatrollingGuardManager.ifPlayerIsInSight),
			//always shoot twice
			new SequencerNode([new ActionNode(PatrollingGuardManager.actionShootAtPlayer), new ActionNode(PatrollingGuardManager.actionShootAtPlayer)]),
			//cover or patrol
			new SelectorNode(new ActionNode(PatrollingGuardManager.ifUnderFire), new ActionNode(PatrollingGuardManager.actionTakeCover), new ActionNode(PatrollingGuardManager.actionWalkBackAndForthGuardingDoorway))
	);


	var guard1 = {};
	tick(patrollingGuardBehaviourTree, guard1);
}



function secondExample() {

	var totalKidsWondering = 20;

	var PolicemanManager = {};


	PolicemanManager.ifKidInSight = function (behaviourTreeInstanceState) {
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

	PolicemanManager.ifIsKidInControl = function (behaviourTreeInstanceState) {
		var b = Math.random() > 0.5;
		writeOnConsole(actorInstance.name+": "+"Hi kid, where do you live? " + (b ? "F**k you" : "Home"));
		return  b;
	};

	PolicemanManager.runAfterKid = function (behaviourTreeInstanceState) {

		var actorInstance = behaviourTreeInstanceState.actor;
		behaviourTreeInstanceState.completedCurrentAction = false;

		setTimeout(function() {
			behaviourTreeInstanceState.completedCurrentAction = true;
			//todo chase success, fail
		},5000);

	};

	PolicemanManager.actionBringChildToStation = function (behaviourTreeInstanceState) {
		totalKidsWondering--;
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Bring child to station");
	};

	PolicemanManager.actionBringChildHome = function (behaviourTreeInstanceState) {
		totalKidsWondering--;
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Bring child home");
	};

	PolicemanManager.actionSmoke = function (behaviourTreeInstanceState) {
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Smoke");
	};

	PolicemanManager.actionWanderAround = function (behaviourTreeInstanceState) {
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Wander around");
	};

	PolicemanManager.amOutside = function (behaviourTreeInstanceState) {
		return behaviourTreeInstanceState.actor.isOutside;
	};

	// Behaviour Tree Instance BEGIN
	/**
	 *  This is the key point: define your instance of behaviour tree. Here you can play and make it more complex.
	 */
	var kidInsightAction = new SelectorNode(
			new ActionNode(PolicemanManager.ifIsKidInControl),
			new SelectorRandomNode([new ActionNode(PolicemanManager.actionSmoke),new ActionNode(PolicemanManager.actionWanderAround)]),
			new ActionNode(PolicemanManager.runAfterKid)
			);


	//new SelectorRandomNode([new ActionNode(PolicemanManager.actionBringChildHome), new ActionNode(PolicemanManager.actionSmoke)]));

	var patrollingPoliceBehaviourTree = new
			SelectorNode(
			new ActionNode(PolicemanManager.ifKidInSight),
			kidInsightAction,
			new ActionNode(PolicemanManager.actionWanderAround)
	);
	// Behaviour Tree Instance END


	/**
	 * This "singleton" will handle all the actions of each SocialSecurityWorker instance
	 */
	var SocialSecurityWorkerManager = {};


	/**
	 * THis is an interesting method, because it shows how we support a
	 * selector which makes a choice between more than 2 cases.
	 * It gets modelled and implemented as SelectorArrayNode
	 * @param actorInstance
	 * @returns {number} (index of array of nodes)
	 */
	SocialSecurityWorkerManager.ifKidInSight = function (actorInstance) {
		if (totalKidsWondering > 0) {
			var b = Math.random() > 0.5 ? 0 : Math.random() > 0.7 ? 1 : 2;
			writeOnConsole(actorInstance.name+": "+"see kid? " + b);
			return  b;
		} else {
			writeOnConsole(actorInstance.name+": "+"No more kids");
			return 2;
		}
	};

	SocialSecurityWorkerManager.ifIsKidInControl = function (actorInstance) {
		var b = Math.random() > 0.5;
		writeOnConsole(actorInstance.name+": "+"Hi kid, having a good time? " + (b ? "F**k you" : "OK"));
		return  b;
	};

	SocialSecurityWorkerManager.actionBringChildHome = function (actorInstance) {
		totalKidsWondering--;
		writeOnConsole(actorInstance.name+": "+"Bring child home");

	};

	SocialSecurityWorkerManager.actionChatWithKid = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"How is school?");
	};

	SocialSecurityWorkerManager.actionLazyAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Smoke weed");
	};

	SocialSecurityWorkerManager.actionWanderAround = function (actorInstance) {
		writeOnConsole(actorInstance.name+": "+"Wander around");
	};

	SocialSecurityWorkerManager.amOutside = function (actorInstance) {
		return actorInstance.isOutside;
	};

	// Behaviour Tree Instance BEGIN
	/**
	 *  This is the key point: define your instance of behaviour tree. Here you can play and make it more complex.
	 */
	var socialSecurityKidInsightAction = new SelectorNode(
			new ActionNode(SocialSecurityWorkerManager.ifIsKidInControl),
			new ActionNode(SocialSecurityWorkerManager.actionBringChildHome),
			new SelectorRandomNode([new ActionNode(SocialSecurityWorkerManager.actionChatWithKid), new ActionNode(SocialSecurityWorkerManager.actionLazyAround)])
	);

	var socialWorkerBehaviourTree = new SelectorArrayNode(
			new ActionNode(SocialSecurityWorkerManager.ifKidInSight),
			[socialSecurityKidInsightAction, new ActionNode(SocialSecurityWorkerManager.actionWanderAround), new ActionNode(SocialSecurityWorkerManager.actionLazyAround)]);
	// Behaviour Tree Instance END

	/**
	 * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
	 * and get them acting on a certain behaviour tree instance.
	 */
	var policeman1 = {};
	policeman1.name = "Bobby";
	policeman1.haveBeenChasing=0;

	var state = new BehaviourTreeInstance(patrollingPoliceBehaviourTree,policeman1);

	tick(state);

	/*var policeman2 = {};
	 policeman2.name = "Jimmy";
	 tick(patrollingPoliceBehaviourTree, policeman2);

	 var socialWorker1 = {};
	 socialWorker1.name = "Helping Dude";
	 tick(socialWorkerBehaviourTree, socialWorker1);*/

}

