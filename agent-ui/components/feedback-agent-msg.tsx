import { FeedbackAnalysis } from "@/lib/types";
import { AnalysisCard } from "./analysis-card";

interface FeedbackAgentMessageProps {
	agentMessage: string;
	feedbackAnalysis: FeedbackAnalysis;
}
export const FeedbackAgentMessage = ({
	agentMessage,
	feedbackAnalysis,
}: FeedbackAgentMessageProps) => {
	return (
		<div className="flex flex-col w-full space-y-2">
			{agentMessage && (
				<div className="text-sm text-gray-500 mb-4">{agentMessage}</div>
			)}
			<div>
				<AnalysisCard analysis={feedbackAnalysis} />
			</div>
		</div>
	);
};
