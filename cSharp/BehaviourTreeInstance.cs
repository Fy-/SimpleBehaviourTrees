using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using Debug = UnityEngine.Debug;


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
  public Actor actor;
  private int numberOfLoops;
  private int numberOfRuns = 0;
  private bool completed = false;


  public Dictionary<BehaviourTreeNode, NodeState> NodeAndState =
    new Dictionary<BehaviourTreeNode, NodeState>();

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
    Debug.Log("called wait until");
    NodeAndState[node] = NodeState.STATE_EXECUTING;
    Debug.Log("about to call callback "+callback);
    callback();
    Debug.Log("called callback");
  }

  public ExecutionResult ExecuteBehaviourTree()
  {

    if (completed)
    {
      return new ExecutionResult(true);
    }

    //find current node to be executed, or a running one, or root to launch, or root completed
    currentNode = FindCurrentNode(node);

    if (currentNode == null)
    {
      numberOfRuns++;
      if (numberOfLoops == 0 ||
          numberOfRuns < numberOfLoops)
      {
        NodeAndState = new Dictionary<BehaviourTreeNode, NodeState>();
        currentNode = FindCurrentNode(node);
        Debug.Log("current node is "+currentNode);
      }
      else
      {
        completed = true;
        Debug.Log("completed");
        return new ExecutionResult(true);
      }
    }

    bool toBeStarted = false;
    if (NodeAndState.ContainsKey(currentNode))
    {
      toBeStarted = NodeAndState[currentNode] == BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
    }
    else
    {
      toBeStarted = true;
    }

    if (toBeStarted)
    {
      currentNode.Execute(this);
      Debug.Log("executing node: "+currentNode);
      var afterState = NodeAndState[currentNode];
      Debug.Log("afterState: " + afterState);
      
      if (afterState == BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED)
        NodeAndState[currentNode] = BehaviourTreeInstance.NodeState.STATE_WAITING;
      Debug.Log("after afterState: " + NodeAndState[currentNode]);
      return new ExecutionResult(true);
    }

    NodeState state = NodeAndState[currentNode];
    Debug.Log("state: " + state);
    
    if (state == BehaviourTreeInstance.NodeState.STATE_COMPUTE_RESULT)
    {
      ExecutionResult result = currentNode.Execute(this);
      NodeAndState[currentNode] = BehaviourTreeInstance.NodeState.STATE_COMPLETED;
      return result;
    }

    return null;
  }

  public BehaviourTreeNode FindCurrentNode(BehaviourTreeNode node)
  {
    if (!NodeAndState.ContainsKey(node))
    {
      NodeAndState[node] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;
      return node;
    }
    
    var state = NodeAndState[node];

    if (state == BehaviourTreeInstance.NodeState.STATE_DISCARDED)
      return null;

    if (state == BehaviourTreeInstance.NodeState.STATE_EXECUTING ||
        state == BehaviourTreeInstance.NodeState.STATE_COMPUTE_RESULT ||
        state == BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED
        )
      return node;

    var children = node.Children();
    if (children == null)
    {
      return null;
    }
    else
    {
      for (var i = 0; i < node.Children().Count; i++)
      {
        var childNode = FindCurrentNode(children[i]);
        if (childNode != null)
          return childNode;
      }
      if (state == BehaviourTreeInstance.NodeState.STATE_WAITING)
      {
        NodeAndState[node] = BehaviourTreeInstance.NodeState.STATE_COMPLETED;
      }
    }
    return null;
  }


}

