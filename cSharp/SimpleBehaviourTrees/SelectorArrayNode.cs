using System;
using System.Collections.Generic;
using System.Linq;

namespace SimpleBehaviourTrees
{
  public class SelectorArrayNode : BehaviourTreeNode
  {
    private Func<BehaviourTreeInstance, ExecutionResult> conditionFunction;
    private BehaviourTreeNode[] actionArray;

    public SelectorArrayNode(Func<BehaviourTreeInstance, ExecutionResult> conditionFunction,
      BehaviourTreeNode[] actionArray)
    {
      this.conditionFunction = conditionFunction;
      this.actionArray = actionArray;
    }

    public ExecutionResult Execute(BehaviourTreeInstance behaviourTreeInstance)
    {
      var state = behaviourTreeInstance.NodeAndState[this];

      if (state == BehaviourTreeInstance.NodeState.STATE_EXECUTING)
        return new ExecutionResult(true);

      int resultInt = conditionFunction(behaviourTreeInstance).IntegerResult;

      if (state == BehaviourTreeInstance.NodeState.STATE_EXECUTING)
        return new ExecutionResult(true);

      for (var j = 0; j < actionArray.Count(); j++)
      {
        if (j == resultInt)
          behaviourTreeInstance.NodeAndState[actionArray[j]] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
        else
          behaviourTreeInstance.NodeAndState[actionArray[j]] = BehaviourTreeInstance.NodeState.STATE_DISCARDED;
      }

      return new ExecutionResult(resultInt);
    }

    public bool IsConditional()
    {
      return true;
    }

    public List<BehaviourTreeNode> Children()
    {
      return actionArray.ToList();
    }
  }
}