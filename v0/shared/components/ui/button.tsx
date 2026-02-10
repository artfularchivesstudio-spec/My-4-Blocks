/**
 * 🎭 The Button Virtuoso - A Polymorphic Button of Many Faces
 *
 * "From primary to ghost, from default to destructive,
 * this button dons many costumes on the stage of UI.
 * Click me if you dare, hover me if you care..."
 *
 * - The Theatrical Component Maestro
 */

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

/**
 * 🎨 The Button Variants - A CVA-Powered Style Symphony
 *
 * Each variant is a costume change in our button's theatrical performance.
 * The size variants determine how much stage presence our button commands.
 *
 * ✨ Base styles: flexbox centering, transitions, focus rings
 * ✨ 6 variant costumes: default, destructive, outline, secondary, ghost, link
 * ✨ 6 size options: default, sm, lg, icon, icon-sm, icon-lg
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // 🌟 The Star of the Show - Primary action, bold and beautiful
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        // 💥 The Dramatic Exit - For actions you can't undo (careful now!)
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        // 📦 The Outlined Understudy - Subtle but ready to shine
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        // 🎭 The Supporting Actor - Secondary but essential
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        // 👻 The Ghost - Minimal presence, maximum elegance
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        // 🔗 The Hyperlink in Disguise - It's a button! No wait, it's a link!
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        // 📐 Standard stage presence
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        // 🐭 The Compact Performer
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        // 🦁 The Statement Maker
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        // 🔘 Square icon button
        icon: 'size-9',
        // 🔹 Compact icon button
        'icon-sm': 'size-8',
        // 🔷 Large icon button
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/**
 * 🌟 Button Props - The Script for Our Button Actor
 *
 * Extends native button props with our variant superpowers and the
 * mystical asChild prop for polymorphic rendering via Radix Slot.
 */
export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  /**
   * 🎭 Polymorphic Mode - When true, renders children as the button element
   * Perfect for wrapping Links, anchors, or other interactive elements
   */
  asChild?: boolean
}

/**
 * 🎭 The Button Component - A Polymorphic UI Virtuoso
 *
 * A beautifully crafted button that can transform into any interactive element
 * via the asChild prop. Supports 6 visual variants and 6 size options.
 *
 * ✨ Fully accessible with proper focus states
 * ✨ Supports asChild for wrapping other elements (links, etc.)
 * ✨ Dark mode ready out of the box
 * ✨ SVG icon sizing handled automatically
 *
 * @example
 * // Primary button (default)
 * <Button>Click me!</Button>
 *
 * @example
 * // Destructive action with icon
 * <Button variant="destructive" size="sm">
 *   <TrashIcon /> Delete
 * </Button>
 *
 * @example
 * // As a link (polymorphic)
 * <Button asChild variant="ghost">
 *   <Link href="/somewhere">Navigate</Link>
 * </Button>
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  // 🎭 The Costume Change - Slot for polymorphism, button for default
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
