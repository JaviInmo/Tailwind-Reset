import RegisterPage from "../../create/register-form";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/app-dialog";

export default async function ModalCreatePage(){
    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogDescription>
                    <RegisterPage/>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
