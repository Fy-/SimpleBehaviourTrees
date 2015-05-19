/**
 * Created by Pietro Polsinelli on 15/05/2015. Twitter: @ppolsinelli
 *
 * Inspired by http://stackoverflow.com/questions/4241824/creating-an-ai-behavior-tree-in-c-sharp-how
 *
 */

function SelectorNode(conditionFunction, actionIfTrue, actionIfFalse) {
    this.conditionFunction = conditionFunction;
    this.actionIfTrue = actionIfTrue;
    this.actionIfFalse = actionIfFalse;
}

function SequencerNode(actionArray) {
    this.actionArray = actionArray;
}



function executeBehaviourTreeSimpleNoTick(behaviourTreeNode, actor) {

    if (Object.getPrototypeOf(behaviourTreeNode) === SelectorNode.prototype) {
        selector(behaviourTreeNode, actor);
    } else if (Object.getPrototypeOf(behaviourTreeNode) === SequencerNode.prototype) {
        sequencer(behaviourTreeNode, actor);
    } else {
        return behaviourTreeNode(actor);
    }
}


function selector(selectorNode, actorInstance) {

    if (executeBehaviourTreeSimpleNoTick(selectorNode.conditionFunction, actorInstance)) {

        executeBehaviourTreeSimpleNoTick(selectorNode.actionIfTrue, actorInstance);

    } else {

        executeBehaviourTreeSimpleNoTick(selectorNode.actionIfFalse, actorInstance);
    }
}

function sequencer(sequencerNode, actorInstance) {
    for (i = 0; i < sequencerNode.actionArray.length; i++) {

        executeBehaviourTreeSimpleNoTick(sequencerNode.actionArray[i], actorInstance);
    }
}

function firstExample() {

    var patrollingModel = {};

    patrollingModel.ifPlayerIsInSight = function (actorInstance) {
        var b = Math.random() > 0.2;
        console.log("see player? " + (b ? "yes" : "no"));
        return  b;
    };

    patrollingModel.actionShootAtPlayer = function (actorInstance) {
        console.log("bang!");
    };

    patrollingModel.ifUnderFire = function (actorInstance) {
        var b = Math.random() > 0.5;
        console.log("under fire? " + (b ? "yes" : "no"));
        return  b;
    };

    patrollingModel.actionTakeCover = function (actorInstance) {
        //actorInstance.inCover=true;
        console.log("Took cover");
    };

    patrollingModel.actionWalkBackAndForthGuardingDoorway = function (actorInstance) {
        //actorInstance.goingUp=!actorInstance.goingUp;
        console.log("Patrolling " + (actorInstance.goingUp ? "north" : "south"));
    };

    var patrollingGuardBehaviourTree = new
        //shoot or other
        SelectorNode(
        patrollingModel.ifPlayerIsInSight,
        //always shoot twice
        new SequencerNode([patrollingModel.actionShootAtPlayer, patrollingModel.actionShootAtPlayer]),
        //cover or patrol
        new SelectorNode(patrollingModel.ifUnderFire, patrollingModel.actionTakeCover, patrollingModel.actionWalkBackAndForthGuardingDoorway)
    );

    /*SelectorNode(
     patrollingModel.ifPlayerIsInSight,
     //always shoot twice
     patrollingModel.actionShootAtPlayer,
     //cover or patrol
     patrollingModel.actionWalkBackAndForthGuardingDoorway
     ); */


    var guard1 = {};
    executeBehaviourTreeSimpleNoTick(patrollingGuardBehaviourTree, guard1);
}

firstExample();