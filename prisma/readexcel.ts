import XlsxPopulate from "xlsx-populate";

type PrinvicieExcel = {
  provincia: string;
  municipios: string[];
};

export async function readExcelColumn(): Promise<PrinvicieExcel[]> {
  try {
    const workbook = await XlsxPopulate.fromFileAsync(
      "./prisma/provincias.xlsx"
    );
    const sheet = workbook.sheet("Hoja1");
    const columnValues =
      sheet
        ?.usedRange()
        ?.value()
        ?.map((row) => row[0]) ?? [];

    const splitByEmpty = columnValues.reduce<string[][]>((prev, acc) => {
      // If the value is empty, we create a new array
      if (!acc) return [...prev, []];

      // We get the last element of the array and add the new value
      return [...prev.toSpliced(-1), [...(prev.at(-1) ?? []), acc]];
    }, []);

    return splitByEmpty.reduce<PrinvicieExcel[]>((prev, value) => {
      // Do not add empty values
      if (value.length === 0) return prev;

      // Get the first element as the province and the rest as municipalities
      const provincia = value[0].replaceAll("_", " ");

      // Remove the first element and filter equal values to provinces
      const municipios = value
        .slice(1)
        .filter((municipio) => municipio !== provincia);
        
        console.log("Datos enviados:" );
      return [...prev, { provincia, municipios }];
    }, []);
    
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
}
