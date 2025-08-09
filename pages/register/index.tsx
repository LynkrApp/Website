import Link from 'next/link';
import Form from '@/components/shared/form/form';
import { AuthLayout } from '@/components/layout/BaseLayout';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Register() {
  const { route } = useRouter();

  return (
    <AuthLayout
      metaProps={{ title: 'Create Account' }}
      className="flex items-center justify-center min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
    >
      <div className="z-10 w-full max-w-md overflow-hidden border border-gray-500 shadow-xl rounded-2xl">
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
          <h3 className="text-xl font-semibold">
            {route === '/register' ? 'Create your account' : 'Welcome back'}
          </h3>
          <p className="text-sm text-gray-500">
            Get started for free. No credit card required
          </p>
        </div>
        <Form type="register" />
      </div>
    </AuthLayout>
  );
}