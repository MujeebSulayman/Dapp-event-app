import { truncate } from '@/utils/helper'
import { EventStruct } from '@/utils/type.dt'
import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'
import { Skeleton } from "@/components/ui/skeleton"

const EventList: React.FC<{ events: EventStruct[]; loading?: boolean }> = ({ events, loading }) => {
  return (
    <section className="mt-10">
      <main className="container mx-auto px-4">
        <h4 className="text-3xl font-bold my-8 text-gray-100 text-center">
          Recent Events
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))
          ) : (
            events.map((event, i) => (
              <Card key={i} event={event} />
            ))
          )}
        </div>
      </main>
    </section>
  )
}

const Card: React.FC<{ event: EventStruct }> = ({ event }) => {
  return (
    <Link
      href={'/events/' + event.id}
      className="group bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300"
    >
      <div className="relative aspect-video">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute right-3 top-3 rounded-full px-4 py-1 text-sm font-medium ${
          !event.minted 
            ? 'bg-green-500/90 text-white' 
            : 'bg-cyan-600/90 text-white'
        }`}>
          {!event.minted ? 'Open' : 'Minted'}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-gray-100 text-xl font-semibold mb-2 capitalize">
          {truncate({
            text: event.title,
            startChars: 45,
            endChars: 0,
            maxLength: 48,
          })}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {truncate({
            text: event.description,
            startChars: 100,
            endChars: 0,
            maxLength: 103,
          })}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full">
            <FaEthereum className="text-lg" />
            <span className="font-medium">{event.ticketCost.toFixed(4)} ETH</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const CardSkeleton = () => {
  return (
    <div className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5">
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
    </div>
  )
}

export default EventList
