'use client' // kalau pakai App Router

import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_GATEWAY_URL)
        const data = await res.json()
        setMessage(data.message)
      } catch (err) {
        setMessage('Gagal connect ke backend')
        console.error(err)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold">Halo dari Frontend 🎉</h1>
      <p className="mt-4">{message}</p>
    </main>
  )
}
