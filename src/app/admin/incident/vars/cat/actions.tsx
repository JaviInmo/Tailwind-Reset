"use client"

import { useGenericTableRow } from "@/components/generic/generic-table.context"
import Link from "next/link"
import { FaRegEdit } from "react-icons/fa"
import { RiDeleteBin7Line } from "react-icons/ri"

export function CatActions() {
  const { id } = useGenericTableRow()

  return (
    <div className="flex items-center justify-start gap-2 px-1">
      <Link href={`/admin/incident/vars/cat/update/${id}`}>
        <button type={"button"} className="flex w-full items-center justify-center">
          <FaRegEdit className="text-lg transition-transform hover:scale-110" />
        </button>
      </Link>
      <Link href={`/admin/incident/vars/cat/delete/${id}`}>
        <button type={"button"} className="flex w-full items-center justify-center">
          <RiDeleteBin7Line className="text-lg transition-transform hover:scale-110" />
        </button>
      </Link>
    </div>
  )
}
