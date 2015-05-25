using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;

class ActionNode : BehaviourTreeNode
{
  private readonly Func<BehaviourTreeInstance, ExecutionResult> action;

  public ActionNode(Func<BehaviourTreeInstance, ExecutionResult> action)
  {
    this.action = action;
  }

  public ExecutionResult Execute(BehaviourTreeInstance behaviourTreeInstance)
  {
    return action(behaviourTreeInstance);
  }

  public bool IsConditional()
  {
    return false;
  }

  public List<BehaviourTreeNode> Children()
  {
    return null;
  } 
}

