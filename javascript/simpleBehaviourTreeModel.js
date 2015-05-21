/**
 * Created by Pietro Polsinelli on 15/05/2015.
 *
 * Fisrt inspired by the simplicity of
 * http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 * Follow me on Twitter @ppolsinelli where I post about game design, game development, Unity3d 2D, HTML5, applied games.
 *
 */

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

        if (executeBehaviourTreeWithTick(conditionFunction, behaviourTreeInstanceState.actor)) {

            executeBehaviourTreeWithTick(actionIfTrue, behaviourTreeInstanceState.actor);

        } else {

            executeBehaviourTreeWithTick(actionIfFalse, behaviourTreeInstanceState.actor);
        }
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
        executeBehaviourTreeWithTick(actionArray[executeBehaviourTreeWithTick(behaviourTreeInstanceState)], behaviourTreeInstanceState.actor);
    }
}
// SelectorArray model and implementation - END



// Sequencer model and implementation - BEGIN
function SequencerNode(actionArray) {

    this.actionArray = actionArray;

    this.execute = function(behaviourTreeInstanceState) {
        for (i = 0; i < actionArray.length; i++) {

            executeBehaviourTreeWithTick(actionArray[i], behaviourTreeInstanceState.actor);
        }
    }
}
// Sequencer model and implementation - END



// SelectorRandom model and implementation - BEGIN
function SelectorRandomNode(actionArray) {

    this.actionArray = actionArray;

    this.execute = function(behaviourTreeInstanceState) {
        var randomIndex = Math.floor(Math.random() * actionArray.length);
        executeBehaviourTreeWithTick(actionArray[randomIndex], behaviourTreeInstanceState.actor);
    }
}
// SelectorRandom model and implementation - END



// SequencerRandom model and implementation - BEGIN
function SequencerRandomNode(actionArray) {

    this.actionArray = actionArray;

    this.execute = function(behaviourTreeInstanceState) {
        shuffle(actionArray);

        for (i = 0; i < actionArray.length; i++) {

            executeBehaviourTreeWithTick(actionArray[i], behaviourTreeInstanceState.actor);
        }
    }
}
// SequencerRandom model and implementation - END

function BehaviourTreeInstanceState(behaviourTreeInstance, actor) {

    this.behaviourTreeInstance = behaviourTreeInstance;
    this.currentNode = behaviourTreeInstance;
    this.actor = actor;
}

/**
 * This is the function that crawls the behaviour tree instance you pass to it
 * and calls the executors if the the argument is a node of some kind,
 * calls it as an action otherwise.
 */
function executeBehaviourTreeWithTick(behaviourTreeInstanceState) {

    if (behaviourTreeInstanceState.actor.completedCurrentAction === undefined || behaviourTreeInstanceState.actor.completedCurrentAction === true) {

            return behaviourTreeInstanceState.currentNode.execute(behaviourTreeInstanceState);
    }
}

/**
 * This is what makes all your behaviour trees instances run
 */
function tick(behaviourTreeInstanceState) {
    console.debug("called tick ",behaviourTreeInstanceState);
    executeBehaviourTreeWithTick(behaviourTreeInstanceState);

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

