import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

const getWeb3 = () =>
	new Promise((resolve, reject) => {
		window.addEventListener('load', async () => {
			if (window.ethereum) {
				const web3 = new Web3(window.ethereum);
				try {
					// Request account access if needed
					await window.ethereum.request({
						method: 'eth_requestAccounts',
					});
					resolve(web3);

					// Listen for account changes
					window.ethereum.on('accountsChanged', (accounts) => {
						if (accounts.length === 0) {
							console.log('Account disconnected');
							window.location.href = '/';
						} else {
							// Reload upon account change
							console.log('Account changed:', accounts[0]);
							window.location.reload();
						}
					});

					window.ethereum.on('chainChanged', (chainId) => {
						console.log('Chain changed to', chainId);
						window.location.reload();
					});
				} catch (error) {
					reject(error);
				}
			}
			// Legacy dapp browsers...
			else if (window.web3) {
				// Use Mist/MetaMask's provider.
				const web3 = window.web3;
				console.log('Injected web3 detected.');
				resolve(web3);
			} else {
				const provider = new Web3.providers.HttpProvider(
					'http://127.0.0.1:7545'
				);
				const web3 = new Web3(provider);
				console.log('No web3 instance injected, using Local web3.');
				resolve(web3);
			}
		});
	});

export default getWeb3;
