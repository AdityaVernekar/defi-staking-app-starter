pragma solidity >=0.5.0 <0.9.0;

import "./Tether.sol";
import "./RWD.sol";

contract DecentraBank {
    string public name = "DecentraBank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }
}
