"use client";

import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CiSearch } from "react-icons/ci";
import { Input, InputIcon, InputRoot } from "../ui/input";
import { startTransition, useState } from "react";
import { useQueryString } from "@/hooks/use-query-string";
import { removeProperties } from "@/util/remove-property";
import { TABLE_QUERY } from "./generic-table.enums";
import type React from "react";

export function GenericTableVisibility<TItem>({
    columns,
    defaultHiddenColumns,
}: Readonly<{
    columns: Record<keyof TItem, string>;
    defaultHiddenColumns: (keyof TItem)[];
}>) {
    const { getQueryString, pushQueryString } = useQueryString();

    const hiddenQuery = (getQueryString(TABLE_QUERY.HIDDEN)?.split(",") ?? []) as (keyof TItem)[];

    const cleanColumns = removeProperties(columns, hiddenQuery);

    const [filterOpen, setFilterOpen] = useState(false);

    const toggleColumnVisibility = (key: keyof TItem) => {
        if (hiddenQuery.includes(key)) {
            return pushQueryString(
                TABLE_QUERY.HIDDEN,
                hiddenQuery.filter((k) => k !== key).join(","),
            );
        }

        return pushQueryString(TABLE_QUERY.HIDDEN, [...hiddenQuery, key].join(","));
    };

    return (
        <div className="relative">
            <Button
                className="relative rounded border border-slate-700 bg-slate-800 px-4 py-1 text-slate-100 hover:bg-slate-950"
                onClick={() => setFilterOpen(!filterOpen)}
            >
                Filtro
            </Button>
            {filterOpen && (
                <div className="absolute left-0 z-50 mt-2">
                    <div className="duration-600 absolute left-0 z-10 w-52 origin-top scale-y-100 transform rounded-lg bg-white p-4 pt-2 shadow-xl transition-transform">
                        <h4 className="mb-2 text-sm font-semibold">Seleccionar columnas</h4>
                        <ul className="space-y-1">
                            {Object.entries<string>(columns)
                                .filter(
                                    ([key]) => !defaultHiddenColumns.includes(key as keyof TItem),
                                )
                                .map(([key, value]) => (
                                    <li key={key} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            // @ts-expect-error complex logic
                                            checked={Boolean(cleanColumns[key])}
                                            onChange={() =>
                                                toggleColumnVisibility(key as keyof TItem)
                                            }
                                            className="cursor-pointer"
                                        />
                                        <span>{value}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export function GenericTablePageSize({
    defaultPageSize = "10",
}: Readonly<{ defaultPageSize?: string }>) {
    const { pushQueryString, getQueryString } = useQueryString();

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm font-medium text-slate-700">
                Filas:
            </label>
            <Select
                value={getQueryString("limit") ?? defaultPageSize}
                onValueChange={(value) => pushQueryString("limit", value)}
            >
                <SelectTrigger className="h-6 w-[70px] px-2 py-0 shadow-md">
                    <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}

export function GenericTablePagination({ pageCount }: Readonly<{ pageCount: number }>) {
    const { pushQueryString, getQueryString } = useQueryString();

    const pageQuery = getQueryString(TABLE_QUERY.PAGE);
    const currentPage = pageQuery ? Number(pageQuery) : 1;

    return (
        <div className="flex">
            {Array.from({ length: pageCount }, (_, index) => index).map((value) => (
                <button
                    key={`${value}`}
                    type={"button"}
                    className={`flex h-6 w-6 items-center justify-center border border-gray-400 px-2 py-0 shadow-md ${
                        currentPage === value + 1
                            ? "rounded-sm border-slate-950 bg-slate-800 text-white"
                            : "rounded bg-white text-gray-700"
                    }`}
                    onClick={() => pushQueryString(TABLE_QUERY.PAGE, `${value + 1}`)}
                >
                    {value + 1}
                </button>
            ))}
        </div>
    );
}

export function GenericTableSearch() {
    const { getQueryString, pushQueryString } = useQueryString();

    const search = getQueryString(TABLE_QUERY.SEARCH) ?? "";

    function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
        startTransition(() => {
            pushQueryString(TABLE_QUERY.SEARCH, event.target.value);
        });
    }

    return (
        <InputRoot>
            <InputIcon>
                <CiSearch size={20} />
            </InputIcon>
            <Input
                type="text"
                placeholder="Buscar..."
                className="input input-bordered input-primary rounded border border-slate-400 py-1 pl-10 text-left"
                onChange={onChangeInput}
                value={search}
            />
        </InputRoot>
    );
}
