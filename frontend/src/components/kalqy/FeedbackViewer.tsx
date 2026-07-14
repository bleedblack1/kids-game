import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw, MessageSquareHeart, Download } from "lucide-react";
import { fetchFeedback, type FeedbackEntry } from "@/lib/api";
import { authStore } from "@/lib/auth-store";
import { LoginForm } from "@/components/kalqy/LoginForm";

interface Props {
  onBack: () => void;
}

// Feedback viewer, reached from the main dashboard. Access requires a real
// admin login; once authenticated it shows the submissions in a table that can
// be exported to Excel (CSV). The data itself is admin-only server-side.
export function FeedbackViewer({ onBack }: Props) {
  const [authed, setAuthed] = useState(
    () => authStore.isAuthenticated && authStore.principal?.role === "ADMIN",
  );

  if (!authed) {
    return (
      <LoginForm
        title="Feedback Access"
        subtitle="Sign in as an admin to view parent feedback."
        requiredRole="ADMIN"
        onBack={onBack}
        onSuccess={() => setAuthed(true)}
      />
    );
  }
  return <FeedbackTable onBack={onBack} />;
}

function FeedbackTable({ onBack }: { onBack: () => void }) {
  const [entries, setEntries] = useState<FeedbackEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchFeedback().then((data) => {
      setEntries(data ?? []);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const rows = useMemo(
    () => (entries ? [...entries].sort((a, b) => b.ts - a.ts) : []),
    [entries],
  );

  const download = () => downloadExcel(rows);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-2xl bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm transition-all hover:scale-105"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={download}
            disabled={rows.length === 0}
            className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" /> Download Excel
          </button>
        </div>
      </div>

      <h1 className="mb-1 flex items-center gap-2 text-3xl font-black md:text-4xl">
        <MessageSquareHeart className="h-8 w-8 text-primary" /> Parent Feedback
      </h1>
      <p className="mb-6 text-sm font-semibold text-muted-foreground">
        {rows.length} response{rows.length === 1 ? "" : "s"} collected.
      </p>

      {loading && entries === null ? (
        <div className="rounded-3xl border-2 border-border bg-card p-10 text-center text-sm font-semibold text-muted-foreground">
          Loading feedback…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center">
          <div className="mb-2 text-4xl">📭</div>
          <div className="text-base font-black text-foreground">No feedback yet</div>
          <div className="text-sm text-muted-foreground">
            Submissions from the Feedback button will appear here.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border-2 border-border bg-card shadow-lg">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-secondary/40 text-left">
                <Th>#</Th>
                <Th>Date</Th>
                <Th>Parent</Th>
                <Th>Contact</Th>
                <Th>Child Age</Th>
                <Th>Rating</Th>
                <Th>Enjoyed</Th>
                <Th>Recommend</Th>
                <Th>Refer</Th>
                <Th>Enjoyed Most</Th>
                <Th>Improve</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e, i) => (
                <tr
                  key={`${e.ts}-${i}`}
                  className="border-t border-border align-top hover:bg-muted/30"
                >
                  <Td>{i + 1}</Td>
                  <Td className="whitespace-nowrap">{formatDate(e.ts)}</Td>
                  <Td>{e.parentName || "—"}</Td>
                  <Td>{e.contact ? <ContactLink contact={e.contact} /> : "—"}</Td>
                  <Td className="whitespace-nowrap">{e.childAge || "—"}</Td>
                  <Td>{e.rating != null ? `${e.rating}/5 ⭐` : "—"}</Td>
                  <Td>{e.enjoyed || "—"}</Td>
                  <Td>{e.recommend != null ? `${e.recommend}/10` : "—"}</Td>
                  <Td>{e.refer || "—"}</Td>
                  <Td>{e.aspects?.length ? e.aspects.join(", ") : "—"}</Td>
                  <Td className="max-w-[260px]">{e.improve || "—"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-muted-foreground">
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 font-semibold text-foreground ${className}`}>{children}</td>;
}

// Render a contact as a clickable mailto: (email) or tel: (phone) link.
function ContactLink({ contact }: { contact: string }) {
  const isEmail = contact.includes("@");
  const href = isEmail ? `mailto:${contact}` : `tel:${contact.replace(/[^\d+]/g, "")}`;
  return (
    <a href={href} className="whitespace-nowrap text-primary hover:underline">
      {contact}
    </a>
  );
}

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

// Export the feedback as a genuine .xlsx (OOXML) workbook — no external
// library. We hand-build the minimal set of XML parts an Excel file needs and
// pack them into a ZIP (stored, uncompressed), so it opens natively in Excel
// with zero import prompts.
function downloadExcel(rows: FeedbackEntry[]) {
  const headers = [
    "#",
    "Date",
    "Parent",
    "Contact",
    "Child Age",
    "Rating (1-5)",
    "Enjoyed",
    "Recommend (0-10)",
    "Refer to Others",
    "Enjoyed Most",
    "Improve",
  ];

  const matrix: (string | number)[][] = [
    headers,
    ...rows.map((e, i) => [
      i + 1,
      formatDate(e.ts),
      e.parentName ?? "",
      e.contact ?? "",
      e.childAge ?? "",
      e.rating ?? "",
      e.enjoyed ?? "",
      e.recommend ?? "",
      e.refer ?? "",
      (e.aspects ?? []).join("; "),
      e.improve ?? "",
    ]),
  ];

  const blob = buildXlsx(matrix, "Feedback");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kalqy-feedback-${stamp()}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colLetter(index: number): string {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Build a worksheet-only .xlsx workbook from a 2D array of cell values.
function buildXlsx(matrix: (string | number)[][], sheetName: string): Blob {
  const sheetRows = matrix
    .map((row, r) => {
      const cells = row
        .map((value, c) => {
          const ref = `${colLetter(c)}${r + 1}`;
          if (typeof value === "number" && Number.isFinite(value)) {
            return `<c r="${ref}"><v>${value}</v></c>`;
          }
          const text = String(value ?? "");
          if (text === "") return `<c r="${ref}"/>`;
          return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(
            text,
          )}</t></is></c>`;
        })
        .join("");
      return `<row r="${r + 1}">${cells}</row>`;
    })
    .join("");

  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`;

  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(
    sheetName,
  )}" sheetId="1" r:id="rId1"/></sheets></workbook>`;

  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`;

  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;

  const files: { name: string; data: Uint8Array }[] = [
    { name: "[Content_Types].xml", data: enc(contentTypes) },
    { name: "_rels/.rels", data: enc(rootRels) },
    { name: "xl/workbook.xml", data: enc(workbookXml) },
    { name: "xl/_rels/workbook.xml.rels", data: enc(workbookRels) },
    { name: "xl/worksheets/sheet1.xml", data: enc(sheetXml) },
  ];

  const bytes = zipStore(files);
  return new Blob([bytes.buffer.slice(0) as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function enc(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

// --- Minimal ZIP writer (store / no compression) ---

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = -1;
  for (let i = 0; i < bytes.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function zipStore(files: { name: string; data: Uint8Array }[]): Uint8Array {
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const f of files) {
    const nameBytes = enc(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;

    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0, true);
    local.setUint16(8, 0, true); // store
    local.setUint16(10, 0, true);
    local.setUint16(12, 0, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, size, true);
    local.setUint32(22, size, true);
    local.setUint16(26, nameBytes.length, true);
    local.setUint16(28, 0, true);
    const localBytes = new Uint8Array(local.buffer);
    parts.push(localBytes, nameBytes, f.data);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint16(8, 0, true);
    cd.setUint16(10, 0, true);
    cd.setUint16(12, 0, true);
    cd.setUint16(14, 0, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, size, true);
    cd.setUint32(24, size, true);
    cd.setUint16(28, nameBytes.length, true);
    cd.setUint16(30, 0, true);
    cd.setUint16(32, 0, true);
    cd.setUint16(34, 0, true);
    cd.setUint16(36, 0, true);
    cd.setUint32(38, 0, true);
    cd.setUint32(42, offset, true);
    central.push(new Uint8Array(cd.buffer), nameBytes);

    offset += localBytes.length + nameBytes.length + f.data.length;
  }

  const centralStart = offset;
  const centralSize = central.reduce((s, c) => s + c.length, 0);

  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(4, 0, true);
  eocd.setUint16(6, 0, true);
  eocd.setUint16(8, files.length, true);
  eocd.setUint16(10, files.length, true);
  eocd.setUint32(12, centralSize, true);
  eocd.setUint32(16, centralStart, true);
  eocd.setUint16(20, 0, true);

  const all = [...parts, ...central, new Uint8Array(eocd.buffer)];
  const total = all.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  for (const a of all) {
    out.set(a, p);
    p += a.length;
  }
  return out;
}

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(
    d.getMinutes(),
  )}`;
}
