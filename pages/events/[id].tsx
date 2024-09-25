import Head from 'next/head'
import Link from 'next/link'
import Moment from 'react-moment'
import BuyTicket from '@/components/BuyTicket'
import Identicon from 'react-identicons'
import { GetServerSidePropsContext, NextPage } from 'next'
import { BsCalendar, BsClock, BsPeople, BsGeoAlt } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { EventStruct, RootState, TicketStruct } from '@/utils/type.dt'
import { calculateDateDifference, formatDate, truncate } from '@/utils/helper'
import { useAccount } from 'wagmi'
import EventActions from '@/components/EventAction'
import { useDispatch, useSelector } from 'react-redux'
import { globalActions } from '@/store/globalSlices'
import { useEffect } from 'react'
import { getEvent } from '@/services/blockchain'
import { generateTicketData } from '@/utils/fakeData'

interface ComponentProps {
  eventData: EventStruct
  ticketsData: TicketStruct[]
}

const Page: NextPage<ComponentProps> = ({ eventData, ticketsData }) => {
  const { address } = useAccount()

  const dispatch = useDispatch()
  const { setEvent, setTickets } = globalActions
  const { event, tickets } = useSelector((states: RootState) => states.globalStates)

  useEffect(() => {
    dispatch(setEvent(eventData))
    dispatch(setTickets(ticketsData))
  }, [dispatch, setEvent, eventData, setTickets, ticketsData])

  return event ? (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Event X | {event.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side: Event details */}
          <div className="md:w-2/3">
            <div className="relative mb-6">
              <img src={event.imageUrl} alt={event.title} className="w-full h-96 object-cover rounded-lg" />
              {!event.minted ? (
                <span className="absolute top-4 right-4 bg-orange-500 text-black text-sm font-semibold px-4 py-2 rounded-full">
                  Open
                </span>
              ) : (
                <span className="absolute top-4 right-4 bg-cyan-500 text-black text-sm font-semibold px-4 py-2 rounded-full">
                  Minted
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-center text-indigo-400 mb-2">
                  <BsCalendar className="text-lg mr-2" />
                  <h3 className="text-lg font-semibold">Date</h3>
                </div>
                <p className="text-white text-sm">{formatDate(event.startsAt)}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-center text-indigo-400 mb-2">
                  <BsClock className="text-xl mr-2" />
                  <h3 className="text-lg font-semibold">Time Remaining</h3>
                </div>
                <p className="text-white text-sm">{calculateDateDifference(event.endsAt, Date.now())}</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-center text-indigo-400 mb-2">
                  <BsPeople className="text-xl mr-2" />
                  <h3 className="text-lg font-semibold">Available Seats</h3>
                </div>
                <p className="text-white text-sm">{event.capacity - event.seats} left</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="flex items-center text-indigo-400 mb-2">
                  <BsGeoAlt className="text-xl mr-2" />
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>
                <p className="text-white text-sm">Event Location</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{event.description}</p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-2xl font-bold text-indigo-400">
                <FaEthereum className="mr-2" />
                <span>{event.ticketCost.toFixed(2)} ETH</span>
              </div>
            </div>

            <div className="flex gap-4">
              {event.endsAt > Date.now() && (
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                  Buy Ticket
                </button>
              )}
              {address === event.owner && <EventActions event={event} />}
            </div>
          </div>

          {/* Right side: Recent purchases */}
          <div className="md:w-1/3 bg-gray-900 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Recent Purchases ({tickets.length})</h2>
            <div className="space-y-4">
              {tickets.slice(0, 5).map((ticket, i) => (
                <div key={i} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Identicon className="rounded-full" size={32} string={ticket.owner} />
                      <span className="font-medium">
                        {truncate({
                          text: ticket.owner,
                          startChars: 4,
                          endChars: 4,
                          maxLength: 11,
                        })}
                      </span>
                    </div>
                    <span className="flex items-center text-indigo-400 font-semibold">
                      <FaEthereum className="mr-1" /> {ticket.ticketCost.toFixed(2)}
                    </span>
                  </div>
                  <Moment fromNow className="text-sm text-gray-400">{ticket.timestamp}</Moment>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href={'/events/tickets/' + event.id}
                className="block w-full text-center bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                View All Sales
              </Link>
            </div>
          </div>
        </div>
      </main>

      <BuyTicket event={event} />
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const eventData: EventStruct = await getEvent(Number(id))
  const ticketsData: TicketStruct[] = generateTicketData(5)

  return {
    props: {
      eventData: JSON.parse(JSON.stringify(eventData)),
      ticketsData: JSON.parse(JSON.stringify(ticketsData)),
    },
  }
}
