"use client";

import { ArrowDownUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Pagination from "react-bootstrap/Pagination";
import Table from "react-bootstrap/Table";

import DeleteModal from "@/app/admin/variables/createCateg/deletecat/page";

import { handleDeleteCategoryAction } from "./deletecat/delete.action";

import styles from "./cattable.module.css";

interface Data {
    id: number;
    name: string;
    variable: string; // Nueva columna para la variable
}

interface TableProps {
    data: Data[];
}

export default function TablePage({ data }: TableProps) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [sortColumn, setSortColumn] = useState<keyof Data | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; id: number | null }>({
        show: false,
        id: null,
    });

    const filteredData = data.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase()),
        ),
    );

    if (sortColumn !== null) {
        filteredData.sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (a[sortColumn] > b[sortColumn]) {
                return sortDirection === "asc" ? 1 : -1;
            }
            return 0;
        });
    }

    const lastItem = currentPage * itemsPerPage;
    const firstItem = lastItem - itemsPerPage;
    const currentItems = filteredData.slice(firstItem, lastItem);

    const pages = [];
    for (let number = 1; number <= Math.ceil(filteredData.length / itemsPerPage); number++) {
        pages.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
                className={`${styles.pageItemSecondary} ${number === currentPage ? styles.pageItemSecondaryActive : ""}`}
            >
                {number}
            </Pagination.Item>,
        );
    }

    const requestSort = (column: keyof Data) => {
        const direction = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
        setSortColumn(column);
        setSortDirection(direction);
    };

    const handleDelete = (id: number) => {
        setDeleteModal({ show: true, id });
    };

    const confirmDelete = async (id: number) => {
        const result = await handleDeleteCategoryAction(id);
        setDeleteModal({ show: false, id: null });
    };

    return (
        <div className="container">
            <Row style={{ marginBottom: "1rem" }}>
                <Col md={6} className="align-bottom">
                    <h4>Tabla de Categorías</h4>
                </Col>
                <Col md={4}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar..."
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </Col>
                <Col md={2}>
                    <Link href="/admin/variables/createCateg/createcat" passHref>
                        <Button type="submit" variant="primary">
                            Agregar Nueva
                        </Button>
                    </Link>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {["id", "name", "variable", "acciones"].map((column) => (
                            <th key={column}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    {column.charAt(0).toUpperCase() + column.slice(1)}
                                    {column !== "acciones" && (
                                        <ArrowDownUp
                                            size={12}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => requestSort(column as keyof Data)}
                                        />
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.variable}</td> {/* Nueva celda para la variable */}
                            <td>
                                {/*  <Link href={`/admin/edit/${row.id}`}>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        style={{ marginRight: "0.5rem" }}
                                    >
                                        Editar
                                    </Button>
                                </Link> */}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(row.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Pagination>{pages}</Pagination>
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
