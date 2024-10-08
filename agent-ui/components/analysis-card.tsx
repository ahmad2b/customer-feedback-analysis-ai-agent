import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackAnalysis } from "@/lib/types";

const sentimentColors = {
	Positive: "bg-green-50 text-gray-900 border-green-200",
	Neutral: "bg-gray-100 text-gray-900 border-gray-200",
	Negative: "bg-red-50 text-gray-900 border-red-200",
};

export const AnalysisCard = ({ analysis }: { analysis: FeedbackAnalysis }) => {
	const sentimentColor =
		sentimentColors[analysis.sentiment as keyof typeof sentimentColors] ||
		sentimentColors.Neutral;
	return (
		<Card
			className={`transition-colors duration-500 ease-in-out ${sentimentColor}`}
		>
			{" "}
			<CardHeader>
				<CardTitle>Feedback Analysis</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<h3 className="font-semibold">Category:</h3>
					<Badge variant="secondary">{analysis?.category}</Badge>
				</div>
				<div>
					<h3 className="font-semibold">Sentiment:</h3>
					<Badge
						variant={
							analysis?.sentiment === "Negative" ? "destructive" : "default"
						}
					>
						{analysis?.sentiment}
					</Badge>
				</div>
				<div>
					<h3 className="font-semibold">Priority:</h3>
					<p>{analysis?.priority}</p>
				</div>
				<div>
					<h3 className="font-semibold">Summary:</h3>
					<p>{analysis?.summary}</p>
				</div>
				<div>
					<h3 className="font-semibold">Entities:</h3>
					<div className="flex flex-wrap gap-2">
						{analysis?.entities &&
							analysis?.entities.map((entity, index) => (
								<Badge
									key={index}
									variant="outline"
								>
									{entity}
								</Badge>
							))}
					</div>
				</div>
				<div>
					<h3 className="font-semibold">Route:</h3>
					<p>{analysis?.route}</p>
				</div>
				<div>
					<h3 className="font-semibold">Action Items:</h3>
					<ul className="list-disc pl-5">
						{analysis?.action_items &&
							analysis.action_items.map((item, index) => (
								<li
									key={index}
									dangerouslySetInnerHTML={{ __html: item }}
								/>
							))}
					</ul>
				</div>
				<div>
					<h3 className="font-semibold">Trend Analysis:</h3>
					<p>{analysis?.trend_analysis}</p>
				</div>
				<div>
					<h3 className="font-semibold">Management Dashboard:</h3>
					<p>{analysis?.management_dashboard}</p>
				</div>
			</CardContent>
		</Card>
	);
};
