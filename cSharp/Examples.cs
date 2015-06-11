using System;
using System.Diagnostics;
using SimpleBehaviourTrees;
using UnityEngine;
using Debug = UnityEngine.Debug;

public class Examples
{
  public BehaviourTreeNode root;

  public static BehaviourTreeInstance Exemplify(PoliceManager pm)
  {
    Policeman p = new Policeman("Bobby");

    var patrollingPoliceBehaviourTreeTwoResults =

      new SelectorNode(
            pm.IfChaseGotKid,
            new ActionNode(pm.ActionBringChildToStation),
            new SequencerNode(new BehaviourTreeNode[] {
                new ActionNode(pm.ActionWander), new ActionNode(pm.ActionSmoke)
              })
        );

    var patrollingPoliceBehaviourTreeTwoResultsSimple =

      new SelectorNode(
            pm.IfChaseGotKid,
            new ActionNode(pm.ActionBringChildToStation),
            new ActionNode(pm.ActionSmoke)
              );

    var patrollingPoliceBehaviourArrayResults =

      new SelectorArrayNode(
           pm.IfChaseGotKidCases,
           new BehaviourTreeNode[] {
             new ActionNode(pm.ActionBringChildToStation),
             new ActionNode(pm.ActionWander), 
             new ActionNode(pm.ActionSmoke)
           }
        );

    BehaviourTreeInstance instance =
      new BehaviourTreeInstance(patrollingPoliceBehaviourArrayResults, p, 1);

    return instance;
  }

  public static void LogSomewhere(string text)
  {
    //Debug.WriteLine(text);
    //remove if not in Unity
    Debug.Log(text);
  }

}
