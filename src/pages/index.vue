<script setup lang="ts">
  import { ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCryptoStore } from '~/store/crypto'
  import iLendingPool  from '~/contracts/ILendingPool.json'
  import iERC20  from '~/contracts/IERC20WithPermit'
import { ethers } from 'ethers'

  const cryptoStore = useCryptoStore()
  const { connectWallet, disconnectWallet, getBalance } = useCryptoStore()
  const { account, lendingPool } = storeToRefs(cryptoStore)  

  const amount = ref(0)
  const destination = ref('')

  async function deposit() {
    try {
      const amountString = amount.value.toString()
      const usdcMumbai = "0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e".toLowerCase()
      const usdcDecimals = 6
      const amountDeposit = ethers.utils.parseUnits(amountString,usdcDecimals)
      // const provider = ethers.getDefaultProvider('https://polygon-mumbai.g.alchemy.com/v2/soQ4cv_lP6qRhW7YN8my9pfiAcVzylZI')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();


      const lendingPoolAddress = '0x9198F13B08E299d85E096929fA9781A1E3d5d827'

      const lendingPoolContract = new ethers.Contract(lendingPoolAddress,iLendingPool.abi,signer) 
      const usdcContract = new ethers.Contract(usdcMumbai,iERC20.abi,signer)

      const approve = await usdcContract.approve(lendingPoolAddress,amountDeposit, {gasPrice: 30000000000})
      console.log("🚀 ~ file: index.vue:30 ~ deposit ~ approve", approve)
      const depositAction = await lendingPoolContract.deposit(usdcMumbai, amountDeposit, destination.value.toLowerCase(), 0, {gasPrice: 30000000000})
      console.log("🚀 ~ file: index.vue:32 ~ deposit ~ depositAction", depositAction)
    } catch (error) {
      console.error(error)
    }
  }

</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="text-2xl m-4">
      AAVE pilot
    </h1>
    <button v-if ="!account" @click="connectWallet()" class="bg-green-300 rounded p-4">
      Connect Wallet
    </button>
    <div v-else>
      <button @click="disconnectWallet()" class="bg-red-300 rounded p-4">
        Disconnect Wallet
      </button>
      <p>Account {{ account }}</p>
    </div>


    <!-- AAVE JS Section -->
    <div class="mt-10">
      <p>USDC Amount</p>
      <input v-model="amount" type="number" label="Amount">
      <p>Beneficiary (optional)</p>
      <input v-model="destination" type="text" label="Destination" class="mb-10">
      <br>
      <button @click="deposit()" class="bg-blue-300 rounded p-2 mx-5">
        Deposit
      </button>
      <!-- <button @click="disconnectWallet()" class="bg-blue-300 rounded p-2 mx-5">
        Redeeem
      </button>
      <button @click="disconnectWallet()" class="bg-blue-300 rounded p-2 mx-5">
        Borrow
      </button>
      <button @click="disconnectWallet()" class="bg-blue-300 rounded p-2 mx-5">
        Repay Borrow
      </button> -->
    </div>
  </div>
</template>

