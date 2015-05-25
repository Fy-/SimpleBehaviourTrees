using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class BehaviourTreeInstance
{
  public enum NodeState
  {
    STATE_TO_BE_STARTED,
    STATE_WAITING,
    STATE_DISCARDED,
    STATE_EXECUTING,
    STATE_COMPUTE_RESULT,
    STATE_COMPLETED
  };

  private BehaviourTreeNode node;
  private Actor actor;
  private int numberOfLoops;
  private int numberOfRuns = 0;
  private bool completed = false;


  public Dictionary<BehaviourTreeNode, NodeState> NodeAndState = new Dictionary<BehaviourTreeNode, NodeState>();
  private BehaviourTreeNode currentNode = null;

  public BehaviourTreeInstance(BehaviourTreeNode node, Actor actor, int numberOfLoops)
  {
    this.node = node;
    this.actor = actor;
    this.numberOfLoops = numberOfLoops;
  }

  public bool HasToStart()
  {
    NodeState state = NodeAndState[node];
    return state != NodeState.STATE_EXECUTING && state != NodeState.STATE_COMPUTE_RESULT;
  }

  public bool HasToComplete()
  {
    NodeState state = NodeAndState[node];
    return state == NodeState.STATE_COMPUTE_RESULT;
  }

  public void CompletedAsync()
  {
    if (this.currentNode.IsConditional())
    {
      NodeAndState[node] = NodeState.STATE_COMPUTE_RESULT;
    }
    else
    {
      NodeAndState[node] = NodeState.STATE_COMPLETED;
    }
  }

  public void WaitUntil(Action callback)
  {
    NodeAndState[node] = NodeState.STATE_EXECUTING;
    callback();
  }

  public ExecutionResult ExecuteBehaviourTree()
  {

    if (completed)
    {
      return new ExecutionResult(true);
    }

    //find current node to be executed, or a running one, or root to launch, or root completed
    currentNode = findCurrentNode();

    if (currentNode == null)
    {
      numberOfRuns++;
      if (numberOfLoops == 0 ||
          numberOfRuns < numberOfLoops)
      {
        NodeAndState = new Dictionary<BehaviourTreeNode, NodeState>();
        currentNode = findCurrentNode(node);
      }
      else
      {
        completed = true;
        return;
      }
    }
    
    NodeState state = NodeAndState[currentNode];
    

    if (state == null || state == BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED)
    {

      currentNode.Execute(this);
      var afterState = findStateForNode(currentNode);
      if (afterState == BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED)
        NodeAndState[currentNode] = BehaviourTreeInstance.NodeState.STATE_WAITING;
      return;
    }


    //if (state == BehaviourTreeInstance.STATE_WAITING)
    //	state = BehaviourTreeInstance.STATE_COMPUTE_RESULT;

    //if (state == BehaviourTreeInstance.STATE_TO_BE_STARTED)
    //	state = BehaviourTreeInstance.STATE_COMPUTE_RESULT;

//	behaviourTreeInstance.currentNode.start(behaviourTreeInstance);

    if (state == BehaviourTreeInstance.NodeState.STATE_COMPUTE_RESULT)
    {
      ExecutionResult result = currentNode.Execute(this);
      state = BehaviourTreeInstance.NodeState.STATE_COMPLETED;
      return result;
    }

    return null;

  }

  public BehaviourTreeNode FindCurrentNode(node) {

    var state = behaviourTreeInstance.findStateForNode(node);

    if (state == BehaviourTreeInstance.STATE_DISCARDED)
        return null;

    if (state == null) {
        behaviourTreeInstance.setState(BehaviourTreeInstance.STATE_TO_BE_STARTED, node);
        return node;
    }

    if (state == BehaviourTreeInstance.STATE_EXECUTING ||
        state == BehaviourTreeInstance.STATE_COMPUTE_RESULT ||
        state == BehaviourTreeInstance.STATE_TO_BE_STARTED
        )
        return node;

    var children = node.children();
    if (children == null) {
        return null;
    } else {

        for (var i = 0; i < children.length; i++) {
            var childNode = findCurrentNode(children[i], behaviourTreeInstance);
            if (childNode)
                return childNode;
        }
        if (state == BehaviourTreeInstance.STATE_WAITING) {
            behaviourTreeInstance.setState(BehaviourTreeInstance.STATE_COMPLETED, node);
            console.debug("setting to completed ", node);
        }
    }
    return null;
}





}

