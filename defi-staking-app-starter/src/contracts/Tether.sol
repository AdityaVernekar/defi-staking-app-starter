// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract Tether {
    string public name = "Tether";
    string public symbol = "mUSDT";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8 public decimals = 18;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= value, "Insufficient Balance");
        balanceOf[msg.sender] -= value;
        balanceOf[_to] += value;
        emit Transfer(msg.sender, _to, value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 value
    ) public returns (bool success) {
        require(value <= balanceOf[_from]);
        require(value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= value;
        balanceOf[_to] += value;
        allowance[msg.sender][_from] -= value;
        emit Transfer(_from, _to, value);
        return true;
    }

    function approve(address _spender, uint256 value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = value;
        emit Approval(msg.sender, _spender, value);
        return true;
    }
}
