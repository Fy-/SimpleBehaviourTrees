using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

class UnitySampleTicker : MonoBehaviour
{
  private Examples exs;
  float lastTickedOn;

  
  void Awake()
  {
    exs = Examples.Exemplify();
  }

  void Update()
  {
    if (Time.time - lastTickedOn > .3f)
    {
      lastTickedOn = Time.time;
      //exs.root.Execute(exs.Actor);
    }
  }
}

