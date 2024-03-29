import {
	Card,
	CardHeader,
	CardContent,
	CardMedia,
	CardActions,
	Typography,
} from '@mui/material';
import defaultAvatar from '../images/avatar.png';

export default function Candidate({ id, name, voteCount, highlight }) {
	return (
		<Card
			sx={{
				backgroundColor:
					highlight && voteCount > 0 ? 'brown' : 'inherit',
				border: highlight && voteCount > 0 ? '4px solid red' : 'none',
			}}
		>
			<CardHeader
				title={
					<Typography align="center" variant="subtitle1">
						{name}
					</Typography>
				}
			/>
			<CardContent sx={{ padding: 0 }}>
				<CardMedia
					component="img"
					height="150"
					width="100"
					image={defaultAvatar}
				/>
			</CardContent>
			<CardActions sx={{ justifyContent: 'center' }}>
				{voteCount ? (
					<Typography align="center">
						<strong>{voteCount}</strong> votes
					</Typography>
				) : null}
			</CardActions>
		</Card>
	);
}
