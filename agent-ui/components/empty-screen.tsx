import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Car, Hotel, Map, Plane } from "lucide-react";
import Link from "next/link";

export function EmptyScreen() {
	return (
		<motion.div className="h-[350px] px-4 w-full md:max-w-lg md:w-full md:px-0 pt-20 mx-auto">
			<div className=" rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
				<h2 className="flex text-center text-base md:text-lg font-serif flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
					Intelligent Customer Support Agent
				</h2>
				<div className="flex justify-center space-x-6">
					<Button
						variant="ghost"
						size="icon"
						className="cursor-default hover:bg-transparent"
					>
						<Plane className="h-6 w-6 text-blue-500 mb-1" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-default hover:bg-transparent"
					>
						<Hotel className="h-6 w-6 text-green-500 mb-1" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-default hover:bg-transparent"
					>
						<Car className="h-6 w-6 text-red-500 mb-1" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-default hover:bg-transparent"
					>
						<Map className="h-6 w-6 text-purple-500 mb-1" />
					</Button>
				</div>
				<p className="text-center">
					This is a customer support <span className="font-bold">AI Agent</span>{" "}
					for an airline to help users research and make travel arrangements.
					Users can search for flights, hotels, and car rentals using natural
					language.
				</p>
				<div className="flex flex-col mx-auto">
					<h3 className="font-bold">Main Features:</h3>
					<ul className="my-2 ml-6 list-disc [&>li]:mt-1">
						<li>Flight bookings</li>
						<li>Hotel Reservations</li>
						<li>Car Rentals</li>
						<li>Excursions</li>
					</ul>
				</div>
				<p className="text-center">
					{" "}
					Learn more about the AI Agent at{" "}
					<Link
						className="text-fuchsia-500 dark:text-fuchsia-400"
						href="https://devraftel.com/"
						target="_blank"
					>
						DevRaftel{" "}
					</Link>
				</p>
			</div>
		</motion.div>
	);
}
