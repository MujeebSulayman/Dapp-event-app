import EventList from '@/components/EventList'
import Hero from '@/components/Hero'
import { getEvents } from '@/services/blockchain'
import { generateEventData } from '@/utils/fakeData'
import { EventStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const Page: NextPage = () => {
  const [end, setEnd] = useState<number>(6)
  const [count] = useState<number>(6)
  const [collection, setCollection] = useState<EventStruct[]>([])
  const [events, setEvents] = useState<EventStruct[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents()
        setEvents(fetchedEvents)
      } catch (error) {
        console.error('Failed to fetch events:', error)
        // Handle the error appropriately
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    setCollection(events.slice(0, end))
  }, [events, end])

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <Head>
        <title>HemiVent</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Hero />
      {events.length > 0 ? (
        <EventList events={collection} />
      ) : (
        <p className="text-center text-white mt-10">No events available.</p>
      )}

      <div className="mt-10 h-20 "></div>

      {collection.length > 0 && events.length > collection.length && (
        <div className="w-full flex justify-center items-center">
          <button
            className="px-6 py-3 rounded-lg text-sm font-medium text-white  bg-indigo-600 hover:bg-indigo-700  duration-300 transition-all"
            onClick={() => setEnd(end + count)}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default Page
