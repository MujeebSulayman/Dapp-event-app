import { ethers } from 'ethers'
import contractAddress from '@/contracts/contractAddress.json'
import DappEventXArtifact from '@/artifacts/contracts/DappEventX.sol/DappEventX.json'
import { EventParams, EventStruct, TicketStruct } from '@/utils/type.dt'

const address = contractAddress.dappEventXContract
const abi = DappEventXArtifact.abi

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
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contract = new ethers.Contract(address, abi, signer)
    return contract
  }
}

//Create an Event
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

//Update an Event
const updateEvent = async (event: EventParams): Promise<void> => {
  if (!ethereum) {
    reportError('Please install wallet provider')
    return Promise.reject(new Error('Please install wallet provider'))
  }
  try {
    const contract = await getEthereumContracts()
    tx = await contract.updateEvent(
      event.id,
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

//DELETE EVENT
const deleteEvent = async (eventId: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install wallet provider')
    return Promise.reject(new Error('Please install wallet provider'))
  }
  try {
    const contract = await getEthereumContracts()
    tx = await contract.deleteEvent(eventId)
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}
//BUY TICKET
const buyTickets = async (event: EventStruct, tickets: number): Promise<void> => {
  if (!ethereum) {
    reportError('Please install wallet provider')
    return Promise.reject(new Error('Please install wallet provider'))
  }
  try {
    const contract = await getEthereumContracts()
    tx = await contract.buyTickets(event.id, tickets, { value: toWei(event.ticketCost * tickets) })
    await tx.wait()
    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

//Get All Events
const getEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getEvents()
  return events.length > 0 ? structuredEvent(events) : []
}

//Get a single Event
const getEvent = async (eventId: number): Promise<EventStruct> => {
  const contract = await getEthereumContracts()
  const event = await contract.getSingleEvent(eventId)
  return structuredEvent([event])[0]
}

//Get Personal event
const getMyEvents = async (): Promise<EventStruct[]> => {
  const contract = await getEthereumContracts()
  const events = await contract.getMyEvents()
  return structuredEvent(events)
}

//Get All Tickets
const getTickets = async (eventId: number): Promise<TicketStruct[]> => {
  const contract = await getEthereumContracts()
  const tickets = await contract.getTickets(eventId)
  return structuredTicket(tickets)
}

const structuredTicket = (tickets: TicketStruct[]): TicketStruct[] =>
  tickets
    .map((ticket) => ({
      id: Number(ticket.id),
      eventId: Number(ticket.eventId),
      owner: ticket.owner,
      ticketCost: parseFloat(fromWei(ticket.ticketCost)),
      timestamp: Number(ticket.timestamp),
      refunded: ticket.refunded,
      minted: ticket.minted,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

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

export {
  createEvent,
  updateEvent,
  getEvents,
  getEvent,
  deleteEvent,
  getMyEvents,
  getTickets,
  buyTickets,
}
