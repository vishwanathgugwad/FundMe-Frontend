import { ethers } from "./ethers-5.6.esm.min.js"
const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("ethBalance")
const withdrawETH = document.getElementById("withdraweth")
import { abi, contractAddress } from "./constants.js"

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawETH.onclick = withdraw

async function connect() {
    if (typeof window.ethereum != "undefined") {
        console.log(`i see a metamast!!`)
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "Connected"
        } catch (err) {
            console.log(err)
        }
    } else connectButton.innerHTML = "Please install metamask"
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}`)
    if (typeof window.ethereum != "undefined") {
        // provider / connection with blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / someone with gas
        const signer = provider.getSigner()
        console.log(signer)
        // contract that we are interacating with
        const contract = new ethers.Contract(contractAddress, abi, signer) //

        //ABI and Address
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenTransactionForMine(transactionResponse, provider)
            console.log("Done!")
            document.getElementById("ethAmount").value = ""
        } catch (err) {
            console.log(err)
        }
    }
}

async function withdraw() {
    console.log(`withdrawing...`)
    if (typeof window.ethereum != "undefined") {
        // provider / connection with blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / someone with gas
        const signer = provider.getSigner()
        console.log(signer)
        // contract that we are interacating with
        const contract = new ethers.Contract(contractAddress, abi, signer) //

        //ABI and Address
        try {
            const transactionResponse = await contract.withdraw()
            await listenTransactionForMine(transactionResponse, provider)
            console.log("Done!")
            document.getElementById("ethAmount").value = ""
        } catch (err) {
            console.log(err)
        }
    }
}

function listenTransactionForMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash} ... `)
    //listen for this transaction to finish
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        balanceButton.innerHTML = ethers.utils.formatEther(balance) + " ETH"
        console.log(`Balance is ${ethers.utils.formatEther(balance)} ETH`)
    }
}
