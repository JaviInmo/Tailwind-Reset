"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Form, Modal } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { countCats } from "../readcat.action";
import { fetchCategoriesByVariable, fetchVariables, registerAction } from "./cat.action";

const formSchema = z.object({
    variable: z.string({ required_error: "Variable es requerida" }),
    categories: z
        .string({ required_error: "Categorías no pueden estar vacías" })
        .min(1, { message: "Categorías no pueden estar vacías" }),
});

type FormSchemaData = z.infer<typeof formSchema>;

export function CatForm() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [initialCount, setInitialCount] = useState<number | null>(null);
    const [variables, setVariables] = useState<{ id: number; name: string }[]>([]);
    const [selectedVariableId, setSelectedVariableId] = useState<number | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors },
    } = useForm<FormSchemaData>({
        resolver: zodResolver(formSchema),
        mode: "onTouched",
    });

    useEffect(() => {
        const fetchData = async () => {
            const vars = await fetchVariables();
            setVariables(vars);

            const count = await countCats();
            setInitialCount(count);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedVariableId) {
            const fetchCategories = async () => {
                const cats = await fetchCategoriesByVariable(selectedVariableId);
                setCategories(cats);
            };

            fetchCategories();
        } else {
            setCategories([]);
        }
    }, [selectedVariableId]);

    const handleVariableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedVariable = variables.find((v) => v.name === event.target.value);
        if (selectedVariable) {
            setSelectedVariableId(selectedVariable.id);
        }
    };

    const onSubmit: SubmitHandler<FormSchemaData> = async (data) => {
        if (!selectedVariableId) {
            setError("variable", { message: "Debe seleccionar una variable válida" });
            return;
        }

        const categoriesArray = data.categories.split(",").map((name) => name.trim());
        let allSuccess = true;

        for (const category of categoriesArray) {
            const response = await registerAction({
                variableId: selectedVariableId,
                name: category,
            });
            if (!response.success) {
                setError("root", { message: `Categoría "${category}" ya registrada` });
                allSuccess = false;
            }
        }

        if (allSuccess) {
            const newCount = await countCats();

            if (initialCount !== null && newCount > initialCount) {
                setShowSuccessModal(true);
            } else {
                console.error("Error al actualizar la tabla después de la inserción");
            }
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        reset();
    };

    const handleConfirmSuccessModal = () => {
        setShowSuccessModal(false);
        reset();
        router.push("/admin/variables/createCateg");
    };

    return (
        <div className="w-100 d-flex flex-column align-items-center py-lg-4 gap-4 py-0">
            <div className={"text-center"}>
                <h1 className="d-none d-sm-block">Registro de Categorías</h1>
                <h2 className="d-block d-sm-none">Registro de Categorías</h2>
                <p className={"fs-5 d-none d-sm-block text-muted"}>
                    Seleccione una variable y rellene el campo del formulario para registrar las
                    categorías.
                </p>
                <p className={"fs-6 d-block d-sm-none text-muted"}>
                    Seleccione una variable y rellene el campo del formulario para registrar las
                    categorías.
                </p>
            </div>

            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="col-lg-7 col-sm-12 d-flex flex-column gap-3"
            >
                <Form.Group className={"w-100"}>
                    <Form.Label>Variable:</Form.Label>
                    <Form.Select {...register("variable")} onChange={handleVariableChange}>
                        <option value="">Seleccione una variable</option>
                        {variables.map((variable) => (
                            <option key={variable.id} value={variable.name}>
                                {variable.name}
                            </option>
                        ))}
                    </Form.Select>
                    {errors.variable && (
                        <Form.Text className={"text-danger"}>{errors.variable.message}</Form.Text>
                    )}
                </Form.Group>

                <Form.Group className={"w-100"}>
                    <Form.Label>Nombre de las Categorías (separadas por comas):</Form.Label>
                    <Form.Control
                        type="text"
                        {...register("categories")}
                        placeholder="Introduzca los nombres de las categorías separados por comas"
                    />
                    {errors.categories && (
                        <Form.Text className={"text-danger"}>{errors.categories.message}</Form.Text>
                    )}
                </Form.Group>

                <Button type="submit" variant={"primary"}>
                    Submit
                </Button>
            </Form>

            {/* Mostrar categorías en un card */}
            {categories.length > 0 && (
                <Card className="w-100 mt-4">
                    <Card.Header>Categorías de la Variable Seleccionada</Card.Header>
                    <Card.Body>
                        <div className="d-flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <Card key={cat.id} className="p-2">
                                    {cat.name}
                                </Card>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            )}

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Categorías Creadas</Modal.Title>
                </Modal.Header>
                <Modal.Body>Categorías creadas con éxito.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleConfirmSuccessModal}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
