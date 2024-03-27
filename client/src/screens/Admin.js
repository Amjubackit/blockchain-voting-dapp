import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { ElectionStateEnum } from '../utils/enums';
import Candidate from '../components/CandidateCard';
import CandidateForm from '../components/CandidateForm';
import StartElection from '../components/StartElection';

export default function Admin({ role, contract, web3, currentAccount }) {
	const [electionState, setElectionState] = useState(0);
	const [loading, setLoading] = useState(true);
	const [candidates, setCandidates] = useState([]);

	const getCandidates = async () => {
		if (contract) {
			const count = await contract.methods.candidatesCount().call();
			const temp = [];
			for (let i = 0; i < count; i++) {
				const candidate = await contract.methods
					.getCandidateDetails(i)
					.call();
				temp.push({ name: candidate[0], votes: candidate[1] });
			}
			setCandidates(temp);
			setLoading(false);
		}
	};

	const getElectionState = async () => {
		if (contract) {
			const state = await contract.methods.electionState().call();
			setElectionState(parseInt(state));
		}
	};

	useEffect(() => {
		getElectionState();
		getCandidates();
		const candidateAddedListener = contract.events
			.CandidateAdded()
			.on('data', (event) => {
				getCandidates();
			});

		return () => {
			candidateAddedListener.unsubscribe();
		};
	}, [contract]);

	const handleEnd = async () => {
		try {
			if (contract) {
				await contract.methods
					.endElection()
					.send({ from: currentAccount });
				getElectionState();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<Box>
			{loading ? (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '80vh',
					}}
				>
					Loading...
				</Box>
			) : (
				<Box>
					<Grid container sx={{ mt: 0 }} spacing={4}>
						<Grid item xs={12}>
							<Typography
								align="center"
								variant="h6"
								color="textSecondary"
							>
								ELECTION STATUS :{' '}
								{electionState ===
									ElectionStateEnum.NOT_STARTED &&
									'Election has not started.'}
								{electionState ===
									ElectionStateEnum.IN_PROGRESS &&
									'Election is in progress.'}
								{electionState === ElectionStateEnum.ENDED &&
									'Election has ended.'}
							</Typography>
							<Divider />
						</Grid>
						{electionState === ElectionStateEnum.NOT_STARTED && (
							<Grid item xs={12} sx={{ display: 'flex' }}>
								<StartElection
									contract={contract}
									currentAccount={currentAccount}
								/>
								<CandidateForm
									contract={contract}
									web3={web3}
									currentAccount={currentAccount}
								/>
							</Grid>
						)}
						{electionState === ElectionStateEnum.IN_PROGRESS && (
							<Button
								variant="contained"
								type="submit"
								sx={{ width: '30%', margin: 'auto' }}
								onClick={handleEnd}
							>
								End election
							</Button>
						)}

						<Grid item xs={12}>
							<Typography align="center" variant="h6">
								{electionState === 1 && 'LIVE RESULTS'}
								{electionState === 2 && 'FINAL RESULT'}
							</Typography>
							<Divider />
						</Grid>

						{electionState === ElectionStateEnum.NOT_STARTED && (
							<Grid
								item
								xs={12}
								sx={{
									overflowY: 'hidden',
									overflowX: 'auto',
									display: 'flex',
									width: '98vw',
									justifyContent: 'center',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										width: '100%',
										alignItems: 'center',
									}}
								></Box>
							</Grid>
						)}

						{
							<Grid
								item
								xs={12}
								sx={{
									overflowY: 'hidden',
									overflowX: 'auto',
									display: 'flex',
									width: '98vw',
									justifyContent: 'center',
								}}
							>
								{candidates.map((candidate, index) => (
									<Box sx={{ mx: 2 }} key={index}>
										<Candidate
											id={index}
											name={candidate.name}
											voteCount={candidate.votes}
										/>
									</Box>
								))}
							</Grid>
						}
					</Grid>
				</Box>
			)}
		</Box>
	);
}
