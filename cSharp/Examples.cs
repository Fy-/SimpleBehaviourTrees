using System;
using System.Diagnostics;
using UnityEngine;
using Debug = UnityEngine.Debug;


public class Examples
{
  public BehaviourTreeNode root;
  //public Actor Actor;

  public static BehaviourTreeInstance Exemplify()
  {
    Examples exs = new Examples();
    Policeman p = new Policeman();
    PoliceManager pm = new PoliceManager();
    
    	var patrollingPoliceBehaviourTreeTwoResults =
			(new SelectorNode(
							pm.IfChaseGotKid,
							new ActionNode(pm.ActionBringChildToStation),
              new SequencerNode(new BehaviourTreeNode[] {
                new ActionNode(pm.ActionWander), new ActionNode(pm.ActionSmoke)
              })
					)
    );

    BehaviourTreeInstance instance = new BehaviourTreeInstance(patrollingPoliceBehaviourTreeTwoResults, p, 1);
    return instance;
  }

  public static void LogSomewhere(string text)
  {
    //Debug.WriteLine(text);
    //remove if not in Unity
    Debug.Log(text);
  }

}
