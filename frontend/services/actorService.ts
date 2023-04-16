import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent';
import { Activity } from '../types/types'

import { _SERVICE as VerifierService } from '../../src/declarations/Verifier/Verifier.did';
import {
  canisterId as verifierCanisterId,
  createActor as createVerifierActor,
  idlFactory as verifierFactory,
} from '../../src/declarations/Verifier';

import { Student } from 'frontend/types/types';
import { useAuthStore } from '../store/authstore';

const isLocal: boolean =
  window.location.origin.includes('localhost') ||
  window.location.origin.includes('127.0.0.1');

export async function getVerifierActor(): Promise<ActorSubclass<VerifierService>> {
  let loginMethod = useAuthStore.getState().loginMethod;
 
  var identity =
    (await useAuthStore?.getState().getIdentity()) || new AnonymousIdentity();
  return createVerifierActor(verifierCanisterId as string, {
    agentOptions: {
      identity,
      host: isLocal ? undefined : 'https://icp-api.io ',
    },
  });
}

export async function getStudent(principalId): Promise<Student | undefined> {
  console.log('getStudent', principalId);
//   type Student = 
//  record {
//    canisterIds: vec text;
//    completedDays: vec DailyProject;
//    name: text;
//    principalId: text;
//    rank: text;
//    score: nat;
//    strikes: int;
//    teamId: text;
//  };

// type DailyProject = 
//  record {
//    canisterId: text;
//    completed: bool;
//    day: nat;
//    timeStamp: nat64;
//  };
  
  let dummyStudent = {
    canisterIds: ["dummy"],
    completedDays: [ { canisterId: "dummy", completed: true, day: BigInt(0), timeStamp: BigInt(0) } ],
    name: 'dummy',
    principalId: 'dummy',
    rank: 'dummy',
    score: BigInt(0),
    strikes: BigInt(0),
    teamId: 'dummy',
  };
  return dummyStudent;

  // const verifier = await getVerifierActor();
  // const result = await verifier.getStudent( principalId);
  // if ('err' in result) {
  //   console.error(result.err);
  //   return undefined;
  // } else {
  //   return result.ok;
  // }
}

export async function getActivity(): Promise<Activity[] | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getActivity(BigInt(0), BigInt(100));
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}
