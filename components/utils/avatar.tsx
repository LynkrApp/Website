import * as Avatar from '@radix-ui/react-avatar';
import useCurrentUser from '@/hooks/useCurrentUser';
import useUser from '@/hooks/useUser';

export const UserAvatar = ({
  src,
  name,
  className,
}: {
  src?: string | null;
  name?: string | null;
  className?: string;
}) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedUser } = useUser(currentUser?.handle);

  const imageSrc = src || (fetchedUser as any)?.image;
  const fallbackText = (name || currentUser?.name || '@').slice(0, 1);

  return (
    <>
      <Avatar.Root
        className={`inline-flex items-center justify-center overflow-hidden rounded-full align-middle ${
          className || 'h-[35px] w-[35px] border-2 border-blue-300 lg:w-[45px] lg:h-[45px]'
        }`}
      >
        <Avatar.Image
          className="h-full w-full rounded-[inherit] object-cover"
          src={imageSrc}
          referrerPolicy="no-referrer"
          alt="avatar"
        />
        <Avatar.Fallback
          className="leading-1 text-slate-900 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
          delayMs={100}
        >
          {fallbackText}
        </Avatar.Fallback>
      </Avatar.Root>
    </>
  );
};

export const UserAvatarSetting = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedUser } = useUser(currentUser?.handle);

  return (
    <>
      <Avatar.Root
        className="inline-flex h-[100px] w-[100px] 
				 items-center justify-center overflow-hidden rounded-full align-middle border-2 border-blue-400"
      >
        <Avatar.Image
          className="h-full w-full rounded-[inherit] object-cover"
          src={(fetchedUser as any) && (fetchedUser as any)?.image}
          referrerPolicy="no-referrer"
          alt="avatar"
        />
        <Avatar.Fallback
          className="leading-1 flex h-full w-full items-center justify-center bg-white text-slate-900 text-[35px] font-medium"
          delayMs={100}
        >
          @
        </Avatar.Fallback>
      </Avatar.Root>
    </>
  );
};
