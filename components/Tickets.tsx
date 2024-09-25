import { truncate } from '@/utils/helper'
import { TicketStruct } from '@/utils/type.dt'
import { FaEthereum } from 'react-icons/fa'
import { HiOutlineTicket } from 'react-icons/hi'
import Identicon from 'react-identicons'
import Moment from 'react-moment'

const Ticket: React.FC<{ tickets: TicketStruct[] }> = ({ tickets }) => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
          <HiOutlineTicket className="mr-2" />
          Purchased Tickets
          <span className="ml-2 text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
            {tickets.length}
          </span>
        </h2>
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {tickets.map((ticket, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors duration-200 ease-in-out border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <Identicon
                  className="rounded-full overflow-hidden shadow-md"
                  size={40}
                  string={ticket.owner}
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {truncate({
                      text: ticket.owner,
                      startChars: 4,
                      endChars: 4,
                      maxLength: 11,
                    })}
                  </p>
                  <Moment className="text-sm text-gray-500" fromNow>
                    {ticket.timestamp}
                  </Moment>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaEthereum className="text-blue-500" />
                <span className="font-bold text-gray-900">{ticket.ticketCost.toFixed(2)} ETH</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ticket
