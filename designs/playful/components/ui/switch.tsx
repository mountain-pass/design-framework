// Generated from designs/playful/classes.json by scripts/build-components.mjs.
// Do not edit by hand — change classes.json and re-run the generator.
import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn("inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-input p-0.5 transition-colors", "data-[state=checked]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn("h-5 w-5 rounded-full bg-background shadow-sm transition-transform", "data-[state=checked]:translate-x-5")}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
