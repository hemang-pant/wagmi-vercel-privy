'use client';

import Balance from 'components/Balance';
import BlockNumber from 'components/BlockNumber';
import Button from 'components/Button';
import ContractEvent from 'components/ContractEvent';
import ContractRead from 'components/ContractRead';
import ContractReads from 'components/ContractReads';
import ContractWrite from 'components/ContractWrite';
import EnsAddress from 'components/EnsAddress';
import EnsAvatar from 'components/EnsAvatar';
import EnsName from 'components/EnsName';
import EnsResolver from 'components/EnsResolver';
import FeeData from 'components/FeeData';
import PublicClient from 'components/PublicClient';
import SendTransaction from 'components/SendTransaction';
import SignMessage from 'components/SignMessage';
import SignTypedData from 'components/SignTypedData';
import Signer from 'components/Signer';
import SwitchNetwork from 'components/SwitchNetwork';
import Token from 'components/Token';
import Transaction from 'components/Transaction';
import WaitForTransaction from 'components/WaitForTransaction';
import WalletClient from 'components/WalletClient';
import WatchPendingTransactions from 'components/WatchPendingTransactions';
import {shorten} from 'lib/utils';
import Image from 'next/image';
import {useAccount, useDisconnect} from 'wagmi';
import { useBalanceModal } from '@arcana/ca-wagmi';
import { useCAFn } from "@arcana/ca-wagmi"

import {usePrivy, useWallets} from '@privy-io/react-auth';
import {useSetActiveWallet} from '@privy-io/wagmi';

import wagmiPrivyLogo from '../public/arcana_x_privy.png';
import { useState } from 'react';
import { Field, Label, Select, Input } from '@headlessui/react';

const MonoLabel = ({label}: {label: string}) => {
  return <span className="rounded-xl bg-slate-200 px-2 py-1 font-mono">{label}</span>;
};

export default function Home() {

  const { transfer, bridge } = useCAFn()
  const [sendVal, setSendVal] = useState(
    {
      to: '',
      amount: 0,
      chain: 0,
      token: '',
      open: false,
    }
  );
  const [bridgeVal, setBridgeVal] = useState({
    amount: 0,
    chain: 0,
    token: '',
    open: false,
  });
  // Privy hooks
  const {ready, user, authenticated, login, connectWallet, logout, linkWallet} = usePrivy();
  const {wallets, ready: walletsReady} = useWallets();

  // WAGMI hooks
  const {address, isConnected, isConnecting, isDisconnected} = useAccount();
  const {disconnect} = useDisconnect();
  const {setActiveWallet} = useSetActiveWallet();

  if (!ready) {
    return null;
  }

  const { showModal, hideModal } = useBalanceModal();
  return (
    <>
      <main className="min-h-screen bg-slate-200 p-4 text-slate-800">
        <Image
          className="mx-auto rounded-lg"
          src={wagmiPrivyLogo}
          alt="wagmi x privy logo"
          width={400}
          height={100}
        />
        <p className="my-4 text-center">
          This demo showcases how you can integrate{' '}
          <a href="https://www.npmjs.com/package/@arcana/ca-wagmi" className="font-medium underline">
            Arcana Network's CA-WAGMI SDK
          </a>{' '} and  {' '}
          <a href="https://wagmi.sh/" className="font-medium underline">
            wagmi
          </a>{' '}
          alongside{' '}
          <a href="https://www.privy.io/" className="font-medium underline">
            Privy
          </a>{' '}
          in your React app. Login below to try it out!
          <br />
          For more information, check out{' '}
          <a href="https://docs.privy.io/guide/guides/wagmi" className="font-medium underline">
            our integration guide
          </a>{' '}
          or the{' '}
          <a href="https://github.com/privy-io/wagmi-demo" className="font-medium underline">
            source code
          </a>{' '}
          for this app.
        </p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
            <h1 className="text-4xl font-bold">Privy</h1>
            {ready && !authenticated && (
              <>
                <p>You are not authenticated with Privy</p>
                <div className="flex items-center gap-4">
                  <Button onClick_={login} cta="Login with Privy" />
                  <span>or</span>
                  <Button onClick_={connectWallet} cta="Connect only" />
                </div>
              </>
            )}

            {walletsReady &&
              wallets.map((wallet) => {
                return (
                  <div
                    key={wallet.address}
                    className="flex min-w-full flex-row flex-wrap items-center justify-between gap-2 bg-slate-50 p-4"
                  >
                    <div>
                      <MonoLabel label={shorten(wallet.address)} />
                    </div>
                    <Button
                      cta="Make active"
                      onClick_={async () => {
                        setActiveWallet(wallet);
                      }}
                    />
                  </div>
                );
              })}

            {ready && authenticated && (
              <>
                <p className="mt-2">You are logged in with privy.</p>
                {/* <div
                  className="flex min-w-full flex-row flex-wrap items-center justify-between gap-2 bg-slate-50 p-4"
                > */}
                <button 
                // pink buttons
                className="mt-2 rounded bg-pink-500 px-4 py-2 text-white"
                onClick={() => {
                  showModal()
                }
                }
                >
                  Show Unified Balance
                </button>
                <button 
                // pink buttons
                className="mt-2 rounded bg-pink-500 px-4 py-2 text-white"
                onClick={() => {
                  if(sendVal.open) {
                    setSendVal({
                      to: '',
                      amount: 0,
                      chain: 0,
                      token: '',
                      open: false,
                    })
                  } else {
                    setBridgeVal({
                      ...bridgeVal,
                      open: false,
                    })
                    setSendVal({
                      ...sendVal,
                      open: true,
                    })
                  }
                }
                }
                >
                  Transfer
                </button>
                <button 
                // pink buttons
                className="mt-2 rounded bg-pink-500 px-4 py-2 text-white"
                onClick={() => {

                  if(bridgeVal.open) {
                    setBridgeVal({
                      token: '',
                      amount: 0,
                      chain: 0,
                      open: false,
                    })
                  } else {
                    setSendVal({
                      to: '',
                      amount: 0,
                      chain: 0,
                      token: '',
                      open: false,
                    })
                    setBridgeVal({
                      ...bridgeVal,
                      open: true,
                    })
                  }
                }
                }
                >
                  Bridge     
                </button>
                {/* </div> */}
                
                <br/>
                {
                  sendVal.open && (
                    <>
                    <Field>
                      <Label className="text-sm/6 font-medium text-black">
                        To
                      </Label>
                      <Input
                        type="text"
                        className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                        placeholder="Enter Wallet Address"
                        onChange={(e) => {
                          setSendVal({
                            ...sendVal,
                            to: e.target.value,
                          });
                          console.log(e.target.value);
                        }}
                      />
                    </Field>
                    <Field>
                      <Label className="text-sm/6 font-medium text-black">
                        Amount
                      </Label>
                      <Input
                        type="text"
                        className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                        placeholder="Amount"
                        onChange={(e) => {
                          console.log(e.target.value);
                          setSendVal({
                            ...sendVal,
                            amount: Number(e.target.value),
                          });
                        }}
                      />
                    </Field>

                    <Field>
                      <Label className="text-sm/6 font-medium text-black">
                        Token
                      </Label>
                      <Input
                        type="text"
                        className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                        placeholder="USDC"
                        onChange={(e) => {
                          console.log(e.target.value);
                          setSendVal({
                            ...sendVal,
                            token: e.target.value,
                          });
                        }}
                      />
                    </Field>
                    <Field>
                      <Label className="text-sm/6 font-medium text-black">
                        Chain
                      </Label>
                      <div className="relative">
                        <Select
                          className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                          defaultValue="active"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setSendVal({
                              ...sendVal,
                              chain: Number(e.target.value),
                            });
                          }}
                        >
                          <option value="0">Select Chain</option>
                          <option value="42161">Arbitrum One</option>
                          <option value="10">OP Mainnet</option>
                          <option value="8453">Base</option>
                          <option value="534532">Scroll</option>
                          <option value="137">Polygon POS</option>
                          <option value="1">Ethereum Mainnet</option>
                          <option value="59144">Linea</option>
                        </Select>
                      </div>
                      <div className="mt-5">
                        
                          <button
                            onClick={() => {
                              transfer({
                                to: `0x${sendVal.to
                                  .slice(2)}`,
                                amount: sendVal.amount.toString(),
                                token: sendVal.token as any,
                                chain: sendVal.chain,
                              });
                            }}
                            className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
                          >
                            Send
                          </button>
                      </div>
                    </Field>
                  </>
                )}
                {
                  bridgeVal.open && (
                    <>
                    <Field disabled>
                      <Label className="text-sm/6 font-medium text-black">
                        To
                      </Label>
                      <Input
                        type="text"
                        className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                        placeholder="SELF"
                        onChange={(e) => {
                          console.log(e.target.value);
                        }}
                      />
                    </Field>
                    <Field>
                      <Label className="text-sm/6 font-medium text-black">
                        Amount
                      </Label>
                      <Input
                        type="text"
                        className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                        placeholder="Amount"
                        onChange={(e) => {
                          console.log(e.target.value);
                          setBridgeVal({
                            ...bridgeVal,
                            amount: Number(e.target.value),
                          });
                        }}
                      />
                    </Field>

                    <Field>
                      <Label className="text-sm/6 font-medium text-black">
                        Token
                      </Label>
                      <Input
                        type="text"
                        className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                        placeholder="USDC"
                        onChange={(e) => {
                          console.log(e.target.value);
                          setBridgeVal({
                            ...bridgeVal,
                            token: e.target.value,
                          });
                        }}
                      />
                    </Field>
                    <Field>
                      <Label className="text-sm/6 font-medium text-black">
                        Chain
                      </Label>
                      <div className="relative">
                        <Select
                          className="mt-1 block w-half rounded-md bg-slate-700 text-white"
                          defaultValue="active"
                          onChange={(e) => {
                            console.log(e.target.value);
                            setBridgeVal({
                              ...bridgeVal,
                              chain: Number(e.target.value),
                            });
                          }}
                        >
                          <option value="0">Select Chain</option>
                          <option value="42161">Arbitrum One</option>
                          <option value="10">OP Mainnet</option>
                          <option value="8453">Base</option>
                          <option value="534532">Scroll</option>
                          <option value="137">Polygon POS</option>
                          <option value="1">Ethereum Mainnet</option>
                          <option value="59144">Linea</option>
                        </Select>
                      </div>
                      <div className="mt-5">
                        
                          <button
                            onClick={() => {
                              bridge({
                                amount: bridgeVal.amount.toString(),
                                token: bridgeVal.token as any,
                                chain: bridgeVal.chain,
                              });
                            }}
                            className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
                          >
                            Bridge
                          </button>
                        
                      </div>
                    </Field>
                  </>
                  )
                }
                <br />
                <Button onClick_={logout} cta="Logout from Privy" />
              </>
                  )
                }
            
          </div>
          <div className="border-1 flex flex-col items-start gap-2 rounded border border-black bg-slate-100 p-3">
            <h1 className="text-4xl font-bold">WAGMI</h1>
            <p>
              Connection status: {isConnecting && <span>🟡 connecting...</span>}
              {isConnected && <span>🟢 connected.</span>}
              {isDisconnected && <span> 🔴 disconnected.</span>}
            </p>
            {isConnected && address && (
              <>
                <h2 className="mt-6 text-2xl">useAccount</h2>
                <p>
                  address: <MonoLabel label={address} />
                </p>
                <Button onClick_={disconnect} cta="Disconnect from WAGMI" />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
