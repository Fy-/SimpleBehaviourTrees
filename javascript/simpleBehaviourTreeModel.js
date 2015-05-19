/**
 * Created by Pietro Polsinelli on 15/05/2015.
 *
 * Fisrt inspired by the simplicity of
 * http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 * Follow me on Twitter @ppolsinelli where I post about game design, game development, Unity3d 2D, HTML5, applied games.
 *
 */

// selector model and implementation - BEGIN
/**
 * This models the "selector" behaviour on two alternative conditions
 * You use this function in configuring your actor behaviour.
 */
function SelectorNode(conditionFunction, actionIfTrue, actionIfFalse) {
    this.conditionFunction = conditionFunction;
    this.actionIfTrue = actionIfTrue;
    this.actionIfFalse = actionIfFalse;
}

/**
 * This makes a given SelectorNode instance execute.
 * This function is used by the engine executeBehaviourTreeWithTick
 * when a node of type SelectorNode is met
 */
function selector(selectorNode, actorInstance) {

    if (executeBehaviourTreeWithTick(selectorNode.conditionFunction, actorInstance)) {

        executeBehaviourTreeWithTick(selectorNode.actionIfTrue, actorInstance);

    } else {

        executeBehaviourTreeWithTick(selectorNode.actionIfFalse, actorInstance);
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
}

function selectorArray(selectorArrayNode, actorInstance) {
    executeBehaviourTreeWithTick(selectorArrayNode.actionArray[executeBehaviourTreeWithTick(selectorArrayNode.conditionFunction, actorInstance)], actorInstance);
}
// SelectorArray model and implementation - END



// Sequencer model and implementation - BEGIN
function SequencerNode(actionArray) {
    this.actionArray = actionArray;
}

function sequencer(sequencerNode, actorInstance) {
    for (i = 0; i < sequencerNode.actionArray.length; i++) {

        executeBehaviourTreeWithTick(sequencerNode.actionArray[i], actorInstance);
    }
}
// Sequencer model and implementation - END



// SelectorRandom model and implementation - BEGIN
function SelectorRandomNode(actionArray) {
    this.actionArray = actionArray;
}

function selectorRandom(selectorRandomNode, actorInstance) {

    var randomIndex = Math.floor(Math.random() * selectorRandomNode.actionArray.length);

    executeBehaviourTreeWithTick(selectorRandomNode.actionArray[randomIndex], actorInstance);
}
// SelectorRandom model and implementation - END



// SequencerRandom model and implementation - BEGIN
function SequencerRandomNode(actionArray) {
    this.actionArray = actionArray;
}

function sequencerRandom(sequencerRandomNode, actorInstance) {

    shuffle(sequencerRandomNode.actionArray);
    for (i = 0; i < sequencerRandomNode.actionArray.length; i++) {

        executeBehaviourTreeWithTick(sequencerRandomNode.actionArray[i], actorInstance);
    }
}
// SequencerRandom model and implementation - END


/**
 * This is the function that crawls the behaviour tree instance you pass to it
 * and calls the executors if the the argument is a node of some kind,
 * calls it as an action otherwise.
 */
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

/**
 * This is what makes all your behaviour trees instances run
 * @param behaviourTreeNode
 * @param actor
 */
function tick(behaviourTreeNode, actor) {
    setInterval(function () {
        executeBehaviourTreeWithTick(behaviourTreeNode, actor);
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

