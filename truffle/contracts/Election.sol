// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
    event ElectionStateChanged(State newState);

    modifier isVotingAllowed() {
        require(
            electionState == State.InProgress &&
                block.timestamp >= startTime &&
                block.timestamp <= startTime + duration,
            "Election has ended"
        );
        _;
    }

    function startElection(uint256 _duration) public {
        require(msg.sender == owner);
        require(electionState == State.NotStarted);
        electionState = State.InProgress;
        startTime = block.timestamp;
        duration = _duration * 60;
        emit ElectionStateChanged(electionState);
    }

    function endElection() public {
        require(msg.sender == owner);
        require(electionState == State.InProgress);
        electionState = State.Ended;
        emit ElectionStateChanged(electionState);
    }

    function addCandidate(string memory _name) public {
        require(owner == msg.sender, "Only owner can add candidates");
        require(
            electionState == State.NotStarted,
            "Election has already started"
        );

        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
        emit CandidateAdded();
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
