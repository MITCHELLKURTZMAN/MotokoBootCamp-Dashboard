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
  const Result_1 = IDL.Variant({ 'ok' : Team, 'err' : IDL.Text });
  const Activity = IDL.Record({
    'activityId' : IDL.Text,
    'specialAnnouncement' : IDL.Bool,
    'activity' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const TestResults = IDL.Record({
    'day1' : IDL.Text,
    'day2' : IDL.Text,
    'day3' : IDL.Text,
    'day4' : IDL.Text,
    'day5' : IDL.Text,
  });
  return IDL.Service({
    'buildStudent' : IDL.Func([IDL.Text], [Result_2], []),
    'buildTeam' : IDL.Func([IDL.Text], [Result_1], []),
    'getActivity' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(Activity)], []),
    'getAdmins' : IDL.Func([], [Result_3], ['query']),
    'isEvenTest' : IDL.Func([IDL.Int], [IDL.Bool], []),
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
