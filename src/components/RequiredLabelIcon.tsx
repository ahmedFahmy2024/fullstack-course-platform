import { cn } from "@/lib/utils";
import { AsteriskIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

const RequiredLabelIcon = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AsteriskIcon>) => {
  return (
    <AsteriskIcon
      {...props}
      className={cn("text-destructive inline size-4 align-top", className)}
    />
  );
};

export default RequiredLabelIcon;

// ComponentPropsWithoutRef<T>:
// Gives you all the props of a given React component T, except it removes the ref prop.
// (Because refs are usually handled differently and you don’t always want to pass them down.)

// typeof AsteriskIcon:
// This is the type of the AsteriskIcon component (imported from lucide-react).
// So TypeScript knows exactly which props AsteriskIcon accepts (like size, color, strokeWidth, className, etc.).

// ➡️ Together:
// ComponentPropsWithoutRef<typeof AsteriskIcon> = “all the props that AsteriskIcon supports, except ref”.

// 🛠 Why use it here?
// The RequiredLabelIcon is just a wrapper around AsteriskIcon, so instead of manually retyping its props, this type ensures that:
// Your wrapper component accepts the same props as AsteriskIcon.
// TypeScript autocomplete will show correct props when using <RequiredLabelIcon />.
// If AsteriskIcon updates its props in the library, your component automatically stays in sync.
