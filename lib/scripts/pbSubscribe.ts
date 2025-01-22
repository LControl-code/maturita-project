import PocketBase from 'pocketbase';
import pkg from 'lodash';
const { debounce } = pkg;
import { revalidationBus } from '../revalidationBus';

// Create tag groups for related revalidations
const TAG_GROUPS = {
    ERROR_TAGS: ['live_errors_tag', 'top_fails_tag', 'failed_tests_tag'],
    STATS_TAGS: ['production_stats_tag', 'device_stats_tag']
};

// Create debounced emit functions for each tag group
const debouncedEmit = {
    ERROR_TAGS: debounce(
        () => revalidationBus.emit('revalidate', TAG_GROUPS.ERROR_TAGS),
        1000,
        { maxWait: 5000, leading: false, trailing: true }
    ),
    STATS_TAGS: debounce(
        () => revalidationBus.emit('revalidate', TAG_GROUPS.STATS_TAGS),
        1000,
        { maxWait: 5000, leading: false, trailing: true }
    )
};

const pb = new PocketBase('http://127.0.0.1:8090');

async function startSubscription() {
    console.log('Starting PB subscription...');

    try {
        await pb.collection('test_data').subscribe('*', async (data) => {
            console.log('PocketBase event:', data.action, data.record?.id);

            if (data.action === 'create') {
                if (data.record.test_fail) {
                    // Emit error-related tags
                    debouncedEmit.ERROR_TAGS();
                }
                // Always emit stats tags for any new record
                debouncedEmit.STATS_TAGS();
            }
        });

        console.log('Successfully subscribed to PocketBase test_data!');
    } catch (err) {
        console.error('Subscription error:', err);
        setTimeout(startSubscription, 5000);
    }
}

// Handle process termination
process.on('SIGINT', async () => {
    console.log('Closing PocketBase subscription...');
    Object.values(debouncedEmit).forEach(fn => fn.cancel());
    await pb.collection('test_data').unsubscribe();
    process.exit(0);
});

startSubscription();