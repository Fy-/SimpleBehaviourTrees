using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

class UnitySampleTicker : MonoBehaviour
{
  private BehaviourTreeInstance bti;
  float lastTickedOn;
  public PoliceManager pm;


  void Start()
  {
    bti = Examples.Exemplify(pm);
  }

  void Update()
  {
    if (Time.time - lastTickedOn > .5f)
    {
      lastTickedOn = Time.time;
      bti.ExecuteBehaviourTree();
      if (bti.Completed)
      {
        Debug.Log("BT END");
        UnityEditor.EditorApplication.isPlaying = false;
      }
      //Debug.Log("ticked "+Time.time);
    }
  }
}

