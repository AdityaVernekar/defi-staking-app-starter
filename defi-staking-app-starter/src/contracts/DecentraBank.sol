pragma solidity >=0.5.0 <0.9.0;

contract DecentraBank {
    string public name = "DecentraBank";
    address public owner;

    constructor() public {
        owner = msg.sender;
    }
}
