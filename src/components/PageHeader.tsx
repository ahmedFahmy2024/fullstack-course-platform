import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

const PageHeader = ({ title, children, className }: Props) => {
  return (
    <div
      className={cn("mb-8 flex gap-4 items-center justify-between", className)}
    >
      <h1 className="text-2xl font-semibold">{title}</h1>
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
