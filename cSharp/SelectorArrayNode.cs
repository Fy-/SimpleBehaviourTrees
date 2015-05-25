using System;
using System.Collections.Generic;
using System.Linq;

public class SelectorArrayNode : BehaviourTreeNode
{
  Func<BehaviourTreeInstance, int> conditionFunction;
  private BehaviourTreeNode[] actionArray;

  public SelectorArrayNode(Func<BehaviourTreeInstance, int> conditionFunction, 
    BehaviourTreeNode[] actionArray)
  {
    this.conditionFunction = conditionFunction;
    this.actionArray = actionArray;
  }

  public void Execute(BehaviourTreeInstance behaviourTreeInstance)
  {
    var state = behaviourTreeInstance.NodeAndState[this];

    if (state == BehaviourTreeInstance.NodeState.STATE_EXECUTING)
      return;

    if (state == BehaviourTreeInstance.NodeState.STATE_COMPUTE_RESULT)
    {
      int resultInt = conditionFunction(behaviourTreeInstance);
     
      behaviourTreeInstance.NodeAndState[this] = BehaviourTreeInstance.NodeState.STATE_WAITING;

      for (var j = 0; j < actionArray.Count(); j++)
      {
        if (j == resultInt)
          behaviourTreeInstance.NodeAndState[actionArray[j]] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
        else
          behaviourTreeInstance.NodeAndState[actionArray[j]] = BehaviourTreeInstance.NodeState.STATE_DISCARDED;
      }
    }
    else
    {
      conditionFunction(behaviourTreeInstance);
    }
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