import { PublicKey, AccountInfo } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Address } from "@project-serum/anchor";
import { ORCA_WHIRLPOOL_PROGRAM_ID } from "@orca-so/whirlpools-sdk";
import { AddressUtil } from "@orca-so/common-sdk";
import { getConnection } from "./client";

const ORCA_TOKEN_SWAP_V1_ID = new PublicKey("DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1");
const ORCA_TOKEN_SWAP_V2_ID = new PublicKey("9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP");

export type ResolvedAccount = {
  pubkey: PublicKey,
  path: string,
}

export async function resolveAccountType(addr: Address): Promise<ResolvedAccount> {
  const pubkey = AddressUtil.toPubKey(addr);
  const connection = getConnection();
  const accountInfo = await connection.getAccountInfo(pubkey);

  if (accountInfo.owner.equals(ORCA_WHIRLPOOL_PROGRAM_ID)) {
    switch (accountInfo.data.length) {
      case 9988: return { pubkey, path: "/whirlpool/tickarray" };
      case 653: return { pubkey, path: "/whirlpool/whirlpool" };
      case 216: return { pubkey, path: "/whirlpool/position" };
      case 108: return { pubkey, path: "/whirlpool/config" };
      case 44: return { pubkey, path: "/whirlpool/feetier" };
    }
  }

  if (accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
    switch (accountInfo.data.length) {
      case 165: return { pubkey, path: "/token/account" };
      case 82: return { pubkey, path: "/token/mint" };
    }
  }

  if (accountInfo.owner.equals(ORCA_TOKEN_SWAP_V1_ID) || accountInfo.owner.equals(ORCA_TOKEN_SWAP_V2_ID)) {
    switch (accountInfo.data.length) {
      case 324: return { pubkey, path: "/tokenswap/swapstate" };
    }
  }

  return { pubkey, path: "/generic" };
}