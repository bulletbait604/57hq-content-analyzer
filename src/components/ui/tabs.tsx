"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tabsListVariants = cva(
  "inline-flex h-10 items-center justify-center rounded-md bg-black p-1 text-cyan-500",
  {
    variants: {
      variant: {
        default: "bg-black border border-cyan-500",
        underline: "bg-transparent border-b-2 border-cyan-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)]",
        underline: "bg-transparent hover:bg-cyan-900 hover:text-cyan-400 data-[state=active]:bg-cyan-800 data-[state=active]:text-cyan-300 data-[state=active]:shadow-[0_0_10px_rgba(0,255,255,0.3)] border-0 border-b-2 border-transparent data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
