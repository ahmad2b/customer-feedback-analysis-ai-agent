"use client";

import { StreamableValue, useStreamableValue } from "ai/rsc";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { BotIcon, UserIcon } from "./icons";
import { MemoizedReactMarkdown } from "./markdown";

export const TextStreamMessage = ({
	content,
}: {
	content: StreamableValue;
}) => {
	const [text] = useStreamableValue(content);

	return (
		<motion.div
			className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
		>
			<div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
				<BotIcon />
			</div>

			<div className="flex flex-col gap-1 w-full">
				<div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
					<MemoizedReactMarkdown>{text}</MemoizedReactMarkdown>
				</div>
			</div>
		</motion.div>
	);
};

export const Message = ({
	role,
	content,
}: {
	role: "ai" | "human" | "tool";
	content: string | ReactNode;
}) => {
	return (
		<motion.div
			className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
			initial={{ y: 5, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
		>
			<div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
				{role === "ai" ? <RiRobot2Fill /> : <UserIcon />}
			</div>

			<div className="flex flex-col gap-1 w-full">
				<div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
					{content}
				</div>
			</div>
		</motion.div>
	);
};
