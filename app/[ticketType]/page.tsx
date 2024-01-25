import React from 'react'
import Ticket from '@/components/Ticket'
import { RedirectType, redirect } from 'next/navigation'

interface TicketPageProps {
    params: {
        ticketType: string
    }
}

const ticketTypes = ['offline_pass']

function TicketPage({ params: { ticketType } }: TicketPageProps) {
    if(!ticketTypes.includes(ticketType)){
        redirect("https://rcs.encryptedge.in", RedirectType.replace)
    }
    return <Ticket ticketType={ticketType} />
}

export default TicketPage
