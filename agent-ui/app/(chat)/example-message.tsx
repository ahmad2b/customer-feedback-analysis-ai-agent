import { Button } from "@/components/ui/button";
import { useActions, useUIState } from "ai/rsc";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ExampleMessageProps {
	action: {
		title: string;
		label: string;
		action: string;
	};
	index: number;
}

export const ExampleMessage = ({ action, index }: ExampleMessageProps) => {
	const [messages, setMessages] = useUIState();
	const { sendMessage } = useActions();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.01 * index }}
			key={index}
			className={index > 1 ? "hidden sm:block" : "block"}
		>
			<Button
				onClick={async () => {
					setMessages((messages: any) => [
						...messages,
						{
							id: Date.now(),
							role: "human",
							display: <p>{action.action}</p>,
						},
					]);
					const response: ReactNode = await sendMessage(action.action);
					setMessages((messages: any) => [...messages, response]);
				}}
				variant="outline"
				className="w-full text-left justify-start h-auto"
			>
				<div className="flex flex-col items-start">
					<span className="font-medium">{action.title}</span>
					<span className="text-zinc-500 dark:text-zinc-400">
						{action.label}
					</span>
				</div>
			</Button>
		</motion.div>
	);
};
