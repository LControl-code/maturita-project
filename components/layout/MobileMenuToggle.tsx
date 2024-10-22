import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { Menu } from "lucide-react"

const NavigationMenuLinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} passHref legacyBehavior>
    <NavigationMenuLink className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground">
      {children}
    </NavigationMenuLink>
  </Link>
)

export const MobileMenuToggle: React.FC = () => {
  return (
    <div className="md:hidden">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="px-3">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open main menu</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[200px]">
                <li>
                  <NavigationMenuLinkItem href="/">Dashboard</NavigationMenuLinkItem>
                </li>
                <li>
                  <NavigationMenuLinkItem href="/devices">Devices</NavigationMenuLinkItem>
                </li>
                <li>
                  <NavigationMenuLinkItem href="/stations">Stations</NavigationMenuLinkItem>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}