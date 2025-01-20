// lib/scripts/pbSubscribe.js
import PocketBase from 'pocketbase';
import { EventSourcePolyfill } from 'event-source-polyfill';
import fetch from 'node-fetch';
import pkg from 'lodash';
const { debounce } = pkg;

// Polyfill EventSource for Node environment
global.EventSource = EventSourcePolyfill;

// Create debounced revalidate functions for each tag
const debouncedRevalidate = {
    'live_errors_tag': createDebouncedRevalidate('live_errors_tag'),
    'top_fails_tag': createDebouncedRevalidate('top_fails_tag'),
    'failed_tests_tag': createDebouncedRevalidate('failed_tests_tag'),
    'production_stats_tag': createDebouncedRevalidate('production_stats_tag'),
    'device_stats_tag': createDebouncedRevalidate('device_stats_tag')
};

// Helper to create a debounced function for each tag
function createDebouncedRevalidate(tag) {
    return debounce(async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/revalidate?tag=${tag}`, {
                method: 'POST',
            });

            if (!res.ok) {
                console.error(`Failed to revalidate tag ${tag}. Status:`, res.status);
                const text = await res.text();
                console.error('Error details:', text);
            } else {
                console.log(`Successfully revalidated tag: ${tag}`);
            }
        } catch (err) {
            console.error(`Error calling revalidate endpoint for tag ${tag}:`, err);
        }
    }, 1000, {
        leading: false,     // Don't execute immediately
        trailing: true,     // Execute after the delay
        maxWait: 5000      // Maximum time to wait before forcing execution
    });
}

// Create PocketBase client and subscribe
const pb = new PocketBase('http://127.0.0.1:8090');

async function startSubscription() {
    console.log('Starting PB subscription...');

    try {
        await pb.collection('test_data').subscribe('*', async (data) => {
            console.log('PocketBase event:', data.action, data.record?.id);

            if (data.action === 'create') {
                if (data.record.test_fail) {
                    // Call the debounced functions for error tags
                    debouncedRevalidate['live_errors_tag']();
                    debouncedRevalidate['top_fails_tag']();
                    debouncedRevalidate['failed_tests_tag']();
                } else {
                    // Call the debounced function for production stats
                    debouncedRevalidate['production_stats_tag']();
                }
                // Call the debounced function for device stats
                debouncedRevalidate['device_stats_tag']();
            }
        });

        console.log('Successfully subscribed to PocketBase test_data!');
    } catch (err) {
        console.error('Subscription error:', err);
        // Attempt to reconnect after a delay
        setTimeout(startSubscription, 5000);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('Closing PocketBase subscription...');
    // Cancel any pending debounced calls
    Object.values(debouncedRevalidate).forEach(fn => fn.cancel());
    await pb.collection('test_data').unsubscribe();
    process.exit(0);
});

// Start the subscription
startSubscription();