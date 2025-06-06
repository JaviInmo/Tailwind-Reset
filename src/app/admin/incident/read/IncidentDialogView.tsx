import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { GrStatusInfo } from "react-icons/gr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface IncidentData {
  date: string
  title: string
  titulo: string
  description: string
  provinceId: number
  municipalityId: number
  variableId: number
  categoryId: number
  subcategoryId: number
  secondSubcategoryId: number
 
  numberOfPeople: number
  items?: {
    id: number
    productName: string
    quantity: number
    unitMeasureId: number | null
    unitMeasure?: {
      id: number
      name: string
    } | null
  }[]
}

interface Province {
  id: number
  name: string
  municipalities: Municipality[]
}

interface Municipality {
  id: number
  name: string
}

interface Variable {
  id: number
  name: string
  categories: Category[]
}

interface Category {
  id: number
  name: string
  subcategories: Subcategory[]
}

interface Subcategory {
  id: number
  name: string
  secondSubcategories: SecondSubcategory[]
}

interface SecondSubcategory {
  id: number
  name: string
}

export function IncidentViewDialog({
  incidentData,
  provinceData,
  variableData,
}: {
  incidentData: IncidentData
  provinceData: Province[]
  variableData: Variable[]
}) {
  // Obtener los datos de las relaciones para mostrar nombres en lugar de IDs
  const province = provinceData.find((p) => p.id === incidentData.provinceId)
  const municipality = province?.municipalities.find((m) => m.id === incidentData.municipalityId)
  const variable = variableData.find((v) => v.id === incidentData.variableId)
  const category = variable?.categories.find((cat) => cat.id === incidentData.categoryId)
  const subcategory = category?.subcategories.find((sub) => sub.id === incidentData.subcategoryId)
  const secondSubcategory = subcategory?.secondSubcategories.find((sec) => sec.id === incidentData.secondSubcategoryId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex w-full items-center justify-center">
          <GrStatusInfo className="text-lg transition-transform hover:scale-110" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ver Incidencia</DialogTitle>
          <DialogDescription>Detalle completo de la incidencia</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Fecha */}
          <div>
            <Label>Fecha:</Label>
            <Input
              type="date"
              value={incidentData?.date ? new Date(incidentData.date).toISOString().split("T")[0] : ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Título */}
          <div>
            <Label>Título:</Label>
            <Input
              value={incidentData?.title || incidentData?.titulo || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Descripción */}
          <div>
            <Label>Descripción:</Label>
            <Textarea
              value={incidentData?.description || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Provincia */}
          <div>
            <Label>Provincia:</Label>
            <Input
              value={province?.name || incidentData?.provinceId || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Municipio */}
          <div>
            <Label>Municipio:</Label>
            <Input
              value={municipality?.name || incidentData?.municipalityId || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Variable */}
          <div>
            <Label>Variable:</Label>
            <Input
              value={variable?.name || incidentData?.variableId || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Categoría */}
          <div>
            <Label>Categoría:</Label>
            <Input
              value={category?.name || incidentData?.categoryId || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Subcategoría */}
          <div>
            <Label>Subcategoría:</Label>
            <Input
              value={subcategory?.name || incidentData?.subcategoryId || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Segunda Subcategoría */}
          <div>
            <Label>Segunda Subcategoría:</Label>
            <Input
              value={secondSubcategory?.name || incidentData?.secondSubcategoryId || ""}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>
          {/* Toneladas */}
         
          {/* Número de Personas */}
          <div>
            <Label>Número de Personas:</Label>
            <Input
              type="number"
              value={incidentData?.numberOfPeople || 0}
              disabled
              className="w-full rounded border border-gray-300 bg-gray-100 p-2"
            />
          </div>

          {/* Items Section */}
          {incidentData.items && incidentData.items.length > 0 && (
            <div className="mt-6">
              <Label className="text-lg font-medium mb-2">Ítems del Incidente:</Label>
              <Table className="border rounded-md">
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Unidad de Medida</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidentData.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unitMeasure?.name || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
