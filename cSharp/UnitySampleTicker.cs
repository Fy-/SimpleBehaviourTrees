using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

class UnitySampleTicker : MonoBehaviour
{
  private BehaviourTreeInstance bti;
  float lastTickedOn;
  
  void Start()
  {
    bti = Examples.Exemplify();
  }
  
  void Update()
  {
    if (Time.time - lastTickedOn > 1f)
    {
      lastTickedOn = Time.time;
      bti.ExecuteBehaviourTree();
    }
  }
}

