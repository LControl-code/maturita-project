'use client'
import { useCallback, useEffect, useRef } from 'react'
import { pb } from '@/lib/pocketbase_connect'
import { revalidateData } from '@/lib/actions'
import debounce from 'lodash/debounce'

type SubscriptionConfig = {
    collection: string;
    filter?: string;
    revalidateTags: {
        onFail?: string[];
        onPass?: string[];
        always?: string[];
    };
}

export default function PocketbaseSubscriber({
                                                 collection,
                                                 filter = '*',
                                                 revalidateTags
                                             }: SubscriptionConfig) {
    const revalidateTagsRef = useRef(revalidateTags)
    revalidateTagsRef.current = revalidateTags

    const debouncedRevalidateFailures = useCallback(
        debounce(() => {
            revalidateTagsRef.current.onFail?.forEach(tag => {
                revalidateData(tag)
            })
        }, 5000, {
            leading: false,
            trailing: true,
            maxWait: 10000
        }),
        []
    )

    const debouncedRevalidatePasses = useCallback(
        debounce(() => {
            revalidateTagsRef.current.onPass?.forEach(tag => {
                revalidateData(tag)
            })
        }, 5000, {
            leading: false,
            trailing: true,
            maxWait: 10000
        }),
        []
    )

    const debouncedRevalidateAlways = useCallback(
        debounce(() => {
            revalidateTagsRef.current.always?.forEach(tag => {
                revalidateData(tag)
            })
        }, 5000, {
            leading: false,
            trailing: true,
            maxWait: 10000
        }),
        []
    )

    useEffect(() => {
        const isSubscribed = true

        const setupSubscription = async () => {
            try {
                return await pb.collection(collection).subscribe(filter, async (e) => {
                    if (!isSubscribed) return

                    if (collection === "test_data" && e.action === "create") {
                        // Always revalidate general tags if specified
                        if (revalidateTagsRef.current.always?.length) {
                            debouncedRevalidateAlways()
                        }

                        // Revalidate based on test result
                        if (e.record.test_fail) {
                            debouncedRevalidateFailures()
                        } else {
                            debouncedRevalidatePasses()
                        }
                    }
                })
            } catch (error) {
                console.error('Subscription error:', error)
                return null
            }
        }

        let unsubscribeFunc: (() => void) | null = null
        setupSubscription().then(unsub => {
            unsubscribeFunc = unsub
        })

        return () => {
            debouncedRevalidateFailures.cancel()
            debouncedRevalidatePasses.cancel()
            debouncedRevalidateAlways.cancel()
            if (unsubscribeFunc) {
                try {
                    unsubscribeFunc()
                } catch {
                    console.log('Cleanup: Connection already closed')
                }
            }
            try {
                pb.collection(collection).unsubscribe()
            } catch (error) {
                console.log('Additional cleanup failed:', error)
            }
        }
    }, [collection, filter, debouncedRevalidateFailures, debouncedRevalidatePasses, debouncedRevalidateAlways])

    return null
}