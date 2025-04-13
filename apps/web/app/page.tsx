'use client'

import { useState, useActionState } from 'react'
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Calendar } from '@/components/ui/calendar'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { createTask } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@clerk/nextjs'

export default function Home() {
	const { getToken } = useAuth()
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
	const actionWrapper = async (state: any, formData: FormData) => {
		const token = await getToken();
		return createTask(state, formData, token!)
	}

	const [state, action, isPending] = useActionState(actionWrapper, undefined)
	console.log("form state: ", state)

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
							<DialogTitle>Create Notes</DialogTitle>
						</DialogHeader>

						<form action={action} className="grid gap-2">
							{/* here we will have traditional form */}
							<Input type="text" name="title" placeholder="title" />
							<Input type="text" name="description" placeholder="description" />
							<input type="hidden" name="due_date" value={selectedDate ? selectedDate.toISOString() : ""} />
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
							<SignInButton mode="modal">
								Register
							</SignInButton>
						</SignedOut>

						<SignedIn>
							<UserButton />
						</SignedIn>
					</div>
				</div>
			</div>
		</div>
	);
}
