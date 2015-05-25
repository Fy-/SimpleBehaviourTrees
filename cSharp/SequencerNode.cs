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

  public void Execute(BehaviourTreeInstance behaviourTreeInstance)
  {
    var state = behaviourTreeInstance.NodeAndState[this];

    behaviourTreeInstance.NodeAndState[this] = BehaviourTreeInstance.NodeState.STATE_WAITING;
    behaviourTreeInstance.NodeAndState[actionArray[0]] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
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