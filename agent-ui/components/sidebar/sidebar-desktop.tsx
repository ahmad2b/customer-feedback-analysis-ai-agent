import { Sidebar } from "@/components/sidebar/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PlusCircleIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { SidebarToggle } from "./sidebar-toggle";

export async function SidebarDesktop() {
	// const { userId } = auth();

	// if (!userId) {
	// 	return null;
	// }

	// const user = await currentUser();

	return (
		<Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full  bg-transparent duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] data-[state=open]:m-2 rounded-xl">
			<div className="bg-white shadow h-full rounded-xl border flex flex-col space-y-2">
				<div className="p-2">
					<div className="flex items-center justify-between">
						<Link
							href={"/"}
							className="font-bold font-sans text-xl"
						>
							AI Agent
						</Link>
						<SidebarToggle />
					</div>
				</div>
				<Separator />
				<div className="p-2">
					<Link
						href={"/"}
						className={cn(
							"",
							buttonVariants({
								size: "lg",
								className: "w-full",
							})
						)}
					>
						<PlusCircleIcon className="mr-2 size-5" />
						New Chat
					</Link>
				</div>
			</div>

			{/* <ChatHistory userId={user?.id} /> */}
		</Sidebar>
	);
}
