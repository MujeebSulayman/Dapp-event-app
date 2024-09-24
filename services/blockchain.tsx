import { ethers } from 'ethers'
import { dappEventXContract as address } from '@/contracts/contractAddress.json'
import { abi } from '@/artifacts/contracts/DappEventX.sol/DappEventX.json'
import { EventParams, EventStruct } from '@/utils/type.dt'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any
let tx: any

if (typeof window !== 'undefined') ethereum = window.ethereum

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })
  if (accounts.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(address, abi, signer)
    return contract
  } else {
    const provider = new ethereum.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contract = new ethers.Contract(address, abi, signer)
    return contract
  }
}

const createEvent = async (event: EventParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install wallet provider')
    return Promise.reject('Please install wallet provider')
  }
  try {
    const contract = await getEthereumContracts()
    tx = await contract.createEvent(
      event.title,
      event.description,
      event.imageUrl,
      event.capacity,
      toWei(Number(event.ticketCost)),
      event.startsAt,
      event.endsAt
    )
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const getEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getEvents()
  return events
}





export { createEvent }
