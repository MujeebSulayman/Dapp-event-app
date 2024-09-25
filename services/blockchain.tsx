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
  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(address, abi, signer)
    return contract
  } else {
    // Use a fallback RPC URL if the local network is not available
    const fallbackRpcUrl =
      'https://sepolia.infura.io/v3/43b63ab830c94d8a98ca966e9d167c57' ||
      process.env.NEXT_PUBLIC_RPC_URL
    const provider = new ethers.JsonRpcProvider(fallbackRpcUrl)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contract = new ethers.Contract(address, abi, signer)
    return contract
  }
}

const createEvent = async (event: EventParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install wallet provider')
    return Promise.reject(new Error('Please install wallet provider'))
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
  return structuredEvent(events)
}

const getEvent = async (eventId: number): Promise<EventStruct> => {
  const contract = await getEthereumContracts()
  const event = await contract.getSingleEvent(eventId)
  return structuredEvent([event])[0]
}

const getMyEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getMyEvents()
  return structuredEvent(events)
}

const structuredEvent = (events: EventStruct[]): EventStruct[] =>
  events
    .map((event) => ({
      id: Number(event.id),
      title: event.title,
      imageUrl: event.imageUrl,
      description: event.description,
      owner: event.owner,
      sales: Number(event.sales),
      ticketCost: parseFloat(fromWei(event.ticketCost)),
      capacity: Number(event.capacity),
      seats: Number(event.seats),
      startsAt: Number(event.startsAt),
      endsAt: Number(event.endsAt),
      timestamp: Number(event.timestamp),
      deleted: event.deleted,
      paidOut: event.paidOut,
      refunded: event.refunded,
      minted: event.minted,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

export { createEvent, getEvents, getEvent, getMyEvents }
