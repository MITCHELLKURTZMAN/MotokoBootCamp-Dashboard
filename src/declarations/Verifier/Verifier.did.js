export const idlFactory = ({ IDL }) => {
  const DailyProject = IDL.Record({
    'day' : IDL.Nat,
    'timeStamp' : IDL.Nat64,
    'completed' : IDL.Bool,
    'canisterId' : IDL.Text,
  });
  const Student = IDL.Record({
    'completedDays' : IDL.Vec(DailyProject),
    'name' : IDL.Text,
    'rank' : IDL.Text,
    'canisterIds' : IDL.Vec(IDL.Text),
    'score' : IDL.Nat,
    'teamId' : IDL.Text,
    'principalId' : IDL.Text,
    'strikes' : IDL.Int,
  });
  const Result_2 = IDL.Variant({ 'ok' : Student, 'err' : IDL.Text });
  const Team = IDL.Record({
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Nat,
    'teamId' : IDL.Text,
  });
  const Activity = IDL.Record({
    'activityId' : IDL.Text,
    'specialAnnouncement' : IDL.Text,
    'activity' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(Student), 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : Team, 'err' : IDL.Text });
  const TestResults = IDL.Record({
    'day1' : IDL.Text,
    'day2' : IDL.Text,
    'day3' : IDL.Text,
    'day4' : IDL.Text,
    'day5' : IDL.Text,
  });
  return IDL.Service({
    'buildStudent' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'buildTeam' : IDL.Func([IDL.Text], [Team], ['query']),
    'getActivity' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(Activity)],
        ['query'],
      ),
    'getAdmins' : IDL.Func([], [Result_4], ['query']),
    'getAllTeams' : IDL.Func([], [IDL.Vec(Team)], []),
    'getStudent' : IDL.Func([IDL.Text], [Result_2], []),
    'getStudentsFromTeam' : IDL.Func([IDL.Text], [Result_3], []),
    'getTeam' : IDL.Func([IDL.Text], [Team], []),
    'isEvenTest' : IDL.Func([IDL.Int], [IDL.Bool], ['query']),
    'registerAdmin' : IDL.Func([IDL.Text], [Result], []),
    'registerStudent' : IDL.Func([IDL.Text], [Result_2], []),
    'registerTeamMembers' : IDL.Func(
        [IDL.Vec(IDL.Text), IDL.Bool, IDL.Text],
        [Result_1],
        [],
      ),
    'unregisterAdmin' : IDL.Func([IDL.Text], [Result], []),
    'verifyProject' : IDL.Func([IDL.Text, IDL.Nat], [TestResults], []),
  });
};
export const init = ({ IDL }) => { return []; };
