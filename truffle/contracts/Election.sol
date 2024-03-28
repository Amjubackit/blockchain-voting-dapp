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

    function startElection() public {
        require(msg.sender == owner);
        require(electionState == State.NotStarted);
        electionState = State.InProgress;
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

    function vote(uint256 _candidateId) public {
        require(
            electionState == State.InProgress,
            "Election is not in progress"
        );
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
