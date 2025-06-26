// components/SocialPlatformIcon.tsx
import { FaYoutube, FaTwitter, FaInstagram, FaTiktok, FaGlobe } from 'react-icons/fa';

type PlatformIconProps = {
  platform?: string;
  className?: string;
};

const SocialPlatformIcon = ({ platform, className }: PlatformIconProps) => {
  if (!platform) return <FaGlobe className={className} />;

  const platformLower = platform.toLowerCase();

  if (platformLower.includes('youtube')) return <FaYoutube className={className} />;
  if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <FaTwitter className={className} />;
  if (platformLower.includes('instagram')) return <FaInstagram className={className} />;
  if (platformLower.includes('tiktok')) return <FaTiktok className={className} />;

  return <FaGlobe className={className} />;
};

export default SocialPlatformIcon;