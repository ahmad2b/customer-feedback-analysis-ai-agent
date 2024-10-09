import { SidebarDesktop } from "@/components/sidebar/sidebar-desktop";
import React from "react";
import { AI } from "./actions";

const ChatLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<AI>
			<div className="relative flex h-dvh overflow-hidden bg-white">
				<SidebarDesktop />
				<main className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[260px] ">
					{children}
				</main>
			</div>
		</AI>
	);
};

export default ChatLayout;
