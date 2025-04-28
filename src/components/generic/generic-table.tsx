"use client"

import type React from "react"

import { CiSearch } from "react-icons/ci"
import { Input, InputIcon, InputRoot } from "../ui/input"
import { useState, startTransition } from "react"
import { cn } from "@/lib/utils"
import { useQueryString } from "@/hooks/use-query-string"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { ArrowDownUp } from "lucide-react"
import { cx } from "@/util/cx"
import Link from "next/link"
import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin7Line } from "react-icons/ri"
import { removeProperties } from "@/util/remove-property"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEFAULT_ORDER, TABLE_QUERY, type OrderQuery } from "./generic-table.enums"

export function GenericTableRoot({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md", className)} {...props}>
      {children}
    </div>
  )
}

export function GenericTableHeader({
  children,
  className,
  title,
  ...props
}: React.ComponentProps<"div"> & {
  title: string
}) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <div className="relative flex items-center gap-4">{children}</div>
    </div>
  )
}

interface GenericTableContentProps<TItem extends { id: string }> {
  data: TItem[]
  columns: Record<keyof TItem, string>
  defaultHiddenColumns: (keyof TItem)[]
}

export function GenericTableContent<TItem extends { id: string }>({
  data,
  columns,
  defaultHiddenColumns,
}: Readonly<GenericTableContentProps<TItem>>) {
  const { getQueryString, updateQuery } = useQueryString()

  const currentSortQuery = getQueryString(TABLE_QUERY.SORT)
  const currentOrderQuery = (getQueryString(TABLE_QUERY.ORDER) as OrderQuery) ?? DEFAULT_ORDER

  const hiddenQuery = (getQueryString(TABLE_QUERY.HIDDEN)?.split(",") ?? []) as (keyof TItem)[]

  const hiddenColumns = [...hiddenQuery, ...defaultHiddenColumns]

  const cleanColumns = removeProperties(columns, hiddenColumns)

  const cleanColumnsKeys = Object.keys(cleanColumns) as (keyof TItem)[]

  function onToggleSort(columnKey: keyof TItem) {
    if (currentSortQuery === columnKey) {
      return updateQuery({
        [TABLE_QUERY.SORT]: columnKey.toString(),
        [TABLE_QUERY.ORDER]: currentOrderQuery === "asc" ? "desc" : "asc",
      })
    }

    return updateQuery({
      [TABLE_QUERY.SORT]: columnKey.toString(),
      [TABLE_QUERY.ORDER]: DEFAULT_ORDER,
    })
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
            <TableHead
              className="sticky right-0 w-[60px] bg-white p-2.5 text-sm font-semibold text-slate-800"
              style={{ boxShadow: "2px 0 0 #f1f5f9 inset" }}
            >
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-slate-700">
          {data.map((row, rowIndex) => (
            <TableRow key={row.id} className={cx(rowIndex % 2 === 0 ? "bg-slate-100" : "bg-white")}>
              {cleanColumnsKeys.map((key) => (
                <TableCell
                  key={key.toString()}
                  className="overflow-hidden truncate whitespace-nowrap border-r-2 px-2 py-2 text-sm"
                  title={String(row[key])}
                >
                  {String(row[key])}
                </TableCell>
              ))}
              <TableCell
                className="sticky right-0 w-[100px] truncate bg-white px-3 py-1 text-sm"
                style={{
                  boxShadow: `2px 0 0 ${rowIndex % 2 === 0 ? "white" : "#f1f5f9"} inset`,
                }}
              >
                <div className="flex items-center justify-start gap-2 px-1">
                  <Link href={`/admin/users/edit/${row.id}`}>
                    <button type={"button"} className="flex w-full items-center justify-center">
                      <FaRegEdit className="text-lg transition-transform hover:scale-110" />
                    </button>
                  </Link>
                  <DeleteAction id={row.id} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// TODO: this can be improved
function DeleteAction({ id }: Readonly<{ id: string }>) {
  return (
    <Link href={`/admin/users/delete/${id}`}>
      <button type={"button"} className="flex w-full items-center justify-center">
        <RiDeleteBin7Line className="text-lg transition-transform hover:scale-110" />
      </button>
    </Link>
  )
}

export function GenericTableSearch() {
  const { getQueryString, pushQueryString } = useQueryString()

  const search = getQueryString(TABLE_QUERY.SEARCH) ?? ""

  function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    startTransition(() => {
      pushQueryString(TABLE_QUERY.SEARCH, event.target.value)
    })
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
  )
}

export function GenericTableVisibility<TItem>({
  columns,
  defaultHiddenColumns,
}: Readonly<{
  columns: Record<keyof TItem, string>
  defaultHiddenColumns: (keyof TItem)[]
}>) {
  const { getQueryString, pushQueryString } = useQueryString()

  const hiddenQuery = (getQueryString(TABLE_QUERY.HIDDEN)?.split(",") ?? []) as (keyof TItem)[]

  const cleanColumns = removeProperties(columns, hiddenQuery)

  const [filterOpen, setFilterOpen] = useState(false)

  const toggleColumnVisibility = (key: keyof TItem) => {
    if (hiddenQuery.includes(key)) {
      return pushQueryString(TABLE_QUERY.HIDDEN, hiddenQuery.filter((k) => k !== key).join(","))
    }

    return pushQueryString(TABLE_QUERY.HIDDEN, [...hiddenQuery, key].join(","))
  }

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
                .filter(([key]) => !defaultHiddenColumns.includes(key as keyof TItem))
                .map(([key, value]) => (
                  <li key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      // @ts-expect-error complex logic
                      checked={Boolean(cleanColumns[key])}
                      onChange={() => toggleColumnVisibility(key as keyof TItem)}
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
  )
}

export function GenericTableFooter({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      {children}
    </div>
  )
}

export function GenericTablePageSize({ defaultPageSize = "10" }: Readonly<{ defaultPageSize?: string }>) {
  const { pushQueryString, getQueryString } = useQueryString()

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
  )
}

export function GenericTablePagination({ pageCount }: Readonly<{ pageCount: number }>) {
  const { pushQueryString, getQueryString } = useQueryString()

  const pageQuery = getQueryString(TABLE_QUERY.PAGE)
  const currentPage = pageQuery ? Number(pageQuery) : 1

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
  )
}
