import { ActorSubclass, AnonymousIdentity } from '@dfinity/agent';
import { Activity } from '../types/types'

import { _SERVICE as VerifierService } from '../../src/declarations/Verifier/Verifier.did';
import {
  canisterId as verifierCanisterId,
  createActor as createVerifierActor,
  idlFactory as verifierFactory,
} from '../../src/declarations/Verifier';


import { Student, Team } from '../types/types';
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


export async function getActivity(): Promise<Activity[] | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getActivity(BigInt(0), BigInt(200));
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}

export async function getStudent(PrincipalId: string): Promise<Student | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getStudent(
    PrincipalId
  );
  console.log("Result from getStudent:", result); 
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result.ok;
  }
}

export async function getTeam(teamId: string): Promise<Team | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getTeam(
    teamId
  );
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}

export async function getAllTeams(): Promise<Team[] | undefined> {
  const verifier = await getVerifierActor();
  const result = await verifier.getAllTeams();
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}

export async function verifyProject(canisterId: string, day: number)
{
  const verifier = await getVerifierActor();
  const result = await verifier.verifyProject(
    canisterId,
    BigInt(day)
  );
  if ('err' in result) {
    console.error(result.err);
    return undefined;
  } else {
    return result;
  }
}