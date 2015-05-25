using System;
using System.Diagnostics;
using UnityEngine;
using Debug = UnityEngine.Debug;


public class Examples
{
  public BehaviourTreeNode root;
  //public Actor Actor;

  public static Examples Exemplify()
  {
    Examples exs = new Examples();
    /*Policeman p = new Policeman();
    PolicemanManager pm = Poli
    exs.Actor = p;

    exs.root = new SelectorNode(
      Policeman.IsCriminalInSight,
      //new SelectorNode(p.RunAfterCriminal,new ActionNode(p.GotFellow),new ActionNode(p.EscapedFellow)),
      new ActionNode(Policeman.RunAfterCriminal),
      new ActionNode(Policeman.SmokeWeed)
      );*/

    return exs;
  }

  public static void LogSomewhere(string text)
  {
    //Debug.WriteLine(text);
    //remove if not in Unity
    Debug.Log(text);
  }

}
