import { AgentMessage } from "@/components/agent-message";
import { FlightData } from "@/components/flight/flight-info-card";
import { SpinnerMessage } from "@/components/stocks/message";
import { generateId } from "ai";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import { RemoteRunnable } from "langchain/runnables/remote";
import { ReactNode } from "react";

const sendMessage = async (message: string) => {
	"use server";

	console.log("Sending message:", message);

	const aiState = getMutableAIState();

	aiState.update({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				id: generateId(),
				role: "human",
				content: message,
			},
		],
	});

	console.log("AI state:", aiState.get());

	const uiStream = createStreamableUI("");
	const spinnerStream = createStreamableUI(<SpinnerMessage />);

	let streamResult = "";
	let flightData: FlightData[] = [];

	(async () => {
		spinnerStream.update(<SpinnerMessage />);

		const remoteChain = new RemoteRunnable({
			url: "http://localhost:8000/agent",
			options: {
				timeout: 60000,
			},
		});

		const formatedMessages = [{ type: "human", content: message }];

		const stream = remoteChain.streamEvents(
			{
				messages: formatedMessages,
				user_info: "user",
			},
			{
				version: "v1",
				configurable: {
					checkpoint_id: "string",
					checkpoint_ns: "string",
					thread_id: "1",
					passenger_id: "3442 587242",
				},
			}
		);

		try {
			for await (const event of stream) {
				const eventType = event.event;
				const eventName = event.name;

				console.log("Event type:", eventType);
				console.log("Event name:", eventName);

				if (eventType === "on_chat_model_stream") {
					if (event.name === "ChatOpenAI") {
						const data = event.data;
						streamResult += data.chunk["content"];
						console.log("ChatOpenAI Stream data:", data);
						uiStream.update(
							<AgentMessage
								agentMessage={streamResult}
								flightData={flightData}
							/>
						);
					}
				}

				if (eventType === "on_tool_end") {
					if (eventName === "fetch_user_flight_information") {
						const data = event.data.output;
						console.log("fetch_user_flight_information Tool end data:", data);
						flightData = data;
						// uiStream.update(
						// 	<AgentMessage
						// 		agentMessage={streamResult}
						// 		flightData={flightData}
						// 	/>
						// );
					}
				}
			}
		} catch (error) {
			console.error("Error processing stream:", error);
		}
	})()
		.catch((error) => {
			console.error("Error in async function:", error);
		})
		.finally(() => {
			spinnerStream.update(null);
			uiStream.done();
		});

	return {
		id: generateId(),
		role: "ai",
		display: uiStream.value,
		spinner: spinnerStream.value,
	};
};

export type Role = "human" | "ai" | "tool";

export type Message = {
	role: Role;
	content: string;
	id?: string;
	name?: string;
	display?: {
		name: string;
		props: Record<string, any>;
	};
};

export type AIState = {
	chatId: string;
	messages: Array<Message>;
};

export type UIState = {
	id: string;
	role: Role;
	display: ReactNode;
	spinner?: ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
	initialAIState: {
		chatId: generateId(),
		messages: [],
	},
	initialUIState: [],
	actions: {
		sendMessage,
	},
	onSetAIState: async ({ state, done }) => {
		"use server";

		if (done) {
			// save to database
		}
	},
});
