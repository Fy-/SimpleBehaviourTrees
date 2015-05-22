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
 * This does nothing but we like to have a "root"
 */

var btiId = 0;

/**
 *
 * @param behaviourTree
 * @param actor
 * @param numberOfLoops 0 forever
 * @constructor
 */
function BehaviourTreeInstance(behaviourTree, actor, numberOfLoops) {

    if (!numberOfLoops)
        numberOfLoops = 1;

	this.behaviourTree = behaviourTree;
	this.actor = actor;
	this.nodeAndState = [];
	this.currentNode=null;
    this.numberOfLoops = numberOfLoops;

    this.numberOfRuns = 0;
    this.finished = false;

	this.findStateForNode = function (node) {

		for(var i = 0;i<this.nodeAndState.length;i++) {
			if (this.nodeAndState[i][0]==node)
			  return this.nodeAndState[i][1];
		}
	}

	this.setState = function (state, node) {

        if (!node)
            node = this.currentNode;

        for(var i = 0;i<this.nodeAndState.length;i++) {
            if (this.nodeAndState[i][0]==node) {
                this.nodeAndState.splice(i, 1);
                break;
            }
        }
		this.nodeAndState.push([node,state]);
	}

}
BehaviourTreeInstance.STATE_TO_BE_STARTED = "STATE_TO_BE_STARTED";
BehaviourTreeInstance.STATE_WAITING = "STATE_WAITING";
BehaviourTreeInstance.STATE_DISCARDED = "STATE_DISCARDED";
BehaviourTreeInstance.STATE_EXECUTING = "STATE_EXECUTING";
BehaviourTreeInstance.STATE_COMPUTE_RESULT = "STATE_COMPUTE_RESULT";
BehaviourTreeInstance.STATE_COMPLETED = "STATE_COMPLETED";

// Action model and implementation - BEGIN
/**
 * This simply creates a wrapper node for any specific action.
 * The wrapper is necessary in order to have a uniform "execute"
 * method to be called by the engine.
 */
function ActionNode(action) {
    this.id = btiId++;
    this.action = action;

	this.execute = function(behaviourTreeInstanceState) {
		return action(behaviourTreeInstanceState);
	}

	this.children = function(behaviourTreeInstanceState) {
		return null;
	}

	}
// Action model and implementation - END



// selector model and implementation - BEGIN
/**
 * This models the "selector" behaviour on two alternative conditions
 * You use this function in configuring your actor behaviour.
 */
function SelectorNode(conditionFunction, actionIfTrue, actionIfFalse) {

    this.id = btiId++;
	this.conditionFunction = conditionFunction;
	this.actionIfTrue = actionIfTrue;
	this.actionIfFalse = actionIfFalse;

	/**
	 * This makes a given SelectorNode instance execute.
	 * This function is used by the engine executeBehaviourTreeWithTick
	 * when a node of type SelectorNode is met
	 */
	this.execute = function(behaviourTreeInstanceState) {

		console.debug("conditionFunction ",conditionFunction);

		//var result = executeBehaviourTree(behaviourTreeInstanceState)
		var result = conditionFunction.execute(behaviourTreeInstanceState);
		behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_WAITING);

		if (result) {
			behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED,actionIfTrue);
			behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED,actionIfFalse);
		} else {
			behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_DISCARDED,actionIfFalse);
			behaviourTreeInstanceState.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED,actionIfTrue);
		}


	}

	this.children = function() {
		return [actionIfTrue,actionIfFalse];
	}

}
// selector model and implementation - END



// SelectorArray model and implementation - BEGIN
/**
 * This is a cool extension of selector that takes a condition function returning the index of the action to be executed.
 * This allows to compact a set of nested conditions in a more readable one.
 */
function SelectorArrayNode(conditionFunction, actionArray) {

	this.conditionFunction = conditionFunction;
	this.actionArray = actionArray;

	this.execute = function(behaviourTreeInstanceState) {

		behaviourTreeInstanceState.currentNode = conditionFunction;
		executeBehaviourTreeWithTick(actionArray[executeBehaviourTreeWithTick(behaviourTreeInstanceState)]);
	}

	this.children = function() {
		return actionArray;
	}

}
// SelectorArray model and implementation - END



// Sequencer model and implementation - BEGIN
function SequencerNode(actionArray) {

	this.actionArray = actionArray;

	this.execute = function(behaviourTreeInstanceState) {
		for (var i = 0; i < actionArray.length; i++) {

			behaviourTreeInstanceState.currentNode = actionArray[i];
			executeBehaviourTreeWithTick(behaviourTreeInstanceState);
		}
	}

	this.children = function() {
		return actionArray;
	}
}
// Sequencer model and implementation - END



// SelectorRandom model and implementation - BEGIN
function SelectorRandomNode(actionArray) {

	this.actionArray = actionArray;

	this.execute = function(behaviourTreeInstanceState) {
		var randomIndex = Math.floor(Math.random() * actionArray.length);
		behaviourTreeInstanceState.currentNode = actionArray[randomIndex];

		executeBehaviourTreeWithTick(behaviourTreeInstanceState);
	}

	this.children = function() {
		return actionArray;
	}
}
// SelectorRandom model and implementation - END



// SequencerRandom model and implementation - BEGIN
function SequencerRandomNode(actionArray) {

	this.actionArray = actionArray;

	this.execute = function(behaviourTreeInstanceState) {
		shuffle(actionArray);

		for ( var i = 0; i < actionArray.length; i++) {
			behaviourTreeInstanceState.currentNode = actionArray[i];
			executeBehaviourTreeWithTick(behaviourTreeInstanceState);
		}
	}

	this.children = function() {
		return actionArray;
	}
}
// SequencerRandom model and implementation - END

/**
 * This is the function that crawls the behaviour tree instance you pass to it
 * and calls the executors if the the argument is a node of some kind,
 * calls it as an action otherwise.
 */
function executeBehaviourTree(behaviourTreeInstance) {

    if (behaviourTreeInstance.finished)
      return;


	//find current node to be executed, or a running one, or root to launch, or root completed
	behaviourTreeInstance.currentNode = findCurrentNode(behaviourTreeInstance.behaviourTree, behaviourTreeInstance);

    if (behaviourTreeInstance.currentNode == null) {
        behaviourTreeInstance.numberOfRuns++;
        if (behaviourTreeInstance.numberOfLoops==0 || behaviourTreeInstance.numberOfRuns<behaviourTreeInstance.numberOfLoops) {
            behaviourTreeInstance.nodeAndState = [];
            behaviourTreeInstance.currentNode = findCurrentNode(behaviourTreeInstance.behaviourTree, behaviourTreeInstance);
        } else {
            console.debug(behaviourTreeInstance.actor.name+" has finished.");
            behaviourTreeInstance.finished = true;
            return;
        }
    }

	console.debug("node", behaviourTreeInstance.currentNode);

	var state = behaviourTreeInstance.findStateForNode(behaviourTreeInstance.currentNode);
	console.debug("state", state);


	if (state == null || state == BehaviourTreeInstance.STATE_TO_BE_STARTED) {

        behaviourTreeInstance.currentNode.execute(behaviourTreeInstance);
        var afterState = behaviourTreeInstance.findStateForNode(behaviourTreeInstance.currentNode);
        if (afterState == BehaviourTreeInstance.STATE_TO_BE_STARTED)
            behaviourTreeInstance.setState(BehaviourTreeInstance.STATE_WAITING);
        return;
    }


	//if (state == BehaviourTreeInstance.STATE_WAITING)
	//	state = BehaviourTreeInstance.STATE_COMPUTE_RESULT;

	//if (state == BehaviourTreeInstance.STATE_TO_BE_STARTED)
	//	state = BehaviourTreeInstance.STATE_COMPUTE_RESULT;

//	behaviourTreeInstance.currentNode.start(behaviourTreeInstance);

	if (state == BehaviourTreeInstance.STATE_COMPUTE_RESULT) {
        behaviourTreeInstance.currentNode.execute(behaviourTreeInstance);
        state = BehaviourTreeInstance.STATE_COMPLETED;
        return;
    }

	console.debug("state-1", state);

}

function findCurrentNode(node, behaviourTreeInstance) {

	var state = behaviourTreeInstance.findStateForNode(node);
	if (state==null) {
		behaviourTreeInstance.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED,node);
		return node;
	}

	if (state == BehaviourTreeInstance.STATE_EXECUTING ||
			state == BehaviourTreeInstance.STATE_COMPUTE_RESULT ||
			state == BehaviourTreeInstance.STATE_TO_BE_STARTED
			)
		return node;

	var children = node.children();
	if (children==null) {
        return null;
    } else {

		for (var i = 0; i < children.length; i++) {
			var childNode = findCurrentNode(children[i],behaviourTreeInstance);
			if (childNode)
			  return childNode;
		}
        if (state==BehaviourTreeInstance.STATE_WAITING) {
            behaviourTreeInstance.setState(BehaviourTreeInstance.STATE_COMPLETED, node);
            console.debug("setting to completed ",node);
        }
	}
	return null;
}



/**
 * This is what makes all your behaviour trees instances run
 */
function tick(behaviourTreeInstance) {

	//executeBehaviourTree(behaviourTreeInstance);

	setInterval(function () {
		executeBehaviourTree(behaviourTreeInstance);
	 }, 1000);
}


/**
 * Utility array shuffle function
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

