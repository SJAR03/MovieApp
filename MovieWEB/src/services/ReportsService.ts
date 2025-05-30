import api from "../utils/api";

export interface AdminReportData {
  reservedSeats: number;
  totalIncome: number;
  potentialLostIncome: number;
}

export const fetchAdminReport = async (
  token: string
): Promise<AdminReportData> => {
  const response = await api.get<AdminReportData>("/reports/sales", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
