import React from "react"

import { NavBar } from "components/nav-bar/NavBar"
import { NavigationItem } from "types/index"

const navigations: NavigationItem[] = [
  { name: "Explore", href: "/explore?tab=all" },
  { name: "How It Works", href: "./" },
]

export function MainNavbar() {
  return <NavBar navigations={navigations} />
}
