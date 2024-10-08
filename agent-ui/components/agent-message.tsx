import FlightInfoCard, { FlightData } from "./flight/flight-info-card";

interface AgentMessageProps {
	agentMessage: string;
	flightData: FlightData[];
}
export const AgentMessage = ({
	agentMessage,
	flightData,
}: AgentMessageProps) => {
	return (
		<div className="flex flex-col w-full space-y-2">
			<div className="text-sm text-gray-500">{agentMessage}</div>
			{flightData.map((data, index) => (
				<FlightInfoCard
					key={index}
					flightData={data}
				/>
			))}
		</div>
	);
};
