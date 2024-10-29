import { truncate } from '@/utils/helper'
import { EventStruct } from '@/utils/type.dt'
import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'

const EventList: React.FC<{ events: EventStruct[] }> = ({ events }) => {
  return (
    <section className="py-16 ">
      <main className="container mx-auto px-4">
        <h4 className="text-3xl font-bold mb-12 text-gray-300 text-center">
          Discover Amazing Events
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      className="group bg-white rounded-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="relative">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        {!event.minted ? (
          <span className="absolute right-4 top-4 bg-gradient-to-r from-green-400 to-green-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
            Open
          </span>
        ) : (
          <span className="absolute right-4 top-4 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
            Minted
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 capitalize">
          {truncate({
            text: event.title,
            startChars: 45,
            endChars: 0,
            maxLength: 48,
          })}
        </h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncate({
            text: event.description,
            startChars: 100,
            endChars: 0,
            maxLength: 103,
          })}
        </p>
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-green-50 px-4 py-2 rounded-full">
            <FaEthereum className="text-green-500 mr-2 text-lg" />
            <p className="text-green-700 font-semibold">
              {event.ticketCost.toFixed(4)} ETH
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventList
