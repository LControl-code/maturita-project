'use server'
import { revalidateTag } from 'next/cache'

export async function revalidateData(tag: string) {
    console.log(`INFO : revalidating tag: ${tag}!`)
    revalidateTag(tag)
}