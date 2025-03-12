import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function BreadcrumbWithCustomSeparator() {
  const pathname = usePathname(); // Obtiene la ruta actual
  const pathSegments = pathname.split("/").filter((segment) => segment); // Divide la URL en partes

  // Si la URL comienza con "/admin", quitamos "admin"
  const filteredSegments = pathSegments[0] === "admin" ? pathSegments.slice(1) : pathSegments;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-slate-300 flex items-center ">
        {filteredSegments.map((segment, index) => {
          const label = decodeURIComponent(segment)
            .replace(/-/g, " ") // Reemplaza guiones por espacios si existen
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Convierte la primera letra a mayúscula

          const isLast = index === filteredSegments.length - 1; // Último elemento

          return (
            <div key={segment} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator className="mx-1 text-lg" />} {/* Ajusta separación y tamaño */}
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">{label}</BreadcrumbPage> {/* Texto con inicial en mayúscula */}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
