// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
import React, {useState} from 'react'
import {ethers} from 'ethers'
import SimpleStorage_abi from './contracts/SimpleStorage_abi.json'

const SimpleStore = () => {

	// deploy simple storage contract and p aste deployed contract address here. This value is local ganache chain
	let contractAddress = '0xfE98b38a29dfdaD9783a2Bb86e74a2c9cf9e3Cd7';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState([]);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, SimpleStorage_abi, tempSigner);
		setContract(tempContract);	
	}

	const setHandler = (event) => {
		event.preventDefault();
		contract.createClient( event.target.cin.value, event.target.fullName.value, 
			                   event.target.email.value, event.target.statut.value);
	}

	const getCurrentVal = async () => {
		let val = await contract.getClients();
		setCurrentContractVal(val);
		console.log(val);
	}
	return (
		<div>
		<h4> {"Get/Set Contract interaction"} </h4>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div>
				<h3>Address: {defaultAccount}</h3>
			</div>
			<form onSubmit={setHandler}>
				<button type={"submit"}> Add Client </button><br/>
				FullName: <input type="text" id="fullName" /><br/>
				Email: <input type="text" id="email" /><br/>
				Cin: <input type="number" id="cin" /><br/>
				Statut: <input type="checkbox" id="statut"/><br/>
			</form>
			<div>
			{/* <button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button> */}
			<button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Client Value </button>            
			</div>
			{currentContractVal.map(e=>{
				return(
					<div>
						<li>{e.fullName}</li>
{/* <table style="width:100%">
  <tr>
    <th>Cin</th>
    <th>Full Name</th>
    <th>statut</th>
  </tr>
  <tr>
    <td>CIN</td>
    <td>{e.fullName}</td>
    <td>{e.statut}</td>
  </tr>
</table> */}
					</div>
				)
			})}
			
		</div>
	);
}

export default SimpleStore;