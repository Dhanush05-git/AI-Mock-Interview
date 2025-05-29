"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
  theme={theme}
  position="top-right"
  className="toaster group"
  style={{
    "--toast-success-bg": "#dcfce7", // light green
    "--toast-error-bg": "#fee2e2",   // light red
    "--toast-info-bg": "#dbeafe",    // light blue
    "--toast-warning-bg": "#fef9c3", // light yellow
    "--normal-bg": "var(--popover)",
    "--normal-text": "var(--popover-foreground)",
    "--normal-border": "var(--border)"
  }}
  {...props}
/>

  );
}

export { Toaster }
