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

	const handleSubmit = async () => {
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
				width: '50%',
			}}
			noValidate
			autoComplete="off"
		>
			<Stack spacing={2}>
				<TextField
					id="start-cooldown"
					label="Election Start Cooldown (minutes)"
					variant="outlined"
					value={startCooldown}
					onChange={handleCooldownChange}
					type="text"
					InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
				/>
				<TextField
					id="duration"
					label="Election Duration (minutes)"
					variant="outlined"
					value={duration}
					onChange={handleDurationChange}
					type="text"
					InputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
				/>
				<Button variant="contained" onClick={handleSubmit}>
					Start election
				</Button>
			</Stack>
		</Box>
	);
}
