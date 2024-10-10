import { BotCard, SpinnerMessage } from "@/components/chat/message";
import { FeedbackAgentMessage } from "@/components/feedback-agent-msg";
import { FeedbackAnalysis, FeedbackAnalytics } from "@/lib/types";
import { generateId } from "ai";
import { createAI, createStreamableUI, getMutableAIState } from "ai/rsc";
import { RemoteRunnable } from "langchain/runnables/remote";
import { ReactNode } from "react";

const analyzeFeedback = async (feedback: string): Promise<UIState> => {
	"use server";

	console.log("Analyzing feedback:", feedback);

	const aiState = getMutableAIState();

	const messageId = generateId();

	aiState.update({
		...aiState.get(),
		messages: [
			...aiState.get().messages,
			{
				id: messageId,
				role: "human",
				content: feedback,
			},
		],
	});

	console.log("AI state:", aiState.get());

	const uiStream = createStreamableUI();
	const spinnerStream = createStreamableUI(<SpinnerMessage />);

	let streamResult = "";
	let feedbackAnalysis = {
		feedback: "",
		category: "",
		entities: [],
		summary: "",
		sentiment: "",
		priority: "",
		route: "",
		action_items: [],
		database_updated: false,
		trend_analysis: "",
		management_dashboard: "",
		analysis_summary: {
			last_updated: "",
			sentiment_distribution: {},
			top_categories: {},
			top_trends: {},
			total_feedback_processed: 0,
		},
	} satisfies FeedbackAnalysis;
	let sentiment;

	(async () => {
		spinnerStream.update(<SpinnerMessage />);

		const remoteChain = new RemoteRunnable({
			url: "http://localhost:8000",
			options: {
				timeout: 60000,
			},
		});

		const stream = remoteChain.streamEvents(
			{
				feedback: feedback,
				category: "",
				entities: [],
				summary: "",
				sentiment: "",
				priority: "",
				route: "",
				action_items: [],
				database_updated: false,
				trend_analysis: "",
				management_dashboard: "",
				analysis_summary: {},
			},
			{
				version: "v2",
			}
		);

		try {
			for await (const event of stream) {
				const eventType = event.event;
				const eventName = event.name;

				console.log("Event type:", eventType);
				console.log("Event name:", eventName);

				if (eventType === "on_chat_model_stream") {
					if (eventName === "ChatOpenAI") {
						const data = event.data;
						// streamResult += data.chunk["content"];
						// console.log("ChatOpenAI Stream data:", data);
						uiStream.update(
							<BotCard>
								<FeedbackAgentMessage
									agentMessage={streamResult}
									feedbackAnalysis={feedbackAnalysis}
								/>
							</BotCard>
						);
					}
				}

				if (eventType === "on_chain_end") {
					if (eventName === "_write") {
						const data = event.data.output;
						console.log("on_chain_end _write data:", data);

						feedbackAnalysis = data;

						uiStream.update(
							<BotCard>
								<FeedbackAgentMessage
									agentMessage={streamResult}
									feedbackAnalysis={feedbackAnalysis}
								/>
							</BotCard>
						);
					}
				}
				if (eventType === "on_chain_end") {
					if (eventName === "LangGraph") {
						const data = event.data.output;
						console.log("on_chain_end LangGraph data:", data);
						feedbackAnalysis = data;
						sentiment = feedbackAnalysis.sentiment;

						uiStream.update(
							<BotCard>
								<div className="flex ">
									<FeedbackAgentMessage
										agentMessage={streamResult}
										feedbackAnalysis={feedbackAnalysis}
									/>
									{/* <FeedbackAnalyticsDashboard
										data={feedbackAnalysis.analysis_summary}
									/> */}
								</div>
							</BotCard>
						);
						spinnerStream.done(null);
						uiStream.done();
						aiState.update({
							...aiState.get(),
							messages: [
								...aiState.get().messages,
								{
									id: generateId(),
									role: "ai",
									content: feedback,
									display: uiStream.value,
									spinner: spinnerStream.value,
									analysis_summary: feedbackAnalysis.analysis_summary,
								},
							],
						});
					}
				}
			}
		} catch (error) {
			console.error("Error processing stream:", error);
		}
	})().catch((error) => {
		console.error("Error in async function:", error);
	});

	return {
		id: messageId,
		role: "ai",
		display: uiStream.value,
		spinner: spinnerStream.value,
		analysis_summary: feedbackAnalysis.analysis_summary,
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
	analysis_summary?: AnalysisSummary;
};

export type AIState = {
	chatId: string;
	messages: Array<Message>;
};

type AnalysisSummary = {
	sentiment_distribution: {
		Positive: number;
		Negative: number;
		Neutral: number;
		[key: string]: number; // In case there are additional sentiments like "Neutral" or others
	};
	top_categories: {
		Praise: number;
		Complaint: number;
		[key: string]: number; // To accommodate any other categories that may be added
	};
	top_trends: {
		[key: string]: number; // The key can be any string, and it maps to a number
	};
	total_feedback_processed: number;
	last_updated: string; // This represents the ISO timestamp as a string
};

export type UIState = {
	id: string;
	role: Role;
	display: ReactNode;
	spinner?: ReactNode;
	analysis_summary: FeedbackAnalytics;
};

export const AI = createAI<AIState, UIState[]>({
	initialAIState: {
		chatId: generateId(),
		messages: [],
	},
	initialUIState: [],
	actions: {
		analyzeFeedback,
	},
	onSetAIState: async ({ state, done }) => {
		"use server";

		if (done) {
			// save to database
		}
	},
});
