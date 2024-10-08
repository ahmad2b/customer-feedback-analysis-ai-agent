import { Button } from "@/components/ui/button";
import { Car, Hotel, Map, Plane } from "lucide-react";

export const ChatFooter = () => {
	return (
		<div className="flex justify-center space-x-6">
			<Button
				variant="ghost"
				size="sm"
				className="flex flex-col items-center"
			>
				<Plane className="size-5 text-blue-500 mb-1 flex-shrink-0" />
				<span className="text-xs text-gray-600">Flights</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="flex flex-col items-center"
			>
				<Hotel className="size-5 text-green-500 mb-1 flex-shrink-0" />
				<span className="text-xs text-gray-600">Hotels</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="flex flex-col items-center"
			>
				<Car className="size-5 text-red-500 mb-1 flex-shrink-0" />
				<span className="text-xs text-gray-600">Cars</span>
			</Button>
			<Button
				variant="ghost"
				size="sm"
				className="flex flex-col items-center"
			>
				<Map className="size-5 text-purple-500 mb-1 flex-shrink-0" />
				<span className="text-xs text-gray-600">Excursions</span>
			</Button>
		</div>
	);
};
