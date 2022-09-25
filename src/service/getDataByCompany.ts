import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { API_URL } from "./constants";
import { Feature } from "./types";

export type DataByCompany = {
  companyName: string;
  features: Feature[];
}[];

export const fetchDataByCompany = async () => {
  const response = await fetch(`${API_URL}/v1/analytics/company`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  if (!data || data.success !== true) {
    throw new Error("Failed to fetch data");
  }

  return data.message as DataByCompany;
};

type Row = {
  id: number;
  companyName: string;
  [key: string]: number | string;
};

const getDataGridColumnsAndRows = (data: DataByCompany) => {
  const { features, rows } = data.reduce(
    (acc, curr) => {
      const features = [...acc.features];

      const rows = [
        ...acc.rows,
        {
          id: acc.rows.length,
          companyName: curr.companyName,
          ...curr.features.reduce((acc, curr) => {
            if (!features.includes(curr.featureName)) {
              features.push(curr.featureName);
            }
            return {
              ...acc,
              [curr.featureName]: curr.featureUsedCount,
            };
          }, {} as { [key: string]: number }),
        },
      ];

      return { features, rows };
    },
    { features: [] as string[], rows: [] as Row[] }
  );

  const columns: GridColDef[] = [
    { field: "companyName", headerName: "Company Name", width: 150 },
    ...features.map((feature) => ({
      field: feature,
      headerName: feature,
      width: 150,
    })),
  ];

  return { columns, rows };
};

export const getDataByCompany = async () => {
  try {
    const data = await fetchDataByCompany();
    return getDataGridColumnsAndRows(data);
  } catch (error) {
    console.error(error);
    return { columns: [], rows: [] };
  }
};
