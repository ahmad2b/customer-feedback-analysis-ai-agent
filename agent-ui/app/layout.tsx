import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL("https://devraftel.com"),
	title: "Intelligent Customer Support Agent",
	description:
		"A customer support AI Agent for an airline to help users research and make travel arrangements.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
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
