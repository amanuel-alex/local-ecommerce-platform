// import { Button, ButtonProps } from "@/components/ui/button"
// import { cn } from "@/lib/utils"
// import { ReactNode } from "react"

// interface ThemeButtonProps extends ButtonProps {
//   children: ReactNode
//   themeVariant?: 'default' | 'gradient' | 'glass'
//   className?: string
// }

// export function ThemeButton({ 
//   children, 
//   themeVariant = 'default', 
//   className,
//   ...props 
// }: ThemeButtonProps) {
//   const variants = {
//     default: '',
//     gradient: 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl',
//     glass: 'glass-effect backdrop-blur-sm hover:backdrop-blur-md transition-all'
//   }

//   return (
//     <Button
//       className={cn(
//         variants[themeVariant],
//         "transition-all duration-300",
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </Button>
//   )
// }