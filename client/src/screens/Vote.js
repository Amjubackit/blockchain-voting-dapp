import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { ElectionStateEnum } from '../utils/enums';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Candidate from '../components/CandidateCard';

export default function Vote({ contract, currentAccount }) {
	const [candidates, setCandidates] = useState([]);
	const [vote, setVote] = useState(null);
	const [electionState, setElectionState] = useState(0);

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
		}
	};

	const getElectionState = async () => {
		if (contract) {
			const state = await contract.methods.getElectionState().call();
			setElectionState(parseInt(state));
		}
	};

	const voteCandidate = async (candidate) => {
		try {
			if (contract) {
				await contract.methods
					.vote(candidate)
					.send({ from: currentAccount });
				getCandidates();
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleVoteChange = (event) => {
		setVote(event.target.value);
	};

	const handleVote = (event) => {
		event.preventDefault();
		voteCandidate(vote);
	};

	useEffect(() => {
		getCandidates();
		getElectionState();
		if (contract) {
			const candidateChangedListener = contract.events
				.CandidateAdded()
				.on('data', () => {
					getCandidates();
				});
			const stateChangedListener = contract.events
				.ElectionStateChanged()
				.on('data', () => {
					getElectionState();
				});
			return () => {
				candidateChangedListener.unsubscribe();
				stateChangedListener.unsubscribe();
			};
		}
	}, [contract]);

	return (
		<Box>
			<form onSubmit={handleVote}>
				<Grid
					container
					sx={{ mt: 0 }}
					spacing={6}
					justifyContent="center"
				>
					<Grid item xs={12}>
						<Typography marginTop={2} align="center" variant="h6">
							{electionState === ElectionStateEnum.NOT_STARTED &&
								'WAIT FOR ELECTION TO START'}
							{electionState === ElectionStateEnum.IN_PROGRESS &&
								'VOTE FOR YOUR FAVORITE CANDIDATE'}
							{electionState === ElectionStateEnum.ENDED &&
								'ELECTION ENDED'}
						</Typography>
						<Divider />
					</Grid>
					{electionState === 1 && (
						<>
							<Grid item xs={12}>
								<FormControl>
									<RadioGroup
										row
										sx={{
											overflowY: 'hidden',
											overflowX: 'auto',
											display: 'flex',
											width: '98vw',
											justifyContent: 'center',
										}}
										value={vote}
										onChange={handleVoteChange}
									>
										{candidates.map((candidate, index) => (
											<FormControlLabel
												key={index}
												labelPlacement="top"
												control={<Radio />}
												value={index}
												label={
													<Candidate
														id={index}
														name={candidate.name}
													/>
												}
											/>
										))}
									</RadioGroup>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<div style={{ margin: 20 }}>
									<Button
										type="submit"
										variant="contained"
										sx={{ width: '100%' }}
									>
										Vote
									</Button>
								</div>
							</Grid>
						</>
					)}

					{electionState === 2 && (
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
							{candidates &&
								candidates.map((candidate, index) => (
									<Box sx={{ mx: 2 }} key={index}>
										<Candidate
											id={index}
											name={candidate.name}
											voteCount={candidate.votes}
										/>
									</Box>
								))}
						</Grid>
					)}
				</Grid>
			</form>
		</Box>
	);
}
