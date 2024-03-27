import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import defaultAvatar from '../images/avatar.png';

export default function Candidate({ id, name, voteCount }) {
	return (
		<Card>
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
					height="190"
					width="130"
					image={defaultAvatar}
				/>
			</CardContent>
			<CardActions sx={{ justifyContent: 'center' }}>
				{voteCount && (
					<Typography align="center" variant="">
						<strong>{voteCount}</strong> votes
					</Typography>
				)}
			</CardActions>
		</Card>
	);
}
