using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using SimpleBehaviourTrees;
using Random = UnityEngine.Random;

class Policeman : Actor
{
  private bool actionCompleted = true;
  private string name;

  public Policeman(string name)
  {
    this.name = name;
  }

  public bool IsCriminalInSight()
  {
    int r = Random.Range(0, 2);
    if (r > 0)
      return true;
    else
      return false;
  }

  public bool RunAfterCriminal()
  {
    Examples.LogSomewhere("running after criminal");
    int running = Random.Range(0, 100);
    if (running < 5)
    {
      actionCompleted = true;
      int r = Random.Range(0, 2);
      if (r > 0)
        return true;
      else
        return false;
    }
    else
    {
      actionCompleted = false;
      return false;
    }
  }

  public void GotFellow()
  {
    Examples.LogSomewhere("got criminal");
  }

  public void EscapedFellow()
  {
    Examples.LogSomewhere("didn't get criminal");
  }

  public void SmokeWeed()
  {
    Examples.LogSomewhere("smoking weed");
  }

  public bool ActionCompleted()
  {
    return actionCompleted;
  }

  public string Name()
  {
    return name;
  }
}

