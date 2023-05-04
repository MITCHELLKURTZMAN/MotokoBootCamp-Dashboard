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
export interface DailyProjectText {
  'day' : string,
  'timeStamp' : string,
  'completed' : string,
  'canisterId' : string,
}
export interface DailyTotalMetrics {
  'day1' : string,
  'day2' : string,
  'day3' : string,
  'day4' : string,
  'day5' : string,
}
export interface HelpTicket {
  'day' : string,
  'resolved' : boolean,
  'helpTicketId' : string,
  'description' : string,
  'gitHubUrl' : string,
  'principalId' : string,
  'canisterId' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : HelpTicket } |
  { 'err' : string };
export type Result_2 = { 'ok' : Team } |
  { 'err' : string };
export type Result_3 = { 'ok' : Student } |
  { 'err' : string };
export type Result_4 = { 'ok' : Array<Student> } |
  { 'err' : string };
export type Result_5 = { 'ok' : Array<DailyProjectText> } |
  { 'err' : string };
export type Result_6 = { 'ok' : Array<string> } |
  { 'err' : string };
export type Result_7 = { 'ok' : string } |
  { 'err' : string };
export type Result_8 = { 'ok' : Array<[string, string]> } |
  { 'err' : string };
export interface Student {
  'completedDays' : Array<DailyProject>,
  'teamName' : string,
  'name' : string,
  'rank' : string,
  'canisterIds' : Array<string>,
  'score' : bigint,
  'cliPrincipalId' : string,
  'principalId' : string,
  'strikes' : bigint,
}
export interface Team {
  'name' : string,
  'teamMembers' : Array<string>,
  'score' : bigint,
}
export interface TeamString {
  'name' : string,
  'teamMembers' : Array<string>,
  'score' : string,
}
export type VerifyProject = { 'ok' : null } |
  {
    'err' : { 'NotAController' : string } |
      { 'NotAStudent' : string } |
      { 'UnexpectedValue' : string } |
      { 'InvalidDay' : string } |
      { 'UnexpectedError' : string } |
      { 'AlreadyCompleted' : string } |
      { 'NotImplemented' : string }
  };
export interface _SERVICE {
  'adminCreateTeam' : ActorMethod<[string], Result_2>,
  'adminDeleteTeam' : ActorMethod<[string], Result_7>,
  'adminGetAllTeamsWithTeamId' : ActorMethod<[], Result_8>,
  'adminManuallyVerifyStudentDay' : ActorMethod<[string, string], Result>,
  'adminSyncTeamScores' : ActorMethod<[], Result_7>,
  'buildStudent' : ActorMethod<[string], Result_3>,
  'buildTeam' : ActorMethod<[string], Team>,
  'getActivity' : ActorMethod<[bigint, bigint], Array<Activity>>,
  'getActivityFeed' : ActorMethod<[], Array<Activity>>,
  'getAdmins' : ActorMethod<[], Result_6>,
  'getAllStudents' : ActorMethod<[], Result_6>,
  'getAllStudentsPrincipal' : ActorMethod<[], Array<Principal>>,
  'getAllTeams' : ActorMethod<[], Array<TeamString>>,
  'getHelpTickets' : ActorMethod<[], Array<HelpTicket>>,
  'getStudent' : ActorMethod<[string], Result_3>,
  'getStudentCompletedDays' : ActorMethod<[], Result_5>,
  'getStudentsFromTeam' : ActorMethod<[string], Result_4>,
  'getTeam' : ActorMethod<[string], Team>,
  'getTotalCompletedPerDay' : ActorMethod<[], DailyTotalMetrics>,
  'getTotalProjectsCompleted' : ActorMethod<[], string>,
  'getTotalStudents' : ActorMethod<[], string>,
  'getTotalTeams' : ActorMethod<[], string>,
  'getUser' : ActorMethod<[], Result_3>,
  'isEvenTest' : ActorMethod<[bigint], boolean>,
  'isStudent' : ActorMethod<[string], boolean>,
  'registerAdmin' : ActorMethod<[string], Result>,
  'registerStudent' : ActorMethod<[string, string, string], Result_3>,
  'registerTeamMembers' : ActorMethod<[Array<string>, string], Result_2>,
  'resolveHelpTicket' : ActorMethod<[string, boolean], Result_1>,
  'sanityCheckGetEmptyStudent' : ActorMethod<[string], string>,
  'studentCreateHelpTicket' : ActorMethod<
    [string, string, string, string],
    Result_1
  >,
  'unregisterAdmin' : ActorMethod<[string], Result>,
  'verifyProject' : ActorMethod<[string, bigint], VerifyProject>,
}
