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
//import IC "mo:base/ExperimentalInternetComputer";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Test "test";
import U "utils";
import Bool "mo:base/Bool";
import IC "ic";
import Cycles "mo:base/ExperimentalCycles";
import Canistergeek "mo:canistergeek/canistergeek";
import Admins "admins";

shared ({ caller = creator }) actor class Dashboard() = this {
    var maxHashmapSize = 1000000;

    stable var principalIdReverseEntries : [(Text, Text)] = [];

    stable var studentsEntries : [(Text, Student)] = [];
    stable var teamsEntries : [(Text, Team)] = [];
    stable var activityEntries : [(Text, Activity)] = [];

    var studentsHashMap : HashMap.HashMap<Text, Student> = HashMap.fromIter<Text, Student>(studentsEntries.vals(), studentsEntries.size(), Text.equal, Text.hash); //the student stored by principal id

    stable var teamIdCounter : Nat = 0;
    var teamsHashMap : HashMap.HashMap<Text, Team> = HashMap.fromIter<Text, Team>(teamsEntries.vals(), teamsEntries.size(), Text.equal, Text.hash); //the team stored by team id

    stable var activityIdCounter : Nat = 0;
    var activityHashMap : HashMap.HashMap<Text, Activity> = HashMap.fromIter<Text, Activity>(activityEntries.vals(), activityEntries.size(), Text.equal, Text.hash); //the activity feed stored by activity id

    ///////////
    // ADMIN //
    ///////////

    stable var master : Principal = creator;

    stable var _AdminsUD : ?Admins.UpgradeData = null;
    let _Admins = Admins.Admins(creator);

    /**
        * Returns a boolean indicating if the specified principal is an admin
        */
    public query func is_admin(p : Principal) : async Bool {
        _Admins.isAdmin(p)
    };

    /**
        * Returns a list of all the admins
        */
    public query func getAdmins() : async Result.Result<[Text], Text> {
        _Monitor.collectMetrics();
        let adminsPrincipals : [Principal] = _Admins.getAdmins();
        let adminsText : [Text] = Array.map<Principal, Text>(adminsPrincipals, Principal.toText);
        return #ok(adminsText)
    };

    /**
        * Adds the specified principal as an admin
        * @auth : admin
        */
    public shared ({ caller }) func registerAdmin(id : Text) : async Result.Result<(), Text> {
        _Admins.addAdmin(Principal.fromText(id), caller);
        _Monitor.collectMetrics();
        _Logs.logMessage("CONFIG :: Added admin : " # id # " by " # Principal.toText(caller));
        return #ok()
    };

    /**
        * Removes the specified principal from the admin list
        * @auth : master
        */
    public shared ({ caller }) func unregisterAdmin(id : Text) : async Result.Result<(), Text> {
        assert (caller == master);
        _Monitor.collectMetrics();
        let p = Principal.fromText(id);
        _Admins.removeAdmin(p, caller);
        _Logs.logMessage("CONFIG :: Removed admin : " # Principal.toText(p) # " by " # Principal.toText(caller));
        return #ok()
    };

    public shared ({ caller }) func adminCreateTeam(teamName : Text, spanish : Bool) : async Result.Result<Team, Text> {
        let name = U.trim(U.lowerCase(teamName));
        if (not _Admins.isAdmin(caller)) {
            return #err("You are not an admin")
        };
        if (_isTeamNameTaken(name)) {
            return #err("Team name is already taken")
        };

        var team : Team = {
            name = U.trim(U.lowerCase(teamName));
            score = 0;
            teamMembers = [];
            spanish
        };
        // Register the team
        teamsHashMap.put(Nat.toText(teamIdCounter), team);
        teamIdCounter := teamIdCounter + 1;

        // Activity feed
        activityHashMap.put(Nat.toText(activityIdCounter), { activityId = Nat.toText(activityIdCounter); activity = "Welcome new team, " # name # ", to Motoko Bootcamp!"; specialAnnouncement = "newTeam" });
        activityIdCounter := activityIdCounter + 1;
        #ok(team)
    };

    public shared ({ caller }) func adminManuallyVerifyStudentDay(day : Text, student : Text) : async Result.Result<(), Text> {
        if (not _Admins.isAdmin(caller)) {
            return #err("Unauthorized to verify student day")
        };

        if (_hasStudentCompletedDay(U.textToNat(day), Principal.fromText(student))) {
            return #err("Student has already completed this project")
        };

        _validated(
            U.textToNat(day),
            Principal.fromActor(this),
            Principal.fromText(student),
        );
        _Logs.logMessage("ADMIN :: Manually verified student day " # day # " for " # student # " by " # Principal.toText(caller));
        return #ok()
    };

    ////////////
    // LOGS ///
    //////////

    stable var _LogsUD : ?Canistergeek.LoggerUpgradeData = null;
    private let _Logs : Canistergeek.Logger = Canistergeek.Logger();

    /**
        * Returns collected log messages based on passed parameters.
        * Called from browser.
        * @auth : admin
        */
    public query ({ caller }) func getCanisterLog(request : ?Canistergeek.CanisterLogRequest) : async ?Canistergeek.CanisterLogResponse {
        assert (_Admins.isAdmin(caller));
        _Logs.getLog(request)
    };

    /**
        * Set the maximum number of saved log messages.
        * @auth : admin
        */
    public shared ({ caller }) func setMaxMessagesCount(n : Nat) : async () {
        assert (_Admins.isAdmin(caller));
        _Logs.setMaxMessagesCount(n)
    };

    //////////////
    // CYCLES  //
    /////////////

    /**
        * Add the cycles attached to the incoming message to the balance of the canister.
        */
    public func acceptCycles() : async () {
        let available = Cycles.available();
        let accepted = Cycles.accept(available);
        assert (accepted == available)
    };

    /**
        * Returns the cycle balance of the canister.
        */
    public query func availableCycles() : async Nat {
        return Cycles.balance()
    };

    ///////////////
    // METRICS ///
    /////////////

    stable var _MonitorUD : ?Canistergeek.UpgradeData = null;
    private let _Monitor : Canistergeek.Monitor = Canistergeek.Monitor();

    /**
        * Returns collected data based on passed parameters.
        * Called from browser.
        * @auth : admin
        */
    public query ({ caller }) func getCanisterMetrics(parameters : Canistergeek.GetMetricsParameters) : async ?Canistergeek.CanisterMetrics {
        assert (_Admins.isAdmin(caller));
        _Monitor.getMetrics(parameters)
    };

    /**
        * Force collecting the data at current time.
        * Called from browser or any canister "update" method.
        * @auth : admin
        */
    public shared ({ caller }) func collectCanisterMetrics() : async () {
        assert (_Admins.isAdmin(caller));
        _Monitor.collectMetrics()
    };

    //types
    public type Student = {
        principalId : Text;
        cliPrincipalId : Text;
        name : Text;
        teamId : Text;
        score : Nat;
        completedDays : [DailyProject]
    };

    public type Team = {
        name : Text;
        score : Nat;
        spanish : Bool;
        teamMembers : [Text]
    };

    public type DailyProject = {
        day : Nat;
        canisterId : Principal;
        timeStamp : Nat64
    };

    public type DailyProjectText = {
        day : Text;
        canisterId : Text;
        timeStamp : Text
    };

    public type DailyTotalMetrics = {
        day1 : Text;
        day2 : Text;
        day3 : Text;
        day4 : Text;
        day5 : Text
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

    //ENDS - ADMINS

    //BEGINS - STUDENTS
    // Returns a boolean indicating whether the given principal has completed the given day.
    // If the principal doesn't correspond to a student, returns false.
    func _hasStudentCompletedDay(day : Nat, p : Principal) : Bool {
        let studentId = Principal.toText(p);
        switch (studentsHashMap.get(studentId)) {
            case (null) { return false };
            case (?student) {
                for (d in student.completedDays.vals()) {
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
        switch (studentsHashMap.get(studentId)) {
            case (null) { return false };
            case (?_) { return true }
        }
    };

    // BEGINS - STUDENTS

    // UTILS
    func _isStudentNameTaken(name : Text) : Bool {
        for (student in studentsHashMap.vals()) {
            if (student.name == U.trim(U.lowerCase(name))) {
                return true
            }
        };
        false
    };

    // Returns the name of the team to assign to a newly registered student (the one with the least member corresponding to the language of the student)
    func _assignTeam(spanish : Bool) : Text {
        var teamId = "";
        var minimum = 100000;
        for ((id, team) in teamsHashMap.entries()) {
            if (team.spanish == spanish) {
                if (team.teamMembers.size() < minimum) {
                    teamId := id;
                    minimum := team.teamMembers.size()
                }
            }
        };
        teamId
    };

    func _addStudentToTeam(studentId : Text, teamId : Text) : () {
        switch (teamsHashMap.get(teamId)) {
            case (null) {
                assert (false);
                return
            };
            case (?team) {
                var newTeam : Team = {
                    teamMembers = Array.append<Text>(team.teamMembers, [studentId]);
                    name = team.name;
                    score = team.score;
                    spanish = team.spanish
                };
                teamsHashMap.put(teamId, newTeam)
            }
        }
    };

    public shared query func isStudent(principal : Text) : async Bool {
        _isStudent(Principal.fromText(principal))
    };

    //Function needed for the project on Day 4 - Do not delete. See: https://github.com/motoko-bootcamp/motoko-starter/tree/main/days/day-4/project
    public shared func getAllStudentsPrincipal() : async [Principal] {
        var studentsBuffer = Buffer.Buffer<Principal>(studentsHashMap.size());
        for (id in studentsHashMap.keys()) {
            studentsBuffer.add(Principal.fromText(id))
        };
        Buffer.toArray(studentsBuffer)
    };

    // public shared ({ caller }) func getStudentCompletedDays() :  async Result.Result<[DailyProjectText], Text> {

    // };

    public shared ({ caller }) func registerStudent(userName : Text, cliPrincipal : Text, spanish : Bool) : async Result.Result<Student, Text> {
        let name = U.trim(U.lowerCase(userName));
        let principalId = Principal.toText(caller);
        let team = _assignTeam(spanish);

        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous user cannot register")
        };
        if (Principal.isAnonymous(Principal.fromText(cliPrincipal))) {
            return #err("Invalid CLI Principal ID, run: dfx identity get-principal")
        };
        if (_isStudent(caller)) {
            return #err("Student already registered")
        };

        if (_isStudentNameTaken(name)) {
            return #err("Name" # name # "is already taken")
        };

        var student : Student = {
            principalId = principalId;
            cliPrincipalId = cliPrincipal;
            name = U.trim(U.lowerCase(name));
            teamId = team;
            score = 0;
            bonusPoints = 0;
            rank = "recruit";
            completedDays = []
        };

        studentsHashMap.put(principalId, student);
        _addStudentToTeam(team, principalId);
        activityHashMap.put(Nat.toText(activityIdCounter), { activityId = Nat.toText(activityIdCounter); activity = name # " has registered for Motoko Bootcamp"; specialAnnouncement = "newStudent" });
        activityIdCounter := activityIdCounter + 1;
        activityHashMap.put(Nat.toText(activityIdCounter), { activityId = Nat.toText(activityIdCounter); activity = "A new team member has joined team " # team; specialAnnouncement = "newTeamMember" });
        activityIdCounter := activityIdCounter + 1;
        return #ok(student)
    };

    // public shared ({ caller }) func getStudentCompletedDays() : async Result.Result<[DailyProjectText], Text> {
    //     let studentId = Principal.toText(caller);
    //     let studentCompletedDays = U.safeGet(studentCompletedDaysHashMap, studentId, []).vals();
    //     let studentCompletedDaysString = Buffer.Buffer<DailyProjectText>(1);
    //     for (d in studentCompletedDays) {
    //         studentCompletedDaysString.add({
    //             day = Nat.toText(d.day);
    //             canisterId = d.canisterId;
    //             completed = Bool.toText(d.completed);
    //             timeStamp = Nat64.toText(d.timeStamp)
    //         })
    //     };
    //     #ok(Buffer.toArray(studentCompletedDaysString))

    // };

    // public shared func getAllStudents() : async Result.Result<[Text], Text> {
    //     var studentsBuffer = Buffer.Buffer<Text>(principalIdHashMap.size());
    //     for (student in principalIdHashMap.keys()) {
    //         studentsBuffer.add(student)
    //     };
    //     #ok(Buffer.toArray(studentsBuffer))
    // };

    public shared func getStudent(principalId : Text) : async Result.Result<Student, Text> {
        switch (studentsHashMap.get(principalId)) {
            case (null) {
                return #err("Student not found")
            };
            case (?student) {
                #ok(student)
            }
        }
    };

    //consider methods to use a query for frontend speed
    public shared ({ caller }) func getUser() : async Result.Result<Student, Text> {
        let principalId = Principal.toText(caller);
        switch (studentsHashMap.get(principalId)) {
            case (null) {
                return #err("Student not found")
            };
            case (?student) {
                #ok(student)
            }
        }
    };

    //teams
    func _getStudentScore(studentId : Text) : Nat {
        switch (studentsHashMap.get(studentId)) {
            case (null) {
                assert (false);
                //Unreachable
                return 0
            };
            case (?student) {
                return student.score
            }
        }
    };

    func _updateTeamScore(teamId : Text) : () {
        switch (teamsHashMap.get(teamId)) {
            case (null) {
                assert (false);
                return
            };
            case (?team) {
                var score = 0;
                for (studentId in team.teamMembers.vals()) {
                    let studentScore = _getStudentScore(studentId);
                    score += studentScore
                };
                let size : Nat = team.teamMembers.size();
                score := Nat.div(score, size);
                teamsHashMap.put(teamId, { team with score = score })
            }
        }
    };

    func _isTeamNameTaken(name : Text) : Bool {
        for (team in teamsHashMap.vals()) {
            if (U.trim(U.lowerCase(team.name)) == U.trim(U.lowerCase(name))) {
                return true
            }
        };
        false
    };

    func _getTeamNameFromId(teamId : Text) : Text {
        switch (teamsHashMap.get(teamId)) {
            case (null) {
                assert (false);
                //Unreachable
                return ""
            };
            case (?team) {
                team.name
            }
        }
    };

    public shared func getTeam(teamName : Text) : async Team {
        switch (teamsHashMap.get(teamName)) {
            case (null) {
                assert (false);
                //Unreachable
                return {
                    name = "";
                    score = 0;
                    spanish = false;
                    teamMembers = []
                }
            };
            case (?team) {
                team
            }
        }
    };

    public shared func getStudentsFromTeam(teamName : Text) : async Result.Result<[Student], Text> {
        for (team in teamsHashMap.vals()) {
            if (U.trim(U.lowerCase(team.name)) == U.trim(U.lowerCase(teamName))) {
                var buffer : Buffer.Buffer<Student> = Buffer.Buffer<Student>(team.teamMembers.size());
                for (studentId in team.teamMembers.vals()) {
                    switch (studentsHashMap.get(studentId)) {
                        case (null) {
                            assert (false);
                            //Unreachable
                            return #err("Student not found")
                        };
                        case (?student) {
                            buffer.add(student)
                        }
                    }
                };
                return #ok(Buffer.toArray(buffer))
            }
        };
        return #err("Team not found")
    };

    public type StudentList = {
        name : Text;
        score : Text
    };

    public shared query func getStudentsForTeamDashboard(teamName : Text) : async Result.Result<[StudentList], Text> {
        var studentBuffer = Buffer.Buffer<StudentList>(studentsHashMap.size());
        for (student in studentsHashMap.vals()) {
            let studentTeamName = _getTeamNameFromId(student.teamId);
            if (studentTeamName == teamName) {
                let studentListItem : StudentList = {
                    name = student.name;
                    score = Nat.toText(student.score)
                };
                studentBuffer.add(studentListItem)
            }
        };

        #ok(Buffer.toArray(studentBuffer))

    };

    //only used on frontend, delivers string as a quickfix to deal with bigints
    public shared query func getAllTeams() : async [TeamString] {
        var teamBuffer = Buffer.Buffer<TeamString>(teamsHashMap.size());
        for (team in teamsHashMap.vals()) {
            let teamString : TeamString = {
                name = team.name;
                teamMembers = team.teamMembers;
                score = Nat.toText(team.score)
            };
            teamBuffer.add(teamString)
        };
        return Buffer.toArray(teamBuffer)
    };

    public type TestResult = Test.TestResult;
    // Expand the base type with additional errors.
    public type VerifyProject = TestResult or Result.Result<(), { #NotAController : Text; #NotAStudent : Text; #InvalidDay : Text; #AlreadyCompleted : Text }>;

    //Utils
    func _getCliPrincipal(caller : Principal) : Principal {
        let studentId = Principal.toText(caller);
        switch (studentsHashMap.get(studentId)) {
            case (null) {
                assert (false);
                //Unreachable
                return Principal.fromText("")
            };
            case (?student) {
                return Principal.fromText(student.cliPrincipalId)
            }
        }
    };

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
        let cliPrincipal = if (not (await Test.verifyOwnership(canisterId, _getCliPrincipal(caller)))) {
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
        switch (studentsHashMap.get(studentId)) {
            case (null) { assert (false); return () };
            case (?student) {
                // Step 1: Add the new completed project to the student's completed projects (studentCompletedDaysHashMap)
                let completedDays = student.completedDays;
                let name = student.name;
                let projectCompleted = {
                    day = day;
                    canisterId;
                    timeStamp = Nat64.fromIntWrap(Time.now())
                };
                let newCompletedDays = Array.append<DailyProject>(completedDays, [projectCompleted]);
                // Step 2: Generate the new student's score
                let score = student.score + 20; // 20 points per completed project
                // Step 3: Update the team score
                _updateTeamScore(student.teamId);
                // Step 4: Update the activity feed & the activity counter
                activityHashMap.put(Nat.toText(activityIdCounter), { activityId = Nat.toText(activityIdCounter); activity = student.name # " has completed day " # Nat.toText(day) # " of the competition!"; specialAnnouncement = "ProjectCompleted" });
                activityIdCounter := activityIdCounter + 1;
                return
            }
        }
    };

    //activity section

    public shared ({ caller }) func adminSpecialAnnouncement(announcement : Text) : async () {
        assert (_Admins.isAdmin(caller));
        activityHashMap.put(
            Nat.toText(activityIdCounter),
            {
                activityId = Nat.toText(activityIdCounter);
                activity = announcement;
                specialAnnouncement = "Admin"
            },
        );
        activityIdCounter := activityIdCounter + 1
    };

    public shared ({ caller }) func adminAnnounceTimedEvent(announcement : Text) : async () {
        assert (_Admins.isAdmin(caller));
        activityHashMap.put(
            Nat.toText(activityIdCounter),
            {
                activityId = Nat.toText(activityIdCounter);
                activity = announcement;
                specialAnnouncement = "AdminTimeEvent"
            },
        );
        activityIdCounter := activityIdCounter + 1
    };

    public shared ({ caller }) func adminGrantBonusPoints(studentId : Text, reason : Text) : async Result.Result<(), Text> {
        assert (_Admins.isAdmin(caller));
        switch (studentsHashMap.get(studentId)) {
            case (null) { return #err("Student not found") };
            case (?student) {
                let score = student.score + 10;
                var newStudent = { student with score = score };
                studentsHashMap.put(studentId, newStudent);
                activityHashMap.put(Nat.toText(activityIdCounter), { activityId = Nat.toText(activityIdCounter); activity = student.name # " has been granted bonus points for " # reason; specialAnnouncement = "BonusPoints" });
                activityIdCounter := activityIdCounter + 1
            }
        };
        return #ok(())
    };

    public shared func getStudentPrincipalByName(studentName : Text) : async Result.Result<Text, Text> {
        let nameTrimmed = U.trim(U.lowerCase(studentName));
        for ((studentId, student) in studentsHashMap.entries()) {
            if (U.trim(U.lowerCase(student.name)) == nameTrimmed) {
                return #ok(studentId)
            }
        };
        return #err("The student does not exist")
    };

    public shared query func getActivity(lowerBound : Nat, upperBound : Nat) : async [Activity] {
        var activityBuffer = Buffer.Buffer<Activity>(1);
        for (activity in activityHashMap.vals()) {
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

        for (activity in activityHashMap.vals()) {
            if (U.textToNat(activity.activityId) >= lowerBound and U.textToNat(activity.activityId) <= upperBound) {
                activityBuffer.add(activity)
            }
        };

        return Array.reverse(Buffer.toArray(activityBuffer))
    };
    //metrics section
    // TODO in the metrics section, these are computed on the fly. we can definitely add caching later.
    public type CanisterId = Principal;
    public type CanisterSettings = {
        controllers : [Principal];
        compute_allocation : Nat;
        memory_allocation : Nat;
        freezing_threshold : Nat
    };

    public type CanisterStatus = {
        status : { #running; #stopping; #stopped };
        settings : CanisterSettings;
        module_hash : ?Blob;
        memory_size : Text;
        cycles : Text;
        idle_cycles_burned_per_day : Text;
        canisterId : Text

    };
    public shared func getCanisterInfo() : async CanisterStatus {

        let managementCanister : IC.ManagementCanister = actor ("aaaaa-aa");
        let canisterId : CanisterId = Principal.fromActor(this);
        let canisterStatus = await managementCanister.canister_status({
            canister_id = canisterId
        });
        return {
            status = canisterStatus.status;
            settings = canisterStatus.settings;
            module_hash = canisterStatus.module_hash;
            memory_size = Nat.toText(canisterStatus.memory_size);
            cycles = Nat.toText(canisterStatus.cycles);
            idle_cycles_burned_per_day = Nat.toText(canisterStatus.idle_cycles_burned_per_day);
            canisterId = Principal.toText(canisterId)
        }

    };

    public shared query func getTotalStudents() : async Text {
        return Nat.toText(studentsHashMap.size())
    };

    public shared query func getTotalTeams() : async Text {
        return Nat.toText(teamsHashMap.size())
    };

    public shared query func getTotalProjectsCompleted() : async Text {
        //todo return the data per student for a heat map
        var days = 0;

        for (student in studentsHashMap.vals()) {
            let completedDays = student.completedDays;
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

        for (student in studentsHashMap.vals()) {
            let completedDays = student.completedDays;
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

    //#Upgrade hooks
    system func preupgrade() {
        studentsEntries := Iter.toArray(studentsHashMap.entries());
        teamsEntries := Iter.toArray(teamsHashMap.entries());
        activityEntries := Iter.toArray(activityHashMap.entries())
    };

    system func postupgrade() {
        studentsEntries := [];
        teamsEntries := [];
        activityEntries := []
    };

}
