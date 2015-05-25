using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using UnityEditorInternal;
using UnityEngine;
// Change this if not using Unity
using Debug = UnityEngine.Debug;
using Random = UnityEngine.Random;


public class PoliceManager
{
  public static ExecutionResult IfChaseGotKid(BehaviourTreeInstance instance)
  {

    if (instance.HasToStart())
    {

      Debug.Log("running after kid");

      instance.WaitUntil(() =>
      {
        DoNap(instance);
      });

    }
    else if (instance.HasToComplete())
    {

      var b = Random.Range(0, 1) > 0.5;
      Debug.Log(instance.actor.Name + ": " + " got child: " + b);
      return new ExecutionResult(b);

    }
    else
    {
      Debug.Log("running after kid doing nothing");
    }

    return new ExecutionResult(true);

  }

  public static IEnumerator DoNap(BehaviourTreeInstance behaviourTreeInstanceState)
  {
    yield return new WaitForSeconds(3f);
    behaviourTreeInstanceState.CompletedAsync();
  }

  public ExecutionResult IfChaseGotKidCases(BehaviourTreeInstance instance)
  {
        if (instance.HasToStart()) {

            Debug.Log("running after kid");
            instance.WaitUntil(() =>
            {
              DoNap(instance);
            });

        } else if (instance.HasToComplete()) {

            var random = Random.Range(0,1);
            var b = random > 0.6? 2 : (random > 0.3? 1: 0);
            Debug.Log(instance.actor.Name + ": " + " got child: "+b);
            return  new ExecutionResult(b);

        } else {
            Debug.Log("running after kid doing nothing");
        }
        return new ExecutionResult(true);
  }

  /*
   

    PolicemanManager.actionBringChildToStation = function (instance) {

        if (instance.hasToStart()) {

            writeOnConsole(instance.actor.name + ": " + "Bring child to station");

            instance.waitUntil(function() {
                setTimeout(function () {
                    writeOnConsole(instance.actor.name + ": " + " child in station");
                    instance.completedAsync();
                }, 3000);
            });

            totalKidsWondering--;
        }

	};

	PolicemanManager.actionBringChildHome = function (instance) {
		totalKidsWondering--;
		writeOnConsole(instance.actor.name+": "+"Bring child home");
	};

	PolicemanManager.actionSmoke = function (instance) {
		writeOnConsole(instance.actor.name+": "+"Smoke");
	};

    PolicemanManager.actionImHurt = function (instance) {
        writeOnConsole(instance.actor.name+": "+"  I'm hurt!");
    };


	PolicemanManager.actionWanderAround = function (instance) {
		writeOnConsole(instance.actor.name+": "+"Wander around");
	};
   */


}

