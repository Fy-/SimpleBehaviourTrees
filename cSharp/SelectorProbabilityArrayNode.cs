using System;
using System.Collections.Generic;
using System.Linq;

public class SelectorProbabilityRandomArrayNode : BehaviourTreeNode
{
 
  private Dictionary<BehaviourTreeNode, int> actionArrayAndLikelihood;

  public SelectorProbabilityRandomArrayNode(Dictionary<BehaviourTreeNode, int> actionArrayAndLikelihood)
  {
    this.actionArrayAndLikelihood = actionArrayAndLikelihood;
  }

  public ExecutionResult Execute(BehaviourTreeInstance behaviourTreeInstance)
  {
    var state = behaviourTreeInstance.NodeAndState[this];

    if (state == BehaviourTreeInstance.NodeState.STATE_EXECUTING)
      return new ExecutionResult(true);

    if (state == BehaviourTreeInstance.NodeState.STATE_COMPUTE_RESULT)
    {
      BehaviourTreeNode picked = ChooseByProbability(actionArrayAndLikelihood);

      behaviourTreeInstance.NodeAndState[this] = BehaviourTreeInstance.NodeState.STATE_WAITING;
      behaviourTreeInstance.NodeAndState[picked] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;

      foreach (var item in actionArrayAndLikelihood)
      {
        if (item.Key!=picked)
          behaviourTreeInstance.NodeAndState[item.Key] = BehaviourTreeInstance.NodeState.STATE_DISCARDED;
      }
    }
    return new ExecutionResult(true);
  }

  public static BehaviourTreeNode ChooseByProbability(
    Dictionary<BehaviourTreeNode, int> actionArrayAndLikelihood)
  {
    Dictionary<BehaviourTreeNode, float> collection = new Dictionary<BehaviourTreeNode, float>();

	var totalPoints = 0;
	foreach (int point in actionArrayAndLikelihood.Values){
		totalPoints += point;
	}

	var unit = 1/totalPoints;

	foreach (var item in actionArrayAndLikelihood){
    collection.Add(item.Key, item.Value * unit);
	}

	return SelectorWeightedRandomArrayNode.ChooseByRandom(collection);
}

 
  public bool IsConditional()
  {
    return true;
  }

  public List<BehaviourTreeNode> Children()
  {
    return actionArrayAndLikelihood.Keys.ToList();
  }

  

}