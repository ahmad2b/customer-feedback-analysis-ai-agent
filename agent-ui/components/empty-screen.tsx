import { motion } from "framer-motion";
import Link from "next/link";
import { Separator } from "./ui/separator";

export function EmptyScreen() {
	return (
		<motion.div className="h-[350px] px-4 w-full md:max-w-xl md:w-full md:px-0 pt-20 mx-auto ">
			<div className="p-6 flex flex-col px-10 py-16 gap-4 text-zinc-500 text-sm dark:text-zinc-400 shadow-[#9ba5b7] bg-[#f4f4f8] shadow-md rounded-2xl dark:border-zinc-700">
				<h2 className="flex text-center text-2xl text-[#323E59] font-urban font-medium md:text-4xl  flex-row justify-center gap-4 items-center ">
					Customer Feedback Analysis AI Agent
				</h2>

				<Separator className="my-4" />

				<p className="text-center font-poppins text-lg text-[#323e59]">
					Customer Feedback Analysis AI Agent for reducing staff hours, boosting
					efficiency, faster response times, improved retention, actionable
					insights for product and strategy, and testing system with a data
					subset to see results fast.
				</p>

				<Separator className="my-4" />

				<p className="text-center text-lg text-[#323e59]">
					Learn more about the AI Agent{" "}
					<Link
						className="text-[#0058dd] hover:underline hover:text-[#0058dd]/80"
						href="https://github.com/ahmad2b/customer-feedback-analysis-ai-agent.git"
						target="_blank"
					>
						here
					</Link>
					.
				</p>
			</div>
		</motion.div>
	);
}
