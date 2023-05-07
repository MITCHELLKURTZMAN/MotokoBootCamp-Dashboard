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
export type Result_2 = { 'ok' : Student } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<Student> } |
  { 'err' : string };
export type Result_4 = { 'ok' : Array<StudentList> } |
  { 'err' : string };
export type Result_5 = { 'ok' : string } |
  { 'err' : string };
export type Result_6 = { 'ok' : Array<DailyProjectText> } |
  { 'err' : string };
export type Result_7 = { 'ok' : Array<string> } |
  { 'err' : string };
export type Result_8 = { 'ok' : Team } |
  { 'err' : string };
export interface Student {
  'completedDays' : Array<DailyProject>,
  'teamName' : string,
  'name' : string,
  'rank' : string,
  'canisterIds' : Array<string>,
  'bonusPoints' : bigint,
  'score' : bigint,
  'cliPrincipalId' : string,
  'principalId' : string,
  'strikes' : bigint,
}
export interface StudentList {
  'name' : string,
  'rank' : string,
  'bonusPoints' : string,
  'score' : string,
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
  'adminAnnounceTimedEvent' : ActorMethod<[string], undefined>,
  'adminCreateTeam' : ActorMethod<[string], Result_8>,
  'adminDeleteTeam' : ActorMethod<[string], Result_5>,
  'adminGrantBonusPoints' : ActorMethod<[string, string], Result>,
  'adminManuallyVerifyStudentDay' : ActorMethod<[string, string], Result>,
  'adminSpecialAnnouncement' : ActorMethod<[string], undefined>,
  'adminSyncTeamScores' : ActorMethod<[], Result_5>,
  'buildStudent' : ActorMethod<[string], Result_2>,
  'buildTeam' : ActorMethod<[string], Team>,
  'getActivity' : ActorMethod<[bigint, bigint], Array<Activity>>,
  'getActivityFeed' : ActorMethod<[], Array<Activity>>,
  'getAdmins' : ActorMethod<[], Result_7>,
  'getAllStudents' : ActorMethod<[], Result_7>,
  'getAllStudentsPrincipal' : ActorMethod<[], Array<Principal>>,
  'getAllTeams' : ActorMethod<[], Array<TeamString>>,
  'getHelpTickets' : ActorMethod<[], Array<HelpTicket>>,
  'getStudent' : ActorMethod<[string], Result_2>,
  'getStudentCompletedDays' : ActorMethod<[], Result_6>,
  'getStudentPrincipalByName' : ActorMethod<[string], Result_5>,
  'getStudentsForTeamDashboard' : ActorMethod<[string], Result_4>,
  'getStudentsFromTeam' : ActorMethod<[string], Result_3>,
  'getTeam' : ActorMethod<[string], Team>,
  'getTotalCompletedPerDay' : ActorMethod<[], DailyTotalMetrics>,
  'getTotalProjectsCompleted' : ActorMethod<[], string>,
  'getTotalStudents' : ActorMethod<[], string>,
  'getTotalTeams' : ActorMethod<[], string>,
  'getUser' : ActorMethod<[], Result_2>,
  'isEvenTest' : ActorMethod<[bigint], boolean>,
  'isStudent' : ActorMethod<[string], boolean>,
  'principalReverseMigration' : ActorMethod<[], undefined>,
  'registerAdmin' : ActorMethod<[string], Result>,
  'registerStudent' : ActorMethod<[string, string, string], Result_2>,
  'resolveHelpTicket' : ActorMethod<[string, boolean], Result_1>,
  'studentCreateHelpTicket' : ActorMethod<
    [string, string, string, string],
    Result_1
  >,
  'unregisterAdmin' : ActorMethod<[string], Result>,
  'verifyProject' : ActorMethod<[string, bigint], VerifyProject>,
}
