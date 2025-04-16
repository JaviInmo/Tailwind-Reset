import { EditUserPage } from "@/app/admin/users/edit/[id]/page";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/app-dialog";
import { getAuth } from "@/libs/auth";

export default async function FormPage({ params }: { params: { id: string } }) {

    return <Dialog open={true}>
                <DialogContent  >
                    
                   
                        <EditUserPage params={params} />
               
                  
                </DialogContent>
            </Dialog>
}