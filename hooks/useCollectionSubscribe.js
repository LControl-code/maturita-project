import { useState, useEffect, useRef } from 'react';
import { pb } from "@/lib/pocketbase_connect";

const collections = ['station_s02', 'station_a20', 'station_a25', 'station_a26', 'station_nvh', 'station_r23'];

export function useCollectionSubscribe() {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [record, setRecord] = useState(null);
  const subscriptionsRef = useRef([]);

  useEffect(() => {
    const setupSubscriptions = async () => {
      for (const collectionName of collections) {
        try {
          const unsubscribe = await pb.collection(collectionName).subscribe('*', (e) => {
            setLastUpdate(new Date());
            setRecord({ collection: collectionName, record: e.record });
          });
          subscriptionsRef.current.push({ collectionName, unsubscribe });
        } catch (error) {
          console.error(`Hook: Failed to subscribe to ${collectionName}:`, error);
        }
      }
    };

    setupSubscriptions();

    // Cleanup function
    return () => {
      subscriptionsRef.current.forEach(({ collectionName, unsubscribe }) => {
        try {
          unsubscribe();
        } catch (error) {
          console.error(`Hook: Failed to unsubscribe from ${collectionName}:`, error);
        }
      });
      subscriptionsRef.current = [];
    };
  }, []);

  return { lastUpdate, record };
}