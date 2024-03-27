import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Vote from './Vote';
import Admin from './Admin';
import ElectionContract from '../contracts/Election.json';
import getWeb3 from '../utils/getWeb3';
import RoleEnum from '../utils/enums';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.js';

export default function Home() {
	console.log('Home called');
	const navigate = useNavigate();
	const [role, setRole] = useState(RoleEnum.USER);
	const [web3, setWeb3] = useState(null);
	const [currentAccount, setCurrentAccount] = useState(null);
	const [contract, setContract] = useState(null);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		loadWeb3();
		getRole();
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
					{role === RoleEnum.ADMIN && (
						<Admin
							role={role}
							contract={contract}
							web3={web3}
							currentAccount={currentAccount}
						/>
					)}
					{role === RoleEnum.USER && (
						<Vote
							role={role}
							contract={contract}
							web3={web3}
							currentAccount={currentAccount}
						/>
					)}
				</Box>
			)}
		</Box>
	);
}
