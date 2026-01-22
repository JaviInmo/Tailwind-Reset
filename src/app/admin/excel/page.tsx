import { ExcelImporter } from "@/app/admin/excel/excel-importer"

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Importador de Archivos Excel</h1>
        <ExcelImporter />
      </div>
    </main>
  )
}
