'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
  const redirectUri = process.env.AUTH_URL
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL

  // 👇 Hardcode domain Cognito di sini
  const cognitoDomain = 'us-east-1ncbrwffqw.auth.us-east-1.amazoncognito.com'

  const getToken = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('id_token')
      if (token) {
        localStorage.setItem('id_token', token)
        window.history.replaceState({}, document.title, '/')
        return token
      }
      return localStorage.getItem('id_token')
    }
    return null
  }

  const redirectToLogin = () => {
    const loginUrl = `https://${cognitoDomain}/login?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`
    window.location.href = loginUrl
  }

  const checkLogin = async () => {
    const token = getToken()
    if (!token) {
      redirectToLogin()
      return
    }

    try {
      const res = await fetch(`${apiUrl}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Gagal fetch backend')

      const data = await res.json()
      setMessage(data.message || 'Backend Connect 🎉')
    } catch (err) {
      localStorage.removeItem('id_token')
      redirectToLogin()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkLogin()
  }, [])

  return (
    <main style={{ padding: '2rem', color: 'white', background: 'black' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>🚀 Halo dari Frontend</h1>
          <p>{message}</p>
        </>
      )}
    </main>
  )
}
