"use client";

import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, RowClickedEvent } from "ag-grid-community";
import { OrderRecord } from "@/lib/store";

interface OrdersLedgerProps {
  orders: OrderRecord[];
  selectedOrderId?: string;
  onSelectOrder?: (order: OrderRecord) => void;
}

export function OrdersLedger({ orders, selectedOrderId, onSelectOrder }: OrdersLedgerProps) {
  // Format items array into readable summary for the grid cell
  const rowData = useMemo(() => {
    return orders.map((o) => ({
      ...o,
      itemsSummary: o.items.map((i) => `${i.qty}x ${i.name}`).join(", "),
    }));
  }, [orders]);

  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        field: "status",
        headerName: "Status",
        width: 170,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          const status = params.value as OrderRecord["status"];
          let label = status;
          if (status === "PENDING_APPROVAL") label = "Waiting Approval" as any;
          if (status === "PAID") label = "Paid" as any;
          if (status === "APPROVED") label = "Approved" as any;
          if (status === "FAILED") label = "Failed" as any;

          return (
            <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
              <span className={`status-chip ${status}`}>{label}</span>
            </div>
          );
        },
      },
      {
        field: "itemsSummary",
        headerName: "Restock Items",
        flex: 2,
        minWidth: 220,
        sortable: true,
        filter: true,
      },
      {
        field: "total",
        headerName: "Total (USD)",
        width: 140,
        sortable: true,
        filter: "agNumberColumnFilter",
        headerClass: "ag-right-aligned-header",
        cellStyle: { textAlign: "right" },
        valueFormatter: (params) => {
          return params.value != null ? `$${Number(params.value).toFixed(2)}` : "$0.00";
        },
      },
      {
        field: "createdAt",
        headerName: "Created",
        width: 175,
        sortable: true,
        filter: "agDateColumnFilter",
        valueFormatter: (params) => {
          return params.value ? new Date(params.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " " + new Date(params.value).toLocaleDateString() : "";
        },
      },
      {
        field: "id",
        headerName: "PayPal Order ID",
        width: 180,
        sortable: true,
        filter: true,
        cellRenderer: (params: any) => {
          return (
            <code style={{ fontSize: "12px", color: "var(--color-crate-blue)", fontWeight: 600 }}>
              {params.value}
            </code>
          );
        },
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
    }),
    []
  );

  const handleRowClick = (event: RowClickedEvent) => {
    if (event.data && onSelectOrder) {
      onSelectOrder(event.data);
    }
  };

  if (orders.length === 0) {
    return (
      <div
        className="grid-wrapper"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          textAlign: "center",
          color: "var(--color-ink-muted)",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>📦</div>
        <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--color-ink-blue)", marginBottom: "4px" }}>
          No orders yet
        </div>
        <div style={{ fontSize: "14px", maxWidth: "380px" }}>
          Describe what you need to restock and the agent will price it.
        </div>
      </div>
    );
  }

  return (
    <div className="grid-wrapper ag-theme-quartz" style={{ width: "100%", height: "360px" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="single"
        onRowClicked={handleRowClick}
        animateRows={true}
      />
    </div>
  );
}
