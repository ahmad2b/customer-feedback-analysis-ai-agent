import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackAnalysis } from "@/lib/types";
import { MemoizedReactMarkdown } from "./markdown";
import { Separator } from "./ui/separator";

const sentimentColors = {
	Positive: "bg-green-50/20 text-gray-900 border-green-200",
	Neutral: "bg-gray-100/20 text-gray-900 border-gray-200",
	Negative: "bg-red-50/20 text-gray-900 border-red-200",
};

export const AnalysisCard = ({ analysis }: { analysis: FeedbackAnalysis }) => {
	const sentimentColor =
		sentimentColors[analysis.sentiment as keyof typeof sentimentColors] ||
		sentimentColors.Neutral;
	return (
		<Card
			className={`transition-colors duration-500 ease-in-out ${sentimentColor}`}
		>
			<CardHeader>
				<CardTitle>Feedback Analysis</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-3 gap-4">
					<div className="border-r">
						<h3 className="font-semibold">Category:</h3>
						<Badge variant="secondary">{analysis?.category}</Badge>
					</div>
					<div className="border-r">
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
				</div>
				<Separator />
				<div className="grid  grid-cols-3 gap-4">
					<div className="col-span-1 border-r">
						<h3 className="font-semibold">Route:</h3>
						<p>{analysis?.route}</p>
					</div>
					<div className="col-span-2">
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
				</div>
				<Separator />

				<div>
					<h3 className="font-semibold">Trend Analysis:</h3>
					<p>{analysis?.trend_analysis}</p>
				</div>
				<Separator />
				<div>
					<h3 className="font-semibold">Summary:</h3>
					<p>{analysis?.summary}</p>
				</div>
				<Separator />

				<div>
					<h3 className="font-semibold">Action Items:</h3>
					<ul className="list-disc pl-5">
						{analysis?.action_items &&
							analysis.action_items.map((item, index) => (
								<li key={index}>
									<MemoizedReactMarkdown key={index}>
										{item}
									</MemoizedReactMarkdown>
								</li>
							))}
					</ul>
				</div>

				<Separator />

				<div>
					<h3 className="font-semibold">Management Dashboard:</h3>
					<MemoizedReactMarkdown>
						{analysis?.management_dashboard}
					</MemoizedReactMarkdown>
				</div>
			</CardContent>
		</Card>
	);
};
