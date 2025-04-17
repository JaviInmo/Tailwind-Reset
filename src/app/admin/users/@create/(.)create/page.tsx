import RegisterPage from "../../create/register-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/app-dialog";

export default async function ModalCreatePage() {
	return (
		<Dialog open={true}>
			<DialogTitle />
			<DialogContent>
				<RegisterPage />
			</DialogContent>
		</Dialog>
	);
}
