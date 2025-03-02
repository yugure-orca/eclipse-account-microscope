<script lang="ts">
  import { Address } from "@coral-xyz/anchor";
  import { getRPC } from "../libs/client";
  import { getTokenList, TokenInfo } from "../libs/orcaapi";
  import { getShortAddressNotation } from "../libs/utils";

  export let address: Address;
  export let short: boolean = false;
  export let length: number = 5;
  export let type: string = "generic";

  function getExplorerURL(address: Address): string {
    if ( !address ) return "";

    const explorerBaseUrl = "https://explorer.dev.eclipsenetwork.xyz/address";
    const rpc = getRPC();

    let querystring = "";
    if (rpc.network === "devnet") {
      querystring = "?cluster=devnet";
    }
    if (rpc.network === "localnet") {
      querystring = `?cluster=custom&customUrl=${rpc.url}`;
    }
    if (rpc.network === "custom") {
      // pass (don't include custom RPC URL, treat it as mainnet)
    }

    const url = `${explorerBaseUrl}/${address.toString()}${querystring}`;
    return url;
  }

  function getSolscanURL(address: Address): string {
    if ( !address ) return "";

    const solscanBaseUrl = "https://solscan.io/account";
    const rpc = getRPC();

    let querystring = "";
    if (rpc.network === "devnet") {
      querystring = "?cluster=devnet";
    }
    if (rpc.network === "localnet") {
      querystring = `?cluster=custom&customUrl=${rpc.url}`;
    }
    if (rpc.network === "custom") {
      // pass (don't include custom RPC URL, treat it as mainnet)
    }

    const url = `${solscanBaseUrl}/${address.toString()}${querystring}`;
    return url;
  }

  function getSolanaFmURL(address: Address): string {
    if ( !address ) return "";

    const solscanBaseUrl = "https://solana.fm/address";
    const rpc = getRPC();

    let querystring = "";
    if (rpc.network === "devnet") {
      querystring = "?cluster=devnet-solana";
    }
    if (rpc.network === "localnet") {
      // Solana FM doesn't accept custom RPC URL
      // pass (don't include localnet RPC URL, treat it as mainnet)
    }
    if (rpc.network === "custom") {
      // pass (don't include custom RPC URL, treat it as mainnet)
    }

    const url = `${solscanBaseUrl}/${address.toString()}${querystring}`;
    return url;
  }

  let tokenInfo: TokenInfo|undefined = undefined;
  getTokenList().then((list) => {tokenInfo = list.getTokenInfoByMint(address)});

  let toolkit;
  let clipboard;
  function copy() {
    navigator.clipboard.writeText(address.toString());
    clipboard.textContent = "✅";
    setTimeout(()=>clipboard.textContent = "📎", 1000);
  }

  let path = `#/${type}/${address}`;
</script>

{#if address}
📘
<span on:mouseenter={() => toolkit.style.setProperty("visibility", "visible")} on:mouseleave={() => toolkit.style.setProperty("visibility", "hidden")} style="cursor: pointer;">
<a href={path}>
{#if short}
<span>{getShortAddressNotation(address, length)}</span>
{:else}
<span>{address}</span>
{/if}
{#if type === "token2022/mint" || type === "token2022/account"}
{"[2022]"}
{/if}
{#if tokenInfo && !tokenInfo.poolToken}
({tokenInfo.symbol})
{/if}
</a>
<span bind:this={toolkit} style="visibility: hidden;">
  {#if address}
  <a target="_blank" rel="noreferrer" href={getExplorerURL(address)}>🔭</a>
  <!--a target="_blank" rel="noreferrer" href={getSolscanURL(address)}>🔍</a-->
  <!--a target="_blank" rel="noreferrer" href={getSolanaFmURL(address)}>📻</a-->
  <a href="#/generic/{address}">🪣</a>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span bind:this={clipboard} on:click={copy}>📎</span>
  {/if}
</span>
</span>
{:else}
{address}
{/if}

<style>
  a {
    color: #39f;
    text-decoration: none;
  }
</style>