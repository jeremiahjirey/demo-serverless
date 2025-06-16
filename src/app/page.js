'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Gagal connect ke backend ❌');
  const [loading, setLoading] = useState(true);

  // Ambil env dari NEXT_PUBLIC
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
const redirectUri = process.env.AUTH_URL;


  // Ambil token dari URL hash (setelah redirect dari Cognito)
  const getIdTokenFromUrl = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    return params.get('id_token');
  };

  // Cek apakah user sudah login
  const checkLogin = async () => {
    const token = getIdTokenFromUrl();

    if (!token) {
      // Belum login, redirect ke Cognito
      const loginUrl = `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/login?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}`;
      window.location.href = loginUrl;
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/check`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Gagal fetch backend');

      const data = await res.json();
      setMessage(data.message || 'Berhasil connect 🎉');
    } catch (err) {
      console.error(err);
      setMessage('Gagal connect ke backend ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <main className="text-white bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Halo dari Frontend 🎉</h1>
      <p>{loading ? 'Loading...' : message}</p>
    </main>
  );
}
