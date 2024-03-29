import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function CountdownTimer({
	duration,
	onCountdownComplete,
	text,
	variant,
	itemType,
}) {
	const [startCountdown, setCountdown] = useState(duration);

	useEffect(() => {
		if (startCountdown === 0) {
			return;
		}
		const interval = setInterval(() => {
			setCountdown((currentCountdown) => {
				const updatedCountdown = currentCountdown - 1;
				localStorage.setItem(itemType, updatedCountdown.toString());
				if (updatedCountdown <= 0) {
					clearInterval(interval);
					console.log(
						'CALLING onCountdownComplete FROM CountdownTimer'
					);
					onCountdownComplete();
					return 0;
				}
				return updatedCountdown;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [startCountdown, onCountdownComplete, itemType]);

	const formatTime = (time) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes
			.toString()
			.padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Typography align="center" variant={variant} color="textSecondary">
				{text}
				<br />
				{formatTime(startCountdown)}
			</Typography>
		</Box>
	);
}
