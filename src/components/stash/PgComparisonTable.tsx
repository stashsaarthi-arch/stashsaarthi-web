import React from "react";
import { ComparisonMatrixTable } from "@/components/ui/ComparisonMatrixTable";
import type { BookingPrefill } from "./types";

export interface PgComparisonTableProps {
  onBook?: (prefill?: BookingPrefill) => void;
}

export const PgComparisonTable: React.FC<PgComparisonTableProps> = ({ onBook }) => {
  return <ComparisonMatrixTable onBook={onBook} />;
};

export default PgComparisonTable;
