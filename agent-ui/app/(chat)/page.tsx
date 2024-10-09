"use client";

import { EmptyScreen } from "@/components/empty-screen";
import { UserMessage } from "@/components/stocks/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { useActions, useUIState } from "ai/rsc";
import { Send } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { UIState } from "./actions";

export default function FeedbackChat() {
	const { analyzeFeedback } = useActions();
	const [messages, setMessages] = useUIState();
	const [input, setInput] = useState("");

	const inputRef = useRef<HTMLInputElement>(null);
	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!input.trim()) return;

		setMessages((prevMessages: any) => [
			...prevMessages,
			{
				id: Date.now(),
				role: "human",
				display: <UserMessage>{input}</UserMessage>,
			},
		]);
		setInput("");

		try {
			const response: ReactNode = await analyzeFeedback(input);
			setMessages((prevMessages: any) => [...prevMessages, response]);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	};

	return (
		<div className="flex flex-col h-screen font-sans w-full ">
			<div className="flex w-full mx-auto max-w-6xl px-4 sm:px-6 md:px-8 py-2 relative">
				<div className="flex-1 flex flex-col  w-full h-[96vh] py-4">
					<ScrollArea
						className="flex-1  mb-4 pb-4"
						ref={messagesContainerRef}
					>
						{messages.length ? (
							<div className="relative mx-auto max-w-5xl grid auto-rows-max gap-8 px-4 text-neutral-950">
								{messages.map((message: UIState, idx: number) => {
									return (
										<div
											key={message.id}
											className={`${
												message.role === "ai"
													? "border-b-2 border-stone-300 pb-4"
													: ""
											}`}
										>
											{message?.spinner}
											{message?.display}
										</div>
									);
								})}
							</div>
						) : (
							<EmptyScreen />
						)}
						{/* <div ref={messagesEndRef} /> */}
					</ScrollArea>
					<form
						onSubmit={handleSubmit}
						className="flex space-x-2 mb-4 bg-[#f4f4f8] rounded-full p-4 shadow-sm shadow-[#9ba5b7]"
					>
						<Input
							ref={inputRef}
							className="flex-1 rounded-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-[#323E59] font-poppins"
							placeholder="Paste your feedback here..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<Button
							type="submit"
							className="rounded-full bg-[#0058dd] hover:bg-[#1968e0] text-white"
						>
							<Send className="h-4 w-4" />
							<span className="sr-only">Send</span>
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
