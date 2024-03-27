import * as React from 'react';
import { Button, Typography } from '@mui/material';
import CoverLayout from '../components/CoverLayout';
import { useNavigate } from 'react-router-dom';
import bgImage from '../images/gpt-bg-2.png';

export default function CoverPage() {
	const navigate = useNavigate();
	const handleClick = () => {
		console.log('home button clicked');
		navigate('/home');
		window.location.reload();
	};

	return (
		<CoverLayout
			sxBackground={{
				backgroundImage: `url(${bgImage})`,
				backgroundColor: '#000000', // Just Black
				backgroundPosition: 'center',
			}}
		>
			<Typography
				fontWeight="bold"
				align="center"
				variant="h2"
				marked="center"
			>
				Blockchain Voting DApp
			</Typography>
			<br />
			<br />
			<br />
			<Button
				color="primary"
				variant="contained"
				size="large"
				sx={{ minWidth: 170 }}
				onClick={handleClick}
			>
				Connect Wallet
			</Button>
		</CoverLayout>
	);
}
