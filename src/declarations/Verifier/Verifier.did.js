export const idlFactory = ({ IDL }) => {
  const Team = IDL.Record({
    'name' : IDL.Text,
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : Team, 'err' : IDL.Text });
  const Result_8 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result_9 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'err' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const DailyProject = IDL.Record({
    'day' : IDL.Nat,
    'timeStamp' : IDL.Nat64,
    'completed' : IDL.Bool,
    'canisterId' : IDL.Text,
  });
  const Student = IDL.Record({
    'completedDays' : IDL.Vec(DailyProject),
    'teamName' : IDL.Text,
    'name' : IDL.Text,
    'rank' : IDL.Text,
    'canisterIds' : IDL.Vec(IDL.Text),
    'score' : IDL.Nat,
    'cliPrincipalId' : IDL.Text,
    'principalId' : IDL.Text,
    'strikes' : IDL.Int,
  });
  const Result_3 = IDL.Variant({ 'ok' : Student, 'err' : IDL.Text });
  const BulkStudent = IDL.Record({
    'teamName' : IDL.Text,
    'name' : IDL.Text,
    'cliPrincipalId' : IDL.Text,
    'principalId' : IDL.Text,
  });
  const Activity = IDL.Record({
    'activityId' : IDL.Text,
    'specialAnnouncement' : IDL.Text,
    'activity' : IDL.Text,
  });
  const Result_7 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const TeamString = IDL.Record({
    'name' : IDL.Text,
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Text,
  });
  const HelpTicket = IDL.Record({
    'day' : IDL.Text,
    'resolved' : IDL.Bool,
    'helpTicketId' : IDL.Text,
    'description' : IDL.Text,
    'gitHubUrl' : IDL.Text,
    'principalId' : IDL.Text,
    'canisterId' : IDL.Text,
  });
  const DailyProjectText = IDL.Record({
    'day' : IDL.Text,
    'timeStamp' : IDL.Text,
    'completed' : IDL.Text,
    'canisterId' : IDL.Text,
  });
  const Result_6 = IDL.Variant({
    'ok' : IDL.Vec(DailyProjectText),
    'err' : IDL.Text,
  });
  const StudentList = IDL.Record({
    'name' : IDL.Text,
    'rank' : IDL.Text,
    'score' : IDL.Text,
  });
  const Result_5 = IDL.Variant({
    'ok' : IDL.Vec(StudentList),
    'err' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Vec(Student), 'err' : IDL.Text });
  const DailyTotalMetrics = IDL.Record({
    'day1' : IDL.Text,
    'day2' : IDL.Text,
    'day3' : IDL.Text,
    'day4' : IDL.Text,
    'day5' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : HelpTicket, 'err' : IDL.Text });
  const VerifyProject = IDL.Variant({
    'ok' : IDL.Null,
    'err' : IDL.Variant({
      'NotAController' : IDL.Text,
      'NotAStudent' : IDL.Text,
      'UnexpectedValue' : IDL.Text,
      'InvalidDay' : IDL.Text,
      'UnexpectedError' : IDL.Text,
      'AlreadyCompleted' : IDL.Text,
      'NotImplemented' : IDL.Text,
    }),
  });
  return IDL.Service({
    'adminAnnounceTimedEvent' : IDL.Func([IDL.Text], [], []),
    'adminCreateTeam' : IDL.Func([IDL.Text], [Result_2], []),
    'adminDeleteTeam' : IDL.Func([IDL.Text], [Result_8], []),
    'adminGetAllTeamsWithTeamId' : IDL.Func([], [Result_9], []),
    'adminManuallyVerifyStudentDay' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'adminSpecialAnnouncement' : IDL.Func([IDL.Text], [], []),
    'adminSyncTeamScores' : IDL.Func([], [Result_8], []),
    'buildStudent' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'buildTeam' : IDL.Func([IDL.Text], [Team], ['query']),
    'bulkRegisterStudents' : IDL.Func([IDL.Vec(BulkStudent)], [Result], []),
    'getActivity' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(Activity)],
        ['query'],
      ),
    'getActivityFeed' : IDL.Func([], [IDL.Vec(Activity)], ['query']),
    'getAdmins' : IDL.Func([], [Result_7], ['query']),
    'getAllStudents' : IDL.Func([], [Result_7], []),
    'getAllStudentsPrincipal' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getAllTeams' : IDL.Func([], [IDL.Vec(TeamString)], ['query']),
    'getHelpTickets' : IDL.Func([], [IDL.Vec(HelpTicket)], ['query']),
    'getStudent' : IDL.Func([IDL.Text], [Result_3], []),
    'getStudentCompletedDays' : IDL.Func([], [Result_6], []),
    'getStudentsForTeamDashboard' : IDL.Func([IDL.Text], [Result_5], ['query']),
    'getStudentsFromTeam' : IDL.Func([IDL.Text], [Result_4], []),
    'getTeam' : IDL.Func([IDL.Text], [Team], []),
    'getTotalCompletedPerDay' : IDL.Func([], [DailyTotalMetrics], ['query']),
    'getTotalProjectsCompleted' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalStudents' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalTeams' : IDL.Func([], [IDL.Text], ['query']),
    'getUser' : IDL.Func([], [Result_3], []),
    'isEvenTest' : IDL.Func([IDL.Int], [IDL.Bool], ['query']),
    'isStudent' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'registerAdmin' : IDL.Func([IDL.Text], [Result], []),
    'registerStudent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_3],
        [],
      ),
    'registerTeamMembers' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Text],
        [Result_2],
        [],
      ),
    'resolveHelpTicket' : IDL.Func([IDL.Text, IDL.Bool], [Result_1], []),
    'sanityCheckGetEmptyStudent' : IDL.Func([IDL.Text], [IDL.Text], []),
    'studentCreateHelpTicket' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result_1],
        [],
      ),
    'unregisterAdmin' : IDL.Func([IDL.Text], [Result], []),
    'verifyProject' : IDL.Func([IDL.Text, IDL.Nat], [VerifyProject], []),
  });
};
export const init = ({ IDL }) => { return []; };
