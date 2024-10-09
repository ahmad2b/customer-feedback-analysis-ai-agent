"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackAnalytics } from "@/lib/types";
import { BarChart2, Frown, RefreshCw, Smile, TrendingUp } from "lucide-react";
import { useState } from "react";

const AnimatedNumber = ({ value }: { value: number }) => {
	const [displayValue, setDisplayValue] = useState(0);

	useState(() => {
		let start = 0;
		const end = value;
		const duration = 1000;
		const increment = end / (duration / 16);
		const timer = setInterval(() => {
			start += increment;
			setDisplayValue(Math.floor(start));
			if (start >= end) {
				clearInterval(timer);
				setDisplayValue(end);
			}
		}, 16);
		return () => clearInterval(timer);
	}, [value]);

	return <span>{displayValue}</span>;
};

const SentimentFace = ({
	sentiment,
	count,
	total,
}: {
	sentiment: string;
	count: number;
	total: number;
}) => {
	const percentage = (count / total) * 100;
	return (
		<div className="flex flex-col items-center">
			{sentiment === "Positive" ? (
				<Smile
					className={`w-16 h-16 ${
						percentage > 50 ? "text-green-500" : "text-gray-400"
					}`}
				/>
			) : (
				<Frown
					className={`w-16 h-16 ${
						percentage > 50 ? "text-red-500" : "text-gray-400"
					}`}
				/>
			)}
			<span className="text-2xl font-bold mt-2">
				<AnimatedNumber value={count} />
			</span>
			<span className="text-sm text-muted-foreground">{sentiment}</span>
		</div>
	);
};

export function FeedbackAnalyticsDashboard({
	data,
}: {
	data: FeedbackAnalytics;
}) {
	const totalSentiments = Object.values(data.sentiment_distribution).reduce(
		(a, b) => a + b,
		0
	);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<div className="space-y-4">
			<Card className="w-full">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-2xl font-bold">Feedback Pulse</CardTitle>
					<Button
						variant="outline"
						size="icon"
					>
						<RefreshCw className="h-4 w-4" />
					</Button>
				</CardHeader>
				<CardContent>
					<div className="flex justify-around items-center py-4">
						{Object.entries(data.sentiment_distribution).map(
							([sentiment, count]) => (
								<SentimentFace
									key={sentiment}
									sentiment={sentiment}
									count={count}
									total={totalSentiments}
								/>
							)
						)}
					</div>
					<div className="text-center mt-4">
						<span className="text-3xl font-bold">
							<AnimatedNumber value={data.total_feedback_processed} />
						</span>
						<span className="text-sm text-muted-foreground ml-2">
							Total Feedback
						</span>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold flex items-center">
							<BarChart2 className="mr-2" /> Top Categories
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{Object.entries(data.top_categories).map(([category, count]) => (
								<div
									key={category}
									className="flex justify-between items-center"
								>
									<span className="text-sm font-medium">{category}</span>
									<Badge variant="secondary">{count}</Badge>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg font-semibold flex items-center">
							<TrendingUp className="mr-2" /> Emerging Trends
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{Object.entries(data.top_trends).map(([trend, count]) => (
								<Badge
									key={trend}
									variant="outline"
									className="text-sm py-1 px-2"
								>
									{trend || "Uncategorized"}: {count}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="text-center text-sm text-muted-foreground">
				Last updated: {formatDate(data.last_updated)}
			</div>
		</div>
	);
}
