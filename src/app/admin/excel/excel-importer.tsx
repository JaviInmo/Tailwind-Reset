"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileInfo {
  file: File
  id: string
  size: string
  error?: string
}

export function ExcelImporter() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ]

    const validExtensions = [".xlsx", ".xls", ".csv"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
      return "Solo se permiten archivos Excel (.xlsx, .xls) o CSV"
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      return "El archivo no puede ser mayor a 10MB"
    }

    return null
  }

  const handleFiles = (fileList: FileList) => {
    const newFiles: FileInfo[] = []

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file)
      const fileInfo: FileInfo = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        size: formatFileSize(file.size),
        error: error || undefined,
      }
      newFiles.push(fileInfo)
    })

    setFiles((prev) => [...prev, ...newFiles])

    const validFiles = newFiles.filter((f) => !f.error)
    const invalidFiles = newFiles.filter((f) => f.error)

    if (validFiles.length > 0) {
      toast({
        title: "Archivos agregados",
        description: `${validFiles.length} archivo(s) listo(s) para procesar`,
      })
    }

    if (invalidFiles.length > 0) {
      toast({
        title: "Archivos inválidos",
        description: `${invalidFiles.length} archivo(s) no pudieron ser agregados`,
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearAllFiles = () => {
    setFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const processFiles = async () => {
    const validFiles = files.filter((f) => !f.error)

    if (validFiles.length === 0) {
      toast({
        title: "No hay archivos válidos",
        description: "Agrega al menos un archivo Excel válido para procesar",
        variant: "destructive",
      })
      return
    }

    // Aquí puedes agregar la lógica para procesar los archivos
    // Por ejemplo, leer el contenido con una librería como xlsx
    toast({
      title: "Procesando archivos",
      description: `Iniciando procesamiento de ${validFiles.length} archivo(s)...`,
    })

    // Simulación de procesamiento
    setTimeout(() => {
      toast({
        title: "Archivos procesados",
        description: "Todos los archivos han sido procesados exitosamente",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importar Archivos Excel
          </CardTitle>
          <CardDescription>
            Arrastra y suelta archivos Excel (.xlsx, .xls) o CSV, o haz clic para seleccionarlos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
            <p className="text-sm text-muted-foreground mb-4">
              Formatos soportados: .xlsx, .xls, .csv (máximo 10MB por archivo)
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>Seleccionar Archivos</Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Archivos Seleccionados ({files.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={clearAllFiles}>
                Limpiar Todo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((fileInfo) => (
                <div
                  key={fileInfo.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    fileInfo.error ? "border-destructive/50 bg-destructive/5" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileSpreadsheet
                      className={`h-5 w-5 flex-shrink-0 ${fileInfo.error ? "text-destructive" : "text-primary"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{fileInfo.file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {fileInfo.size}
                        </Badge>
                        {fileInfo.error && (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span className="text-xs">{fileInfo.error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(fileInfo.id)} className="flex-shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={processFiles} disabled={files.filter((f) => !f.error).length === 0} className="flex-1">
                Procesar Archivos ({files.filter((f) => !f.error).length})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
