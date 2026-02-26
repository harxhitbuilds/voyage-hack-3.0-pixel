"use client";

import { Plane } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Trip } from "@/store/trip.store";

import TripTableRow from "./trip-table-row";

interface TripTableProps {
  trips: Trip[];
}

const columns = [
  "Destination",
  "Status",
  "Duration",
  "Travelers",
  "Budget",
  "Created",
  "Actions",
];

const TripTable = ({ trips }: TripTableProps) => {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      {/* Table header section */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800">
          <Plane className="h-4 w-4 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Trips</h3>
          <p className="text-xs text-zinc-500">
            Your AI travel planning conversations
          </p>
        </div>
        <span className="ml-auto rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
          {trips.length} {trips.length === 1 ? "trip" : "trips"}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="text-xs font-medium tracking-wider text-zinc-500 uppercase"
                >
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {trips.map((trip) => (
              <TripTableRow key={trip._id} trip={trip} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TripTable;
