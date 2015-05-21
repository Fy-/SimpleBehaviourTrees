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
function BehaviourTreeInstance(behaviourTree, actor) {

	this.behaviorTree = behaviourTree;
	this.actor = actor;
	this.nodeAndState = [];

	this.findStateForNode = function (node) {

		for(var i = 0;i<this.nodeAndState.length;i++) {
			if (this.nodeAndState[i][0]==node)
			  return this.nodeAndState[i][1];
		}
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
	this.action = action;

	this.execute = function(behaviourTreeInstanceState) {
		return action(behaviourTreeInstanceState.actor);
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

	this.conditionFunction = conditionFunction;
	this.actionIfTrue = actionIfTrue;
	this.actionIfFalse = actionIfFalse;

	/**
	 * This makes a given SelectorNode instance execute.
	 * This function is used by the engine executeBehaviourTreeWithTick
	 * when a node of type SelectorNode is met
	 */
	this.execute = function(behaviourTreeInstanceState) {

		behaviourTreeInstanceState.currentNode = conditionFunction;
		var result = executeBehaviourTreeWithTick(behaviourTreeInstanceState)

		if (result) {
			behaviourTreeInstanceState.currentNode = actionIfTrue;
		} else {
			behaviourTreeInstanceState.currentNode = actionIfFalse;
		}

		executeBehaviourTreeWithTick(behaviourTreeInstanceState);
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

	//find current node to be executed, or a running one, or root to launch, or root completed
	var node = findCurrentNode(behaviourTreeInstance,behaviourTreeInstance);

	var state = behaviourTreeInstance.findStateForNode(node);

	if (state == BehaviourTreeInstance.STATE_EXECUTING)
	 return;

	if (state == BehaviourTreeInstance.STATE_WAITING)
		state = BehaviourTreeInstance.STATE_COMPUTE_RESULT;

	if (state == BehaviourTreeInstance.STATE_TO_BE_STARTED)
    node.start(behaviourTreeInstance);

	if (state == BehaviourTreeInstance.STATE_COMPUTE_RESULT)
		node.execute(behaviourTreeInstance);

}

function findCurrentNode(node, behaviourTreeInstance) {

	var state = behaviourTreeInstance.findStateForNode(node);
	if (state==null) {
		behaviourTreeInstance.nodeAndState.push([node,BehaviourTreeInstance.STATE_TO_BE_STARTED]);
		return node;
	}

	if (state == BehaviourTreeInstance.STATE_EXECUTING ||
			state == BehaviourTreeInstance.STATE_COMPUTE_RESULT ||
			state == BehaviourTreeInstance.STATE_TO_BE_STARTED
			)
		return node;

	var children = node.children();
	if (children==null)
	  return node;
	else {

		for (var i = 0; i < children.length; i++) {
			var childNode = findCurrentNode(children[i]);
			if (childNode)
			  return childNode;
		}
	}
	return null;
}



/**
 * This is what makes all your behaviour trees instances run
 */
function tick(behaviourTreeInstance) {

	executeBehaviourTree(behaviourTreeInstance);

	/*setInterval(function () {
	 executeBehaviourTreeWithTick(behaviourTreeInstanceState);
	 }, 1000); */
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

