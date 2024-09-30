import { truncate } from '@/utils/helper'
import { EventStruct } from '@/utils/type.dt'
import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'

const EventList: React.FC<{ events: EventStruct[] }> = ({ events }) => {
  return (
    <section className="mt-10">
      <main className="lg:w-[70%] w-full mx-auto">
        <h4 className="text-2xl font-semibold my-8 text-gray-300 text-center">Recent Events</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto w-full justify-items-center">
          {events.map((event, i) => (
            <Card key={i} event={event} />
          ))}
        </div>
      </main>
    </section>
  )
}

const Card: React.FC<{ event: EventStruct }> = ({ event }) => {
  return (
    <Link
      href={'/events/' + event.id}
      className="rounded-lg bg-white max-w-xs overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-shadow duration-300"
    >
      <div className="relative">
        <img src={event.imageUrl} alt={event.title} className="h-44 w-full object-cover" />
        {!event.minted ? (
          <span className="bg-green-500 text-white absolute right-3 top-3 rounded-xl px-4">
            Open
          </span>
        ) : (
          <span className="bg-cyan-600 text-white absolute right-3 top-3 rounded-xl px-4">
            Minted
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 text-lg font-bold mb-2 capitalize">
          {truncate({
            text: event.title,
            startChars: 45,
            endChars: 0,
            maxLength: 48,
          })}
        </h3>
        <p className="text-gray-500 text-md">
          {truncate({
            text: event.description,
            startChars: 100,
            endChars: 0,
            maxLength: 103,
          })}
        </p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex justify-start items-center">
            <FaEthereum className="text-green-500" />
            <p className="uppercase text-green-800 font-medium ">
              {event.ticketCost.toFixed(2)} ETH
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventList
