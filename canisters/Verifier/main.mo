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
import Test "test";
import U "utils";

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
    // Returns a boolean indicating whether the given principal has completed the given day.
    // If the principal doesn't correspond to a student, returns false.
    func _hasStudentCompletedDay(day : Nat, p : Principal) : Bool {
        let studentId = Principal.toText(p);
        switch (studentCompletedDaysHashMap.get(studentId)) {
            case (null) { return false };
            case (?completedDays) {
                for (d in completedDays.vals()) {
                    if (d.day == day) {
                        return true
                    }
                };
                return false
            }
        }
    };

    // Returns a boolean indicating whether the given principal is a registered student.
    func _isStudent(p : Principal) : Bool {
        let studentId = Principal.toText(p);
        switch (principalIdHashMap.get(studentId)) {
            case (null) { return false };
            case (?_) { return true }
        }
    };

    public shared ({ caller }) func getStudentCompletedDays() : async Result.Result<[DailyProject], Text> {
        let studentId = Principal.toText(caller);
        return #ok(U.safeGet(studentCompletedDaysHashMap, studentId, []))
    };

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

        if (U.safeGet(principalIdHashMap, principalId, "") == "") {

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
        } else {
            #err("Student already registered")
        }
    };

    public shared func sanityCheckGetEmptyStudent(principalId : Text) : async Text {
        let principal = U.safeGet(principalIdHashMap, principalId, "");
        return principal
    };

    public shared func getAllStudents() : async Result.Result<[Text], Text> {
        var studentsBuffer = Buffer.Buffer<Text>(principalIdHashMap.size());
        for (student in principalIdHashMap.keys()) {
            studentsBuffer.add(student)
        };
        #ok(Buffer.toArray(studentsBuffer))
    };

    func generateStudentScore(principalId : Text) : Nat {
        var score = 0;
        var completedDays = U.safeGet(studentCompletedDaysHashMap, principalId, [{ canisterId = ""; day = 0; completed = false; timeStamp : Nat64 = 0 }]);
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

        var name = U.safeGet(principalIdHashMap, principalId, "");
        if (name == "") {
            return #err("User not found")
        };

        var teamId = U.safeGet(studentTeamHashMap, principalId, "");

        var strikes = U.safeGet(studentStrikesHashMap, principalId, 0);

        var canisterIds = U.safeGet(studentCanisterIdHashMap, principalId, [""]);
        var completedDays = U.safeGet(studentCompletedDaysHashMap, principalId, [{ canisterId = ""; day = 0; completed = false; timeStamp : Nat64 = 0 }]);

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

    func generateTeamScore(teamId : Text) : Nat {
        var teamMembers = U.safeGet(teamHashMap, teamId, []);
        var totalCompletedProjects = 0;
        var projectsRequiredPerStudent = 5;

        if (teamMembers.size() > 0) {
            for (member in teamMembers.vals()) {
                totalCompletedProjects := totalCompletedProjects + Int.abs(U.safeGet(studentScoreHashMap, member, 0))
            };

            let teamProgress = (totalCompletedProjects * 100) / (teamMembers.size() * projectsRequiredPerStudent);

            teamScoreHashMap.put(teamId, teamProgress);
            teamProgress
        } else {
            return 0
        }
    };

    public shared query func buildTeam(teamId : Text) : async Team {

        let updatedScore = generateTeamScore(teamId);
        var teamMembers = U.safeGet(teamHashMap, teamId, []);
        var teamScore = U.safeGet(teamScoreHashMap, teamId, 0);

        Debug.print("team score is " # Nat.toText(teamScore));
        Debug.print("updated score is " # Nat.toText(updatedScore));

        var team = {
            teamId = teamId;
            teamMembers = teamMembers;
            score = (updatedScore)
        };

        return (team)
    };

    // Synchronous version of the above.
    func _buildTeam(teamId : Text) : Team {

        let updatedScore = generateTeamScore(teamId);
        var teamMembers = U.safeGet(teamHashMap, teamId, []);
        var teamScore = U.safeGet(teamScoreHashMap, teamId, 0);

        Debug.print("team score is " # Nat.toText(teamScore));
        Debug.print("updated score is " # Nat.toText(updatedScore));

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
        var teamMembers = U.safeGet(teamHashMap, teamId, []);
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
                if (U.safeGet(studentTeamHashMap, newMembers, "") != "") {
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
                score = U.safeGet(teamScoreHashMap, team, 0)
            })

        } else {

            if (team == "") {
                return #err("Team not found")
            };

            var teamScore = U.safeGet(teamScoreHashMap, team, 0);
            var teamArray = (U.safeGet(teamHashMap, team, []));
            var teambuffer = Buffer.Buffer<Text>(1);

            for (currentMembers in teamArray.vals()) {
                if (U.safeGet(studentTeamHashMap, currentMembers, "") != "") {
                    return #err("Student already on a team")
                };

                teambuffer.add(currentMembers)

            };
            for (newMembers in newTeamMembers.vals()) {
                if (U.safeGet(studentTeamHashMap, newMembers, "") != "") {
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
                teamMembers = U.safeGet(teamHashMap, team, []);
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

    public shared query func getActivity(lowerBound : Nat, upperBound : Nat) : async [Activity] {
        var activityBuffer = Buffer.Buffer<Activity>(1);
        for (activity in activityHashmap.vals()) {
            if (U.textToNat(activity.activityId) >= lowerBound and U.textToNat(activity.activityId) <= upperBound) {
                activityBuffer.add(activity)
            }
        };

        return Array.reverse(Buffer.toArray(activityBuffer))
    };

    public type TestResult = Test.TestResult;
    // Expand the base type with additional errors.
    public type VerifyProject = TestResult or Result.Result<(), { #NotAStudent : Text; #InvalidDay : Text; #AlreadyCompleted : Text }>;

    public shared ({ caller }) func verifyProject(canisterIdText : Text, day : Nat) : async VerifyProject {

        let canisterId = Principal.fromText(canisterIdText);
        // Step 1: Verify that the caller is a registered student
        if (not (_isStudent(caller))) {
            return #err(#NotAStudent("Please login or register"))
        };
        // Step 2: Verify that the caller hasn't already completed the project
        if (_hasStudentCompletedDay(day, caller)) {
            return #err(#AlreadyCompleted("You have already completed this project"))
        };
        // // Step 3: Verify that the caller is the controller of the submitted canister. will bring back once register owner is added
        // if (not (await Test.verifyOwnership(canisterId, caller))) {
        //     return #err(#NotAController)
        // };
        // Step 4: Run the tests (see test.mo)
        switch (day) {
            case (1) {
                switch (await Test.verifyDay1(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (2) {
                switch (await Test.verifyDay2(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (3) {
                switch (await Test.verifyDay3(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (4) {
                switch (await Test.verifyDay4(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (5) {
                switch (await Test.verifyDay5(canisterId)) {
                    case (#ok) {};
                    case (#err(e)) { return #err(e) }
                }
            };
            case (_) {
                return #err(#InvalidDay("Invalid day"))
            }
        };
        // Step 5: Update the necessary variables
        _validated(day, canisterId, caller);
        let updatedStudent = await getStudent(Principal.toText(caller));
        return #ok()
    };

    // Performs the necesary updates once a project is completed by a student
    // 1. Update the studentCompletedDays (in studentCompletedDaysHashMap)

    // 2. Update the studentScore (where?)
    // 3. Update the activity feed (activityHashmap) & the activity counter (activityIdCounter)
    // 4. Update the team score (teamScoreHashMap)
    // 5. Update the team members (teamHashMap)
    func _validated(day : Nat, canisterId : Principal, student : Principal) : () {
        let studentId = Principal.toText(student);
        // Step 1: Add the new completed project to the student's completed projects (studentCompletedDaysHashMap)
        let completedDays = U.safeGet(studentCompletedDaysHashMap, studentId, []);
        let projectCompleted = {
            day = day;
            canisterId = Principal.toText(canisterId);
            completed = true;
            timeStamp = Nat64.fromIntWrap(Time.now())
        };
        studentCompletedDaysHashMap.put(Principal.toText(student), Array.append<DailyProject>(completedDays, [projectCompleted]));
        // Step 2: Generate the new student's score
        ignore generateStudentScore(Principal.toText(student));
        // Step 3: Update the activity feed & the activity counter
        activityHashmap.put(
            Nat.toText(activityIdCounter),
            {
                activityId = Nat.toText(activityIdCounter);
                activity = "A challenger has completed day " # Nat.toText(day) # " of the competition!"; //todo add team name and name of student
                specialAnnouncement = "ProjectCompleted"
            },
        );
        activityIdCounter := activityIdCounter + 1;
        // Step 4: Update the team score
        let team = _buildTeam(U.safeGet(studentTeamHashMap, studentId, ""));
        // Step 5: Update the team members
        let teamScore = U.safeGet(teamScoreHashMap, team.teamId, 0);
        teamScoreHashMap.put(team.teamId, teamScore + 1);
        return
    };

}
