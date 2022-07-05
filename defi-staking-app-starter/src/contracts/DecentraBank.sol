pragma solidity >=0.5.0 <0.9.0;

import "./Tether.sol";
import "./RWD.sol";

contract DecentraBank {
    string public name = "DecentraBank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint256) public stakingBalances;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    //  staking function
    function depositTokens(uint256 _amount) public {
        require(_amount >= 0, "Amount should be greater than zero");

        tether.transferFrom(msg.sender, address(this), _amount);
        stakingBalances[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // unstake tokens
    function unstakeTokens() public {
        uint256 balance = stakingBalances[msg.sender];
        require(balance > 0, "Balance should be greater than zero");

        tether.transfer(msg.sender, balance);

        stakingBalances[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    // reward tokens
    function issueTokens() public {
        require(msg.sender == owner);

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalances[recipient] / 9;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }
}
