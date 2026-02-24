import type { ReactNode } from "react";
import type { StructuredListItem } from "./types";

const cx = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

export type CalloutVariant = "info" | "success" | "error";

export function Callout({
  title,
  children,
  variant = "info",
}: {
  title: ReactNode;
  children: ReactNode;
  variant?: CalloutVariant;
}) {
  return (
    <div className={cx("cds--callout", `cds--callout--${variant}`)}>
      <div className="cds--callout__title">{title}</div>
      <div className="cds--callout__body">{children}</div>
    </div>
  );
}

export function TileGrid({ children }: { children: ReactNode }) {
  return <div className="tile-grid">{children}</div>;
}

export function MetricTile({
  label,
  value,
  detail,
  size = "default",
}: {
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
  size?: "default" | "small";
}) {
  return (
    <div className="cds--tile">
      <div className="cds--tile__label">{label}</div>
      <div className={size === "small" ? "cds--tile__value--small" : "cds--tile__value"}>{value}</div>
      {detail ? <div className="cds--tile__detail">{detail}</div> : null}
    </div>
  );
}

export function StructuredList({ items }: { items: StructuredListItem[] }) {
  return (
    <div className="cds--structured-list">
      {items.map((item, index) => (
        <div className="cds--structured-list__item" key={`structured-item-${index}`}>
          <div className="cds--structured-list__icon">{item.icon}</div>
          <div>
            <div className="cds--structured-list__title">{item.title}</div>
            <div className="cds--structured-list__desc">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: ReactNode[];
  rows: ReactNode[][];
}) {
  return (
    <div className="cds--data-table-wrapper">
      <table className="cds--data-table">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={`table-header-${index}`}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`table-row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`table-row-${rowIndex}-cell-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RecommendationCard({
  title,
  children,
  label = "Recommended",
}: {
  title: ReactNode;
  children: ReactNode;
  label?: ReactNode;
}) {
  return (
    <div className="recommendation">
      <div className="recommendation__label">{label}</div>
      <div className="recommendation__title">{title}</div>
      <p>{children}</p>
    </div>
  );
}

export type TagTone = "blue" | "teal" | "green" | "purple" | "magenta" | "gray";

export function Tag({ tone = "gray", children }: { tone?: TagTone; children: ReactNode }) {
  return <span className={cx("cds--tag", `cds--tag--${tone}`)}>{children}</span>;
}
