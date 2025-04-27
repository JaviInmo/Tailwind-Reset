import type * as React from "react";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

export function InputRoot({
	children,
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div className={cn("relative", className)} {...props}>
			{children}
		</div>
	);
}

export function InputIcon({ children }: React.PropsWithChildren) {
	return (
		<Slot
			role="presentation"
			className="absolute left-3 top-2 bottom-2 text-gray-500"
		>
			{children}
		</Slot>
	);
}

export function Input({
	className,
	type,
	ref,
	...props
}: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			className={cn(
				"flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
}
