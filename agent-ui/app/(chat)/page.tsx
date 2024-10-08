"use client";

import { ChatFooter } from "@/components/chat-footer";
import { ChatList } from "@/components/chat/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { useActions, useUIState } from "ai/rsc";
import { Send } from "lucide-react";
import { ReactNode, useRef, useState } from "react";
import { ExampleMessage } from "./example-message";

export default function Home() {
	const { sendMessage } = useActions();
	const [messages, setMessages] = useUIState();
	const [input, setInput] = useState<string>("");

	const inputRef = useRef<HTMLInputElement>(null);
	const [messagesContainerRef, messagesEndRef] =
		useScrollToBottom<HTMLDivElement>();

	const suggestedActions = [
		{
			title: "Hi there,",
			label: "what time is my flight?",
			action: "Hi there, what time is my flight?",
		},
		{
			title: "Am I allowed to",
			label: "update my flight to something sooner?",
			action:
				"Am I allowed to update my flight to something sooner? I want to leave later today.",
		},
		{
			title: "I'd like an",
			label: "affordable hotel and rent a car",
			action:
				"Yeah I think I'd like an affordable hotel for my week-long stay (7 days). And I'll want to rent a car.",
		},
		{
			title: "Book the cheapest",
			label: "car option for 7 days",
			action:
				"Awesome let's just get the cheapest option. Go ahead and book for 7 days.",
		},
	];

	// console.log(messages);

	return (
		<div className="flex flex-col h-screen  font-sans w-full">
			<div className="flex-1 flex flex-col space-y-4 max-w-3xl mx-auto w-full px-4 sm:px-6 md:px-8 py-2">
				<ScrollArea
					className="flex-1 rounded-2xl bg-white p-4 shadow-lg"
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
				</ScrollArea>

				<div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-3xl mb-4">
					{messages.length === 0 &&
						suggestedActions.map((action, index) => (
							<ExampleMessage
								key={index}
								action={action}
								index={index}
							/>
						))}
				</div>

				<form
					className="flex flex-col gap-2 relative items-center"
					onSubmit={async (event) => {
						event.preventDefault();

						setMessages((messages) => [
							...messages,
							{
								id: Date.now(),
								role: "human",
								display: <p>{input}</p>,
							},
						]);
						setInput("");

						const response: ReactNode = await sendMessage(input);
						setMessages((messages) => [...messages, response]);
					}}
				>
					<div className="flex w-full space-x-2">
						<Input
							ref={inputRef}
							className="flex-1 rounded-full bg-white border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
							placeholder="Ask about your smart home..."
							value={input}
							onChange={(event) => {
								setInput(event.target.value);
							}}
						/>
						<Button
							type="submit"
							className="rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
						>
							<Send className="h-4 w-4" />
							<span className="sr-only">Send</span>
						</Button>
					</div>
				</form>

				<ChatFooter />
			</div>
		</div>
	);
}
