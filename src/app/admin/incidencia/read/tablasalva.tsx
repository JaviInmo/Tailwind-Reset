"use client";

import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import DeleteModal from "@/app/admin/incidencia/delete/page";
import { handleDeleteIncidentAction } from "@/app/admin/incidencia/delete/delete.action";
import { CiSearch } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin7Line } from "react-icons/ri";


interface Data {
    id: number;
    variable: string;
    categoria: string;
    subcategoria: string;
    segundasubcategoria: string;
    amount: number;
    descripcion: string;
    provincia: string;
    municipio: string;
    fecha: string;
}

interface TableProps {
    data: Data[];
}

const columns = [
    "Id",
    "Var",
    "Cat",
    "Subcat",
    "2° subcat",
    "Cant.",
    "Desc.",
    "Prov.",
    "Munic.",
    "Fecha",
    "Acciones",
];

export default function TablePage({ data }: TableProps) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [sortColumn, setSortColumn] = useState<keyof Data | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    const filteredData = useMemo(
        () =>
            data.filter((row) =>
                Object.values(row).some((value) =>
                    String(value).toLowerCase().includes(search.toLowerCase()),
                ),
            ),
        [data, search],
    );

    const sortedData = useMemo(() => {
        if (sortColumn === null) return filteredData;
        return filteredData.slice().sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (a[sortColumn] > b[sortColumn]) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortColumn, sortDirection]);

    const lastItem = currentPage * itemsPerPage;
    const firstItem = lastItem - itemsPerPage;
    const currentItems = sortedData.slice(firstItem, lastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const requestSort = (column: keyof Data) => {
        const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(direction);
    };

    const handleDelete = (id: number) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async (id: number) => {
        const result = await handleDeleteIncidentAction(id);
        if (result.success) {
            console.log(`Incidencia con ID: ${id} eliminada`);
        } else {
            console.error(`Error al eliminar la incidencia con ID: ${id}`, result.error);
        }
        setDeleteModal({ show: false, id: null });
    };

    return (
        
        <div className="relative w-full mt-4 flex flex-col  p-6 shadow-lg rounded-lg bg-white">
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg text-slate-800">Tabla de Incidencias</h3>
                        <div className="relative flex items-center">
                            <CiSearch className="absolute left-3 text-gray-500" size={20} />
                            <input
                            type="text"
                            placeholder="Buscar..."
                            className="input input-bordered input-primary mr-4 text-left pl-10 py-1 rounded border border-slate-400"
                            onChange={(event) => setSearch(event.target.value)}
                            />
                        <Link href="/admin/incidencia/create" passHref>
                        <button className="py-1 px-4 bg-slate-800 text-slate-100 border border-slate-700 rounded hover:bg-slate-950">
                            Agregar Incidencia
                        </button>
                        </Link>
                    </div>
                </div>
            

       
            <div className="block m-4 p-4 w-full overflow-x-auto">
                <table className=" w-full border border-gray-300 ">
                    <thead className="bg-slate-800 text-white">
                    <tr>
                        {columns.map((column) => (
                        <th
                            key={column}
                            className={`py-3 px-2 font-semibold text-sm ${
                            column === "2° subcat" ? "whitespace-nowrap" : ""
                            }`}
                        >
                            <div className="flex items-center justify-between">
                            {column}
                            {column !== "Acciones" && (
                                <ArrowDownUp
                                size={12}
                                className="ml-2 cursor-pointer hover:scale-125 transition-transform"
                                onClick={() => requestSort(column as keyof Data)}
                                />
                            )}
                            </div>
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="text-slate-700">
                    {currentItems.map((row, index) => (
                        <tr key={row.id} className={`${index % 2 === 0 ? "bg-slate-100" : "bg-white"}`}>
                        <td className="text-sm py-2 px-2">{row.id}</td>
                        <td className="text-sm py-2 px-2">{row.variable}</td>
                        <td className="text-sm py-2 px-2">{row.categoria}</td>
                        <td className="text-sm py-2 px-2">{row.subcategoria}</td>
                        <td className="text-sm py-2 px-2">{row.segundasubcategoria}</td>
                        <td className="text-sm py-2 px-2">{row.amount}</td>
                        <td className="text-sm py-2 px-2">{row.descripcion}</td>
                        <td className="text-sm py-2 px-2">{row.provincia}</td>
                        <td className="text-sm py-2 px-2">{row.municipio}</td>
                        <td className="text-sm py-2 px-2">{row.fecha}</td>
                        <td className="text-sm py-2 px-2 ">
                            <div className="flex gap-2 items-center justify-start">
                            <Link href={`/admin/incidencia/edit/${row.id}`}>
                                <button className="w-full flex items-center justify-center">
                                <FaRegEdit className="text-lg hover:scale-110 transition-transform" />
                                </button>
                            </Link>
                            <button className="w-full flex items-center justify-center" onClick={() => handleDelete(row.id)}>
                                <RiDeleteBin7Line className="text-lg hover:scale-110 transition-transform" />
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                
            </div>
            <div className="flex justify-end mt-4">
          <div className="btn-group gap-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i + 1} className={`btn ${currentPage === i + 1 ? "btn-active" : ""}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      
       
        {deleteModal.show && deleteModal.id !== null && (
          <DeleteModal
            id={deleteModal.id}
            onCancel={() => setDeleteModal({ show: false, id: null })}
            onConfirm={() => confirmDelete(deleteModal.id as number)}
          />
        )}
      </div>
        
      
        
       
      
        
     
    );
}
