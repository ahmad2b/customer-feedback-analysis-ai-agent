import { SidebarDesktop } from "@/components/sidebar/sidebar-desktop";
import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import Link from "next/link";
import React from "react";
import { AI } from "./actions";

const ChatLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<div className="relative flex h-dvh overflow-hidden bg-[#f5f5f7]">
			<div className="flex items-center justify-between gap-4 border p-4 rounded-2xl w-[250px] absolute m-2  bg-white shadow ">
				<Link
					href={"/"}
					className="font-bold font-sans text-xl"
				>
					AI Agent
				</Link>
				<SidebarToggle />
			</div>
			<SidebarDesktop />
			<main className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[260px] ">
				<AI>{children}</AI>
			</main>
		</div>
	);
};

export default ChatLayout;
