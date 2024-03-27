import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import Home from './components/Home';
import NFTs from './components/NFTs';
// import {marketplace_abi} from "./Abi.js"
import Create from './components/Create';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import 'react-toastify/dist/ReactToastify.css';
import Info from './components/Info.jsx';
// import Web3 from 'web3';
import contractData from './contract.json'
import MyBuildings from './components/MyListedBuildings.jsx';
import OwnedApartments from './components/OwnedApartments.jsx';

function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace]= useState({});
  const [nftitem, setNFTitem] = useState({})
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload()
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.href = "/"; // Redirect using window.location
          console.log(window.location);
        });

        window.onbeforeunload = function() {
          // Your custom function to run when the page is reloaded
          console.log("Page is being reloaded!");
          window.location.href = "/";
          // Add any other actions you want to perform here
        };
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoading(false)
        let marketplaceAddress = contractData.contractAddress;
        let marketplace_abi = contractData.contractAbi;
        console.log(address);
       

        const marketplacecontract = new ethers.Contract(
          marketplaceAddress,
          marketplace_abi,
          signer
        );
        //console.log(contract);
        setMarketplace(marketplacecontract);
        setMarketplace(marketplacecontract);
        console.log(marketplace);       
        // const web3 = new Web3(window.ethereum);
        // const contract = new web3.eth.Contract(contractData.contractABI, contractData.contractAddress);
        // console.log("contract: ", contract);
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);




  return (
    <BrowserRouter>
    <ToastContainer/>
    <div className="App min-h-screen">
      <div className='gradient-bg-welcome h-screen w-screen'>
      <Nav account={account}/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        {/* <Route path="/all-nft" element={<NFTs marketplace={contract} setNFTitem={setNFTitem} />}></Route>
        <Route path="/create" element={<Create marketplace={contract}  address={account}/>}></Route> */}
        <Route path="/all-nft" element={<NFTs marketplace={marketplace} setNFTitem={setNFTitem} setMarketplace={setMarketplace} />}></Route>
        <Route path="/create" element={<Create marketplace={marketplace}  address={account}/>}></Route>
        <Route path="/info" element={<Info nftitem={nftitem} />}></Route>
        <Route path='/listed-buildings' element={<MyBuildings marketplace={marketplace} address={account}/>}></Route>
        <Route path='/owned-apartments' element={<OwnedApartments marketplace={marketplace}/>}></Route>
      </Routes>
      </div>
    </div>
  
    </BrowserRouter>
  );
}

export default App;
