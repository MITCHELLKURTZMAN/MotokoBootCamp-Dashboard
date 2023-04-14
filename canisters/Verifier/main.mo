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

//todo:
//Register/store principal ids of students
//create a unique id for teams and a way to register students to teams
//collect canister ids of students completed work to be checked

//The verifier can check students work with interface from projects and the corresponding canister id
//If the project is accepted the score of the student is updated and the score of his team.

//The students will need to ensure functions are name exactly as the verifier expects
//this way we can pass the canisterId and the project name to the verifier and it will check the project

//we need timestamps because all projects could technically finish and achieve the same score.

actor verifier {

    var maxHashmapSize = 1000000;
    func isEq(x : Text, y : Text) : Bool { x == y };

    var principalIdHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash); //the name of the student stored by principal id

    var teamHashMap = HashMap.HashMap<Text, [Text]>(maxHashmapSize, isEq, Text.hash); //the students on the team stored by team id in an array
    var teamScoreHashMap = HashMap.HashMap<Text, Int>(maxHashmapSize, isEq, Text.hash); //the score of the team stored by team id
    var studentScoreHashMap = HashMap.HashMap<Text, Int>(maxHashmapSize, isEq, Text.hash); //the score of the student
    var studentTeamHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash); //the team the student is on
    var studentStrikesHashMap = HashMap.HashMap<Text, Int>(maxHashmapSize, isEq, Text.hash); //a way to detect if a student is cheating

    //canister may be unnecessary, because we can just check controller == student, may also explore assigning students 1 canister so we can verify in a secure way
    var studentCanisterHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash);
    var canisterIdHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash);

    stable var teamIdCounter : Nat = 0;

    //types
    public type Student = {
        principalId : Text;
        name : Text;
        teamId : Text;
        score : Int;
        strikes : Int; //will use this if a student attempts to submit someone elses canister
    };

    public type Team = {
        teamId : Text;
        teamMembers : [Text];
        score : Int
    };

    //utils
    func safeGet<K, V>(hashMap : HashMap.HashMap<K, V>, key : K, defaultValue : V) : V {
        switch (hashMap.get(key)) {
            case null defaultValue;
            case (?value) value
        }
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

        #ok()
    };

    public shared ({ caller }) func unregisterAdmin(id : Text) : async Result.Result<(), Text> {

        if (not isAdmin(caller)) {
            return #err("Unauthorized to unregister admin")
        };
        admins := List.filter<Text>(admins, func(val : Text) : Bool { val != id });
        #ok()
    };

    //registration
    public shared ({ caller }) func registerStudent(name : Text) : async Result.Result<Student, Text> {

        let principalId = Principal.toText(caller);

        var student = {
            principalId = principalId;
            name = name;
            teamId = "";
            score = 0;
            strikes = 0
        };

        if (safeGet(principalIdHashMap, principalId, "") != "") {
            return #err("Principal id already registered")
        };

        principalIdHashMap.put(principalId, name);
        studentScoreHashMap.put(principalId, 0);

        #ok(student)
    };

    public func buildStudent(principalId : Text) : async Result.Result<Student, Text> {
        var name = safeGet(principalIdHashMap, principalId, "");
        if (name == "") {
            return #err("Principal id not registered")
        };

        var teamId = safeGet(studentTeamHashMap, principalId, "");
        var score = safeGet(studentScoreHashMap, principalId, 0);
        var strikes = safeGet(studentStrikesHashMap, principalId, 0);

        var student = {
            principalId = principalId;
            name = name;
            teamId = teamId;
            score = score;
            strikes = strikes
        };

        #ok(student)
    };

    public func registerTeamMembers(newTeamMembers : [Text], createNewTeam : Bool, team : Text) : async Result.Result<Team, Text> {

        //create new team or add to existing team
        if (createNewTeam) {

            teamIdCounter += 1;

            var teamBuffer = Buffer.Buffer<Text>(1);
            for (newMembers in newTeamMembers.vals()) {
                if (safeGet(studentTeamHashMap, newMembers, "") != "") {
                    return #err("Student already on a team")
                };
                teamBuffer.add(newMembers)
            };

            teamHashMap.put(Nat.toText(teamIdCounter), Buffer.toArray(teamBuffer));
            teamScoreHashMap.put(team, 0);

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

            return #ok({
                teamId = team;
                teamMembers = safeGet(teamHashMap, team, []);
                score = teamScore
            })
        }
    };

    //test suite
    public shared func isEvenTest(number : Int) : async Bool {
        return number % 2 == 0
    };

    public type TestResults = {
        day1 : Text;
        day2 : Text;
        day3 : Text;
        day4 : Text;
        day5 : Text
    };

    public func verifyProject(canisterId : Text, day : Nat) : async TestResults {

        //qaa6y-5yaaa-aaaaa-aaafa-cai
        let projectActor = actor (canisterId) : actor {
            isEven : (number : Int) -> async Bool
        };

        //day1
        let result : Bool = await projectActor.isEven(2);
        let testCase : Bool = await isEvenTest(2);
        let day1 = if (result == testCase) { "pass" } else { "fail" };

        return {
            day1 = day1;
            day2 = "pass";
            day3 = "pass";
            day4 = "pass";
            day5 = "pass"
        }

    }
}
