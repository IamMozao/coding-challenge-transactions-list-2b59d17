import React, { FC, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FieldValues, SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { Actions, InputProps, TransactionData, TransactionFields } from "../types";
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner, Signer } from "ethers";

const SendTransaction: React.FC = () => {
  const dispatch = useDispatch();
  const [sender, setSender] = useState<string>();
  const [accounts, setAccounts] = useState<JsonRpcSigner[]>([]);
  const provider = new JsonRpcProvider("http://localhost:8545");
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<TransactionData>();

  const walletProvider = new BrowserProvider(window.web3.currentProvider);

  useEffect(() => {
    // Get addresses from list
    const getAccounts = async () => await provider.listAccounts().then((res: JsonRpcSigner[]) => {
      setAccounts(res)
    });

    // Get address from connected wallet
    const signer: any = async () => await walletProvider.getSigner()
      .then((res: JsonRpcSigner) => {
        setSender(res.address);
      });

    signer();
    getAccounts();

  }, []);

  const newAddress = async () => {
    const min = 1;
    const max = 19;
    const random = Math.round(Math.random() * (max - min) + min);
    const recipient = accounts[random].address;
    setValue("recipient", recipient);
  }

  const onSubmit: SubmitHandler<TransactionData> = (data) => {
    handleDispatch({ ...data, sender: sender! });
  }

  const handleDispatch = useCallback((data: TransactionData) => {
    document!.getElementById("loading-spinner")!.classList.toggle("show");
    dispatch({
      type: Actions.SendTransaction,
      payload: data
    })
  }, [dispatch]);

  return (
    <>
      <button
        data-hs-overlay="#hs-basic-modal"
        type="button"
        className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
      >
        Send
      </button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          id="hs-basic-modal"
          className="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto bg-black bg-opacity-60"
        >
          <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-100 transition-all w-full m-3 mx-auto flex flex-col h-full items-center justify-center ">

            <div className="loading-wrapper bg-white border shadow-sm rounded-xl w-modal ">
              <div id="loading-spinner" className="loading">
                <div role="status">
                  <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 px-4 border-b">
                <h3 className="font-bold text-gray-800 text-xl">
                  Send Transaction
                </h3>
                <button
                  type="button"
                  className="hs-dropdown-toggle inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm"
                  data-hs-overlay="#hs-basic-modal"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-3.5 h-3.5"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 overflow-y-auto loading-wrapper">

                <p className="mt-1 mb-6 text-gray-800">
                  Send ETH to a wallet address
                </p>
                <label
                  htmlFor="input-sender"
                  className="block text-sm font-bold my-2"
                >
                  Sender:
                </label>
                <div className="input-wrapper">
                  <input
                    type="string"
                    id="sender"
                    maxLength={42}
                    placeholder={sender}
                    className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                    {...register("sender", {
                      disabled: true,
                      required: true,
                      pattern: /^0x/,
                      validate: v => v.length === 42,
                    })}
                  />
                  {errors?.sender?.type === "required" && <p>This field is required</p>}
                  {errors?.sender?.type === "pattern" && <p>This address is invalid</p>}
                  {errors?.sender?.type === "validate" && <p>This address is not complete</p>}
                </div>

                <label
                  htmlFor="input-recipient"
                  className="block text-sm font-bold my-2"
                >
                  Recipient:
                </label>
                <div className="flex flex-row content-center items-stretch">
                  <div className="grow">
                    <input
                      type="string"
                      id="recipient"
                      maxLength={42}
                      className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                      {...register("recipient", {
                        disabled: false,
                        required: true,
                        pattern: /^0x/,
                        validate: v => v.length === 42,
                      })}
                    />
                    {errors?.recipient?.type === "required" && <p>This field is required</p>}
                    {errors?.recipient?.type === "pattern" && <p>This address is invalid</p>}
                    {errors?.recipient?.type === "validate" && <p>This address is not complete</p>}
                  </div>
                  <div className="self-center pl-1 cursor-pointer" onClick={newAddress}>
                    <svg className="h-8 w-8 text-blue-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" /></svg>
                  </div>
                </div>
                <label
                  htmlFor="input-amount"
                  className="block text-sm font-bold my-2"
                >
                  Amount:
                </label>
                <input
                  type="string"
                  id={TransactionFields.amount}
                  className="opacity-70 py-3 px-4 block bg-gray-50 border-gray-800 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 w-full"
                  placeholder="Amount"
                  {...register("amount", {
                    required: true,
                    min: 0
                  })}
                />
                {errors?.amount?.type === "min" && <p>This value is not valid</p>}
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                <button
                  type="button"
                  className="hs-dropdown-toggle py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm"
                  data-hs-overlay="#hs-basic-modal"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SendTransaction;
