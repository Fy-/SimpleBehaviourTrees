using System;
using System.Collections.Generic;

namespace SimpleBehaviourTrees
{
  public class SelectorNode : BehaviourTreeNode
  {
    private Func<BehaviourTreeInstance, ExecutionResult> conditionFunction;
    private BehaviourTreeNode actionIfTrue;
    private BehaviourTreeNode actionIfFalse;

    public SelectorNode(Func<BehaviourTreeInstance, ExecutionResult> conditionFunction,
      BehaviourTreeNode actionIfTrue, BehaviourTreeNode actionIfFalse)
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

      ExecutionResult result = conditionFunction(behaviourTreeInstance);

      if (state == BehaviourTreeInstance.NodeState.STATE_EXECUTING)
        return new ExecutionResult(true);

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

      return result;
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
}
