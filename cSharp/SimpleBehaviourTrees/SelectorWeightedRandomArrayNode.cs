using System;
using System.Collections.Generic;
using System.Linq;

namespace SimpleBehaviourTrees
{
  public class SelectorWeightedRandomArrayNode : BehaviourTreeNode
  {
    /// <summary>
    /// Here the sum of likelihoods must be one - don't cheat
    /// Example:
    /// Lazy around .7
    /// Pretend to work .2
    /// Actually work .1
    /// </summary>
    private Dictionary<BehaviourTreeNode, float> actionArrayAndLikelihood;

    public SelectorWeightedRandomArrayNode(Dictionary<BehaviourTreeNode, float> actionArrayAndLikelihood)
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
          if (item.Key != picked)
            behaviourTreeInstance.NodeAndState[item.Key] = BehaviourTreeInstance.NodeState.STATE_DISCARDED;
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
      return actionArrayAndLikelihood.Keys.ToList();
    }

    /// <summary>
    /// From http://stackoverflow.com/questions/3655430/selection-based-on-percentage-weighting
    /// </summary>
    private static Random random = new Random();

    public static BehaviourTreeNode ChooseByRandom(
      Dictionary<BehaviourTreeNode, float> collection)
    {
      var rnd = random.NextDouble();
      foreach (var item in collection)
      {
        if (rnd < item.Value)
          return item.Key;
        rnd -= item.Value;
      }
      throw new InvalidOperationException(
        "The proportions in the collection do not add up to 1.");
    }

  }
}