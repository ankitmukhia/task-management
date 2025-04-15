import { useActionState } from "react";
import { prompted } from "./actions";
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { ActionState } from '@/lib/defination'

export const Chat = () => {
	const { getToken } = useAuth();
	const actionWrapper = async (state: ActionState, formData: FormData) => {
		const token = await getToken();
		return prompted(state, formData, token!);
	};

	const [state, action, isPending

	] = useActionState(actionWrapper, undefined);

	console.log("frontend state: ", state);

	return (
		<form action={action} className="flex gap-2 mt-4">
			<Input type="text" name="prompt" placeholder="Ask me..." />

			<Button type="submit">
				{isPending ? "Submitting..." : <ArrowUpRight />}
			</Button>
		</form>
	);
};
