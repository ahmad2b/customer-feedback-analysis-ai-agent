import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Armchair,
	Calendar,
	Clock,
	CreditCard,
	MapPin,
	Plane,
	Ticket,
} from "lucide-react";

export interface FlightData {
	ticket_no: string;
	book_ref: string;
	flight_id: number;
	flight_no: string;
	departure_airport: string;
	arrival_airport: string;
	scheduled_departure: string;
	scheduled_arrival: string;
	seat_no: string;
	fare_conditions: string;
}

export default function FlightInfoCard({
	flightData,
}: {
	flightData: FlightData;
}) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			timeZoneName: "short",
		});
	};

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<CardTitle className="text-lg font-bold">Flight Information</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Plane className="w-5 h-5 text-blue-500" />
							<span className="font-semibold">Flight:</span>
							<span>{flightData.flight_no}</span>
						</div>
						<div className="flex items-center space-x-2">
							<MapPin className="w-5 h-5 text-red-500" />
							<span className="font-semibold">Route:</span>
							<span>
								{flightData.departure_airport} → {flightData.arrival_airport}
							</span>
						</div>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Calendar className="w-5 h-5 text-green-500" />
								<span className="font-semibold">Departure:</span>
							</div>
							<div className="pl-7">
								{formatDate(flightData.scheduled_departure)}
							</div>
						</div>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Calendar className="w-5 h-5 text-green-500" />
								<span className="font-semibold">Arrival:</span>
							</div>
							<div className="pl-7">
								{formatDate(flightData.scheduled_arrival)}
							</div>
						</div>
					</div>
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<CreditCard className="w-5 h-5 text-purple-500" />
							<span className="font-semibold">Booking Reference:</span>
							<span>{flightData.book_ref}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Ticket className="w-5 h-5 text-yellow-500" />
							<span className="font-semibold">Ticket Number:</span>
							<span>{flightData.ticket_no}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Armchair className="w-5 h-5 text-orange-500" />
							<span className="font-semibold">Seat:</span>
							<span>{flightData.seat_no}</span>
						</div>
						<div className="flex items-center space-x-2">
							<Clock className="w-5 h-5 text-indigo-500" />
							<span className="font-semibold">Class:</span>
							<span>{flightData.fare_conditions}</span>
						</div>
					</div>
				</div>
				<Separator className="my-6" />
				<div className="text-sm text-gray-500">
					Flight ID: {flightData.flight_id}
				</div>
			</CardContent>
		</Card>
	);
}
