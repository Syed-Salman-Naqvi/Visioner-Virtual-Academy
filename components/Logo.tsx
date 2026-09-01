import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  subLabel?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

const sizeMap = {
  sm: "h-9",
  md: "h-12",
  lg: "h-16",
};

export function Logo({ subLabel, size = "md", asLink = true }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2 group">
      <Image
        src="/logo.png"
        alt="Visioner Virtual Academy Logo"
        width={52}
        height={52}
        className={`${sizeMap[size]} w-auto object-contain group-hover:scale-105 transition-transform duration-200`}
        priority
      />
      <div className="flex flex-col">
        <span className="text-base font-extrabold tracking-tight text-white leading-tight">
          Visioner <span style={{color:"#E8A820"}}>Academy</span>
        </span>
        {subLabel && (
          <span className="text-[10px] uppercase font-bold tracking-widest" style={{color:"#7BA7E8"}}>
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
  if (asLink) {
    return <Link href="/">{content}</Link>;
  }
  return <div>{content}</div>;
}
