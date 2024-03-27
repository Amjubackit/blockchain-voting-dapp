import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';

export default function StartElection({ contract, currentAccount }) {
	const [startCooldown, setStartCooldown] = useState('');
	const [duration, setDuration] = useState('');

	const handleCooldownChange = (event) => {
		setStartCooldown(event.target.value.replace(/[^0-9]/g, ''));
	};

	const handleDurationChange = (event) => {
		setDuration(event.target.value.replace(/[^0-9]/g, ''));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log('Election settings updated:', { startCooldown, duration });
		try {
			if (contract) {
				await contract.methods
					.startElection()
					.send({ from: currentAccount });
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	return (
		<Box
			component="form"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				padding: '1rem',
				width: '40%',
			}}
			noValidate
			autoComplete="off"
			onSubmit={handleSubmit}
		>
			<Stack spacing={2}>
				<TextField
					id="start-cooldown"
					label="Election Start Cooldown (minutes)"
					variant="outlined"
					value={startCooldown}
					onChange={handleCooldownChange}
					type="text" // Using type="text" with replace logic to avoid default number input behavior
					InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Ensures mobile keyboards are numeric
				/>
				<TextField
					id="duration"
					label="Election Duration (minutes)"
					variant="outlined"
					value={duration}
					onChange={handleDurationChange}
					type="text" // Using type="text" with replace logic to avoid default number input behavior
					InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Ensures mobile keyboards are numeric
				/>
				<Button variant="contained" type="submit">
					Start election
				</Button>
			</Stack>
		</Box>
	);
}
