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


function example() {

	var totalKidsWondering = 20;

	/**
	 *  PolicemanManager is like a static instance that processes actions on a given actor
	 *  through a behaviour tree instance.
	 */
	var PolicemanManager = {};

	PolicemanManager.ifKidInSight = function (behaviourTreeInstanceState) {
		if (totalKidsWondering>0) {
			writeOnConsole("total kids wandering: " + totalKidsWondering);
			var b = Math.random() > 0.4;
			writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"see kid? " + (b ? "yes" : "no"));
			return  b;
		} else {
			writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"No more kids");
			return false;
		}
	};

	PolicemanManager.ifChaseGotKid = function (behaviourTreeInstanceState) {

        if (behaviourTreeInstanceState.hasToStart()) {

            writeOnConsole("running after kid");

            behaviourTreeInstanceState.waitUntil(function() {
                setTimeout(function () {
                    behaviourTreeInstanceState.completedAsync();
                }, 3000);
            });

        } else if (behaviourTreeInstanceState.hasToComplete()) {

            var b = Math.random() > 0.5;
            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " got child: "+b);
            return  b;

        } else {
            writeOnConsole("running after kid doing nothing");
        }

	};

    PolicemanManager.ifChaseGotKidCases = function (behaviourTreeInstanceState) {

        if (behaviourTreeInstanceState.hasToStart()) {

            writeOnConsole("running after kid");

            console.debug("ifChaseGotKid currentNode ", behaviourTreeInstanceState.currentNode);

            behaviourTreeInstanceState.waitUntil(function() {
                setTimeout(function () {
                    behaviourTreeInstanceState.completedAsync();
                }, 3000);
            });

        } else if (behaviourTreeInstanceState.hasToComplete()) {

            var random = Math.random();
            var b = random > 0.6? 2 : (random > 0.3? 1: 0);
            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + " got child: "+b);
            return  b;

        } else {
            writeOnConsole("running after kid doing nothing");
        }

    };

    PolicemanManager.actionBringChildToStation = function (behaviourTreeInstanceState) {

        if (behaviourTreeInstanceState.hasToStart()) {

            writeOnConsole(behaviourTreeInstanceState.actor.name + ": " + "Bring child to station");

            behaviourTreeInstanceState.waitUntil(function() {
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
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Bring child home");
	};

	PolicemanManager.actionSmoke = function (behaviourTreeInstanceState) {
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Smoke");
	};

    PolicemanManager.actionImHurt = function (behaviourTreeInstanceState) {
        writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"  I'm hurt!");
    };


	PolicemanManager.actionWanderAround = function (behaviourTreeInstanceState) {
		writeOnConsole(behaviourTreeInstanceState.actor.name+": "+"Wander around");
	};

	// Behaviour Tree Instance BEGIN
	/**
	 * Here are several examples of behaviour tree definitions. You can create your own.
	 */
	var patrollingPoliceBehaviourTreeTwoResults =
			(new
					SelectorNode(
					new ActionNode(PolicemanManager.ifKidInSight),
					(new
							SelectorNode(
							new ActionNode(PolicemanManager.ifChaseGotKid),
							new ActionNode(PolicemanManager.actionBringChildToStation),
							new SequencerNode([new ActionNode(PolicemanManager.actionWanderAround),new ActionNode(PolicemanManager.actionSmoke)])
					)),
					new ActionNode(PolicemanManager.actionSmoke)
			));

	var patrollingPoliceBehaviourTreeMultiResults =
			new SelectorArrayNode(
        new ActionNode(PolicemanManager.ifChaseGotKidCases),
        [
            new ActionNode(PolicemanManager.actionBringChildToStation),
            new SequencerNode([new ActionNode(PolicemanManager.actionWanderAround),new ActionNode(PolicemanManager.actionSmoke)]),
            new ActionNode(PolicemanManager.actionImHurt)
        ]
    );


    var patrollingPoliceBehaviourTreeRandomResults =
		    new SelectorRandomNode(
        [
            new ActionNode(PolicemanManager.actionBringChildToStation),
            new SequencerRandomNode([new ActionNode(PolicemanManager.actionWanderAround),new ActionNode(PolicemanManager.actionSmoke)]),
            new ActionNode(PolicemanManager.actionImHurt)
        ]
    );

    var patrollingPoliceBehaviourTreeRandom =
		    new SequencerRandomNode([new ActionNode(PolicemanManager.actionWanderAround),new ActionNode(PolicemanManager.actionSmoke)]);
    // Behaviour Tree Instance END


	/**
	 * Now that we have a couple of behaviour trees, all it takes is to create characters (NPCs)
	 * and get them acting on a certain behaviour tree instance.
	 */
	var policeman1 = {};
	policeman1.name = "Bobby";
	policeman1.haveBeenChasing=0;

  var bti1 = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeTwoResults,policeman1,1);

	tick(bti1);


	var policeman2 = {};
	policeman2.name = "Jimmy";
	var bti2 = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeTwoResults,policeman2,1);


	tick(bti2);

}


/**
 * This is what makes all your behaviour trees instances run. (implement your own tick)
 */
function tick(behaviourTreeInstance) {
	setInterval(function () {
		behaviourTreeInstance.executeBehaviourTree();
	}, 1000);
}



