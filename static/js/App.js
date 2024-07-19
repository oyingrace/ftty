import {useEffect, useState} from "react";
import { ethers } from "ethers";
import axios from 'axios';
import QRCode from 'react-qr-code';
import "./App.css";
import CountdownTimer from './CountdownTimer';
import ProgressBar from './ProgressBar';
import abi from './abi';
import Modal from './modal';


function App() {  

    const [currentAccount, setCurrentAccount] = useState(null);
    const [contractAddress, setContractAddress] = useState("null");
    const [rate, setRate] = useState(null);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [tokenName, setTokenName] = useState(null);
    const [tokenContract, setTokenContract] = useState(null);
    const [tokenSymbol, setTokenSymbol] = useState(null);
    const [tokenSupply, setTokenSupply] = useState(null);
    const [presaleTokens, setPresaleTokens] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [payAmount, setPayAmount] = useState(null);
    const [remaingTokens, setRemaingTokens] = useState(0);
    const [tokenDecimals, setTokenDecimals] = useState(18);
    const [affiliateCommission, setAffiliateCommission] = useState("0");
    const [adminWallet, setAdminWallet] = useState("0x");

    const [alertText, setAlertText] = useState(null);
    const [telegram, setTelegram] = useState("#");
    const [twitter, setTwitter] = useState("#");
    const [listingPrice, setListingPrice] = useState(null);
    const [targetProgressbar, setTargetProgressbar] = useState(0);
    const [fundRaised, setFundRaised] = useState(0);
    const [minBuy, setMinBuy] = useState(0);
    const [maxBuy, setMaxBuy] = useState(0);

    const [chainName, setChainName] = useState(null);
    const [chainID, setChainID] = useState(null);
    const [nativeCoin, setNativeCoin] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalOpen2, setModalOpen2] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);
    const openModal2 = () => setModalOpen2(true);
    const closeModal2 = () => setModalOpen2(false);


  function getQueryParams() {
    const search = window.location.search.substring(1);
    const params = search.split('&');
    const queryParams = {};
    for (let i = 0; i < params.length; i++) {
      const pair = params[i].split('=');
      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1]);
      queryParams[key] = value;
    }
    return queryParams;
  }
  const queryParams = getQueryParams();
  const paramValue = queryParams.aff;


  const fetchData = async () => {
    try {
      const response = await axios.get('data.json');
      setContractAddress(response.data[0].value);
      setRate(response.data[1].value);
      setTitle(response.data[2].value);
      setDescription(response.data[3].value);
      setTokenName(response.data[4].value);
      setTokenContract(response.data[5].value);
      setTokenSymbol(response.data[6].value);
      setTokenDecimals(Number(response.data[7].value));
      setTokenSupply(response.data[8].value);
      setPresaleTokens(response.data[9].value);
      setAlertText(response.data[10].value);
      setEndTime(response.data[11].value);
      setAffiliateCommission(response.data[12].value);
      setAdminWallet(response.data[13].value);
      setTelegram(response.data[14].value);
      setTwitter(response.data[15].value);
      setListingPrice(response.data[16].value);
      setChainName(response.data[17].value);
      setChainID(response.data[18].value);
      setNativeCoin(response.data[19].value);
      setMinBuy(response.data[20].value);
      setMaxBuy(response.data[21].value);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAmountChange = (event) => {
    setPayAmount(event.target.value);
    if(Number(event.target.value) > 0){
    }
  };

  const getRemainingTokens = async() => {
    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        let tokensNum = String(await contract.tokenBalance())
        tokensNum = tokensNum.substring(0,tokensNum.length - tokenDecimals);
        setRemaingTokens(Number(tokensNum));
        setTargetProgressbar(((presaleTokens-tokensNum)/presaleTokens)*100);
        setFundRaised(((presaleTokens - tokensNum) / rate).toFixed(2));
      }
    }catch(err){
		alert("You need to connect with MetaMask.");
    	console.log(err);
    }

  }

  function isEthereumAddress(address) {
    // Ethereum address pattern
    const ethereumAddressPattern = /^(0x)?[0-9a-fA-F]{40}$/;
  
    // Check if the address matches the pattern
    return ethereumAddressPattern.test(address);
  }
  
  function isAdmin(){
    if(adminWallet === null || currentAccount === null){
      return false;
    }
    if(adminWallet.toLowerCase() === currentAccount.toLowerCase()){
      return true;
    }
    return false;
  }


  const checkWalletIsConnected = () => {
    const { ethereum } = window;
    if(!ethereum){
      console.log("Metamask NOT Installed");
      return;
    }else{
      console.log("Metamask Installed");
    }
   }

  const connectWalletHandler = async() => { 
    const { ethereum } = window;
    if(!ethereum){
      alert("Please Install Metamask!");
    }

    try{
      const accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log("Found an account :", accounts[0]);
      setCurrentAccount(accounts[0]);
      getRemainingTokens();
    }catch (err){
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
        <button
            className="relative d-flex w-full items-center justify-content-center  gap-2 rounded-md bg-primary py-4 px-6 text-lg font-semibold text-white transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
            type="button"
            onClick={connectWalletHandler}
           >
            Connect wallet
        </button>
    )
  }

  const createButton = () => {
    return (

        <button
            className="relative d-flex w-full items-center justify-content-center  gap-2 rounded-md bg-dark py-4 px-6 text-lg font-semibold text-white transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
            type="button"
            onClick={buyTokenHandler}
           >
            BUY {tokenSymbol}
        </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
    fetchData();
  }, [endTime])

  const withdrawTokens = async() => {
    // alert(contractAddress);
    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Intialize withdraw");
        let withdrawRes = await contract.withdrawTokens(adminWallet);
        
        if(withdrawRes){
          alert("Congratulations, you will receive your tokens very soon");
        }else{
          alert("Something wrong, Only the admin wallet who can withdraw.");
        }
          }
        }catch(err){
        alert("Something wrong, Only the admin wallet who can withdraw.");
          console.log(err);
        }

  }

  
  const buyTokenHandler = async() => {

    if(Number(payAmount) < minBuy || payAmount === null || payAmount > maxBuy){
      alert("You can't buy in less than " + minBuy + " or more than " + maxBuy + " " + nativeCoin);
      return false;
    }

    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        console.log("Intialize payment");
        let getadrp;
        const finalPayAmount = String(Number(payAmount) * 1000000000000000000);
        // alert(paramValue);
        if(isEthereumAddress(paramValue)){
          // alert("i'm affiliate");
          getadrp = await contract.buyTokensAff(paramValue, {value: finalPayAmount});
        }else{
          // alert("i'm without affiliate");
          getadrp = await contract.buyTokens({value: finalPayAmount});
        }
        

        if(getadrp){
          alert("Congratulations, you will receive your tokens very soon");
        }else{
          alert("Something wrong, Maybe you don't have enough balance for the transaction.");
        }
          }
        }catch(err){
        alert("Something wrong, Maybe you don't have enough balance for the transaction.");
          console.log(err);
        }

  }

  async function addToken() {
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Currently only supports ERC20 tokens
          options: {
            address: tokenContract, // The token's contract address
            symbol: tokenSymbol,   // A string symbol of the token
            decimals: tokenDecimals,    // The number of decimals the token uses
            image: window.location.href + '/token-logo.png',  // A string url of the token logo
          },
        },
      });
  
      if (wasAdded) {
        console.log('Token was added successfully!');
      } else {
        console.log('Token was not added.');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // const targetDate = endTime; // Format '2024-08-31T23:59:59'

  // const targetProgressbar = 65; // Set your target progress bar value

  return (
        <main className="d-flex h-screen flex-column">
            
            <div className="container px-4 lg:px-0">
                <div className="d-flex items-center justify-content-between py-6">
                    <div className="d-flex items-center lg:gap-6">
                        <nav >
                            <ul className="-mx-3 d-flex  divide-gray-400">
                                <li>
                                   {/* <a href="/" className="block px-3 text-lg font-semibold leading-none text-white transition-opacity duration-200 hover:text-primary"> 
                                    <img src="/logo.png" className="h-8" alt="Logo" />
  </a> */}
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="d-flex flex-wrap items-center gap-6">
                        <div className="d-flex items-center justify-content-center  gap-4 text-white">
                            <a href={telegram} className="inline-block w-auto" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" className="h-6 w-6">
                                    <path
                                        d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z"
                                    ></path>
                                </svg>
                            </a>
                            <a href={twitter} className="inline-block w-auto" target="_blank" rel="noreferrer">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path
                                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                                    ></path>
                                </svg>
                            </a>
                        </div>
                        
                    </div>
                </div>
            </div>
            <section className="d-flex flex-1 flex-column justify-content-center  py-6">
                <div className="container d-flex flex-column items-center gap-16 px-4 lg:flex-row lg:gap-4 lg:px-0">
                    <div className="w-full lg:w-1/2" >
                        <h4 className="mb-6 text-center font-bold leading-relaxed text-white lg:text-left lg:text-5xl">
                            <span className="text-uppercase text-orange-600">{tokenSymbol}:</span> {description}
                        </h4>
                        <p className="mb-6 text-center font-bold leading-relaxed text-white lg:text-left lg:text-xl"></p>
                        <div className="mb-6 d-flex flex-wrap items-center justify-content-center  gap-4 lg:justify-start">
                            <a
                                href={"https://bscscan.com/token/" + tokenContract}
                                target="_blank"
                                rel="noreferrer"
                                className="d-flex gap-4 rounded-full border-2 border-secondary py-3 px-6 font-bold text-uppercase text-primary-dark backdrop-blur-md"
                            >
                                ZXF Contract
                            </a>
                            <a
                                className="tag-button d-flex gap-4 rounded-full border-2 border-secondary py-3 px-6 font-bold text-uppercase text-primary-dark backdrop-blur-md"
                                onClick={addToken}
                            >
                                Add to MetaMask
                            </a>
                            {affiliateCommission > 0 &&
                            <a
                                className="tag-button d-flex gap-4 rounded-full border-2 border-secondary py-3 px-6 font-bold text-uppercase text-primary-dark backdrop-blur-md"
                                onClick={openModal2}
                            >
                                Affiliate Program
                            </a>
                            }
                        </div>
                        
                    </div>
                    <div className="relative d-flex w-full justify-content-center  lg:w-1/2" >
                        <div className="relative mx-auto w-full max-w-lg self-stretch rounded-3xl bg-white shadow-xl">
                           
                            <div className="d-flex flex-column items-center justify-content-center  rounded-t-3xl bg-primary px-4 py-4 text-white">
                                <p className="-mt-6 mb-2 rounded-full bg-dark px-3 py-1 text-sm">{alertText}</p>
                                {endTime != null &&
                                    <CountdownTimer targetDate={endTime} />
                                }

                                {targetProgressbar != null &&
                                    <ProgressBar targetProgressbar={targetProgressbar} />
                                }

                                <p className="mb-2 text-xl font-bold">
                                  {currentAccount ? `Fund Rasied: ${fundRaised} / ${Math.round(presaleTokens / rate)} ${nativeCoin}` : "Connect wallet to see fund rasied"}
                                  
                                  </p>
                                <p className="text-lg font-bold text-secondary">LISTING PRICE: ${listingPrice}</p>
                            </div>
                            <form className="mb-4 mt-4 d-flex flex-column gap-3 px-4">
                                <div className="relative mt-2 d-flex flex-column items-center justify-content-center ">
                                    <hr className="absolute top-1 h-0.5 w-full bg-primary" />
                                    <span className="z-10 -mt-2 bg-white px-4 font-bold text-primary">1 {nativeCoin} = {Number(rate).toLocaleString()} {tokenSymbol}</span>
                                </div>
                                <div className="d-flex items-center justify-content-center  gap-2">
                                    <img src="coin.png" alt="polygon icon" className="h-6" />
                                    <p className="text-sm font-semibold text-gray-600">Only {chainName} is Approved</p>
                                </div>
                                
                                <div className="d-flex flex-column gap-2">
                                    <label className="text-sm text-gray-600">Amount in <span className="font-bold tracking-widest">{nativeCoin}</span> you pay</label>
                                    <div className="d-flex w-full overflow-hidden rounded-xl border-2 border-gray-300 text-xl ring-4 ring-transparent focus-within:border-primary/50 focus-within:ring-primary/20">
                                        <input 
                                          className="flex-1 py-3 px-3 outline-none" 
                                          type="text" 
                                          placeholder="0.0" 
                                          value={payAmount} 
                                          onChange={handleAmountChange}
                                          />
                                        <div className="d-flex items-center justify-content-center  border-l-2 border-gray-300 px-4"><img src="coin.png" alt="Binance Smart Chain" className="h-8 w-8 object-contain" /></div>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-2">
                                    <label className="text-sm text-gray-600">Amount in <span className="font-bold tracking-widest">{tokenSymbol}</span> you receive</label>
                                    <div className="d-flex w-full overflow-hidden rounded-xl border-2 border-gray-300 text-xl ring-4 ring-transparent focus-within:border-primary/50 focus-within:ring-primary/20">
                                        <input 
                                          className="flex-1 py-3 px-3 outline-none" 
                                          type="text" 
                                          placeholder="0.0" 
                                          value={payAmount * rate}
                                          />
                                        <div className="d-flex items-center justify-content-center  border-l-2 border-gray-300 px-4"><img src="token-logo.png" alt="INSIG Coin" className="h-8 w-8 object-contain" /></div>
                                    </div>
                                </div>

                                {currentAccount ? createButton() : connectWalletButton()}

                                <button
                                    className="relative d-flex w-full items-center justify-content-center  gap-2 rounded-md bg-primary py-4 px-6 text-lg font-semibold text-white transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
                                    type="button"
                                    onClick={openModal}
                                >
                                    Direct Buy
                                </button>

                                {isAdmin() && 
                                  <button
                                      className="relative d-flex w-full items-center justify-content-center  gap-2 rounded-md bg-primary py-4 px-6 text-lg font-semibold text-white transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
                                      type="button"
                                      onClick={withdrawTokens}
                                    >
                                      Withdraw Tokens
                                  </button>
                                }
                            </form>
                        </div>
                    </div>

                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                      <h1>Direct Buy</h1>
                      <p>Scan the QR code and send {nativeCoin} to the presale address and you will receive {tokenSymbol} tokens immediatly.</p>
                      <br />
                      <div className="py-3" align="center">
                        <QRCode
                          title="Presale QR"
                          value={contractAddress}
                        />
                      </div>
                      <div className="py-3" align="center">
                        <p className="bold-red">Send only {nativeCoin} to this address</p>
                      </div>
                    </Modal>

                    <Modal isOpen={isModalOpen2} onClose={closeModal2}>
                      <h1>Affiliate Program</h1>
                      <div className="py-3" align="center">
                        <p>Earn %{affiliateCommission} per every sale you refere.</p>
                      </div>
                      <br />
                      <div className="py-3" align="center">
                        <p className="bold-red">{window.location.href}?aff=Your-Wallet-Here</p>
                      </div>
                    </Modal>

                </div>
            </section>
            <footer className="py-4 text-center font-bold text-gray-500 backdrop-blur-md">
              <p className="text-white">© {new Date().getFullYear()} Powered by <a href='https://ftty.app/' target='_blank' rel="noreferrer">FattyPatty</a></p>
            </footer>
        </main>
  );
}

export default App;
