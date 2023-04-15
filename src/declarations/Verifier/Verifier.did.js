export const idlFactory = ({ IDL }) => {
  const Student = IDL.Record({
    'name' : IDL.Text,
    'rank' : IDL.Text,
    'score' : IDL.Int,
    'teamId' : IDL.Text,
    'principalId' : IDL.Text,
    'strikes' : IDL.Int,
  });
  const Result_2 = IDL.Variant({ 'ok' : Student, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Text), 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Team = IDL.Record({
    'teamMembers' : IDL.Vec(IDL.Text),
    'score' : IDL.Int,
    'teamId' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Team, 'err' : IDL.Text });
  const TestResults = IDL.Record({
    'day1' : IDL.Text,
    'day2' : IDL.Text,
    'day3' : IDL.Text,
    'day4' : IDL.Text,
    'day5' : IDL.Text,
  });
  return IDL.Service({
    'buildStudent' : IDL.Func([IDL.Text], [Result_2], []),
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
