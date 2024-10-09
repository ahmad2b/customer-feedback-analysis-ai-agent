import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Metadata } from "next";
import { Toaster } from "sonner";
import {
	DM_Serif_Display,
	Inter as FontSans,
	Poppins,
	Raleway,
	Roboto,
	Urbanist,
  } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

export const fontUrban = Urbanist({
	subsets: ["latin"],
	variable: "--font-urban",
  });

export const fontPoppins = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["400", "500", "600", "700"],
  });

export const fontDmSansDisplay = DM_Serif_Display({
	subsets: ["latin"],
	variable: "--font-dmSansDisplay",
	weight: ["400"],
  });

export const metadata: Metadata = {
	metadataBase: new URL(
		"https://github.com/ahmad2b/customer-feedback-analysis-ai-agent.git"
	),
	title: "Customer Feedback Analysis AI Agent",
	description:
		"Customer Feedback Analysis AI Agent for reducing staff hours, boosting efficiency, faster response times, improved retention, actionable insights for product and strategy, and testing system with a data subset to see results fast.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en"  className={cn(
			"font-sans antialiased",
			fontUrban.variable,
			fontDmSansDisplay.variable,
			fontPoppins.className,
		  )}>
			<body>
				<Providers
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Toaster
						position="top-center"
						richColors
					/>
					{children}
					<TailwindIndicator />
				</Providers>
			</body>
		</html>
	);
}
