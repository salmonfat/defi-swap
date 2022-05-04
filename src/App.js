import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contract/testTokenDefi.json";
import _tokenAbi from "./contract/TokenForDefi.json";

function App() {
  const contractAddress='0x0ad3203E7140C155e401Acff49C6B824504d1fC0';
  const tokenaddress='0x072879584049FAf96A8939Cd60Bad6B4CD5860f5';
  const contractABI=abi.abi;
  const tokenAbi=_tokenAbi.abi;

  const [isWallectConnect,setWallectConnet]=useState(false);
  const [inputValue,setInPutValue]=useState({/*addDesir:"",addMin:"",addETHMin:"",liq:"",removeMin:"",removeETHMin:"",*/swapIn:"",swapETHMin:"",swapOutMin:"",swapETHamount:""});
  const [yourWalletAddress,setYourWalletAddress]=useState(null);

  const checkWalletConnect=async()=>{
    try{
      if (window.ethereum){
      const accounts=await window.ethereum.request({method: 'eth_requestAccounts'});
      const account = accounts[0];
      setWallectConnet(true);
      setYourWalletAddress(account);
      console.log("Account Connected: ", account);
    }else{
      console.log("No Metamask detected");
      }
    }catch(error){
      console.log(error);
    }
  }
  /*const addLiq=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        let _addDesir=utils.parseEther(inputValue.addDesir);
        let _addMin=utils.parseEther(inputValue.addMin);
        let _addETHMin=utils.parseEther(inputValue.addETHMin);
        const txn=await Contract.addLiq(_addDesir,_addMin,_addETHMin,{ value: ethers.utils.parseEther(inputValue.swapETHamount) });
        console.log("adding");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const removeLiq=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn=await Contract.removeLiq(inputValue.liq,inputValue.removeMin,inputValue.removeETHMin);
        console.log("removing");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }*/
  const swapTokenToETH=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);
        const TokenContract = new ethers.Contract(tokenaddress, tokenAbi, signer);

        const apporveTxn=await TokenContract.approve(contractAddress,utils.parseEther(inputValue.swapIn));
        console.log("approving");
        await apporveTxn.wait();
        const txn=await Contract.swapTokenToETH(utils.parseEther(inputValue.swapIn),utils.parseEther(inputValue.swapETHMin));
        console.log("swaping");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const swapETHToToken=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(contractAddress, contractABI, signer);

        let _swapOutMin=utils.parseEther(inputValue.swapOutMin);
        const txn=await Contract.swapETHToToken(_swapOutMin,{ value: ethers.utils.parseEther(inputValue.swapETHamount) });
        console.log("swaping");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }
  const mint=async(event)=>{
    event.preventDefault();
    try{
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const Contract = new ethers.Contract(tokenaddress, tokenAbi, signer);

        let mAmount=utils.parseEther("5");
        const txn=await Contract.mintToken(mAmount);
        console.log("minting");
        await txn.wait();
        console.log("done",txn.hash);
      }else{
        console.log("Ethereum object not found, install Metamask.");
      }
    }catch(error){
      console.log(error);
    }
  }
  
  const handleInputChange = (event) => {
    setInPutValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  };
  useEffect(() => {
    checkWalletConnect();
  }, []);
  return (
    <main>
      <h2>defi DAPP (On Rinkeby testnet)(interact with Uniswap)</h2>
      <div>
        {isWallectConnect &&(<p>your address:{yourWalletAddress} </p>)}
        {!isWallectConnect &&(<button onClick={checkWalletConnect}> connect wallet </button>)}
      </div>
      <div>
        <h4>Let's mint some coins for free to join the Defi.</h4>
        <button onClick={mint}>mint</button>
      </div>
      <div>
        <h4>Let's swap</h4>
        <h6>swap DT token to ETH</h6>
          <input
            type="text"
            onChange={handleInputChange}
            name="swapIn"
            placeholder="DT amount"
            value={inputValue.swapIn}/>
          <input
            type="text"
            onChange={handleInputChange}
            name="swapETHMin"
            placeholder="expect min ETH back"
            value={inputValue.swapETHMin}/>
            <button onClick={swapTokenToETH}>swap</button>
        <h6>swap ETH to DT token</h6>
          <input
            type="text"
            onChange={handleInputChange}
            name="swapETHamount"
            placeholder="ETH amount"
            value={inputValue.swapETHamount}/>
          <input
            type="text"
            onChange={handleInputChange}
            name="swapOutMin"
            placeholder="expect min DT back"
            value={inputValue.swapOutMin}/>
            <button onClick={swapETHToToken}>swap</button>
      </div>
    </main>
  );
}

export default App;