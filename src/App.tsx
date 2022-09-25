import { useEffect, useState } from "react";
import { Selector } from "./components/Selector";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { getDataByCompany } from "./service/getDataByCompany";
import { getDataByCompanyUser } from "./service/getDataByCompanyUser";
import { Row } from "./service/types";

const showByOptions = [
  { value: "company", label: "Company" },
  { value: "user", label: "User" },
] as const;
type ShowByValue = typeof showByOptions[number]["value"];
const defaultShowByValue = "company";

const timeframeOptions = [
  { value: "lifetime", label: "Lifetime" },
  { value: "1_hour", label: "1 Hour" },
  { value: "1_day", label: "1 Day" },
] as const;
type TimeframeValue = typeof timeframeOptions[number]["value"];
const defaultTimeframeValue = "lifetime";
const getDateFromTimeframe = (timeframe: TimeframeValue) => {
  switch (timeframe) {
    case "1_hour":
      let date = new Date(Date.now() - 60 * 60 * 1000);
      let utc_date = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                      date.getUTCDate(), date.getUTCHours(),
                      date.getUTCMinutes(), date.getUTCSeconds());
      return new Date(utc_date);
    case "1_day":
      let date_day = new Date(Date.now() - 24 * 60 * 60 * 1000);
      let utc_date_day = Date.UTC(date_day.getUTCFullYear(), date_day.getUTCMonth(),
                      date_day.getUTCDate(), date_day.getUTCHours(),
                      date_day.getUTCMinutes(), date_day.getUTCSeconds());
      return new Date(utc_date_day);
    case "lifetime":
    default:
      return null;
  }
};

function App() {
  const [showBy, setShowBy] = useState<ShowByValue>(defaultShowByValue);
  const [timeframe, setTimeframe] = useState<TimeframeValue>(
    defaultTimeframeValue
  );

  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const dataPromise = (() => {
      switch (showBy) {
        case "company":
          return getDataByCompany();
        case "user":
          const dateFrom = getDateFromTimeframe(timeframe);
          return getDataByCompanyUser(dateFrom);
      }
    })();
    dataPromise.then(({ columns, rows }) => {
      setColumns(columns);
      setRows(rows);
    });
  }, [showBy, timeframe]);

  return (
    <div>
      <Box>
        <Selector
          id="show-by"
          label="Show by"
          options={showByOptions}
          initialValue={defaultShowByValue}
          onChange={setShowBy}
        />
        <Selector
          id="timeframe"
          label="Timeframe"
          options={timeframeOptions}
          initialValue={defaultTimeframeValue}
          value={showBy === "company" ? "lifetime" : undefined}
          disabled={showBy === "company"}
          onChange={setTimeframe}
        />
      </Box>
      <Box height={650} margin="0 8px">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Box>
    </div>
  );
}

export default App;
