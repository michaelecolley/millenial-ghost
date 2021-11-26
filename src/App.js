import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './utils/ProbablyNothing.json';

const TWITTER_HANDLE = 'michaelecolley';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = `https://rinkeby.rarible.com/token/0x72E60a58b7D8216178782B10A951a4FFeda85Fbd:3?tab=bids`;
const TOTAL_MINT_COUNT = 6;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log('Make sure you have metamask!');
      return;
    } else {
      console.log('We have the ethereum object', ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log('Connected to chain ' + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = '0x4';
    if (chainId !== rinkebyChainId) {
      alert('You are not connected to the Rinkeby Test Network!');
    }
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setCurrentAccount(account);
    } else {
      console.log('No authorized account found');
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    const { ethereum } = window;
    try {
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = '0x72E60a58b7D8216178782B10A951a4FFeda85Fbd';
    try {
      const { ethereum } = window;
      console.log('milestone1');
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log('milestone2');
        console.log('Going to pop wallet now to pay gas...');
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log('Mining...please wait.');
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className='cta-button connect-wallet-button'>
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  /*
   * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
   */
  return (
    <div className='App'>
      <div className='container'>
        <div className='header-container'>
          <p className='header gradient-text'>My NFT Collection</p>
          <p className='sub-text'>
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === '' ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className='cta-button connect-wallet-button'>
              Mint NFT
            </button>
          )}
          <br />
          <br />
          <div>
            <nft-card
              contractAddress='0x72e60a58b7d8216178782b10a951a4ffeda85fbd'
              tokenId='0'
              network='rinkeby'>
              {' '}
            </nft-card>{' '}
          </div>
        </div>
        <div className='footer-container'>
          <img alt='Twitter Logo' className='twitter-logo' src={twitterLogo} />
          <a
            className='footer-text'
            href={TWITTER_LINK}
            target='_blank'
            rel='noreferrer'>{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
