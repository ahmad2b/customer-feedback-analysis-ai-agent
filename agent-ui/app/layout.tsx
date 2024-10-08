import { Providers } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

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
