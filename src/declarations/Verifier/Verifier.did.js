export const idlFactory = ({ IDL }) => {
  const Team = IDL.Record({
    'name' : IDL.Text,
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Nat,
  });
  const Result_8 = IDL.Variant({ 'ok' : Team, 'err' : IDL.Text });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
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
    'bonusPoints' : IDL.Nat,
    'score' : IDL.Nat,
    'cliPrincipalId' : IDL.Text,
    'principalId' : IDL.Text,
    'strikes' : IDL.Int,
  });
  const Result_2 = IDL.Variant({ 'ok' : Student, 'err' : IDL.Text });
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
  const CanisterSettings = IDL.Record({
    'freezing_threshold' : IDL.Nat,
    'controllers' : IDL.Vec(IDL.Principal),
    'memory_allocation' : IDL.Nat,
    'compute_allocation' : IDL.Nat,
  });
  const CanisterStatus = IDL.Record({
    'status' : IDL.Variant({
      'stopped' : IDL.Null,
      'stopping' : IDL.Null,
      'running' : IDL.Null,
    }),
    'memory_size' : IDL.Text,
    'cycles' : IDL.Text,
    'settings' : CanisterSettings,
    'idle_cycles_burned_per_day' : IDL.Text,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'canisterId' : IDL.Text,
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
    'bonusPoints' : IDL.Text,
    'score' : IDL.Text,
  });
  const Result_4 = IDL.Variant({
    'ok' : IDL.Vec(StudentList),
    'err' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(Student), 'err' : IDL.Text });
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
    'adminCreateTeam' : IDL.Func([IDL.Text], [Result_8], []),
    'adminDeleteTeam' : IDL.Func([IDL.Text], [Result_5], []),
    'adminGrantBonusPoints' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'adminManuallyVerifyStudentDay' : IDL.Func(
        [IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'adminSpecialAnnouncement' : IDL.Func([IDL.Text], [], []),
    'adminSyncTeamScores' : IDL.Func([], [Result_5], []),
    'buildStudent' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'buildTeam' : IDL.Func([IDL.Text], [Team], ['query']),
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
    'getCanisterInfo' : IDL.Func([], [CanisterStatus], []),
    'getHelpTickets' : IDL.Func([], [IDL.Vec(HelpTicket)], ['query']),
    'getStudent' : IDL.Func([IDL.Text], [Result_2], []),
    'getStudentCompletedDays' : IDL.Func([], [Result_6], []),
    'getStudentPrincipalByName' : IDL.Func([IDL.Text], [Result_5], []),
    'getStudentsForTeamDashboard' : IDL.Func([IDL.Text], [Result_4], ['query']),
    'getStudentsFromTeam' : IDL.Func([IDL.Text], [Result_3], []),
    'getTeam' : IDL.Func([IDL.Text], [Team], []),
    'getTotalCompletedPerDay' : IDL.Func([], [DailyTotalMetrics], ['query']),
    'getTotalProjectsCompleted' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalStudents' : IDL.Func([], [IDL.Text], ['query']),
    'getTotalTeams' : IDL.Func([], [IDL.Text], ['query']),
    'getUser' : IDL.Func([], [Result_2], []),
    'isEvenTest' : IDL.Func([IDL.Int], [IDL.Bool], ['query']),
    'isStudent' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'principalReverseMigration' : IDL.Func([], [], []),
    'registerAdmin' : IDL.Func([IDL.Text], [Result], []),
    'registerStudent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'resolveHelpTicket' : IDL.Func([IDL.Text, IDL.Bool], [Result_1], []),
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
