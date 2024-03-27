import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import Candidate from '../components/CandidateCard';
import CandidateForm from '../components/CandidateForm';

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
				getCandidates(); // Refresh candidates list
			});

		return () => {
			candidateAddedListener.unsubscribe(); // Cleanup listener on component unmount
		};
	}, [contract]);

	const handleEnd = async () => {
		if (electionState === 0) {
			try {
				if (contract) {
					await contract.methods
						.startElection()
						.send({ from: currentAccount });
					getElectionState();
				}
			} catch (error) {
				console.error('Error:', error);
			}
		} else if (electionState === 1) {
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
								{electionState === 0 &&
									'Election has not started.'}
								{electionState === 1 &&
									'Election is in progress.'}
								{electionState === 2 && 'Election has ended.'}
							</Typography>
							<Divider />
						</Grid>
						{electionState !== 2 && (
							<Grid item xs={12} sx={{ display: 'flex' }}>
								<Button
									variant="contained"
									sx={{ width: '40%', margin: 'auto' }}
									onClick={handleEnd}
								>
									{electionState === 0 && 'Start Election'}
									{electionState === 1 && 'End Election'}
								</Button>
							</Grid>
						)}

						<Grid item xs={12}>
							<Typography align="center" variant="h6">
								{electionState === 1 && 'LIVE RESULTS'}
								{electionState === 2 && 'FINAL RESULT'}
							</Typography>
							<Divider />
						</Grid>

						{electionState === 0 && (
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
								>
									<CandidateForm
										contract={contract}
										web3={web3}
										currentAccount={currentAccount}
									/>
								</Box>
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
