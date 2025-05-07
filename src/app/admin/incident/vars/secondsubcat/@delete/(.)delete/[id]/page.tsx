import { Dialog, DialogContent } from "@/components/ui/app-dialog"
import prisma from "@/libs/db"
import { DeleteSecondSubCatContent } from "../../../delete/delete-cat-content"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        id: string
    }
    }   

    export default async function ModalDeleteSecondSubCat({ params }: PageProps) {
        // Check if the subcategory exists before rendering the DeleteSubCatContent
        const id = Number(params.id)
        const secondSubCategoryData = await prisma.secondSubcategory.findUnique({
            where: { id },
            include: {
                subcategory: {
                    select: { name: true, category: { select: { name: true } } },
                },
            },
        })

        if (!secondSubCategoryData) {
            return notFound()
        }

        return (
            <Dialog open={true}>
                <DialogContent>
                    <DeleteSecondSubCatContent 
                    id={id} 
                    SecondSubcatName={secondSubCategoryData.name} 
                    SubCategoryName={secondSubCategoryData.subcategory.name} 
                    />
                </DialogContent>
            </Dialog>
        )
    }