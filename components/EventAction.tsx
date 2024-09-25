import { Menu, Transition } from '@headlessui/react'
import { BsThreeDotsVertical, BsTrash, BsPencilSquare, BsCashCoin } from 'react-icons/bs'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { EventStruct } from '@/utils/type.dt'
import { useRouter } from 'next/router'

const EventActions: React.FC<{ event: EventStruct }> = ({ event }) => {
  const { address } = useAccount()
  const router = useRouter()
  const [isAbove, setIsAbove] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const checkPosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        setIsAbove(spaceBelow < 200) // Adjust this value based on your menu height
      }
    }

    checkPosition()
    window.addEventListener('resize', checkPosition)
    return () => window.removeEventListener('resize', checkPosition)
  }, [])

  const handleDelete = async () => {
    if (!address) return toast.warn('Connect wallet first')

    const userConfirmed = window.confirm('Are you sure you want to delete this event?')
    if (!userConfirmed) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        console.log(event)
        resolve(event)
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event deleted successfully',
        error: 'Encountered an error',
      }
    )
  }

  const handlePayout = async () => {
    if (!address) return toast.warn('Connect wallet first')

    const userConfirmed = window.confirm('Are you sure you want to payout this event?')
    if (!userConfirmed) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        console.log(event)
        resolve(event)
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event paid out successfully',
        error: 'Encountered error',
      }
    )
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          ref={buttonRef}
          className="inline-flex justify-center items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Actions
          <BsThreeDotsVertical
            className="w-5 h-5 ml-2 -mr-1 text-indigo-200 hover:text-indigo-100"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${
            isAbove ? 'bottom-full mb-2' : 'top-full mt-2'
          } right-0 w-56 origin-top-right bg-gray-800 divide-y divide-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={'/events/edit/' + event.id}
                  className={`${
                    active ? 'bg-gray-700 text-white' : 'text-gray-200'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                >
                  <BsPencilSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                  Edit
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-gray-700 text-white' : 'text-gray-200'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={handlePayout}
                >
                  <BsCashCoin className="w-5 h-5 mr-2" aria-hidden="true" />
                  Payout
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-red-600 text-white' : 'text-red-500'
                  } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                  onClick={handleDelete}
                >
                  <BsTrash className="w-5 h-5 mr-2" aria-hidden="true" />
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default EventActions
