/*
     ██     ████     ██ ██████████   ███████   ████     ██ ██   ███████  
    ████   ░██░██   ░██░░░░░██░░░   ██░░░░░██ ░██░██   ░██░██  ██░░░░░██ 
   ██░░██  ░██░░██  ░██    ░██     ██     ░░██░██░░██  ░██░██ ██     ░░██
  ██  ░░██ ░██ ░░██ ░██    ░██    ░██      ░██░██ ░░██ ░██░██░██      ░██
 ██████████░██  ░░██░██    ░██    ░██      ░██░██  ░░██░██░██░██      ░██
░██░░░░░░██░██   ░░████    ░██    ░░██     ██ ░██   ░░████░██░░██     ██ 
░██     ░██░██    ░░███    ░██     ░░███████  ░██    ░░███░██ ░░███████  
░░      ░░ ░░      ░░░     ░░       ░░░░░░░   ░░      ░░░ ░░   ░░░░░░░   

*/
import logo from "./logo.svg";
import getWeb3 from "./utils/getWeb3";
import React, { useState, useEffect } from "react";

import AuctionFactoryContract from "./abis/AuctionFactory.json";
import "./App.css";

function App() {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
  });

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        console.log("accounts", accounts);
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AuctionFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(
          AuctionFactoryContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        await instance.methods
          .createAuction("ciso", "ciao", 1, 2, 3, "immagine")
          .send({ from: accounts[0] });
        // Set web3, accounts, and contract to the state, and then proceed with an
        setState({ web3, accounts, contract: instance });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Ciao </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
