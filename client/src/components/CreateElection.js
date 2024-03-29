import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Candidate from '../components/CandidateCard';
import CandidateForm from '../components/CandidateForm';

export default function CreateElection({ contract, web3, currentAccount }) {
	const [startCountdown, setStartCountdown] = useState(5);
	const [duration, setDuration] = useState(5);
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
		}
	};

	const handleCountdownChange = (event) => {
		setStartCountdown(event.target.value.replace(/[^0-9]/g, ''));
	};

	const handleDurationChange = (event) => {
		setDuration(event.target.value.replace(/[^0-9]/g, ''));
	};

	const handleElectionCreated = async () => {
		const electionCreatedEvent = new CustomEvent('electionCreated', {
			detail: {
				duration: duration,
				startCountdown: startCountdown,
			},
		});
		window.dispatchEvent(electionCreatedEvent);
	};

	useEffect(() => {
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

	return (
		<Box sx={{ flexGrow: 2, marginTop: 4 }}>
			<Grid container spacing={2} justifyContent="center">
				{/* Create Election Stack */}
				<Grid item xs={12} sm={8}>
					<Stack spacing={2}>
						<TextField
							fullWidth
							id="start-countdown"
							label="Election Start Countdown (seconds)"
							variant="outlined"
							value={startCountdown}
							onChange={handleCountdownChange}
							type="text"
							InputProps={{
								inputMode: 'numeric',
								pattern: '[0-9]*',
							}}
						/>
						<TextField
							fullWidth
							id="duration"
							label="Election Duration (seconds)"
							variant="outlined"
							value={duration}
							onChange={handleDurationChange}
							type="text"
							InputProps={{
								inputMode: 'numeric',
								pattern: '[0-9]*',
							}}
						/>
						<Button
							variant="contained"
							onClick={handleElectionCreated}
						>
							Create Election
						</Button>
					</Stack>
				</Grid>

				<Grid item xs={12} sm={5}>
					<CandidateForm
						contract={contract}
						web3={web3}
						currentAccount={currentAccount}
					/>
				</Grid>
			</Grid>
			<Divider />
			{/* Candidates Cards */}
			<Box
				sx={{
					overflowY: 'hidden',
					overflowX: 'auto',
					display: 'flex',
					width: '100%',
					justifyContent: 'center',
					marginTop: 6,
				}}
			>
				{candidates.map((candidate, index) => (
					<Box sx={{ mx: 2 }} key={index}>
						<Candidate
							name={candidate.name}
							voteCount={candidate.votes}
						/>
					</Box>
				))}
			</Box>
		</Box>
	);
}
