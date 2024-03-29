import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Vote from './Vote';
import Admin from './Admin';
import ElectionContract from '../contracts/Election.json';
import getWeb3 from '../utils/getWeb3';
import RoleEnum, { ElectionStateEnum } from '../utils/enums';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';
import CountdownTimer from '../components/CountdownTimer.js';

export default function Home() {
	console.log('Home called');
	const navigate = useNavigate();
	const [role, setRole] = useState(RoleEnum.USER);
	const [web3, setWeb3] = useState(null);
	const [currentAccount, setCurrentAccount] = useState(null);
	const [contract, setContract] = useState(null);
	const [loading, setLoading] = useState(true);
	const [electionState, setElectionState] = useState(0);

	const [preElectionPeriod, setPreElectionPeriod] = useState(() => {
		const savedValue = localStorage.getItem('preElectionPeriod');
		return savedValue ? Number(savedValue) : 0;
	});

	const [electionDuration, setElectionDuration] = useState(() => {
		const savedDuration = localStorage.getItem('electionDuration');
		return savedDuration ? Number(savedDuration) : 0;
	});

	const loadWeb3 = async () => {
		try {
			console.log('loadWeb3 called');
			const web3 = await getWeb3();
			const accounts = await web3.eth.getAccounts();
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = ElectionContract.networks[networkId];
			const instance = new web3.eth.Contract(
				ElectionContract.abi,
				deployedNetwork && deployedNetwork.address
			);
			setWeb3(web3);
			setCurrentAccount(accounts[0]);
			setContract(instance);
			setLoading(false);
			console.log('loadWeb3 finished');
		} catch (error) {
			console.error('Error:', error);
			navigate('/');
		}
	};

	const getRole = async () => {
		if (contract) {
			const user = await contract.methods.getRole(currentAccount).call();
			setRole(parseInt(user));
			console.log(`role: ${role}`);
			setLoading(false);
		}
	};

	const handleCountdownComplete = async () => {
		try {
			localStorage.clear();
			if (contract && role === RoleEnum.ADMIN) {
				await contract.methods
					.startElection(electionDuration)
					.send({ from: currentAccount });
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	const handleEnd = async () => {
		try {
			if (contract && role === RoleEnum.ADMIN) {
				await contract.methods
					.endElection()
					.send({ from: currentAccount });
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	useEffect(() => {
		getRole();
		const initWeb3AndContract = async () => {
			await loadWeb3();
			if (contract) {
				const stateChangedListener = contract.events
					.ElectionStateChanged()
					.on('data', (event) => {
						console.log(
							`GOT NEW STATE: ${event.returnValues.newState}`
						);
						setElectionState(event.returnValues.newState);
					});

				return () => stateChangedListener.unsubscribe();
			}
		};

		initWeb3AndContract();

		const handleElectionCreated = (event) => {
			console.log('handleElectionCreated called in Home');
			const { duration, startCountdown } = event.detail;
			setElectionDuration(duration);
			setPreElectionPeriod(startCountdown);
			localStorage.setItem('electionDuration', duration.toString());
			localStorage.setItem(
				'preElectionPeriod',
				startCountdown.toString()
			);
		};

		window.addEventListener('electionCreated', handleElectionCreated);

		return () => {
			window.removeEventListener(
				'electionCreated',
				handleElectionCreated
			);
		};
	}, [contract]);

	return (
		<Box
			sx={{
				bgcolor: 'background.default',
				color: 'text.primary',
				height: '100vh',
			}}
		>
			{loading ? (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '80vh',
					}}
				>
					Loading...
				</Box>
			) : (
				<Box>
					<Header role={role} />
					<Grid item xs={12} align="center">
						{electionState === ElectionStateEnum.IN_PROGRESS &&
							electionDuration && (
								<CountdownTimer
									text={'Election Ends In'}
									duration={electionDuration}
									onCountdownComplete={handleEnd}
									variant={'h6'}
									itemType={'electionDuration'}
								/>
							)}
					</Grid>
					{preElectionPeriod === 0 && (
						<Box>
							{role === RoleEnum.ADMIN && (
								<Admin
									contract={contract}
									web3={web3}
									currentAccount={currentAccount}
								/>
							)}
							{role === RoleEnum.USER && (
								<Vote
									contract={contract}
									currentAccount={currentAccount}
								/>
							)}
						</Box>
					)}
					{preElectionPeriod !== 0 && (
						<CountdownTimer
							text={'Election Starts In'}
							duration={preElectionPeriod}
							onCountdownComplete={handleCountdownComplete}
							variant={'h1'}
							itemType={'preElectionPeriod'}
						/>
					)}
				</Box>
			)}
		</Box>
	);
}
