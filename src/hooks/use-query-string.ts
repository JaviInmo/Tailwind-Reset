import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryString() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	function updateQuery(newParams: Record<string, string>) {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(newParams).forEach(([key, value]) => {
			if (value === "") {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});
		const newUrl = pathname + "?" + params.toString();
		router.push(newUrl);
	}

	function pushQueryString(name: string, value: string) {
		updateQuery({ [name]: value });
	}

	function getQueryString(name: string) {
		return searchParams.get(name);
	}

	return { updateQuery, pushQueryString, getQueryString };
}