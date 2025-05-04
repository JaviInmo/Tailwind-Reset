"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { useQueryString } from "@/hooks/use-query-string";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ArrowDownUp } from "lucide-react";
import { cx } from "@/util/cx";
import { removeProperties } from "@/util/remove-property";
import { DEFAULT_ORDER, TABLE_QUERY, type OrderQuery } from "./generic-table.enums";
import { GenericTableRowProvider } from "./generic-table.context";

interface GenericTableExtraColumn {
    head: string;
    cell: React.ReactNode;
}

interface GenericTableContentProps<TItem extends { id: string }> {
    data: TItem[];
    columns: Record<keyof TItem, string>;
    defaultHiddenColumns: (keyof TItem)[];
    extraColumns: GenericTableExtraColumn[];
}

export function GenericTableContent<TItem extends { id: string }>({
    data,
    columns,
    defaultHiddenColumns,
    extraColumns,
}: Readonly<GenericTableContentProps<TItem>>) {
    const { getQueryString, updateQuery } = useQueryString();

    const currentSortQuery = getQueryString(TABLE_QUERY.SORT);
    const currentOrderQuery = (getQueryString(TABLE_QUERY.ORDER) as OrderQuery) ?? DEFAULT_ORDER;

    const hiddenQuery = (getQueryString(TABLE_QUERY.HIDDEN)?.split(",") ?? []) as (keyof TItem)[];

    const hiddenColumns = [...hiddenQuery, ...defaultHiddenColumns];

    const cleanColumns = removeProperties(columns, hiddenColumns);

    const cleanColumnsKeys = Object.keys(cleanColumns) as (keyof TItem)[];

    function onToggleSort(columnKey: keyof TItem) {
        if (currentSortQuery === columnKey) {
            return updateQuery({
                [TABLE_QUERY.SORT]: columnKey.toString(),
                [TABLE_QUERY.ORDER]: currentOrderQuery === "asc" ? "desc" : "asc",
            });
        }

        return updateQuery({
            [TABLE_QUERY.SORT]: columnKey.toString(),
            [TABLE_QUERY.ORDER]: DEFAULT_ORDER,
        });
    }

    return (
        <div className="relative max-h-[calc(100vh-200px)] w-full overflow-x-auto overflow-y-auto rounded-lg border border-slate-300">
            <Table className="w-full">
                <TableHeader className="sticky top-0 z-10 bg-white shadow-md">
                    <TableRow>
                        {Object.entries<string>(cleanColumns).map(([key, value], index) => (
                            <TableHead
                                key={value}
                                className={cx(
                                    "border-r-2 p-2.5 text-sm font-semibold text-slate-800",
                                    index === data.length - 1 && "border-r-0",
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    {value}
                                    <ArrowDownUp
                                        size={12}
                                        className="ml-2 cursor-pointer text-slate-800 transition-transform hover:scale-125"
                                        onClick={() => onToggleSort(key as keyof TItem)}
                                    />
                                </div>
                            </TableHead>
                        ))}
                        {extraColumns.map((value) => (
                            <TableHead
                                className="sticky right-0 w-[60px] bg-white p-2.5 text-sm font-semibold text-slate-800"
                                style={{ boxShadow: "2px 0 0 #f1f5f9 inset" }}
                                key={value.head}
                            >
                                {value.head}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody className="text-slate-700">
                    {data.map((row, rowIndex) => (
                        <TableRow
                            key={row.id}
                            className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}
                        >
                            <GenericTableRowProvider id={row.id}>
                                {cleanColumnsKeys.map((key) => (
                                    <TableCell
                                        key={key.toString()}
                                        className="overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                                        title={String(row[key])}
                                    >
                                        {String(row[key])}
                                    </TableCell>
                                ))}
                                {extraColumns.map((value) => (
                                    <TableCell
                                        className="sticky right-0 w-[100px] truncate bg-white px-3 py-1 text-sm shadow-[inset_2px_0_0_#f1f5f9]"
                                        key={value.head}
                                    >
                                        {value.cell}
                                    </TableCell>
                                ))}
                            </GenericTableRowProvider>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function GenericTableRoot({ children, className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function GenericTableHeader({
    children,
    className,
    title,
    ...props
}: React.ComponentProps<"div"> & {
    title: string;
}) {
    return (
        <div className={cn("flex items-center justify-between", className)} {...props}>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <div className="relative flex items-center gap-4">{children}</div>
        </div>
    );
}

export function GenericTableFooter({ children, className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex items-center justify-between", className)} {...props}>
            {children}
        </div>
    );
}
