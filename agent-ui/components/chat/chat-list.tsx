import { UIState } from "@/lib/chat/actions";
import { Session } from "@/lib/types";

export interface ChatList {
	messages: UIState;
	session?: Session;
	isShared: boolean;
}

export function ChatList({ messages, session, isShared }: ChatList) {
	return messages.length ? (
		<div className="relative mx-auto max-w-2xl grid auto-rows-max gap-8 px-4 text-neutral-950">
			{messages.map((message) => {
				return (
					<div key={message.id}>
						{message?.spinner}
						{message?.display}
						{message?.attachments}
					</div>
				);
			})}
		</div>
	) : null;
}
