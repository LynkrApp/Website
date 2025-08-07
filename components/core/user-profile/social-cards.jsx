/* eslint-disable @next/next/no-img-element */
import { getApexDomain, removeHashFromHexColor } from '@/utils/helpers';
export const SocialCards = ({ url, title, color, registerClicks }) => {
  const validColor = removeHashFromHexColor(color);

  // checking for website aliases: adding more soon
  const specialCases = {
    x: 'twitter',
    fb: 'facebook',
    pin: 'pinterest',
    discordapp: 'discord',
    t: 'telegram',
  };

  const getSocialMediaName = (url) => {
    const domainURL = getApexDomain(url);
    // Use a regular expression to match only the site name
    const siteName = domainURL.match(/^[^.]+/);

    if (siteName && !(siteName in specialCases)) {
      return siteName[0];
    } else {
      return specialCases[siteName[0]];
    }
  };

  const socialIcon = getSocialMediaName(url);

  return (
    <>
      <a
        onClick={registerClicks}
        target="_blank"
        href={url}
        className="hover:scale-110 transition-all w-[40px] h-[40px] sm:h-[45px] sm:w-[45px] md:h-[50px] md:w-[50px] rounded-full p-1.5 lg:w-[50px] lg:h-[50px]"
        style={{
          /* Apply typography styles for consistent theming */
          fontFamily: 'inherit',
          fontWeight: 'var(--body-weight, 400)'
        }}
      >
        <img
          loading="lazy"
          src={`https://s2.svgbox.net/social.svg?color=${validColor}&ic=${socialIcon}`}
          className="w-full h-full"
          alt={title}
        />
      </a>
    </>
  );
};
