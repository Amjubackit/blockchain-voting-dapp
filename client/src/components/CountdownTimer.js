import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function CountdownTimer({
	duration,
	onCountdownComplete,
	text,
}) {
	const [startCountdown, setCountdown] = useState(duration * 60);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown((currentCountdown) => {
				const updatedCountdown = currentCountdown - 1;
				if (updatedCountdown <= 0) {
					clearInterval(interval);
					onCountdownComplete();
					return 0;
				}
				localStorage.setItem(
					'countdown',
					(updatedCountdown / 60).toString()
				);
				return updatedCountdown;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [startCountdown, onCountdownComplete]);

	const formatTime = (time) => {
		const minutes = Math.floor(time / 60);
		const seconds = time % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '80vh',
			}}
		>
			<Typography align="center" variant="h1" color="textSecondary">
				{text}
				<br />
				{formatTime(startCountdown)}
			</Typography>
		</Box>
	);
}
