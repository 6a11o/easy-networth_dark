import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#2AACDD] text-[#081924] hover:bg-[#2AACDD]/90 shadow-lg shadow-[#2AACDD]/30 font-semibold backdrop-blur-sm hover:scale-105 transition-transform duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-[#33C3F0]/60 bg-transparent text-[#33C3F0] hover:bg-[#33C3F0]/10 shadow-lg shadow-[#33C3F0]/20 hover:shadow-[#33C3F0]/30 hover:scale-105 transition-transform duration-300",
        secondary:
          "bg-[#1A1F2C] text-white hover:bg-[#1A1F2C]/80 border border-[#33C3F0]/30 shadow-sm shadow-[#33C3F0]/10",
        ghost: "hover:bg-[#1A1F2C]/50 hover:text-white text-gray-200",
        link: "text-[#33C3F0] underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-[#33C3F0] to-[#9b87f5] text-[#081924] hover:from-[#2AACDD] hover:to-[#8a76e4] shadow-lg shadow-[#33C3F0]/30 relative before:absolute before:inset-0 before:bg-black/5 before:rounded-full before:pointer-events-none font-semibold hover:scale-105 transition-transform duration-300",
        glass: "bg-[#1A1F2C]/70 backdrop-blur-md text-white border border-white/10 hover:bg-[#1A1F2C]/80 shadow-lg",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-8 py-3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
