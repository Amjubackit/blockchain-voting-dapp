const VoterRewardToken = artifacts.require('VoterRewardToken');
const Election = artifacts.require('Election');

module.exports = async function (deployer) {
	await deployer.deploy(VoterRewardToken);
	const voterRewardToken = await VoterRewardToken.deployed();

	await deployer.deploy(Election);
	const election = await Election.deployed();

	await voterRewardToken.setElectionContractAddress(election.address);
	await election.setVoterRewardTokenAddress(voterRewardToken.address);
};
