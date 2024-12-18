"use client";

import { Connection, Transaction } from "@solana/web3.js";
import { useWallet } from "@jup-ag/wallet-adapter";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Hero() {
  const { publicKey, sendTransaction } = useWallet();
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const connection = new Connection(
    `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
  );

  async function checkEligibility(): Promise<void> {
    try {
      setIsLoading(true);

      if (!publicKey) {
        toast.error("Please connect your wallet!");
        return;
      }

      const response = await fetch("/api/eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: publicKey.toString(),
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        setIsEligible(false);
        return;
      }

      if (data.eligibility && data.eligibility.total > 0) {
        setIsEligible(true);
        toast.success("You are eligible for the airdrop!");
      } else {
        setIsEligible(false);
        toast.info("You are not eligible for the airdrop");
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      toast.error("Error checking eligibility. Please try again.");
      setIsEligible(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function claim(): Promise<void> {
    try {
      setIsLoading(true);
      if (!publicKey) {
        toast.error("Please connect your wallet!");
        return;
      }

      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: publicKey.toString(),
        }),
      });

      const data = await response.json();

      console.log("claim data", data.claim[0].data);

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (!data.claim) {
        toast.error("Invalid claim data received");
        return;
      }

      const claimData = data.claim[0];
      console.log("claimData", claimData);
      const transaction = Transaction.from(
        Buffer.from(claimData.data, "base64")
      );

      console.log("claim transaction", transaction);

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "processed");

      toast.success("Airdrop claimed successfully!");
    } catch (error) {
      console.error("Error claiming airdrop:", error);
      toast.error("Error claiming airdrop. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-center text-black mb-4">
        Connect your wallet to check eligibility and claim your airdrop.
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-4">
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50"
            onClick={checkEligibility}
            disabled={isLoading || !publicKey}
          >
            {isLoading ? "Checking..." : "Check Eligibility"}
          </button>

          {isEligible && (
            <button
              className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800 disabled:opacity-50"
              onClick={claim}
              disabled={isLoading || !publicKey}
            >
              {isLoading ? "Claiming..." : "Claim Airdrop"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
