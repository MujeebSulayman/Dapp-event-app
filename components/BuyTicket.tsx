import { buyTickets } from '@/services/blockchain'
import { globalActions } from '@/store/globalSlices'
import { EventStruct, RootState } from '@/utils/type.dt'
import { useRouter } from 'next/router'
import React, { FormEvent, useState, useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'

const BuyTicket: React.FC<{ event: EventStruct }> = ({ event }) => {
  const router = useRouter()
  const { ticketModal } = useSelector((state: RootState) => state.globalStates)
  const { address } = useAccount()
  const [tickets, setTickets] = useState<number | string>('')
  const { setTicketModal } = globalActions
  const dispatch = useDispatch()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await buyTickets(event, Number(tickets))
          .then((tx) => {
            console.log(tx)
            onClose() // Close the modal
            resolve(tx)
            router.push(`/events/${event.id}`)
          })
          .catch((error) => {
            reject(error)
          })
      }),
      {
        pending: 'Approve transaction...',
        success: 'Ticket purchased successfully',
        error: 'Encountered an error',
      }
    )
  }

  const onClose = () => {
    dispatch(setTicketModal('scale-0'))
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
        bg-black bg-opacity-50 backdrop-blur-sm transform z-50 transition-transform duration-300 ${ticketModal}`}
    >
      <div
        ref={modalRef}
        className="bg-white text-gray-800 shadow-xl rounded-2xl w-11/12 md:w-96 p-8"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-600">Buy Tickets</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="tickets" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tickets
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="tickets"
                  id="tickets"
                  className="block w-full pr-10 text-lg border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 py-3 px-4" // Updated classes
                  placeholder="1-5"
                  min={1}
                  step={1}
                  max={5}
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex mr items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm ml-4">tickets</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Buy Now
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>You are purchasing tickets for:</p>
            <p className="font-semibold text-indigo-600">{event.title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyTicket
