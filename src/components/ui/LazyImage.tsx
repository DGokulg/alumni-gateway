
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  height?: number;
  width?: number;
  fallbackSrc?: string;
  loadingClassName?: string;
}

const LazyImage = ({
  src,
  alt,
  className,
  height,
  width,
  fallbackSrc = "/placeholder.svg",
  loadingClassName,
  ...props
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(fallbackSrc || src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
    img.onerror = () => {
      if (src !== fallbackSrc) {
        setImgSrc(fallbackSrc);
        setIsLoaded(true);
      }
    };
  }, [src, fallbackSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      height={height}
      width={width}
      className={cn(
        "lazy-image",
        !isLoaded && "lazy-image-loading",
        isLoaded && "lazy-image-loaded",
        !isLoaded && loadingClassName,
        className
      )}
      {...props}
    />
  );
};

export default LazyImage;
