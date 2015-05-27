using System;
using System.Collections.Generic;
using System.Linq;

public class SelectorWeightedRandomArrayNode : BehaviourTreeNode
{
  /// <summary>
  /// Here the sum of likelihoods must be one - don't cheat
  /// Example:
  /// Lazy around .7
  /// Pretend to work .2
  /// Actually work .1
  /// </summary>
  private Dictionary<float, BehaviourTreeNode> actionArrayAndLikelihood;

  public SelectorWeightedRandomArrayNode(Dictionary<float, BehaviourTreeNode> actionArrayAndLikelihood)
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
      BehaviourTreeNode picked = ChooseByRandom(actionArrayAndLikelihood);

      behaviourTreeInstance.NodeAndState[this] = BehaviourTreeInstance.NodeState.STATE_WAITING;
      behaviourTreeInstance.NodeAndState[picked] = BehaviourTreeInstance.NodeState.STATE_TO_BE_STARTED;

      foreach (var item in actionArrayAndLikelihood)
      {
        if (item.Value!=picked)
          behaviourTreeInstance.NodeAndState[item.Value] = BehaviourTreeInstance.NodeState.STATE_DISCARDED;
      }
    }
    return new ExecutionResult(true);
  }

 
  public bool IsConditional()
  {
    return true;
  }

  public List<BehaviourTreeNode> Children()
  {
    return actionArrayAndLikelihood.Values.ToList();
  }

  /// <summary>
  /// From http://stackoverflow.com/questions/3655430/selection-based-on-percentage-weighting
  /// </summary>
  static Random random = new Random();
  public static BehaviourTreeNode ChooseByRandom(
        Dictionary<float, BehaviourTreeNode> collection)
  {
    var rnd = random.NextDouble();
    foreach (var item in collection)
    {
      if (rnd < item.Key)
        return item.Value;
      rnd -= item.Key;
    }
    throw new InvalidOperationException(
        "The proportions in the collection do not add up to 1.");
  }

}