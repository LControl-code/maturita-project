// components/FailedTestsGraphOld/FailedTestsGraphOld.server.tsx
import FailedTestsGraphClient from './FailedTestsGraph.client'

export async function fetchFailedTestsData(): Promise<any> {
    const res = await fetch('http://127.0.0.1:8090/api/failedTestsGraphNew', {
        next: {
            tags: ['failed_tests_tag'],
        }
    })
    return res.json()
}

export default async function FailedTestsGraph() {  // No props needed here
    const data = await fetchFailedTestsData()
    return <FailedTestsGraphClient initialData={data} />
}