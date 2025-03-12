
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

const LazyImage = ({
  src,
  alt,
  fallback,
  className,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };
  }, [src]);

  if (error) {
    return fallback || (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <span className="text-muted-foreground text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && <Skeleton className={cn("w-full h-full", className)} />}
      <img 
        src={src} 
        alt={alt} 
        className={cn(className, !loaded && "hidden")} 
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </>
  );
};

export default LazyImage;
