using System;
using System.Collections.Generic;
using System.Linq;

public class SequencerNode : BehaviourTreeNode
{

  private BehaviourTreeNode[] actionArray;

  public SequencerNode(BehaviourTreeNode[] actionArray)
  {
    this.actionArray = actionArray;
  }

  public ExecutionResult Execute(BehaviourTreeInstance behaviourTreeInstance)
  {
    behaviourTreeInstance.NodeAndState[this] = BehaviourTreeInstance.NodeState.STATE_WAITING;
    behaviourTreeInstance.NodeAndState[actionArray[0]] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
    return new ExecutionResult(true);
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