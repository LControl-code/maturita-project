import LiveErrorsClient from './LiveErrors.client'
import {ErrorData} from '@/types/errors'

export async function fetchLiveErrorsData(): Promise<ErrorData[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/data/dashboard/liveErrors`, {
    next: {
      tags: ['live_errors_tag'],
    }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch live errors data. Status: ${res.status}`)
  }

  return await res.json()
}

export default async function LiveErrors() {
  const initialData = await fetchLiveErrorsData()
  return <LiveErrorsClient initialData={initialData} />
}
