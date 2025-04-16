import { useState } from "react";
import { prompted } from "./actions";
import {} from './stream'
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { ActionState } from '@/lib/defination'
import {} from './'

export const Chat = () => {
	const { getToken } = useAuth();
	const [response, setResponse] = useState('');
	const [isPending, setIsPending] = useState(false);

	const handlelSubmit = async (e: React.FormData) => {
		e.preventDefault()
		setIsPending(true)
		
		const token = await getToken();
		try {
				
		}
	};


	return (
		<form submit={handleSubmit} className="flex gap-2 mt-4">
			<Input type="text" name="prompt" placeholder="Ask me..." />

			<Button type="submit">
				{isPending ? "Submitting..." : <ArrowUpRight />}
			</Button>

			<h1 className="text-xl">
				{response}
			</h1>
		</form>
	);
};
