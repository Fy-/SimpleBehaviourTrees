using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public interface BehaviourTreeNode
{
  ExecutionResult Execute(BehaviourTreeInstance behaviourTreeInstance);
  bool IsConditional();
}

