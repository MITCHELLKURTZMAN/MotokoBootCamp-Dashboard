import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
module {    
    // Parses the controllers from the error returned by canister status when the caller is not the controller
    /// Of the canister it is calling
    // From https://forum.dfinity.org/t/getting-a-canisters-controller-on-chain/7531/17
    public func parseControllersFromCanisterStatusErrorIfCallerNotController(errorMessage : Text) : [Principal] {
        let lines = Iter.toArray(Text.split(errorMessage, #text("\n")));
        let words = Iter.toArray(Text.split(lines[1], #text(" ")));
        var i = 2;
        let controllers = Buffer.Buffer<Principal>(0);
        while (i < words.size()) {
        controllers.add(Principal.fromText(words[i]));
        i += 1;
        };
        Buffer.toArray<Principal>(controllers);
    };

}