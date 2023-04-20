import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import Debug "mo:base/Debug";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import IC "mo:base/ExperimentalInternetComputer";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";

//todo:

//If the project is accepted the score of the student is updated and the score of his team updated.
//we need timestamps because all projects could technically finish and achieve the same score.
//store activity data when students achieve milestones
//store student rank data
//make teams in military alphabet
//team scores may need to be weighted for different sized teams

actor verifier {

    var maxHashmapSize = 1000000;
    func isEq(x : Text, y : Text) : Bool { x == y };

    var principalIdHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash); //the name of the student stored by principal id

    var teamHashMap = HashMap.HashMap<Text, [Text]>(maxHashmapSize, isEq, Text.hash); //the students on the team stored by team id in an array
    var teamScoreHashMap = HashMap.HashMap<Text, Nat>(maxHashmapSize, isEq, Text.hash); //the score of the team stored by team id
    var studentScoreHashMap = HashMap.HashMap<Text, Nat>(maxHashmapSize, isEq, Text.hash); //the score of the student
    var studentTeamHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash); //the team the student is on
    var studentStrikesHashMap = HashMap.HashMap<Text, Int>(maxHashmapSize, isEq, Text.hash); //a way to detect if a student is cheating
    var studentRankHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash); //the rank of the student (see Public Type Rank for names)
    var studentCompletedDaysHashMap = HashMap.HashMap<Text, [DailyProject]>(maxHashmapSize, isEq, Text.hash); //the days the student has completed
    var studentCanisterIdHashMap = HashMap.HashMap<Text, [Text]>(maxHashmapSize, isEq, Text.hash); //the canister id or [ids] the student has registered (can use one or many but cannot be someone elses)
    var canisterIdHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash); //the global list of canister ids to cross check against

    //activity feed
    var activityHashmap = HashMap.HashMap<Text, Activity>(maxHashmapSize, isEq, Text.hash); //the activity feed stored by activity id

    stable var teamIdCounter : Nat = 0;
    stable var activityIdCounter : Nat = 0;

    //types
    public type Student = {
        principalId : Text;
        name : Text;
        teamId : Text;
        score : Nat;
        strikes : Int; //will use this if a student attempts to submit someone elses canister
        rank : Text;
        canisterIds : [Text]; //can be one or multiple, but cannot be someone elses
        completedDays : [DailyProject]
    };

    public type DailyProject = {
        day : Nat;
        canisterId : Text;
        completed : Bool;
        timeStamp : Nat64
    };

    public type Team = {
        teamId : Text;
        teamMembers : [Text];
        score : Nat
    };

    public type DashboardTeam = {
        teamId : Text;
        teamMembers : [Student];
        score : Nat
    };

    public type Activity = {
        activityId : Text;
        activity : Text;
        specialAnnouncement : Text; //We may want to customize these and add more as we go to parse on the frontend.
        //so far, we can use: "newProject", "newStudent", "newTeam", "newAdmin", "newRank", "newTeamScore", "LectureEvent"
    };

    public type Rank = {
        #recruit : Text;
        #cyberNovice : Text;
        #dataDefender : Text;
        #motokoMarksman : Text;
        #asyncSergeant : Text;
        #ghostNavigator : Text;
        #digitalCaptain : Text;
        #networkNoble : Text;
        #aiArchitect : Text;
        #quantumConsul : Text
    };

    var rankArray = [
        "Recruit",
        "Cyber Novice",
        "Data Defender",
        "Motoko Marksman",
        "Async Sergeant",
        "Ghost Navigator",
        "Digital Captain",
        "Network Noble",
        "AI Architect",
        "Quantum Consul",
    ];

    public type AlphabetTeams = {
        #auraAlpha : Text;
        #binaryBravo : Text;
        #cyberCharlie : Text;
        #digitalDelta : Text;
        #echoEngine : Text;
        #fluxFoxtrot : Text;
        #glitchGolf : Text;
        #hackerHotel : Text;
        #interfaceIndia : Text;
        #jumpstartJuliet : Text;
        #kineticKilo : Text;
        #logicLima : Text;
        #mainframeMike : Text;
        #nanotechNovember : Text;
        #overdriveOscar : Text;
        #pixelPapa : Text;
        #quantumQuebec : Text;
        #reactiveRomeo : Text;
        #syncSierra : Text;
        #techTango : Text;
        #uploadUniform : Text;
        #virtualVictor : Text;
        #wavelengthWhiskey : Text;
        #xenonXray : Text;
        #yottabyteYankee : Text;
        #zenithZulu : Text
    };

    //utils
    func safeGet<K, V>(hashMap : HashMap.HashMap<K, V>, key : K, defaultValue : V) : V {
        switch (hashMap.get(key)) {
            case null defaultValue;
            case (?value) value
        }
    };

    func textToNat(txt : Text) : Nat {
        assert (txt.size() > 0);
        let chars = txt.chars();

        var num : Nat = 0;
        for (v in chars) {
            let charToNum = Nat32.toNat(Char.toNat32(v) -48);
            assert (charToNum >= 0 and charToNum <= 9);
            num := num * 10 + charToNum
        };

        num
    };

    //admins
    stable var admins : List.List<Text> = List.nil<Text>();
    func isAdmin(caller : Principal) : Bool {
        var c = Principal.toText(caller);
        var exists = List.find<Text>(admins, func(val : Text) : Bool { val == c });
        exists != null
    };

    public shared query ({ caller }) func getAdmins() : async Result.Result<[Text], Text> {
        if (not isAdmin(caller)) {
            return #err("Unauthorized to get admins")
        };

        #ok(List.toArray(admins))
    };

    public shared ({ caller }) func registerAdmin(id : Text) : async Result.Result<(), Text> {

        if (List.size<Text>(admins) > 0 and not isAdmin(caller)) {
            return #err("Unauthorized to register admin")
        };

        if (not List.some<Text>(admins, func(val : Text) : Bool { val == id })) {
            admins := List.push<Text>(id, admins)
        };

        activityHashmap.put(
            Nat.toText(activityIdCounter),
            {
                activityId = Nat.toText(activityIdCounter);
                activity = "Attention on Deck! A new admin has registered";
                specialAnnouncement = "newAdmin"
            },
        );
        activityIdCounter += 1;

        #ok()
    };

    public shared ({ caller }) func unregisterAdmin(id : Text) : async Result.Result<(), Text> {

        if (not isAdmin(caller)) {
            return #err("Unauthorized to unregister admin")
        };
        admins := List.filter<Text>(admins, func(val : Text) : Bool { val != id });
        #ok()
    };

    //student
    public shared ({ caller }) func registerStudent(name : Text) : async Result.Result<Student, Text> {

        let principalId = Principal.toText(caller);

        var student = {
            principalId = principalId;
            name = name;
            teamId = "";
            score = 0;
            strikes = 0;
            rank = "recruit";
            canisterIds = [];
            completedDays = [];

        };

        if (safeGet(principalIdHashMap, principalId, "") != "") {
            return #err("Principal id already registered")
        };

        principalIdHashMap.put(principalId, name);
        studentScoreHashMap.put(principalId, 0);

        activityHashmap.put(
            Nat.toText(activityIdCounter),
            {
                activityId = Nat.toText(activityIdCounter);
                activity = name # " has registered for Motoko Bootcamp";
                specialAnnouncement = "newStudent"
            },
        );
        activityIdCounter := activityIdCounter + 1;

        #ok(student)
    };

    func generateStudentScore(principalId : Text) : Nat {
        var score = 0;
        var completedDays = safeGet(studentCompletedDaysHashMap, principalId, [{ canisterId = ""; day = 0; completed = false; timeStamp : Nat64 = 0 }]);
        let length = completedDays.size();

        for (day in completedDays.vals()) {
            if (day.completed) {
                score += 1
            }
        };

        studentScoreHashMap.put(principalId, score);
        score

    };

    public query func buildStudent(principalId : Text) : async Result.Result<Student, Text> {
        let getScore = generateStudentScore(principalId);
        let score = generateStudentScore(principalId) * 20; //considering 5 days TODO double check this

        //100% / 5 = 20

        let rank = rankArray[getScore];

        var name = safeGet(principalIdHashMap, principalId, "");
        if (name == "") {
            return #err("Principal id not registered")
        };

        var teamId = safeGet(studentTeamHashMap, principalId, "");

        var strikes = safeGet(studentStrikesHashMap, principalId, 0);

        var canisterIds = safeGet(studentCanisterIdHashMap, principalId, [""]);
        var completedDays = safeGet(studentCompletedDaysHashMap, principalId, [{ canisterId = ""; day = 0; completed = false; timeStamp : Nat64 = 0 }]);

        var student = {
            principalId = principalId;
            name = name;
            teamId = teamId;
            score = score;
            strikes = strikes;
            rank = rank;
            canisterIds = canisterIds;
            completedDays = completedDays
        };

        #ok(student)
    };

    public shared func getStudent(principalId : Text) : async Result.Result<Student, Text> {

        await buildStudent(principalId);

    };

    //teams

    func generateTeamScore(teamId : Text) : (Nat) {
        var teamMembers = safeGet(teamHashMap, teamId, []);
        var teamScore = 0;
        for (member in teamMembers.vals()) {
            teamScore := teamScore + Int.abs(safeGet(studentScoreHashMap, member, 0))
        };
        teamScoreHashMap.put(teamId, teamScore);
        teamScore;

    };

    public shared query func buildTeam(teamId : Text) : async Team {

        let updatedScore = generateTeamScore(teamId);
        var teamMembers = safeGet(teamHashMap, teamId, []);
        var teamScore = safeGet(teamScoreHashMap, teamId, 0);

        var team = {
            teamId = teamId;
            teamMembers = teamMembers;
            score = (updatedScore)
        };

        return (team)
    };

    public shared func getTeam(teamId : Text) : async Team {

        await buildTeam(teamId)
    };

    public shared func getStudentsFromTeam(teamId : Text) : async Result.Result<[Student], Text> {

        var studentBuffer = Buffer.Buffer<Student>(1);
        var teamMembers = safeGet(teamHashMap, teamId, []);
        for (member in teamMembers.vals()) {
            let student = await buildStudent(member);
            switch (student) {
                case (#ok(student)) {
                    studentBuffer.add(student)
                };
                case (#err(err)) {
                    return #err(err)
                }

            }
        };
        #ok(Buffer.toArray(studentBuffer))

    };

    private func incTeamIdCounter() : async () {
        teamIdCounter := teamIdCounter + 1
        //todo set aplhabet team
    };

    public func registerTeamMembers(newTeamMembers : [Text], createNewTeam : Bool, team : Text) : async Result.Result<Team, Text> {

        //create new team or add to existing team
        if (createNewTeam) {

            await incTeamIdCounter();

            var teamBuffer = Buffer.Buffer<Text>(1);
            for (newMembers in newTeamMembers.vals()) {
                if (safeGet(studentTeamHashMap, newMembers, "") != "") {
                    return #err("Student already on a team")
                };
                teamBuffer.add(newMembers)
            };

            teamHashMap.put(Nat.toText(teamIdCounter), Buffer.toArray(teamBuffer));
            teamScoreHashMap.put(team, 0);

            activityHashmap.put(
                Nat.toText(activityIdCounter),
                {
                    activityId = Nat.toText(activityIdCounter);
                    activity = "A new team has been created, the competition is heating up!";
                    specialAnnouncement = "newTeam"
                },
            );
            activityIdCounter := activityIdCounter + 1;

            return #ok({
                teamId = Nat.toText(teamIdCounter);
                teamMembers = newTeamMembers;
                score = safeGet(teamScoreHashMap, team, 0)
            })

        } else {

            if (team == "") {
                return #err("Team not found")
            };

            var teamScore = safeGet(teamScoreHashMap, team, 0);
            var teamArray = (safeGet(teamHashMap, team, []));
            var teambuffer = Buffer.Buffer<Text>(1);

            for (currentMembers in teamArray.vals()) {
                if (safeGet(studentTeamHashMap, currentMembers, "") != "") {
                    return #err("Student already on a team")
                };

                teambuffer.add(currentMembers)

            };
            for (newMembers in newTeamMembers.vals()) {
                if (safeGet(studentTeamHashMap, newMembers, "") != "") {
                    return #err("Student already on a team")
                };
                teambuffer.add(newMembers)
            };

            teamHashMap.put(team, Buffer.toArray(teambuffer));

            activityHashmap.put(
                Nat.toText(activityIdCounter),
                {
                    activityId = Nat.toText(activityIdCounter);
                    activity = "A new team member has joined team " # team;
                    specialAnnouncement = "newTeamMember"
                },
            );
            activityIdCounter := activityIdCounter + 1;

            return #ok({
                teamId = team;
                teamMembers = safeGet(teamHashMap, team, []);
                score = teamScore
            })
        }
    };

    public shared func getAllTeams() : async [Team] {

        var teamBuffer = Buffer.Buffer<Team>(1);
        for (teamId in teamHashMap.keys()) {
            let team = await buildTeam(teamId);

            teamBuffer.add(team)

        };
        return Buffer.toArray(teamBuffer)
    };

    //test suite
    public shared query func isEvenTest(number : Int) : async Bool {
        return number % 2 == 0
    };

    public type TestResults = {
        day1 : Text;
        day2 : Text;
        day3 : Text;
        day4 : Text;
        day5 : Text
    };

    public shared query func getActivity(lowerBound : Nat, upperBound : Nat) : async [Activity] {
        var activityBuffer = Buffer.Buffer<Activity>(1);
        for (activity in activityHashmap.vals()) {
            if (textToNat(activity.activityId) >= lowerBound and textToNat(activity.activityId) <= upperBound) {
                activityBuffer.add(activity)
            }
        };
        return Buffer.toArray(activityBuffer)
    };

    func check(canisterId : Text, day : Nat) : async Bool {
        if (day == 1) {
            let projectActor = actor (canisterId) : actor {
                isEven : (number : Int) -> async Bool
            };
            let testCase : Bool = await isEvenTest(2);
            let result : Bool = await projectActor.isEven(2);
            return result == testCase;

        } else if (day == 2) {
            return true
        } else if (day == 3) {
            return true
        } else if (day == 4) {
            return false
        } else if (day == 5) {
            return false
        };
        false
    };

    //TODO: make entire function more dry, specifically the day1, day2, day3, day4, day5 portions
    public shared ({ caller }) func verifyProject(canisterId : Text, day : Nat) : async TestResults {
        let principalId = Principal.toText(caller);
        let student = await buildStudent(principalId);
        let projectActor = actor (canisterId) : actor {
            isEven : (number : Int) -> async Bool
        };

        let day1 : Text = if (await check(canisterId, 1)) { "pass" } else {
            "fail"
        };
        let day2 : Text = if (await check(canisterId, 2)) { "pass" } else {
            "fail"
        };
        let day3 : Text = if (await check(canisterId, 3)) { "pass" } else {
            "fail"
        };
        let day4 : Text = if (await check(canisterId, 4)) { "pass" } else {
            "fail"
        };
        let day5 : Text = if (await check(canisterId, 5)) { "pass" } else {
            "fail"
        };

        let testResults = [
            day1,
            day2,
            day3,
            day4,
            day5,
        ];

        for (i in Iter.range(1, 5)) {
            let result = testResults[i -1];
            if (result == "pass") {
                var completedDaysBuffer = Buffer.Buffer<DailyProject>(1);
                let completedDays = safeGet(studentCompletedDaysHashMap, principalId, []);
                for (dailyProject in completedDays.vals()) {
                    completedDaysBuffer.add(dailyProject)
                };
                completedDaysBuffer.add({
                    day = i;
                    canisterId = canisterId;
                    completed = true;
                    timeStamp = 0 //todo add timestamp

                });
                studentCompletedDaysHashMap.put(principalId, Buffer.toArray(completedDaysBuffer));

                activityHashmap.put(
                    Nat.toText(activityIdCounter),
                    {
                        activityId = Nat.toText(activityIdCounter);
                        activity = "A challenger has completed day " # Nat.toText(i) # " of the competition!"; //todo add team name and name of student
                        specialAnnouncement = "ProjectCompleted"
                    },
                );
                activityIdCounter := activityIdCounter + 1;

                let team = await buildTeam(safeGet(studentTeamHashMap, principalId, ""));
                let teamScore = safeGet(teamScoreHashMap, team.teamId, 0);
                teamScoreHashMap.put(team.teamId, teamScore + 1)
            }
        };

        let finalresult = {
            day1 = testResults[0];
            day2 = testResults[1];
            day3 = testResults[2];
            day4 = testResults[3];
            day5 = testResults[4]
        };

        return finalresult
    }

}
