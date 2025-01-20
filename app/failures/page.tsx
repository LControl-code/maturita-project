
export const dynamic = 'force-static'
/**
 * Alternatively, you could rely on default caching
 * if no dynamic usage is detected. But if you do
 * anything dynamic, set the route to static or dynamic accordingly.
 */

export default async function FailuresPage() {
    // Example fetch from your PocketBase or a separate REST endpoint
    // We tag this fetch as "failures_tag"
    const getData = async () => {
        console.log("Fetching data from /api/failedTestsGraphNew again")
        const res = await fetch('http://127.0.0.1:8090/api/failedTestsGraphNew', {
            next: {
                tags: ['failures_tag'],
                revalidate: 300
            }
        })
        return res.json()
    }

    // Get the data and store it in a variable
    const jsonData = await getData()

    return (
        <main style={{ padding: '1rem' }}>
            <h1>Nested JSON Display</h1>

            {/* 3. Iterate over the top-level keys (A20, A25, etc.) */}
            {Object.entries(jsonData).map(([station, tests]) => {
                // station = "A20" or "A25"
                // tests = { "HiPot_1_UVW_G_NTC": [...], "Offset_NTC1_Temp": [...], ... }

                return (
                    <section key={station} style={{ marginBottom: '2rem' }}>
                        <h2 style={{ marginBottom: '0.5rem' }}>Station: {station}</h2>

                        {/* 4. For each testName under a station */}
                        {Object.entries(tests as Record<string, any[]>).map(([testName, entries]) => {
                            // testName = e.g. "HiPot_1_UVW_G_NTC"
                            // entries = array of objects

                            return (
                                <div key={testName} style={{ margin: '1rem 0' }}>
                                    <h3>{testName}</h3>
                                    <table
                                        style={{
                                            width: '100%',
                                            borderCollapse: 'collapse',
                                            marginTop: '0.5rem',
                                        }}
                                    >
                                        <thead>
                                        <tr style={{ borderBottom: '1px solid #ccc' }}>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Device Code
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Device Type
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Line
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Measured
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Limit
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Offset
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Difference
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Time
                                            </th>
                                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>
                                                Type
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {Array.isArray(entries) &&
                                            entries.map((entry, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.deviceCode}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.deviceType}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.line} (#{entry.lineNumber})
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.measuredValue}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.limit}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.offset}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.difference}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.time}
                                                    </td>
                                                    <td style={{ padding: '0.5rem' }}>
                                                        {entry.type}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })}
                    </section>
                )
            })}
        </main>
    )
}
