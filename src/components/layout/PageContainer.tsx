
import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const PageContainer = ({
  children,
  className,
  fullWidth = false,
}: PageContainerProps) => {
  return (
    <main
      className={cn(
        "min-h-[calc(100vh-4rem-16rem)] page-transition",
        fullWidth ? "w-full" : "container px-4 py-8 md:px-6 md:py-12",
        className
      )}
    >
      {children}
    </main>
  );
};

export default PageContainer;
