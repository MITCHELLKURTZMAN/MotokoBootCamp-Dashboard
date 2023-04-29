import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Float "mo:base/Float";
import Error "mo:base/Error";
import IC "ic";
import Utils "utils";
import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Time "mo:base/Time";
import Prelude "mo:base/Prelude";
module Test {
    // Assumptions during tests
    // No other actor/user is calling the canister and modifying the state

    // BEGIN - General
    public type TestResult = Result.Result<(), TestError>;
    public type TestError = {
        #UnexpectedError : Text;
        #UnexpectedValue : Text;
        #NotAController : Text;
        #AlreadyCompleted : Text;
        #NotImplemented : Text; // TODO
    };

    // Check if p is among the controllers of the canister with canisterId
    public func verifyOwnership(canisterId : Principal, p : Principal) : async Bool {
        let managementCanister : IC.ManagementCanister = actor ("aaaaa-aa");
        try {
            let statusCanister = await managementCanister.canister_status({
                canister_id = canisterId
            });
            let controllers = statusCanister.settings.controllers;
            let controllers_text = Array.map<Principal, Text>(controllers, func x = Principal.toText(x));
            switch (Array.find<Principal>(controllers, func x = p == x)) {
                case (?_) { return true };
                case null { return false }
            }
        } catch (e) {
            let message = Error.message(e);
            let controllers = Utils.parseControllersFromCanisterStatusErrorIfCallerNotController(message);
            let controllers_text = Array.map<Principal, Text>(controllers, func x = Principal.toText(x));
            switch (Array.find<Principal>(controllers, func x = p == x)) {
                case (?_) { return true };
                case null { return false }
            }
        }
    };

    // END - General

    // BEGIN - Day 1
    public type day1Interface = actor {
        add : shared (x : Float) -> async Float;
        sub : shared (x : Float) -> async Float;
        mul : shared (x : Float) -> async Float;
        div : shared (x : Float) -> async Float;
        reset : shared () -> async ();
        see : shared query () -> async Float;
        power : shared (x : Float) -> async Float;
        sqrt : shared () -> async Float;
        floor : shared () -> async Int
    };

    public func verifyDay1(canisterId : Principal) : async TestResult {
        let day1Actor : day1Interface = actor (Principal.toText(canisterId));
        try {
            ignore day1Actor.reset(); // State : 0
            ignore day1Actor.add(2.0); // State : 2.0
            ignore day1Actor.power(2.0); // State : 4.0
            ignore day1Actor.sub(1.0); // State : 3.0
            ignore day1Actor.mul(2.0); // State : 6.0
            ignore day1Actor.div(2.0); // State : 3.0
            let result = await day1Actor.see(); // State : 3.0

            if (result == 3) {
                return #ok()
            } else {
                return #err(#UnexpectedValue("Expected 3, got " # Float.toText(result)))
            }
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)))
        }
    };

    // END - Day 1

    // BEGIN - Day 2
    public type Time = Time.Time;
    public type Homework = {
        title : Text;
        description : Text;
        dueDate : Time;
        completed : Bool;
    };
    public type day2Interface = actor {
        addHomework: shared (homework: Homework) -> async Nat;
        getHomework: shared query (id: Nat) -> async Result.Result<Homework, Text>;
        updateHomework: shared (id: Nat, homework: Homework) -> async Result.Result<(), Text>;
        markAsCompleted: shared (id: Nat) -> async Result.Result<(), Text>;
        deleteHomework: shared (id: Nat) -> async Result.Result<(), Text>;
        getAllHomework: shared query () -> async [Homework];
        getPendingHomework: shared query () -> async [Homework];
        searchHomework: shared query (searchTerm: Text) -> async [Homework];
    };
    
    public func verifyDay2(canisterId : Principal) : async TestResult {
        let day2Actor : day2Interface = actor (Principal.toText(canisterId));
         try {
            let homeworkTest : Homework = {
                title = "Test";
                description = "Test";
                dueDate = Time.now();
                completed = false;
            };
            let id = await day2Actor.addHomework(homeworkTest); // State : 0
            ignore day2Actor.markAsCompleted(id); 
            switch(await day2Actor.getHomework(id)){
                case (#ok(homework)) {
                    if (homework.completed == true and homework.title == "Test" and homework.description == "Test") {
                        return #ok()
                    } else {
                        return #err(#UnexpectedValue("Homework doesn't corresponds with test"));
                    }
                };
                case (#err(message)) { return #err(#UnexpectedError("Homework not found")) }
            };
        } catch (e) {
            return #err(#UnexpectedError(Error.message(e)))
        }
    };
    // END - Day 2

    // BEGIN - Day 3
    public func verifyDay3(canisterId : Principal) : async TestResult {
        return #ok()
    };
    // END - Day 3

    // BEGIN - Day 4
    public func verifyDay4(canisterId : Principal) : async TestResult {
        return #ok()
    };
    // END - Day 4

    // BEGIN - Day 5
    public func verifyDay5(canisterId : Principal) : async TestResult {
        return #ok() //testing
    };
    // END - Day 5

}
