// components/FailedTestsGraphOld/FailedTestsGraphOld.server.tsx

import FailedTestsGraphClient from './FailedTestsGraph.client';

export async function fetchFailedTestsData(): Promise<any> {
    // Fetch from OUR Next.js API route now, not directly from PocketBase
    const res = await fetch(
        // You can do a relative path here:
        // (In most cases, Next can resolve this as long as you're on the same domain.)
        // Or you can do an absolute URL like: `${process.env.NEXT_PUBLIC_APP_URL}/api/failedTestsGraphNew`
        `${process.env.NEXT_PUBLIC_APP_URL}/api/data/dashboard/failedTestsGraph`,
        {
            next: {
                // This tag matches the one you pass to `revalidateTag('failed_tests_tag')`
                tags: ['failed_tests_tag'],
            }
        }
    );

    if (!res.ok) {
        throw new Error(`Failed to fetch /api/failedTestsGraphNew (status: ${res.status}).`);
    }

    return res.json();

}

export default async function FailedTestsGraph() {
    const data = await fetchFailedTestsData();
    return <FailedTestsGraphClient initialData={data}/>;
}
