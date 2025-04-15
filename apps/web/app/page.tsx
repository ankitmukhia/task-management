"use client";

import { useState, useActionState } from "react";
import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Calendar } from "@/components/ui/calendar";
import { durationOptions } from "@/lib/constants";
import { Chat } from "./chat";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectGroup,
	SelectValue,
} from "@/components/ui/select";
import { createTask } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { ActionState } from '@/lib/defination'

export default function Home() {
	const { getToken } = useAuth();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [duration, setDuration] = useState("30");
	const [priority, setPriority] = useState("MEDIUM");
	const [status, setStatus] = useState("PENDING");

	const actionWrapper = async (state: ActionState, formData: FormData) => {
		const token = await getToken();
		return createTask(state, formData, token!);
	};

	const [state, action, isPending] = useActionState(actionWrapper, undefined);
	console.log("form state: ", state);

	// here Next I have to make post request to my noder js creat-task endpoint
	// when traditional form & next js action
	return (
		<div className="p-4">
			<div className="flex justify-between">
				<ThemeToggle />

				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline">Create</Button>
					</DialogTrigger>

					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Task</DialogTitle>
						</DialogHeader>

						<form action={action} className="grid gap-2">
							{/* here we will have traditional form */}
							<Input type="text" name="title" placeholder="title" />
							<Input type="text" name="description" placeholder="description" />
							<input
								type="hidden"
								name="scheduledDate"
								value={selectedDate ? selectedDate.toISOString() : ""}
							/>
							<input
								type="hidden"
								name="priority"
								value={priority ? priority : ""}
							/>
							<input type="hidden" name="status" value={status ? status : ""} />
							<input
								type="hidden"
								name="durationMins"
								value={duration ? duration : ""}
							/>

							<div className="flex">
								<Popover>
									<PopoverTrigger asChild>
										<Button>
											<span>Pick a date</span>
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<Calendar
											mode="single"
											selected={selectedDate}
											onSelect={setSelectedDate}
											initialFocus
										/>
									</PopoverContent>
								</Popover>

								<Select value={duration} onValueChange={setDuration}>
									<SelectTrigger>
										<SelectValue placeholder="Slot" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{durationOptions.map((opt) => (
												<SelectItem key={opt.value} value={opt.value}>
													{opt.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</div>

							<Select value={priority} onValueChange={setPriority}>
								<SelectTrigger>
									<SelectValue placeholder="Select Priority" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="LOW">LOW</SelectItem>
										<SelectItem value="MEDIUM">MEDIUM</SelectItem>
										<SelectItem value="HIGH">HIGH</SelectItem>
										<SelectItem value="URGENT">URGENT</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>

							<Select value={status} onValueChange={setStatus}>
								<SelectTrigger>
									<SelectValue placeholder="Select Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="PENDING">PENDING</SelectItem>
										<SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
										<SelectItem value="COMPLETED">COMPLETED</SelectItem>
										<SelectItem value="CANCELLED">CANCELLED</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>

							<DialogFooter>
								<Button type="submit">
									{isPending ? "Submitting..." : "create"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				<div className="">
					<div className="flex gap-2">
						<SignedOut>
							<SignInButton mode="modal">Register</SignInButton>
						</SignedOut>

						<SignedIn>
							<UserButton />
						</SignedIn>
					</div>
				</div>
			</div>

			<Chat />
		</div>
	);
}
