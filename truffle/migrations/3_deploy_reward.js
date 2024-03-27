const VoterRewardToken = artifacts.require('VoterRewardToken');

module.exports = function (deployer) {
	deployer.deploy(VoterRewardToken);
};
