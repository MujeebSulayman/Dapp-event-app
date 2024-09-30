import Ticket from '@/components/Tickets'
import { getTickets } from '@/services/blockchain'
import { generateTicketData } from '@/utils/fakeData'
import { TicketStruct } from '@/utils/type.dt'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Page: NextPage<{ ticketsData: TicketStruct[] }> = ({ ticketsData }) => {
  const router = useRouter()
  const { id } = router.query

  return (
    <div className="min-h-screen bg-black">
      <Head>
        <title>HemiVent | Tickets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Event Tickets</h1>

        <section className="bg-white shadow-md rounded-lg p-6 mb-8">
          <Ticket tickets={ticketsData} />
        </section>

        <div className="flex justify-start">
          <Link
            href={'/events/' + id}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md
            hover:bg-blue-700 transition duration-300 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Back to Event
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Page

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const ticketsData: TicketStruct[] = await getTickets(Number(id))

  return {
    props: {
      ticketsData: JSON.parse(JSON.stringify(ticketsData)),
    },
  }
}
