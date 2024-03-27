import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import RoleEnum from '../utils/enums';
import getKeyByValue from '../utils/generalUtils';

const Header = (role) => {
	const roleNumber = role['role'];
	console.log(`Header called with role: ${roleNumber}`);
	const roleType = getKeyByValue(RoleEnum, roleNumber);
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<Typography
						variant="h5"
						noWrap
						component="a"
						href=""
						sx={{
							mr: 2,
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						Blockchain Voting DApp
					</Typography>
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title={`Role Type ${roleType}`}>
							<IconButton sx={{ p: 0 }}>
								<Avatar alt={roleType} src="url" />
							</IconButton>
						</Tooltip>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
};
export default Header;
