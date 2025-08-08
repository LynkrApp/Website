import Link from 'next/link';
import Form from '@/components/shared/form/form';
import Head from 'next/head';
import Image from 'next/image';

export default function Login() {
  return (
    <>
      <Head>
        <title>Lynkr | Login</title>
      </Head>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] flex  items-center justify-center ">
        <div className="z-10 w-full max-w-md overflow-hidden border border-gray-100 shadow-xl rounded-2xl">
          <div className="flex flex-col items-center justify-center px-4 py-6 pt-8 space-y-3 text-center bg-white border-b border-gray-200 sm:px-16">
            <Link
              className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors hover:text-blue-600"
              href="/"
            >
              <div className="flex items-center justify-center w-24 h-24 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                <Image
                  src="/logo.png"
                  alt="Lynkr Logo"
                  width={100}
                  height={100}
                  className=""
                />
              </div>
            </Link>
            <h3 className="text-xl font-semibold">Sign in to your account</h3>
            <p className="text-sm text-gray-500">
              Choose your preferred method to sign in
            </p>
          </div>
          <Form type="login" />
        </div>
      </div>
    </>
  );
}
