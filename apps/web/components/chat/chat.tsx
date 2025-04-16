'use client'

import { useActionState, useState } from "react";
import { StreamAIResponse } from './stream-ai-response'
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { ActionState } from '@/lib/defination'

export const Chat = () => {
	const { getToken } = useAuth();
	const [prompt, setPrompt] = useState<string>('')
	const [response, setResponse] = useState<string>('');
	const [isPending, setIsPending] = useState<boolean>(false);

	const onChunk = ((chunk: string) => {
		setResponse((prev) => prev + chunk)
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const token = await getToken();
		console.log({
			prompt,
			token,
		})

		/* try {
			StreamAIResponse(prompt, token!, onChunk)
		} finally {
			setIsPending(false)
		} */
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 mt-4">
			<Input
				type="text"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				placeholder="Ask me..."
			/>

			<Button type="submit">
				{isPending ? "Submitting..." : <ArrowUpRight />}
			</Button>

			<h1 className="text-xl">
				{response}
			</h1>
		</form>
	);
};
