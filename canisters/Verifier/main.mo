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
import Bool "mo:base/Bool";

actor verifier {

    var maxHashmapSize = 1000000;
    func isEq(x : Text, y : Text) : Bool { x == y };

    stable var principalIdEntries : [(Text, Text)] = [];
    stable var teamMembersEntries : [(Text, [Text])] = [];
    stable var teamScoreEntries : [(Text, Nat)] = [];
    stable var studentScoreEntries : [(Text, Nat)] = [];
    stable var studentTeamEntries : [(Text, Text)] = [];
    stable var studentStrikesEntries : [(Text, Int)] = [];
    stable var studentRankEntries : [(Text, Text)] = [];
    stable var studentCompletedDaysEntries : [(Text, [DailyProject])] = [];
    stable var studentCanisterIdEntries : [(Text, [Text])] = [];
    stable var canisterIdEntries : [(Text, Text)] = [];
    stable var studentCliPrincipalIdEntries : [(Text, Text)] = [];
    stable var activityEntries : [(Text, Activity)] = [];
    stable var teamNameEntries : [(Text, Text)] = [];
    stable var bonusPointsEntries : [(Text, Nat)] = [];
    stable var principalIdReverseEntries : [(Text, Text)] = [];

    var principalIdHashMap = HashMap.fromIter<Text, Text>(principalIdEntries.vals(), maxHashmapSize, isEq, Text.hash); //the name of the student stored by principal id
    var principalIdReverseHashMap = HashMap.fromIter<Text, Text>(principalIdReverseEntries.vals(), maxHashmapSize, isEq, Text.hash); //the principal id of the student stored by name
    var teamMembersHashMap = HashMap.fromIter<Text, [Text]>(teamMembersEntries.vals(), maxHashmapSize, isEq, Text.hash); //the students on the team stored by team id in an array
    var teamScoreHashMap = HashMap.fromIter<Text, Nat>(teamScoreEntries.vals(), maxHashmapSize, isEq, Text.hash); //the score of the team stored by team id
    var teamNameHashMap = HashMap.fromIter<Text, Text>(teamNameEntries.vals(), maxHashmapSize, isEq, Text.hash); //the name of the team stored by team id
    var studentScoreHashMap = HashMap.fromIter<Text, Nat>(studentScoreEntries.vals(), maxHashmapSize, isEq, Text.hash); //the score of the student
    var studentTeamHashMap = HashMap.fromIter<Text, Text>(studentTeamEntries.vals(), maxHashmapSize, isEq, Text.hash); //the team the student is on
    var studentStrikesHashMap = HashMap.fromIter<Text, Int>(studentStrikesEntries.vals(), maxHashmapSize, isEq, Text.hash); //a way to detect if a student is cheating
    var studentRankHashMap = HashMap.fromIter<Text, Text>(studentRankEntries.vals(), maxHashmapSize, isEq, Text.hash); //the rank of the student (see Rank array for names)
    var studentCompletedDaysHashMap = HashMap.fromIter<Text, [DailyProject]>(studentCompletedDaysEntries.vals(), maxHashmapSize, isEq, Text.hash); //the days the student has completed
    var studentCanisterIdHashMap = HashMap.fromIter<Text, [Text]>(studentCanisterIdEntries.vals(), maxHashmapSize, isEq, Text.hash); //the canister id or [ids] the student has registered (can use one or many but cannot be someone elses)
    var canisterIdHashMap = HashMap.fromIter<Text, Text>(canisterIdEntries.vals(), maxHashmapSize, isEq, Text.hash); //the global list of canister ids to cross check against
    var studentCliPrincipalIdHashMap = HashMap.fromIter<Text, Text>(studentCliPrincipalIdEntries.vals(), maxHashmapSize, isEq, Text.hash); //the CLI principal id of the students dev env stored by principal id
    var bonusPointsHashMap = HashMap.fromIter<Text, Nat>(bonusPointsEntries.vals(), maxHashmapSize, isEq, Text.hash); //the bonus points of the student

    //activity feed

    var activityHashmap = HashMap.fromIter<Text, Activity>(activityEntries.vals(), maxHashmapSize, isEq, Text.hash); //the activity feed stored by activity id
    stable var activityIdCounter : Nat = 0;

    //Help Tickets
    stable var helpTicketIdCounter : Nat = 0;

    public type HelpTicket = {
        helpTicketId : Text;
        principalId : Text;
        description : Text;
        gitHubUrl : Text;
        day : Text;
        canisterId : Text;
        resolved : Bool
    };

    stable var helpTicketEntries : [(Text, HelpTicket)] = [];
    var helpTicketHashMap = HashMap.fromIter<Text, HelpTicket>(helpTicketEntries.vals(), maxHashmapSize, isEq, Text.hash); //the help ticket stored by help ticket id

    func incHelpTicketIdCounter() : () {
        helpTicketIdCounter := helpTicketIdCounter + 1;

    };

    //types
    public type Student = {
        principalId : Text;
        name : Text;
        teamName : Text;
        score : Nat;
        strikes : Int; //will use this if a student attempts to submit someone elses canister
        rank : Text;
        canisterIds : [Text]; //can be one or multiple, but cannot be someone elses
        completedDays : [DailyProject];
        cliPrincipalId : Text;
        bonusPoints : Nat
    };

    public type DailyProject = {
        day : Nat;
        canisterId : Text;
        completed : Bool;
        timeStamp : Nat64
    };

    public type DailyProjectText = {
        day : Text;
        canisterId : Text;
        completed : Text;
        timeStamp : Text
    };

    public type DailyTotalMetrics = {
        day1 : Text;
        day2 : Text;
        day3 : Text;
        day4 : Text;
        day5 : Text
    };

    public type Team = {
        name : Text;
        teamMembers : [Text];
        score : Nat
    };

    public type TeamString = {
        name : Text;
        teamMembers : [Text];
        score : Text
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

    var teamNameArray = [
        "Aura Alpha",
        "Binary Bravo",
        "Cyber Charlie",
        "Digital Delta",
        "Echo Engine",
        "Flux Foxtrot",
        "Glitch Golf",
        "Hacker Hotel",
        "Interface India",
        "Jumpstart Juliet",
        "Kinetic Kilo",
        "Logic Lima",
        "Mainframe Mike",
        "Nanotech November",
        "Overdrive Oscar",
        "Pixel Papa",
        "Quantum Quebec",
        "Reactive Romeo",
        "Sync Sierra",
        "Tech Tango",
        "Upload Uniform",
        "Virtual Victor",
        "Wavelength Whiskey",
        "Xenon Xray",
        "Yottabyte Yankee",
        "Zenith Zulu",
    ];

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

        if (id == "2vxsx-fae") {
            return #err("Unauthorized to register anonymous admin")
        };

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

    func isAnon(p : Principal) : Bool {
        let id = Principal.toText(p);
        id == "2vxsx-fae"
    };

    //public method for redirecting to registration page
    public shared query func isStudent(principal : Text) : async Bool {
        Debug.print("isStudent: " # principal);
        _isStudent(Principal.fromText(principal))
    };

    public shared ({ caller }) func getStudentCompletedDays() : async Result.Result<[DailyProjectText], Text> {
        let studentId = Principal.toText(caller);
        let studentCompletedDays = U.safeGet(studentCompletedDaysHashMap, studentId, []).vals();
        let studentCompletedDaysString = Buffer.Buffer<DailyProjectText>(1);
        for (d in studentCompletedDays) {
            studentCompletedDaysString.add({
                day = Nat.toText(d.day);
                canisterId = d.canisterId;
                completed = Bool.toText(d.completed);
                timeStamp = Nat64.toText(d.timeStamp)
            })
        };
        #ok(Buffer.toArray(studentCompletedDaysString))

    };

    public shared ({ caller }) func adminManuallyVerifyStudentDay(day : Text, student : Text) : async Result.Result<(), Text> {
        if (not isAdmin(caller)) {
            return #err("Unauthorized to verify student day")
        };

        if (_hasStudentCompletedDay(U.textToNat(day), Principal.fromText(student))) {
            return #err("Student has already completed this project")
        };

        _validated(
            U.textToNat(day),

            Principal.fromActor(verifier),
            Principal.fromText(student),
        );

        return #ok()
    };

    func _isStudentNameTaken(name : Text) : Bool {
        for (student in principalIdHashMap.vals()) {
            Debug.print("student: " # student);
            if (student == U.trim(U.lowerCase(name))) {
                return true
            }
        };
        false
    };

    public shared ({ caller }) func registerStudent(userName : Text, team : Text, cliPrincipal : Text) : async Result.Result<Student, Text> {
        let name = U.trim(U.lowerCase(userName));
        let teamName = U.trim(U.lowerCase(team));
        let principalId = Principal.toText(caller);

        if (isAnon(caller)) {
            return #err("Anonymous user cannot register")
        };
        if (cliPrincipal == "2vxsx-fae") {
            return #err("Invalid CLI Principal ID, run: dfx identity get-principal")
        };

        //check if student already exists
        if (_isStudent(caller)) {
            return #err("Student already registered")
        };

        if (not _isTeamNameTaken(teamName)) {
            return #err("Team" # teamName # "does not exist")
        };

        if (_isStudentNameTaken(name)) {
            return #err("Name" # name # "is already taken")
        };

        var student = {
            principalId = principalId;
            name = U.trim(U.lowerCase(name));
            teamName = U.trim(U.lowerCase(teamName));
            score = 0;
            strikes = 0;
            rank = "recruit";
            canisterIds = [];
            completedDays = [];
            cliPrincipalId = cliPrincipal;
            bonusPoints = 0;

        };

        if (U.safeGet(principalIdHashMap, principalId, "") == "") {

            // get team id to continue registering by (id, name)

            let registerTeam = await registerTeamMembers([principalId], (teamName));

            if (Result.isOk(registerTeam)) {
                studentTeamHashMap.put(principalId, teamName);
                principalIdHashMap.put(principalId, name);
                principalIdReverseHashMap.put(name, principalId);
                studentScoreHashMap.put(principalId, 0);
                studentCliPrincipalIdHashMap.put(principalId, cliPrincipal);
                bonusPointsHashMap.put(principalId, 0);

                activityHashmap.put(
                    Nat.toText(activityIdCounter),
                    {
                        activityId = Nat.toText(activityIdCounter);
                        activity = name # " has registered for Motoko Bootcamp";
                        specialAnnouncement = "newStudent"
                    },
                );
                activityIdCounter := activityIdCounter + 1;

                return #ok(student)
            } else if (Result.isErr(registerTeam)) {

                return #err("Error registering team")
            } else {
                return #err("Other?")
            };

            #ok(student)
        } else {
            #err("Student already registered")
        }
    };

    //Function needed for the project on Day 4 - Do not delete. See: https://github.com/motoko-bootcamp/motoko-starter/tree/main/days/day-4/project
    public shared func getAllStudentsPrincipal() : async [Principal] {
        var studentsBuffer = Buffer.Buffer<Principal>(principalIdHashMap.size());
        for (student in principalIdHashMap.keys()) {
            studentsBuffer.add(Principal.fromText(student))
        };
        Buffer.toArray(studentsBuffer)
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

        studentRankHashMap.put(principalId, rankArray[score]);
        studentScoreHashMap.put(principalId, score);
        score * 20

    };

    public query func buildStudent(principalId : Text) : async Result.Result<Student, Text> {
        let getScore = generateStudentScore(principalId);
        let score = generateStudentScore(principalId); //considering 5 days TODO double check this

        //100% / 5 = 20

        let rank = rankArray[getScore / 20];

        var name = U.safeGet(principalIdHashMap, principalId, "");
        if (name == "") {
            return #err("User not found")
        };

        var teamName = U.safeGet(studentTeamHashMap, principalId, "");

        var strikes = U.safeGet(studentStrikesHashMap, principalId, 0);

        var canisterIds = U.safeGet(studentCanisterIdHashMap, principalId, [""]);
        var completedDays = U.safeGet(studentCompletedDaysHashMap, principalId, [{ canisterId = ""; day = 0; completed = false; timeStamp : Nat64 = 0 }]);
        var cliPrincipalId = U.safeGet(studentCliPrincipalIdHashMap, principalId, "");
        var bonusPoints = U.safeGet(bonusPointsHashMap, principalId, 0);

        var student = {
            principalId = principalId;
            name = name;
            teamName = teamName;
            score = score;
            strikes = strikes;
            rank = rank;
            canisterIds = canisterIds;
            completedDays = completedDays;
            cliPrincipalId = cliPrincipalId;
            bonusPoints = bonusPoints;

        };

        #ok(student)
    };

    public shared func getStudent(principalId : Text) : async Result.Result<Student, Text> {

        await buildStudent(principalId);

    };

    //consider methods to use a query for frontend speed
    public shared ({ caller }) func getUser() : async Result.Result<Student, Text> {
        let principalId = Principal.toText(caller);

        await buildStudent(principalId)
    };

    //teams

    func _isTeamNameTaken(name : Text) : Bool {
        for (team in teamNameHashMap.vals()) {
            if (U.trim(U.lowerCase(team)) == U.trim(U.lowerCase(name))) {
                return true
            }
        };
        false
    };

    public shared ({ caller }) func adminCreateTeam(teamName : Text) : async Result.Result<Team, Text> {
        if (not isAdmin(caller)) {
            return #err("You are not an admin")
        };

        let name = U.trim(U.lowerCase(teamName));
        let principalId = Principal.toText(caller);

        if (not _isTeamNameTaken(name)) {

            teamNameHashMap.put(name, U.trim(U.lowerCase(name)));
            teamScoreHashMap.put(name, 0);
            teamMembersHashMap.put(name, []);

            let teamName = U.safeGet(teamNameHashMap, name, "");
            let score = U.safeGet(teamScoreHashMap, name, 0);
            let members = U.safeGet(teamMembersHashMap, name, []);

            //activity
            activityHashmap.put(
                Nat.toText(activityIdCounter),
                {
                    activityId = Nat.toText(activityIdCounter);
                    activity = "Welcome new team, " # teamName # ", to Motoko Bootcamp!";
                    specialAnnouncement = "newTeam"
                },

            );
            activityIdCounter := activityIdCounter + 1;
            #ok({
                name = teamName;
                score = score;
                teamMembers = members
            })
        } else {
            #err("Team already exists")
        }
    };

    public shared ({ caller }) func adminDeleteTeam(teamId : Text) : async Result.Result<Text, Text> {
        if (not isAdmin(caller)) {
            return #err("You are not an admin")
        };
        // let principalId = Principal.toText(caller);

        // if (U.safeGet(teamNameHashMap, teamId, "") != "") {

        //     teamNameHashMap.delete(teamId);
        //     #ok("Team " # teamId # "deleted...")
        // } else {
        //     #err("Team does not exist")
        // }
        #err("Func not fully implemented")
    };

    public shared ({ caller }) func adminSyncTeamScores() : async Result.Result<Text, Text> {
        if (not isAdmin(caller)) {
            return #err("Unauthorized")
        };

        for (team in teamNameHashMap.entries()) {
            let teamName = team.0;
            let teamScore = generateTeamScore(teamName);
            teamScoreHashMap.put(teamName, teamScore)
        };

        #ok("Team scores synced")
    };

    func generateTeamScore(teamName : Text) : Nat {
        var teamMembers = U.safeGet(teamMembersHashMap, teamName, []);
        var totalCompletedProjects = 0;
        var projectsRequiredPerStudent = 5;

        if (teamMembers.size() > 0) {
            for (member in teamMembers.vals()) {
                totalCompletedProjects := totalCompletedProjects + Int.abs(U.safeGet(studentScoreHashMap, member, 0))
            };

            let teamProgress = (totalCompletedProjects * 100) / (teamMembers.size() * projectsRequiredPerStudent);

            teamScoreHashMap.put(teamName, teamProgress);
            teamProgress
        } else {
            return 0
        }
    };

    public shared query func buildTeam(teamName : Text) : async Team {

        let updatedScore = generateTeamScore(teamName);
        var teamMembers = U.safeGet(teamMembersHashMap, teamName, []);
        var teamScore = U.safeGet(teamScoreHashMap, teamName, 0);

        Debug.print("team score is " # Nat.toText(teamScore));
        Debug.print("updated score is " # Nat.toText(updatedScore));

        var team = {
            name = U.safeGet(teamNameHashMap, teamName, "");
            teamName = teamName;
            teamMembers = teamMembers;
            score = (updatedScore)
        };

        return (team)
    };

    // Synchronous version of the above.
    func _buildTeam(teamName : Text) : Team {

        let updatedScore = generateTeamScore(teamName);
        var teamMembers = U.safeGet(teamMembersHashMap, teamName, []);
        var teamScore = U.safeGet(teamScoreHashMap, teamName, 0);

        Debug.print("team score is " # Nat.toText(teamScore));
        Debug.print("updated score is " # Nat.toText(updatedScore));

        var team = {
            name = U.safeGet(teamNameHashMap, teamName, "");
            teamName = teamName;
            teamMembers = teamMembers;
            score = (updatedScore)
        };

        return (team)
    };

    public shared func getTeam(teamName : Text) : async Team {

        await buildTeam(teamName)
    };

    public shared func getStudentsFromTeam(teamName : Text) : async Result.Result<[Student], Text> {

        var studentBuffer = Buffer.Buffer<Student>(1);
        var teamMembers = U.safeGet(teamMembersHashMap, teamName, []);
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

    public type StudentList = {
        name : Text;
        rank : Text;
        score : Text;
        bonusPoints : Text

    };

    public shared query func getStudentsForTeamDashboard(teamName : Text) : async Result.Result<[StudentList], Text> {

        var studentBuffer = Buffer.Buffer<StudentList>(1);
        var teamMembers = U.safeGet(teamMembersHashMap, teamName, []);
        for (member in teamMembers.vals()) {
            let studentListItem = {
                name = U.safeGet(principalIdHashMap, member, "");
                score = Nat.toText(generateStudentScore(member));
                rank = U.safeGet(studentRankHashMap, member, "");
                bonusPoints = Nat.toText(U.safeGet(bonusPointsHashMap, member, 0))
            };
            studentBuffer.add(studentListItem)
        };

        #ok(Buffer.toArray(studentBuffer))

    };

    func registerTeamMembers(newTeamMembers : [Text], team : Text) : async Result.Result<Team, Text> {

        if (not _isTeamNameTaken(team)) {
            return #err("Team not found")
        };

        var teamScore = U.safeGet(teamScoreHashMap, team, 0);
        var teamMemberArray = (U.safeGet(teamMembersHashMap, team, []));
        var teamMemberbuffer = Buffer.Buffer<Text>(1);

        for (newMembers in newTeamMembers.vals()) {
            if (U.safeGet(studentTeamHashMap, newMembers, "") != "") {
                return #err("Student already on a team")
            };
            teamMemberbuffer.add(newMembers)
        };

        for (member in teamMemberArray.vals()) {
            for (newMembers in newTeamMembers.vals()) {
                if (member == newMembers) {
                    return #err("Student already on team")
                }
            };
            teamMemberbuffer.add(member)
        };

        teamMembersHashMap.put(team, Buffer.toArray(teamMemberbuffer));
        teamScoreHashMap.put(team, generateTeamScore(team));
        teamNameHashMap.put(team, team);

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
            name = U.safeGet(teamNameHashMap, team, "");
            teamMembers = U.safeGet(teamMembersHashMap, team, []);
            score = teamScore
        })

    };

    //only used on frontend, delivers string as a quickfix to deal with bigints
    public shared query func getAllTeams() : async [TeamString] {

        var teamBuffer = Buffer.Buffer<TeamString>(1);
        for (teamName in teamMembersHashMap.keys()) {

            let team : TeamString = {
                name = U.safeGet(teamNameHashMap, teamName, "");
                teamMembers = U.safeGet(teamMembersHashMap, teamName, []);
                score = Nat.toText(U.safeGet(teamScoreHashMap, teamName, 0))
            };
            if (team.name != "") {
                teamBuffer.add(team)
            }

        };
        return Buffer.toArray(teamBuffer)
    };

    //test suite
    public shared query func isEvenTest(number : Int) : async Bool {
        return number % 2 == 0
    };

    public type TestResult = Test.TestResult;
    // Expand the base type with additional errors.
    public type VerifyProject = TestResult or Result.Result<(), { #NotAController : Text; #NotAStudent : Text; #InvalidDay : Text; #AlreadyCompleted : Text }>;

    public shared ({ caller }) func verifyProject(canisterIdText : Text, day : Nat) : async VerifyProject {

        let canisterId = Principal.fromText(U.trim(canisterIdText));
        // Step 1: Verify that the caller is a registered student
        if (not (_isStudent(caller))) {
            return #err(#NotAStudent("Please login or register"))
        };
        // Step 2: Verify that the caller hasn't already completed the project
        if (_hasStudentCompletedDay(day, caller)) {
            return #err(#AlreadyCompleted("You have already completed this project"))
        };
        // // Step 3: Verify that the caller is the controller of the submitted canister.
        let cliPrincipal = U.safeGet(studentCliPrincipalIdHashMap, Principal.toText(caller), "");

        if (not (await Test.verifyOwnership(canisterId, Principal.fromText(cliPrincipal)))) {
            return #err(#NotAController("You are not the controller of this canister"))
        };
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
    // 5. Update the team members (teamMembersHashMap)
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

        let studentName = U.safeGet(principalIdHashMap, studentId, "");
        studentCompletedDaysHashMap.put(Principal.toText(student), Array.append<DailyProject>(completedDays, [projectCompleted]));
        // Step 2: Generate the new student's score
        ignore generateStudentScore(Principal.toText(student));
        // Step 3: Update the activity feed & the activity counter
        activityHashmap.put(
            Nat.toText(activityIdCounter),
            {
                activityId = Nat.toText(activityIdCounter);
                activity = studentName # " has completed day " # Nat.toText(day) # " of the competition!";
                specialAnnouncement = "ProjectCompleted"
            },
        );
        activityIdCounter := activityIdCounter + 1;
        // Step 4: Update the team score
        let team = _buildTeam(U.safeGet(studentTeamHashMap, studentId, ""));
        // Step 5: Update the team members
        let teamScore = U.safeGet(teamScoreHashMap, team.name, 0);
        teamScoreHashMap.put(team.name, teamScore + 1);
        return
    };

    //activity section

    public shared ({ caller }) func adminSpecialAnnouncement(announcement : Text) : async () {

        if (isAdmin(caller)) {
            activityHashmap.put(
                Nat.toText(activityIdCounter),
                {
                    activityId = Nat.toText(activityIdCounter);
                    activity = announcement;
                    specialAnnouncement = "Admin"
                },
            );
            activityIdCounter := activityIdCounter + 1
        }
    };

    public shared ({ caller }) func adminAnnounceTimedEvent(announcement : Text) : async () {
        if (isAdmin(caller)) {
            activityHashmap.put(
                Nat.toText(activityIdCounter),
                {
                    activityId = Nat.toText(activityIdCounter);
                    activity = announcement;
                    specialAnnouncement = "AdminTimeEvent"
                },
            );
            activityIdCounter := activityIdCounter + 1
        }
    };

    public shared ({ caller }) func adminGrantBonusPoints(studentPrincipal : Text, reason : Text) : async Result.Result<(), Text> {
        if (isAdmin(caller)) {
            if (not (_isStudent(Principal.fromText(studentPrincipal)))) {
                return #err("The student does not exist")
            };
            let studentName = U.safeGet(principalIdHashMap, studentPrincipal, "");
            let bonusPoints = U.safeGet(bonusPointsHashMap, studentPrincipal, 0) + 1;
            bonusPointsHashMap.put(studentPrincipal, bonusPoints);
            activityHashmap.put(
                Nat.toText(activityIdCounter),
                {
                    activityId = Nat.toText(activityIdCounter);
                    activity = studentName # " has been granted bonus points for " # reason;
                    specialAnnouncement = "BonusPoints"
                },
            );
            activityIdCounter := activityIdCounter + 1;
            return #ok(())
        } else {
            return #err("You are not the admin")
        };

    };

    public shared func getStudentPrincipalByName(studentName : Text) : async Result.Result<Text, Text> {
        let nameTrimmed = U.trim(U.lowerCase(studentName));
        let studentPrincipal = U.safeGet(principalIdReverseHashMap, nameTrimmed, "");

        if (studentPrincipal == "") {
            return #err("The student does not exist")
        } else {
            return #ok(studentPrincipal)
        }

    };

    public shared func principalReverseMigration() : async () {
        for (student in principalIdHashMap.keys()) {
            principalIdReverseHashMap.put(U.safeGet(principalIdHashMap, student, ""), student)
        }
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

    public shared query func getActivityFeed() : async [Activity] {
        var activityBuffer = Buffer.Buffer<Activity>(1);
        var lowerBound : Int = activityIdCounter - 50;
        var upperBound : Int = activityIdCounter;

        if (lowerBound < 50) {
            lowerBound := 0
        };

        for (activity in activityHashmap.vals()) {
            if (U.textToNat(activity.activityId) >= lowerBound and U.textToNat(activity.activityId) <= upperBound) {
                activityBuffer.add(activity)
            }
        };

        return Array.reverse(Buffer.toArray(activityBuffer))
    };
    //metrics section
    // TODO in the metrics section, these are computed on the fly. we can definitely add caching later.

    public shared query func getTotalStudents() : async Text {
        return Nat.toText(principalIdHashMap.size())
    };

    public shared query func getTotalTeams() : async Text {
        return Nat.toText(teamNameHashMap.size())
    };

    public shared query func getTotalProjectsCompleted() : async Text {
        //todo return the data per student for a heat map
        var days = 0;

        for (studentId in studentCompletedDaysHashMap.keys()) {
            let completedDays = U.safeGet(studentCompletedDaysHashMap, studentId, []);
            if (Array.size(completedDays) > 0) {
                days := days + Array.size(completedDays)
            }
        };
        return Nat.toText(days)
    };

    public shared query func getTotalCompletedPerDay() : async DailyTotalMetrics {
        var day1 = 0;
        var day2 = 0;
        var day3 = 0;
        var day4 = 0;
        var day5 = 0;

        for (studentId in studentCompletedDaysHashMap.keys()) {
            let completedDays = U.safeGet(studentCompletedDaysHashMap, studentId, []);
            for (day in completedDays.vals()) {
                switch (day.day) {
                    case (1) { day1 := day1 + 1 };
                    case (2) { day2 := day2 + 1 };
                    case (3) { day3 := day3 + 1 };
                    case (4) { day4 := day4 + 1 };
                    case (5) { day5 := day5 + 1 };
                    case (_) {}
                }
            }
        };
        return {
            day1 = Nat.toText(day1);
            day2 = Nat.toText(day2);
            day3 = Nat.toText(day3);
            day4 = Nat.toText(day4);
            day5 = Nat.toText(day5)
        }
    };

    //help ticket section
    public shared ({ caller }) func studentCreateHelpTicket(description : Text, githubUrl : Text, canisterId : Text, day : Text) : async Result.Result<HelpTicket, Text> {

        if (not (_isStudent(caller))) {
            return #err("Please login or register")
        };

        var helpTicket = {
            helpTicketId = Nat.toText(helpTicketIdCounter);
            principalId = Principal.toText(caller);
            description = description;
            gitHubUrl = githubUrl;
            canisterId = canisterId;
            day = day;
            resolved = false
        };

        helpTicketHashMap.put(Nat.toText(helpTicketIdCounter), helpTicket);
        incHelpTicketIdCounter();

        return #ok(helpTicket)
    };

    public shared query func getHelpTickets() : async [HelpTicket] {
        var helpTicketbuffer = Buffer.Buffer<HelpTicket>(1);
        for (ticket in helpTicketHashMap.vals()) {
            if (ticket.resolved == false) {
                helpTicketbuffer.add(ticket)
            }
        };
        return Buffer.toArray(helpTicketbuffer)
    };

    public shared ({ caller }) func resolveHelpTicket(helpTicketId : Text, manuallyVerifyDay : Bool) : async Result.Result<HelpTicket, Text> {
        if (not isAdmin(caller)) {
            return #err("Please login or register as Admin")
        };

        if (not (_isStudent(caller))) {
            return #err("Please login or register")
        };

        let helpTicket = U.safeGet(
            helpTicketHashMap,
            helpTicketId,
            {
                helpTicketId = "";
                principalId = "";
                description = "";
                gitHubUrl = "";
                canisterId = "";
                day = "";
                resolved = false
            },
        );

        if (helpTicket.resolved) {
            return #err("Help ticket already resolved")
        };

        if (manuallyVerifyDay) {
            _validated(U.textToNat(helpTicket.day), Principal.fromText(helpTicket.canisterId), Principal.fromText(helpTicket.principalId))
        };

        var helpTicketResolved = {
            helpTicketId = helpTicketId;
            principalId = helpTicket.principalId;
            description = helpTicket.description;
            gitHubUrl = helpTicket.gitHubUrl;
            canisterId = helpTicket.canisterId;
            day = helpTicket.day;
            resolved = true
        };
        helpTicketHashMap.put(helpTicketId, helpTicketResolved);

        return #ok(helpTicket)
    };

    //#Upgrade hooks
    system func preupgrade() {

        principalIdEntries := Iter.toArray(principalIdHashMap.entries());
        principalIdReverseEntries := Iter.toArray(principalIdReverseHashMap.entries());
        teamMembersEntries := Iter.toArray(teamMembersHashMap.entries());
        teamScoreEntries := Iter.toArray(teamScoreHashMap.entries());
        teamNameEntries := Iter.toArray(teamNameHashMap.entries());
        studentTeamEntries := Iter.toArray(studentTeamHashMap.entries());
        studentCompletedDaysEntries := Iter.toArray(studentCompletedDaysHashMap.entries());
        studentScoreEntries := Iter.toArray(studentScoreHashMap.entries());
        activityEntries := Iter.toArray(activityHashmap.entries());
        studentStrikesEntries := Iter.toArray(studentStrikesHashMap.entries());
        studentRankEntries := Iter.toArray(studentRankHashMap.entries());
        studentCanisterIdEntries := Iter.toArray(studentCanisterIdHashMap.entries());
        canisterIdEntries := Iter.toArray(canisterIdHashMap.entries());
        studentCliPrincipalIdEntries := Iter.toArray(studentCliPrincipalIdHashMap.entries());
        helpTicketEntries := Iter.toArray(helpTicketHashMap.entries());
        bonusPointsEntries := Iter.toArray(bonusPointsHashMap.entries())

    };

    system func postupgrade() {
        principalIdEntries := [];
        principalIdReverseEntries := [];
        teamMembersEntries := [];
        teamScoreEntries := [];
        teamNameEntries := [];
        studentTeamEntries := [];
        studentCompletedDaysEntries := [];
        studentScoreEntries := [];
        activityEntries := [];
        studentStrikesEntries := [];
        studentRankEntries := [];
        studentCanisterIdEntries := [];
        canisterIdEntries := [];
        studentCliPrincipalIdEntries := [];
        helpTicketEntries := [];
        bonusPointsEntries := []
    };

}
