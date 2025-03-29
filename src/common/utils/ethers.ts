import { Wallet, utils } from "ethers";
import { BigNumber } from "ethers";

export const getEthWallet = (privateKey: string): Wallet => {
  if (!privateKey) {
    throw new Error("Private key missing");
  }

  return new Wallet(privateKey);
};

export const ether = (amount: number | string): BigNumber => {
  const weiString = utils.parseEther(amount.toString());
  return BigNumber.from(weiString);
};

export const usdc = (amount: number): BigNumber => {
  const weiString = 1000000 * amount;
  return BigNumber.from(weiString);
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
