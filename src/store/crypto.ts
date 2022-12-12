import { ethers } from 'ethers'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { v1, v2, Network, Market, TxBuilderV2 } from '@aave/protocol-js'
import { any } from 'cypress/types/bluebird'

export const useCryptoStore = defineStore('user', () => {
    const account = ref(null)
    const lendingPool = ref(undefined)
    const loading = ref(false)

    async function  getBalance() {
        setLoader(true)
        try {
            const { ethereum } = window
            if(ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                setLoader(false)
            }
        } catch (error) {
            setLoader(false)
            console.error(error)
        }
    }

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            console.log('MetaMask is installed!');
          }
        const { ethereum } = window
        if (!ethereum) {
            alert('Must connect to Metamask')
        }
        const myAccounts = await ethereum.request({ method: 'eth_requestAccounts' })
        console.log('Connected: ', myAccounts[0])
        account.value = myAccounts[0]
        await getBalance()
        await getLendingPool()
    }

    async function disconnectWallet() {
        //TODO: Write method
        console.log('TODO: Disconnect Wallet')
    }

    async function getLendingPool() {
        console.log(import.meta.env.VITE_SOME_KEY)
        const httpProvider = ethers.getDefaultProvider('https://polygon-mumbai.g.alchemy.com/v2/soQ4cv_lP6qRhW7YN8my9pfiAcVzylZI')
        const txBuilder = new TxBuilderV2(Network.mumbai, httpProvider)
        lendingPool.value = txBuilder.getLendingPool(Market.Proto)
        console.log('Lending Pool', lendingPool)
    }

    function setLoader(value: boolean) {
        console.log('setLoader', value)
        loading.value = value
    }

    return {
        account,
        loading,
        connectWallet,
        disconnectWallet,
        getBalance,
        lendingPool
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCryptoStore, import.meta.hot))
}