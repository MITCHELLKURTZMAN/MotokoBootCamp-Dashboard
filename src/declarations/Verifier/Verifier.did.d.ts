import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Activity {
  'activityId' : string,
  'specialAnnouncement' : string,
  'activity' : string,
}
export interface DailyProject {
  'day' : bigint,
  'timeStamp' : bigint,
  'completed' : boolean,
  'canisterId' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : Team } |
  { 'err' : string };
export type Result_2 = { 'ok' : Student } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<Student> } |
  { 'err' : string };
export type Result_4 = { 'ok' : Array<string> } |
  { 'err' : string };
export interface Student {
  'completedDays' : Array<DailyProject>,
  'name' : string,
  'rank' : string,
  'canisterIds' : Array<string>,
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
export type VerifyProject = { 'ok' : null } |
  {
    'err' : { 'NotAController' : null } |
      { 'NotAStudent' : null } |
      { 'UnexpectedValue' : string } |
      { 'InvalidDay' : null } |
      { 'UnexpectedError' : string } |
      { 'AlreadyCompleted' : null } |
      { 'NotImplemented' : null }
  };
export interface _SERVICE {
  'buildStudent' : ActorMethod<[string], Result_2>,
  'buildTeam' : ActorMethod<[string], Team>,
  'getActivity' : ActorMethod<[bigint, bigint], Array<Activity>>,
  'getAdmins' : ActorMethod<[], Result_4>,
  'getAllTeams' : ActorMethod<[], Array<Team>>,
  'getStudent' : ActorMethod<[string], Result_2>,
  'getStudentsFromTeam' : ActorMethod<[string], Result_3>,
  'getTeam' : ActorMethod<[string], Team>,
  'isEvenTest' : ActorMethod<[bigint], boolean>,
  'registerAdmin' : ActorMethod<[string], Result>,
  'registerStudent' : ActorMethod<[string], Result_2>,
  'registerTeamMembers' : ActorMethod<
    [Array<string>, boolean, string],
    Result_1
  >,
  'unregisterAdmin' : ActorMethod<[string], Result>,
  'verifyProject' : ActorMethod<[string, bigint], VerifyProject>,
}
