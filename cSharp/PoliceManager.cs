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
using UnityEngine;

public class PoliceManager : MonoBehaviour
{
  private static int totalKidsWondering = 20;
  private float startedNappingAt =0;

  public ExecutionResult IfChaseGotKid(BehaviourTreeInstance instance)
  {
    if (instance.HasToStart())
    {
      Debug.Log("running after kid");

      instance.WaitUntil(() =>
      {
        // Here we are using Unity's implementation of asynchronous calls.
        // You will have to use a different one in different contexts.
        StartCoroutine(Chasing(instance));
        });

    }
    else if (instance.HasToComplete())
    {
      bool b = Random.Range(0f, 1f) > 10.01;
      Debug.Log(instance.actor.Name + ": " + " got child: " + b);
      return new ExecutionResult(b);

    }
    else
    {
      Debug.Log("running after kid doing nothing");
    }

    return new ExecutionResult(true);

  }

  public static IEnumerator DoNap(BehaviourTreeInstance behaviourTreeInstanceState, Action callback = null)
  {
    yield return new WaitForSeconds(3f);
    behaviourTreeInstanceState.CompletedAsync();

    if (callback != null)
      callback();
  }

  public static IEnumerator Chasing(BehaviourTreeInstance behaviourTreeInstanceState, Action callback = null)
  {
    yield return new WaitForSeconds(3f);
    Debug.Log("End chase");
    behaviourTreeInstanceState.CompletedAsync();

    if (callback != null)
      callback();
  }

  public ExecutionResult IfChaseGotKidCases(BehaviourTreeInstance instance)
  {
    if (instance.HasToStart())
    {
      Debug.Log("running after kid");
      instance.WaitUntil(() =>
      {
        StartCoroutine(DoNap(instance));
      });

    }
    else if (instance.HasToComplete())
    {
      var random = Random.Range(0f, 1f);
      var b = random > 0.6 ? 2 : (random > 0.3 ? 1 : 0);
      Debug.Log(instance.actor.Name + ": " + " got child: " + b);
      return new ExecutionResult(b);
    }
    else
    {
      Debug.Log("running after kid doing nothing");
    }
    return new ExecutionResult(true);
  }

  public ExecutionResult ActionBringChildToStation(BehaviourTreeInstance instance)
  {
    if (instance.HasToStart())
    {
      Debug.Log(instance.actor.Name + ": " + "Bring child to station");

      instance.WaitUntil(() =>
      {
        // Here we are using Unity's implementation of asynchronous calls.
        // You will have to use a different one in different contexts.
        StartCoroutine(DoNap(instance, () =>
        {
          Debug.Log("child in station");
          totalKidsWondering--;
        }));
      });
    }
    return new ExecutionResult(true);
  }

  public ExecutionResult ActionBringChildHome(BehaviourTreeInstance instance)
  {
    totalKidsWondering--;
    Debug.Log(instance.actor.Name + ": " + "Bring child home");
    return new ExecutionResult(true);
  }

  public ExecutionResult ActionSmoke(BehaviourTreeInstance instance)
  {
    Debug.Log(instance.actor.Name + ": " + "Smoke");
    return new ExecutionResult(true);
  }

  public ExecutionResult ActionWander(BehaviourTreeInstance instance)
  {
    Debug.Log(instance.actor.Name + ": " + "Wander around");
    return new ExecutionResult(true);
  }

}