import { ethers } from "ethers";

export const convertToETH = (value: string | undefined) => {
    if (value) {
      return ethers.formatEther(value);
    }
  }