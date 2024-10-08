"use client";

import { ChatList } from "@/components/chat/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { UserMessage } from "@/components/stocks/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { useActions, useUIState } from "ai/rsc";
import { Send } from "lucide-react";
import { ReactNode, useRef, useState } from "react";

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
		<div className="flex flex-col h-screen font-sans w-full">
			<div className="flex-1 flex flex-col max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-2 w-full">
				<ScrollArea
					className="flex-1 rounded-2xl bg-white p-4 shadow-lg mb-4"
					ref={messagesContainerRef}
				>
					{messages.length ? (
						<ChatList
							messages={messages}
							isShared={false}
						/>
					) : (
						<EmptyScreen />
					)}
					<div ref={messagesEndRef} />
					<div ref={messagesEndRef} />
				</ScrollArea>
				<form
					onSubmit={handleSubmit}
					className="flex space-x-2 mb-4"
				>
					<Input
						ref={inputRef}
						className="flex-1 rounded-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
						placeholder="Paste your feedback here..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
					/>
					<Button
						type="submit"
						className="rounded-full bg-stone-600 hover:bg-stone-700 text-white"
					>
						<Send className="h-4 w-4" />
						<span className="sr-only">Send</span>
					</Button>
				</form>
			</div>
		</div>
	);
}
