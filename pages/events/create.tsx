import { createEvent } from '@/services/blockchain'
import { EventParams } from '@/utils/type.dt'
import { NextPage } from 'next'
import Head from 'next/head'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const Page: NextPage = () => {
  const { address } = useAccount()
  const [event, setEvent] = useState<EventParams>({
    title: '',
    imageUrl: '',
    description: '',
    ticketCost: '',
    capacity: '',
    startsAt: '',
    endsAt: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    event.startsAt = new Date(event.startsAt).getTime()
    event.endsAt = new Date(event.endsAt).getTime()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        console.log(event)
        createEvent(event)
          .then((tx) => {
            console.log(tx)
            resetForm()
            resolve(tx)
          })

          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event creation successful',
        error: 'Encountered an error',
      }
    )
  }

  const resetForm = () => {
    setEvent({
      title: '',
      imageUrl: '',
      description: '',
      ticketCost: '',
      capacity: '',
      startsAt: '',
      endsAt: '',
    })
  }

  const inputClasses = "mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-300">
      <Head>
        <title>Event X | Create Event</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-white mb-8">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg shadow-xl">
          {event.imageUrl && (
            <div className="flex justify-center mb-6">
              <img src={event.imageUrl} alt={event.title} className="h-48 w-full object-cover rounded-lg shadow-md" />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className={inputClasses}
                placeholder="Enter event title"
                value={event.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-400 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                id="imageUrl"
                className={inputClasses}
                placeholder="https://example.com/image.jpg"
                pattern="https?://.+(\.(jpg|png|gif))?$"
                value={event.imageUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-400 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  id="capacity"
                  min={1}
                  className={inputClasses}
                  placeholder="Enter capacity"
                  value={event.capacity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="ticketCost" className="block text-sm font-medium text-gray-400 mb-1">
                  Ticket Cost (ETH)
                </label>
                <input
                  type="number"
                  name="ticketCost"
                  id="ticketCost"
                  step="0.001"
                  min="0.001"
                  className={inputClasses}
                  placeholder="0.1"
                  value={event.ticketCost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startsAt" className="block text-sm font-medium text-gray-400 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startsAt"
                  id="startsAt"
                  className={inputClasses}
                  value={event.startsAt}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="endsAt" className="block text-sm font-medium text-gray-400 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endsAt"
                  id="endsAt"
                  className={inputClasses}
                  value={event.endsAt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                className={inputClasses}
                placeholder="Describe your event"
                value={event.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-150 ease-in-out"
            >
              Create Event
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Page
