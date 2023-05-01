export const idlFactory = ({ IDL }) => {
  const Team = IDL.Record({
    'name' : IDL.Text,
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : Team, 'err' : IDL.Text });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result_7 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'err' : IDL.Text,
  });
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
  const Result_2 = IDL.Variant({ 'ok' : Student, 'err' : IDL.Text });
  const Activity = IDL.Record({
    'activityId' : IDL.Text,
    'specialAnnouncement' : IDL.Text,
    'activity' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const TeamString = IDL.Record({
    'name' : IDL.Text,
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Text,
  });
  const Result_4 = IDL.Variant({
    'ok' : IDL.Vec(DailyProject),
    'err' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(Student), 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
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
    'adminCreateTeam' : IDL.Func([IDL.Text], [Result_1], []),
    'adminDeleteTeam' : IDL.Func([IDL.Text], [Result_6], []),
    'adminGetAllTeamsWithTeamId' : IDL.Func([], [Result_7], []),
    'adminSyncTeamScores' : IDL.Func([], [Result_6], []),
    'buildStudent' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'buildTeam' : IDL.Func([IDL.Text], [Team], ['query']),
    'getActivity' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(Activity)],
        ['query'],
      ),
    'getActivityFeed' : IDL.Func([], [IDL.Vec(Activity)], ['query']),
    'getAdmins' : IDL.Func([], [Result_5], ['query']),
    'getAllStudents' : IDL.Func([], [Result_5], []),
    'getAllStudentsPrincipal' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getAllTeams' : IDL.Func([], [IDL.Vec(TeamString)], ['query']),
    'getStudent' : IDL.Func([IDL.Text], [Result_2], []),
    'getStudentCompletedDays' : IDL.Func([], [Result_4], []),
    'getStudentsFromTeam' : IDL.Func([IDL.Text], [Result_3], []),
    'getTeam' : IDL.Func([IDL.Text], [Team], []),
    'isEvenTest' : IDL.Func([IDL.Int], [IDL.Bool], ['query']),
    'isStudent' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'registerAdmin' : IDL.Func([IDL.Text], [Result], []),
    'registerStudent' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text],
        [Result_2],
        [],
      ),
    'registerTeamMembers' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Text],
        [Result_1],
        [],
      ),
    'sanityCheckGetEmptyStudent' : IDL.Func([IDL.Text], [IDL.Text], []),
    'unregisterAdmin' : IDL.Func([IDL.Text], [Result], []),
    'verifyProject' : IDL.Func([IDL.Text, IDL.Nat], [VerifyProject], []),
  });
};
export const init = ({ IDL }) => { return []; };
