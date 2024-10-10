// SPDX-License-Identifier: MIT

pragma solidity >0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Web3DevToken is ERC20 {
    uint256 inviteAmount = 1 * 10 ** decimals();
    uint256 constant MAX_INVITES = 3;

    mapping(address => uint256) private inviteCount;

    constructor() ERC20("Web3DevToken", "W3DT") {
        _mint(msg.sender, inviteAmount);
    }

    function invite(address to) public {
        require(balanceOf(msg.sender) > 0, "You are not invited");
        require(msg.sender != to, "You can't invite yourself");
        require(inviteCount[msg.sender] < MAX_INVITES, "You can't invite more than 3 people");
        require(balanceOf(to) >= inviteAmount, "Address alreayd invited");

        _mint(to, inviteAmount);
        inviteCount[msg.sender]++;
    }

    function getInviteCount(address account) public view returns (uint256) {
        return inviteCount[account];
    }

    function transfer(address, uint256) public pure override returns (bool) {
        revert("Transfers are disabled");
    }
}