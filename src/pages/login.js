import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result.error) {
      setError('Invalid username or password');
    } else {
      router.push('/admin');
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col">
       <Head>
        <title>Gobi - Login</title>
      </Head>
      <div className="pt-4 pl-4">
        <button onClick={handleGoBack} aria-label="Go Back" className="p-2 bg-gray-300 rounded-full">
          <ChevronLeft className="w-6 h-6 text-gray-700 hover:text-orange-500" />
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="w-[200px] h-[100px] mx-auto relative">
            <Image
              src="/Gobi.jpg"
              alt="Gobi Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <h2 className="text-2xl font-semibold text-center text-gray-900 mt-0">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="w-full py-2 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Sign In
            </button>
          </form>
          {error && <p className="text-sm text-center text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
