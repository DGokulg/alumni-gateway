
import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className }) => {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      {children}
    </div>
  );
};

export default PageContainer;
