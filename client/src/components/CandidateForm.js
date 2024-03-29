import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';

export default function CandidateForm({ contract, web3, currentAccount }) {
	const [name, setName] = useState('');

	const handleForm = async (event) => {
		event.preventDefault();
		try {
			await contract.methods
				.addCandidate(name)
				.send({ from: currentAccount });
			console.log('candidate added');
		} catch (error) {
			console.log(error);
		}
		setName('');
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	return (
		<Stack spacing={2} marginRight={5}>
			<TextField
				id="outlined-basic"
				label="Candidate Name"
				variant="outlined"
				value={name}
				onChange={handleNameChange}
			/>
			<Button variant="contained" onClick={handleForm} disabled={!name}>
				Add Candidates
			</Button>
		</Stack>
	);
}
