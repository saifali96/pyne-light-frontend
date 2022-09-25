import { GridColDef } from "@mui/x-data-grid";
import { API_URL } from "./constants";
import { Feature, Row } from "./types";

type DataByCompanyUser = {
  companyName: string;
  users: {
    userName: string;
    features: Feature[];
  }[];
}[];

const fetchDataByCompanyUser = async (dateFrom: Date | null) => {
  const requestUrl = dateFrom
    ? `${API_URL}/v1/analytics/company/users/time?from_ts=${dateFrom.toISOString()}`
    : `${API_URL}/v1/analytics/company/users`;

  const response = await fetch(requestUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await response.json();

  if (!data || data.success !== true) {
    throw new Error("Failed to fetch data");
  }

  return data.message as DataByCompanyUser;
};

const getDataGridColumnsAndRows = (data: DataByCompanyUser) => {
  const columns: GridColDef[] = [
    {
      field: "companyName",
      headerName: "Company Name",
      width: 150,
    },
    {
      field: "userName",
      headerName: "User Name",
      width: 150,
    },
  ];

  const rows: Row[] = [];

  data.forEach((company, companyIndex) => {
    company.users.forEach((user, userIndex) => {
      const row: Row = {
        id: companyIndex * 100 + userIndex,
        companyName: company.companyName,
        userName: user.userName,
      };

      user.features.forEach((feature) => {
        if (!columns.find((column) => column.field === feature.featureName)) {
          columns.push({
            field: feature.featureName,
            headerName: feature.featureName,
            width: 150,
          });
        }

        row[feature.featureName] = feature.featureUsedCount;
      });

      rows.push(row);
    });
  });

  return { columns, rows };
};

export const getDataByCompanyUser = async (dateFrom: Date | null) => {
  try {
    const data = await fetchDataByCompanyUser(dateFrom);

    return getDataGridColumnsAndRows(data);
  } catch (error) {
    console.error(error);
    return { columns: [], rows: [] };
  }
};
