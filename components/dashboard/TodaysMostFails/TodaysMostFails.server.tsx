// components/dashboard/TodaysMostFails/TodaysMostFails.server.tsx
import TodaysMostFailsClient from './TodaysMostFails.client'
import { FailsData } from './types'

export async function fetchTodaysMostFailsData(): Promise<FailsData> {
    const res = await fetch('http://127.0.0.1:8090/api/topFailsNew', {
        next: {
            tags: ['top_fails_tag'],
            revalidate: 300
        }
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch 'todays most fails' data. Status: ${res.status}`)
    }

    const data: FailsData = await res.json()
    return data
}

// Server component fetches data, then renders the client component
export default async function TodaysMostFails() {
    const initialData = await fetchTodaysMostFailsData()
    return <TodaysMostFailsClient initialData={initialData} />
}
