import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import LoadingDots from '@/components/utils/loading-dots';
import Link from 'next/link';
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Form({ type }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isTwitterLoading, setIsTwitterLoading] = useState(false);
  const [isDiscordLoading, setIsDiscordLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams?.get('next');

  useEffect(() => {
    const error = searchParams?.get('error');
    error && toast.error(error);
  }, [searchParams]);

  const isAnyLoading =
    isGoogleLoading || isGitHubLoading || isTwitterLoading || isDiscordLoading;

  const GoogleIcon = FaGoogle as React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;
  const GithubIcon = FaGithub as React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;
  const DiscordIcon = FaDiscord as React.ComponentType<
    React.SVGProps<SVGSVGElement>
  >;

  return (
    <div className="flex flex-col px-4 py-8 space-y-4 bg-gray-50 sm:px-16">
      <button
        onClick={() => {
          setIsGoogleLoading(true);
          signIn('google', {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        disabled={isAnyLoading}
        className={`${
          isAnyLoading
            ? 'cursor-not-allowed border-gray-200 bg-gray-100'
            : 'border-black bg-black text-white hover:bg-white hover:text-black'
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {isGoogleLoading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="flex items-center gap-2 font-semibold">
            <GoogleIcon /> Continue with Google
          </p>
        )}
      </button>

      <button
        onClick={() => {
          setIsGitHubLoading(true);
          signIn('github', {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        disabled={isAnyLoading}
        className={`${
          isAnyLoading
            ? 'cursor-not-allowed border-gray-200 bg-gray-100'
            : 'border-gray-800 bg-gray-800 text-white hover:bg-white hover:text-gray-800'
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {isGitHubLoading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="flex items-center gap-2 font-semibold">
            <GithubIcon /> Continue with GitHub
          </p>
        )}
      </button>

      <button
        onClick={() => {
          setIsDiscordLoading(true);
          signIn('discord', {
            ...(next && next.length > 0 ? { callbackUrl: next } : {}),
          });
        }}
        disabled={isAnyLoading}
        className={`${
          isAnyLoading
            ? 'cursor-not-allowed border-gray-200 bg-gray-100'
            : 'border-indigo-600 bg-indigo-600 text-white hover:bg-white hover:text-indigo-600'
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {isDiscordLoading ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="flex items-center gap-2 font-semibold">
            <DiscordIcon /> Continue with Discord
          </p>
        )}
      </button>

      {type === 'login' ? (
        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-semibold text-gray-800">
            Sign up
          </Link>
        </p>
      ) : (
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-gray-800">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
