// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoterRewardToken is ERC20, ERC20Burnable, Ownable {
    address public electionContractAddress;

    constructor() ERC20("VoterRewardToken", "VRT") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function setElectionContractAddress(address _address) public onlyOwner {
        electionContractAddress = _address;
    }

    function mint(address to, uint256 amount) public {
        require(
            msg.sender == electionContractAddress,
            "Only the election contract can mint tokens"
        );
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
