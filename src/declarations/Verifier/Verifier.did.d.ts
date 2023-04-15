import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Team } |
  { 'err' : string };
export type Result_2 = { 'ok' : Student } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<string> } |
  { 'err' : string };
export interface Student {
  'name' : string,
  'rank' : string,
  'score' : bigint,
  'teamId' : string,
  'principalId' : string,
  'strikes' : bigint,
}
export interface Team {
  'teamMembers' : Array<string>,
  'score' : bigint,
  'teamId' : string,
}
export interface TestResults {
  'day1' : string,
  'day2' : string,
  'day3' : string,
  'day4' : string,
  'day5' : string,
}
export interface _SERVICE {
  'buildStudent' : ActorMethod<[string], Result_2>,
  'getAdmins' : ActorMethod<[], Result_3>,
  'isEvenTest' : ActorMethod<[bigint], boolean>,
  'registerAdmin' : ActorMethod<[string], Result>,
  'registerStudent' : ActorMethod<[string], Result_2>,
  'registerTeamMembers' : ActorMethod<
    [Array<string>, boolean, string],
    Result_1
  >,
  'unregisterAdmin' : ActorMethod<[string], Result>,
  'verifyProject' : ActorMethod<[string, bigint], TestResults>,
}
