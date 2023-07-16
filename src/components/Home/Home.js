import React, { useState, useEffect } from 'react';
import MLM from '../contract/MLM';
import TOKEN from '../contract/Token';
import { ToastContainer, toast } from 'react-toastify';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { errors, providers } from 'ethers';
import bigInt from 'big-integer';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { ethers } from 'ethers';
import polkadotmlmabi from '../../abis/POLKADOT_MLM.json';
import polkadotabi from '../../abis/POLKADOT_token.json';

const POLKADOT_MLM_CONTRACT_ADDRESS = '0x5E03f8AD520E21fB9E4D2F235DF9733A624c38a7';
const POLKADOT_TOKEN_ADDRESS = '0xcbb8094939A0D024f037602B8d36b2E00c3acA76';

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [estimateValue, setEstimateValue] = useState('');
  const [estimateWithdrawValue, setEstimateWithdrawValue] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [handleWithdrawLoader, setHandleWithdrawLoader] = useState(false);
  const [userWithdrawBalance, setUserWithdrawBalance] = useState(0);
  const [userInvestLimitBalance, setUserInvestLimitBalance] = useState(0);
  const [userValid, setUserValid] = useState(false);
  const [tokenPrice, setTokePrice] = useState(0);
  const [show, setShow] = useState(false);
  const [popUpwithdrawValue, setPopupWithdrawValue] = useState('');
  const [popUpClaimValue, setPopupClaimValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [buttonStatus, setButtonStatus] = useState('');
  const [toggleCard, setToggleCard] = useState('deposit');
  const [depositAmount, setDepositamount] = useState('');
  const [approveBtn, setApproveBtn] = useState(true);
  const [refId, setRefId] = useState('');
  const [enterAddress, setEnterAddress] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => {
    console.log('handle show withdraw');
    setShow(true);

  //  getPopUpValue();
  };

  useEffect(() => {
    handleUrl();
    return () => {};
  }, []);

  const PolkadotMLMContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const PolkadotMLMContract = new ethers.Contract(
        POLKADOT_MLM_CONTRACT_ADDRESS,
        polkadotmlmabi,
        signer
      );
      return PolkadotMLMContract;
    } catch (error) {
      console.log(error);
    }
  };

  const PolkadotContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const PolkadotContract = new ethers.Contract(
        POLKADOT_TOKEN_ADDRESS,
        polkadotabi,
        signer
      );
      return PolkadotContract;
    } catch (error) {
      console.log(error);
    }
  };

  const handleUrl = () => {
    try {
      let url = window.location.href;
      let id = url.split('=')[1];
      setRefId(id);
      console.log('🚀 ~ handleUrl ~ id', id);
      console.log('🚀 ~ handleUrl ~ url', url);
    } catch (error) {
      console.log('🚀 ~ handleUrl ~ error', error);
    }
  };

  // const web3Provider = new providers.Web3Provider(provider);

  useEffect(() => {
    if (userAddress) {
      getUserWalletBalance();
      getUserInvestLimitBalance();
    }
    return () => {};
  }, [userAddress]);

  const handleWalletConnect = async () => {
    // try {
    //   await provider.enable();
    // } catch (error) {}
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
          } else {
            console.error(err);
          }
        });
      return true;
    } else {
      console.log('Please connect to MetaMask.');
      return false;
    }
  };
  function handleAccountsChanged(accounts) {
    let currentAccount;

    if (window.ethereum) {
      if (window.ethereum.networkVersion !== '80001') {
        toast.error('Please connect to Polygon Testnet');
      }
    }

    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      // console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      setUserAddress(currentAccount);

      // Do any other work!
    }
  }
  //
  
  const getUserWalletBalance = async () => {

    
    try {
    
     let url = `https://greendotfinance.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/redeem_balance.php?address=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log('err', err);
        }
        if (res) {
          console.log('🚀 ~ bal ~ res', res);
          setUserValid(true);
          return res;
        }
      });
      let stribal = bal.data[2];
      let  ans = stribal.split(":").pop();
      if (bal.data == 'Not Valid') {
        setUserWithdrawBalance(0);
      } else {
        setUserWithdrawBalance(ans);
      }
    } catch (error) {
      console.log('🚀 ~ getUserWalletBalance ~ error', error);
    }
  };

  const getUserInvestLimitBalance = async () => {

    //https://greendotfinance.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/sell_coin_limit.php?address2=0xDCC5E686892315BF80541721DC12Daf3EfBEb257
    try {
    
     let url = `https://greendotfinance.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/sell_coin_limit.php?address2=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log('err', err);
        }
        if (res) {
          console.log('🚀 ~ bal ~ res', res);
          setUserValid(true);
          return res;
        }
      });
      let stribal = bal.data[2];
      let  ans = stribal.split(":").pop();
      if (bal.data == 'Not Valid') {
        setUserInvestLimitBalance(0);
      } else {
        setUserInvestLimitBalance(ans);
      }
    } catch (error) {
      console.log('🚀 ~ getUserWalletBalance ~ error', error);
    }
  };
  
  useEffect(() => {
    getAdmin();
    return () => {};
  }, [userAddress]);

  const getAdmin = async () => {
    console.log('🚀 ~ getAdmin ~ userAddress', userAddress);
    try {
      if (userAddress) {
        let owner = await MLM.owner();
        console.log('🚀 ~ getAdmin ~ owner', owner);
        console.log('🚀 ~ getAdmin ~ userAddress', userAddress);
        if (userAddress.toLowerCase() == owner.toLowerCase()) {
          console.log('valid');
          setIsOwner(true);
        }
      }
    } catch (error) {
      console.log('🚀 ~ getAdmin ~ error', error);
    }
  };

  const handleApprovePOLKADOT = async () => {

    if (!userAddress) {
      return toast.error('Please connect Metamask first.');
    }
    
    if (depositAmount > (userInvestLimitBalance*1)) {
      
       return toast.error('Amount should not be greater than Limit Balance.');
     } 

    try {
      setButtonStatus('approve');
      let _PolkadotContract = await PolkadotContract();
      
      let _approve = await _PolkadotContract.approve(
        POLKADOT_MLM_CONTRACT_ADDRESS,
        ethers.utils.parseEther(depositAmount) 
      );
      let waitForTx = await _approve.wait();
      if (waitForTx) {
        
        setButtonStatus('');
        setApproveBtn(false);

        toast.success('Approved successfull.');
      }
    } catch (error) {
      setButtonStatus('');
      setApproveBtn(true);

      toast.error('Something went wrong!');
      console.log(error);
    }
  };

  const handleDepositPOLKADOT = async () => {
    if (!userAddress) {
      return toast.error('Please connect Metamask first.');
    }
    
    if (depositAmount > (userInvestLimitBalance*1)) {
      
       return toast.error('Amount should not be greater than Limit Balance.');
     } 


    try {
      setButtonStatus('deposit');
      let _PolkadotMLMContract = await PolkadotMLMContract();
    

      if (depositAmount <= 0) {
        return toast.error('Value should be positive.');
      }
      
      
      let _buy = await _PolkadotMLMContract.reInvestCoin(
        ethers.utils.parseEther(depositAmount) 
      );
      let waitForTx = await _buy.wait();
      if (waitForTx) {

        let formdata = new FormData();
        formdata.append('address2', userAddress);
        formdata.append('amount', depositAmount);
      


        let depositApi = await axios.post(
          `https://greendotfinance.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/reinvest.php`, formdata).then((res, err) => {
            if (res) {
             
              return res;
  
            }
            if (err) {
              console.log(err);
            };
          });
        
       
       
        setButtonStatus('');
        setApproveBtn(false);
        toast.success('Sucessfully Deposited New Tokens!');
        getUserWalletBalance();
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
      setButtonStatus('');
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className=''>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='logo'></div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='row'>
        <div className='col-md-12  d-flex justify-content-center'>
          {isOwner ? (
            <Link
              to={'/admin'}
              className='dashBoard wallet  btn btn-outline border-white text-white withdrawButton'
            >
              Admin
            </Link>
          ) : (
            ''
          )}
        </div>
      </div> */}

      {/* handle address  */}

      {/* handle login  */}
      {!isValid ? (
        <div className='container -fluid '>
          <div className='row mt-5'>
            <div className='col-12'>
              <div className='row d-flex justify-content-center'>
                <div
                  className='col-lg-5 col-md-8  p-4 m-2 shadow2 rounded-1 '
                  style={{
                  //  backgroundColor: 'rgb(20 21 51)',
                  backgroundImage:`url(${process.env.PUBLIC_URL+ "./assets/green_leave154.jpg"})`
                  }}
                >
                  <div className='col py-4 '>
                    <div className='row'>
                      <div className='col-md-12 d-flex justify-content-center'>
                        <img
                         // src='./assets/sss_world.png'
                         src='./assets/finswap.png' 
                         // className="img-fluid"
                          alt='logo'
                          loading='lazy'
                          // height={150}
                          className='myImg'
                        />
                      </div>
                    </div>

                    <div className='row py-3'>
                      <div className='col-12 d-flex  justify-content-center'>
                        <input
                          type='text'
                          class='form-control'
                          id='exampleFormControlInput1'
                          disabled
                          value={userAddress}
                          placeholder=' Wallet Address'
                        />
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col d-flex justify-content-center'>
                        {buttonStatus === 'login' ? (
                          <div
                            class='spinner-border text-success'
                            role='status'
                          >
                            <span class='visually-hidden'>Loading...</span>
                          </div>
                        ) : (
                          <button
                           // onClick={handleUserLogin}
                            className='btn btn-outline border-white text-white withdrawButton'
                          >
                            Login
                          </button>
                        )}
                      </div>
                      <div className='col d-flex justify-content-center'>
                        {buttonStatus === 'register' ? (
                          <div
                            class='spinner-border text-success'
                            role='status'
                          >
                            <span class='visually-hidden'>Loading...</span>
                          </div>
                        ) : (
                          <button
                         //   onClick={handleUserRegister}
                            className='btn btn-outline border-white text-white withdrawButton'
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}

      {/* withdraw  */}
      <div className='row m-0 p-0'>
      <div className='col-md-4'>
              <a href='/'>
                <img
                src='/assets/greendotfinlogo.png'
                 // src='/assets/finswap.png'
                  // className="img-fluid"
                  alt='logo'
                  loading='lazy'
                  // height={150}
                  className='myImg'
                />
              </a>
            </div>
        <div className='col-md-12 d-flex justify-content-end '>
          {userAddress ? (
            <button
              className='dashBoard wallet  btn btn-outline border-white text-white withdrawButton'
              // onClick={handleWalletConnect}

              disabled
              style={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                width: '160px',
                whiteSpace: 'nowrap',
                color: 'black',
              }}
            >
              {' '}
              {userAddress}
            </button>
          ) : (
            <button className=' wallet2' onClick={handleWalletConnect}>
              {' '}
              Connect Wallet{' '}
            </button>
          )}
        </div>
      </div>
      {isValid ? (
        <div className='container mt-5'>
          <div className='container '>
            <div className='row d-flex justify-content-center'>
              <div
                className='col-lg-5 col-md-8  p-2 m-2 shadow2 rounded-1'
                style={{
                //  backgroundColor: 'rgb(255 255 255)',
                backgroundImage:`url(${process.env.PUBLIC_URL+ "./assets/green_leave154.jpg"})`
                }}
              >
                <div className='row'>
                  <div className='col d-flex justify-content-center'>
                    <button
                      onClick={() => setToggleCard('deposit')}
                      className={`btn btn-outline border-white text-white ${
                        toggleCard === 'deposit'
                          ? 'activeButton'
                          : 'withdrawButton'
                      }`}
                    >
                      RE INVEST
                    </button>
                  </div>
                  {/*
                  <div className='col-md-12 d-flex justify-content-center'>
                        <img
                         // src='./assets/sss_world.png'
                         src='./assets/finswap.png' 
                         // className="img-fluid"
                          alt='logo'
                          loading='lazy'
                          // height={150}
                          className='myImg'
                        />
                      </div>
                    */}
                {/*}  <div className='col d-flex justify-content-center'>
                    <button
                      onClick={() => setToggleCard('withdraw')}
                      className={`btn btn-outline border-white text-white ${
                        toggleCard === 'withdraw'
                          ? 'activeButton'
                          : 'withdrawButton'
                      }`}
                    >
                      WITHDRAW
                    </button>
                    </div>  */}
                </div>

                {toggleCard === 'deposit' ? (
                  <div className='row'>
                    <div className='col py-4 '>
                      <div className='row '>
                        <div className='col-12'>
                          <h2 className='text-center pb-4' 
                          style={{
                            color: 'rgb(255 255 255)',
                         }}
                         >RE INVEST</h2>
                        </div>
                        <div className='col-12 '>
                          <p
                            className='ps-2  border mx-3 py-2 '
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '20px',
                            }}
                          >
                            (My Balance) - ({userWithdrawBalance}
                            {' Polkadot'})
                          </p>
                        </div>
                      </div>
                      <div className='row  mx-2 '>
                        <div className='col pt-2'>
                          <label htmlFor='input ' className='pb-2' 
                          style={{
                            color: 'rgb(255 255 255)',
                            fontWeight: '500',
                              fontSize: '20px',
                       }}
                       >
                            {' '}
                            Enter Polkadot Amount
                          </label>
                          <input
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '18px',
                            }}
                            className='form-control '
                            type='text'
                            placeholder='Enter Polkadot Value'
                            aria-label='default input example'
                            value={depositAmount}
                            onChange={(e) => {
                              setDepositamount(e.target.value);
                              //getEstimateToken(e.target.value);
                            }}
                          />
                          <p
                            className='text-white pt-2'
                            style={{ fontSize: '12px' }}
                          >
                            DEBIT : {depositAmount } Polkadot
                          </p>
                          <p className='text-white pt-2' style={{fontSize:'12px'}}>Limit Balance  : {userInvestLimitBalance} Polkadot </p>
                        </div>
                      </div>
                    </div>

                    <div className='row   pb-4'>
                      <div className='dashBoard dashBoard2 pt-4 text-center'>
                        <>
                          {console.log('buttton', buttonStatus)}
                          {approveBtn ? (
                            <>
                              {buttonStatus === 'approve' ? (
                                <div
                                  class='spinner-border text-success'
                                  role='status'
                                >
                                  <span class='visually-hidden'>
                                    Loading...
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className={`btn btn-outline border-white text-white  withdrawButton`}
                                  onClick={handleApprovePOLKADOT}
                                  // onClick={handleShow}
                                >
                                  APPROVE
                                </button>
                              )}{' '}
                            </>
                          ) : (
                            ''
                          )}
                          {!approveBtn ? (
                            <>
                              {buttonStatus === 'deposit' ? (
                                <div
                                  class='spinner-border text-success'
                                  role='status'
                                >
                                  <span class='visually-hidden'>
                                    Loading...
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className={`btn btn-outline border-white text-white  withdrawButton`}
                                  onClick={handleDepositPOLKADOT}
                                  // onClick={handleShow}
                                >
                                  Re Invest
                                </button>
                              )}{' '}
                            </>
                          ) : (
                            ''
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )}
                {toggleCard === 'withdraw' ? (
                  <div className='row'>
                    <div className='col py-4 '>
                      <div className='row '>
                        <div className='col-12'>
                          <h2 className='text-center pb-4'
                           style={{
                            color: 'rgb(255 255 255)',
                         }}>WITHDRAW</h2>
                        </div>
                        <div className='col-12 '>
                          <p
                            className='ps-2  border mx-3 py-2 '
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '20px',
                            }}
                          >
                            (My Balance) - ({userWithdrawBalance}
                            {' FTC COIN'})
                          </p>
                        </div>
                      </div>
                      <div className='row  mx-2 '>
                        <div className='col pt-2'>
                          <label htmlFor='input ' className='pb-2'
                          style={{
                            color: 'rgb(255 255 255)',
                            fontWeight: '500',
                              fontSize: '20px',
                       }}
                          >
                            {' '}
                            Enter USD Amount
                          </label>
                          <input
                            style={{
                              backgroundColor: '#D9D9D9',
                              borderRadius: '5px',
                              color: '#2f323b ',
                              fontWeight: '500',
                              fontSize: '18px',
                            }}
                            className='form-control '
                            type='text'
                            placeholder='Enter Value'
                            aria-label='default input example'
                            value={withdrawValue}
                            onChange={(e) => {
                              setWithdrawValue(e.target.value);
                              //_estimatedCreditValue(e.target.value);
                            }}
                          />
                            <p className='pt-2' style={{fontSize:'12px'}}>CREDIT : {estimateWithdrawValue ??'0'} FTC COIN</p>

                        </div>
                      </div>
                    </div>

                    <div className='row   pb-4'>
                      <div className='dashBoard dashBoard2 pt-4 text-center'>
                        <>
                          {!handleWithdrawLoader ? (
                            <button
                              className='btn btn-outline border-white text-white withdrawButton'
                              //onClick={handleWithdraw}
                              // onClick={handleShow}
                            >
                              Withdraw
                            </button>
                          ) : (
                            <div
                              class='spinner-border text-success'
                              role='status'
                            >
                              <span class='visually-hidden'>Loading...</span>
                            </div>
                          )}
                        </>
                      </div>

                    </div>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>

          {handleWithdrawLoader ? (
            <div
              className='alert alert-warning bg-danger text-light'
              role='alert'
            >
              Don't refresh the page, otherwise you lost your money.
            </div>
          ) : (
            ''
          )}

          {/* <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
                <h4 className='text-dark'>Transaction </h4>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className='text-dark'>Are you sure ?</p>
              <p className='text-dark'>Withdraw Value {popUpwithdrawValue}</p>
              <p className='text-dark'>Claim Value {popUpClaimValue} </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={handleClose}>
                Reject
              </Button>
              <Button variant='primary' onClick={handleWithdraw}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal> */}
        </div>
      ) : (
        ''
      )}
    </>
  );
}
