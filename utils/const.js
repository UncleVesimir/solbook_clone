import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import facebook_sol from "../facebook_sol/target/idl/face.json";

export const CLUSTER =
  process.env.REACT_APP_CLUSTER === "mainnet"
    ? "mainnet"
    : process.env.REACT_APP_CLUSTER === "testnet"
    ? "testnet"
    : "devnet";

export const SOLANA_HOST = process.env.REACT_APP_SOLANA_API_URL
  ? process.env.REACT_APP_SOLANA_API_URL
  : CLUSTER === "mainnet"
  ? clusterApiUrl("mainnet-beta")
  : CLUSTER === "testnet"
  ? clusterApiUrl("testnet")
  : clusterApiUrl("devnet");

export const STABLE_POOL_PROGRAM_ID = new PublicKey(
  "2wrK91jxNLfCzAr3FSCfNSnHhQieyvAFJ3jQ1ubbmfzT"
);

export const STABLE_POOL_IDL = facebook_sol;
