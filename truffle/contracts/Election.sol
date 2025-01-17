// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./VoterRewardToken.sol";

contract Election {
    enum State {
        NotStarted,
        InProgress,
        Ended
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    address public owner;
    State public electionState;
    uint256 public startTime;
    uint256 public duration; // Duration of the election in minutes

    mapping(uint256 => Candidate) candidates;
    mapping(address => bool) voted;

    uint256 public candidatesCount = 0;
    uint256 public votersCount = 0;

    constructor() {
        owner = msg.sender;
        electionState = State.NotStarted;
    }

    event Voted(uint256 indexed _candidateId);
    event CandidateAdded();
    event ElectionStateChanged();

    VoterRewardToken public voterRewardToken;

    function setVoterRewardTokenAddress(address _tokenAddress) public {
        require(msg.sender == owner, "Only owner can set token address");
        voterRewardToken = VoterRewardToken(_tokenAddress);
    }

    function getVoterRewardTokenAddress() public view returns (address) {
        return address(voterRewardToken);
    }

    modifier isVotingAllowed() {
        require(
            electionState == State.InProgress &&
                block.timestamp >= startTime &&
                block.timestamp <= startTime + duration,
            "Elections has ended"
        );
        _;
    }

    function startElection(uint256 _duration) public {
        require(msg.sender == owner);
        require(electionState == State.NotStarted);
        electionState = State.InProgress;
        startTime = block.timestamp;
        duration = _duration * 60;
        emit ElectionStateChanged();
    }

    function endElection() public {
        require(msg.sender == owner);
        require(electionState == State.InProgress);
        electionState = State.Ended;
        emit ElectionStateChanged();
    }

    function addCandidate(string memory _name) public {
        require(owner == msg.sender, "Only owner can add candidates");
        require(
            electionState == State.NotStarted,
            "Elections has already started"
        );

        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
        emit CandidateAdded();
    }

    function getElectionState() public view returns (State) {
        return electionState;
    }

    function getRole(address _current) public view returns (uint256) {
        if (owner == _current) {
            return 1;
        } else {
            return 2;
        }
    }

    function vote(uint256 _candidateId) public isVotingAllowed {
        require(!voted[msg.sender], "You have already voted");
        require(
            _candidateId >= 0 && _candidateId < candidatesCount,
            "Invalid candidate ID"
        );

        candidates[_candidateId].voteCount++;
        voted[msg.sender] = true;

        voterRewardToken.mint(msg.sender, 1000);

        emit Voted(_candidateId);
    }

    function getCandidateDetails(
        uint256 _candidateId
    ) public view returns (string memory, uint256) {
        require(
            _candidateId >= 0 && _candidateId < candidatesCount,
            "Invalid candidate ID"
        );
        return (
            candidates[_candidateId].name,
            candidates[_candidateId].voteCount
        );
    }
}
