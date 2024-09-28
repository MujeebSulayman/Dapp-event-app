import EventList from '@/components/EventList'
import { getEvents } from '@/services/blockchain'
import { EventStruct } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const AllEventsPage: NextPage = () => {
  const [end, setEnd] = useState<number>(6)
  const [count] = useState<number>(6)
  const [collection, setCollection] = useState<EventStruct[]>([])
  const [events, setEvents] = useState<EventStruct[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEvents: EventStruct[] = await getEvents()
      setEvents(fetchedEvents)
    }

    fetchData()
  }, [])

  useEffect(() => {
    setCollection(events.slice(0, end))
  }, [events, end])

  return (
    <div className="bg-black min-h-screen">
      <Head>
        <title>HemiVent | All Events</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <EventList events={collection} />

        {collection.length > 0 && events.length > collection.length && (
          <div className="w-full flex justify-center items-center mt-10">
            <button
              className="px-6 py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 duration-300 transition-all"
              onClick={() => setEnd(end + count)}
            >
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default AllEventsPage
