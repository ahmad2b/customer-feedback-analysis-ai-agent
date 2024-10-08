import { motion } from "framer-motion";
import Link from "next/link";
import { Separator } from "./ui/separator";

export function EmptyScreen() {
	return (
		<motion.div className="h-[350px] px-4 w-full md:max-w-lg md:w-full md:px-0 pt-20 mx-auto">
			<div className=" rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
				<h2 className="flex text-center text-base md:text-lg font-serif flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
					Customer Feedback Analysis AI Agent
				</h2>

				<Separator className="my-8" />

				<p className="text-center">
					Customer Feedback Analysis AI Agent for reducing staff hours, boosting
					efficiency, faster response times, improved retention, actionable
					insights for product and strategy, and testing system with a data
					subset to see results fast.
				</p>

				<Separator className="my-8" />

				<p className="text-center">
					Learn more about the AI Agent{" "}
					<Link
						className="text-fuchsia-500 dark:text-fuchsia-400"
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
