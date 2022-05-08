import { Program, AnchorProvider } from "@project-serum/anchor";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { STABLE_POOL_IDL, STABLE_POOL_PROGRAM_ID } from "./const";

export function getProgramInstance(connection, wallet) {
  if (!wallet.publicKey) throw new WalletNotConnectedError();

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  return new Program(STABLE_POOL_IDL, STABLE_POOL_PROGRAM_ID, provider);
}
