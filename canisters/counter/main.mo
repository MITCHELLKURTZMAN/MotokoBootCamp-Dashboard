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

    var principalIdHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash);
    var canisterIdHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash);
    var teamHashMap = HashMap.HashMap<Text, Text>(maxHashmapSize, isEq, Text.hash);
    var teamScoreHashMap = HashMap.HashMap<Text, Int>(maxHashmapSize, isEq, Text.hash);
    var studentScoreHashMap = HashMap.HashMap<Text, Int>(maxHashmapSize, isEq, Text.hash);

    stable var teamIdCounter : Nat = 0;

    //types
    public type Student = {
        principalId : Text;
        name : Text;
        canisterId : Text;
        teamId : Text;
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
    public func registerStudent(principalId : Text, name : Text, canisterId : Text) : async Result.Result<Student, Text> {
        var student = {
            principalId = principalId;
            name = name;
            canisterId = canisterId;
            teamId = "";
            score = 0
        };

        if (safeGet(principalIdHashMap, principalId, "") != "") {
            return #err("Principal id already registered")
        };

        if (safeGet(canisterIdHashMap, canisterId, "") != "") {
            return #err("Canister id already registered")
        };

        principalIdHashMap.put(principalId, name);
        canisterIdHashMap.put(canisterId, principalId);
        #ok(student)
    };

    public func registerTeam(p : Text) : async Result.Result<(), Text> {
        //needs to be stored in a buffer and grow with the team with students

        teamIdCounter += 1;
        #ok()
    };

    //test suite
    public func isEven(number : Int) : async Bool {
        return number % 2 == 0
    };

    // A placeholder function for actual project verification
    public func verifyProject(canisterId : Text) : async Bool {
        // Implement your project verification logic here
        // For now, it returns `true` to indicate the project is verified
        return true
    }
}
