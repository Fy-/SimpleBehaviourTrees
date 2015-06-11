using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SimpleBehaviourTrees
{
  public interface BehaviourTreeNode
  {
    ExecutionResult Execute(BehaviourTreeInstance behaviourTreeInstance);
    bool IsConditional();
    List<BehaviourTreeNode> Children();
  }
}

