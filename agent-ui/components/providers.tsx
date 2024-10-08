"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/lib/hooks/use-sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProviderProps } from "next-themes/dist/types";

export function Providers({ children, ...props }: ThemeProviderProps) {
	return (
		<ClerkProvider>
			<SidebarProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</SidebarProvider>
		</ClerkProvider>
	);
}
