import { getInitials } from "@/lib/user";

interface AvatarProps {
  src?: string | null;
  name: string;
  className: string;
}

const Avatar = ({ src, name, className }: AvatarProps) => {
  if (src) {
    return <img src={src} alt={name} className={`object-cover ${className}`} />;
  }
  return <span className={className}>{getInitials(name)}</span>;
};

export default Avatar;
