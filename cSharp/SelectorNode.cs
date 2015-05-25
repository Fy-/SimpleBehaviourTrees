using System;
using System.Collections.Generic;

public class SelectorNode : BehaviourTreeNode
{
  Func<BehaviourTreeInstance, ExecutionResult> conditionFunction;
  BehaviourTreeNode actionIfTrue;
  BehaviourTreeNode actionIfFalse;

  public SelectorNode(Func<BehaviourTreeInstance, ExecutionResult> conditionFunction, BehaviourTreeNode actionIfTrue, BehaviourTreeNode actionIfFalse)
  {
    this.conditionFunction = conditionFunction;
    this.actionIfTrue = actionIfTrue;
    this.actionIfFalse = actionIfFalse;
  }

  public ExecutionResult Execute(BehaviourTreeInstance behaviourTreeInstance)
  {
    var state = behaviourTreeInstance.NodeAndState[this];

    if (state == BehaviourTreeInstance.NodeState.STATE_EXECUTING)
      return new ExecutionResult(true);

    if (state == BehaviourTreeInstance.NodeState.STATE_COMPUTE_RESULT)
    {

      ExecutionResult result = conditionFunction(behaviourTreeInstance);
      
      behaviourTreeInstance.NodeAndState[this] = BehaviourTreeInstance.NodeState.STATE_WAITING;

      if (result.BooleanResult)
      {
        behaviourTreeInstance.NodeAndState[actionIfTrue] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
        behaviourTreeInstance.NodeAndState[actionIfFalse] = BehaviourTreeInstance.NodeState.STATE_DISCARDED;
      }
      else
      {
        behaviourTreeInstance.NodeAndState[actionIfTrue] = BehaviourTreeInstance.NodeState.STATE_DISCARDED;
        behaviourTreeInstance.NodeAndState[actionIfFalse] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
      }

    }
    else
    {
      return conditionFunction(behaviourTreeInstance);
    }
    return new ExecutionResult(true);
  }

  public bool IsConditional()
  {
    return true;
  }

  public List<BehaviourTreeNode> Children()
  {
    return new List<BehaviourTreeNode> {actionIfTrue, actionIfFalse};
  } 
}
