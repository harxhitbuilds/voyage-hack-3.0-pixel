import type { Trip } from "@/store/trip.store";

export async function exportTripPDF(trip: Trip): Promise<void> {
  // Dynamic import so jsPDF is only loaded when needed
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const PAGE_W = 210;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = 20;

  const colors = {
    bg: [18, 18, 18] as [number, number, number],
    primary: [96, 165, 250] as [number, number, number],
    white: [255, 255, 255] as [number, number, number],
    muted: [161, 161, 170] as [number, number, number],
    emerald: [52, 211, 153] as [number, number, number],
    amber: [251, 191, 36] as [number, number, number],
    card: [39, 39, 42] as [number, number, number],
  };

  // ── Helper functions ──────────────────────────────────────────────
  const setFont = (size: number, style: "normal" | "bold" = "normal") => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
  };

  const setColor = (rgb: [number, number, number]) =>
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);

  const addLine = (
    text: string,
    x: number,
    yPos: number,
    options: { maxWidth?: number; align?: "left" | "center" | "right" } = {},
  ) => {
    doc.text(text, x, yPos, {
      maxWidth: options.maxWidth,
      align: options.align,
    });
  };

  const newPage = () => {
    doc.addPage();
    y = 20;
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > 280) newPage();
  };

  const sectionHeading = (title: string) => {
    ensureSpace(14);
    doc.setFillColor(...colors.primary);
    doc.rect(MARGIN, y, 3, 6, "F");
    setFont(11, "bold");
    setColor(colors.white);
    addLine(title, MARGIN + 6, y + 5);
    y += 12;
  };

  const kv = (label: string, value: string) => {
    ensureSpace(8);
    setFont(8, "bold");
    setColor(colors.muted);
    addLine(label.toUpperCase(), MARGIN, y);
    setFont(9, "normal");
    setColor(colors.white);
    addLine(value, MARGIN + 38, y);
    y += 7;
  };

  // ── Dark background fill ──────────────────────────────────────────
  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, PAGE_W, 297, "F");

  // ── Cover / Title section ─────────────────────────────────────────
  // Gradient bar at top
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, PAGE_W, 2, "F");

  setFont(22, "bold");
  setColor(colors.white);
  const dest = trip.tripDetails?.destination ?? "Trip Itinerary";
  addLine(dest, PAGE_W / 2, y + 6, { align: "center" });
  y += 12;

  setFont(10, "normal");
  setColor(colors.muted);
  addLine("AI-Generated Travel Plan", PAGE_W / 2, y, { align: "center" });
  y += 6;

  if (trip.createdAt) {
    const d = new Date(trip.createdAt);
    const formatted = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    addLine(`Generated on ${formatted}`, PAGE_W / 2, y, { align: "center" });
  }
  y += 14;

  // Divider
  doc.setDrawColor(...colors.card);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 10;

  // ── Trip Details ─────────────────────────────────────────────────
  if (trip.tripDetails) {
    sectionHeading("Trip Details");

    const td = trip.tripDetails;
    if (td.destination) kv("Destination", td.destination);
    if (td.startDate || td.endDate) {
      const range = [td.startDate, td.endDate]
        .filter(Boolean)
        .map((d) => {
          try {
            return new Date(d!).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          } catch {
            return d!;
          }
        })
        .join(" → ");
      kv("Travel Dates", range);
    }
    if (td.travelers) kv("Travelers", `${td.travelers} people`);
    if (td.budget) kv("Budget", td.budget);
    if (td.preferences?.length) kv("Preferences", td.preferences.join(", "));
    if (td.activities?.length) kv("Activities", td.activities.join(", "));
    y += 4;
  }

  // ── AI Summary ───────────────────────────────────────────────────
  if (trip.aiInsights?.tripSummary) {
    sectionHeading("AI Trip Summary");

    doc.setFillColor(...colors.card);
    const summaryLines = doc.splitTextToSize(
      trip.aiInsights.tripSummary,
      CONTENT_W - 8,
    );
    const boxH = summaryLines.length * 5 + 8;
    ensureSpace(boxH + 6);
    doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 2, 2, "F");
    setFont(9, "normal");
    setColor(colors.muted);
    doc.text(summaryLines, MARGIN + 4, y + 6);
    y += boxH + 8;
  }

  // ── Key Insights ─────────────────────────────────────────────────
  if (trip.aiInsights?.keyPoints?.length) {
    sectionHeading("Key Insights");
    for (const point of trip.aiInsights.keyPoints) {
      ensureSpace(8);
      setFont(8, "bold");
      setColor(colors.emerald);
      addLine("✓", MARGIN, y);
      setFont(9, "normal");
      setColor(colors.white);
      const lines = doc.splitTextToSize(point, CONTENT_W - 8);
      doc.text(lines, MARGIN + 5, y);
      y += lines.length * 5 + 3;
    }
    y += 4;
  }

  // ── Itinerary ────────────────────────────────────────────────────
  if (trip.itinerary?.length) {
    sectionHeading("Day-by-Day Itinerary");

    for (const day of trip.itinerary) {
      ensureSpace(20);

      // Day header card
      doc.setFillColor(...colors.card);
      const headerH = 10;
      doc.roundedRect(MARGIN, y, CONTENT_W, headerH, 2, 2, "F");

      setFont(10, "bold");
      setColor(colors.primary);
      addLine(`Day ${day.day}`, MARGIN + 4, y + 7);

      if (day.title && day.title !== `Day ${day.day}`) {
        setFont(9, "normal");
        setColor(colors.white);
        addLine(`— ${day.title}`, MARGIN + 22, y + 7);
      }

      if (day.estimatedCost) {
        setFont(8, "bold");
        setColor(colors.emerald);
        addLine(day.estimatedCost, PAGE_W - MARGIN - 4, y + 7, {
          align: "right",
        });
      }

      y += headerH + 3;

      // Activities
      for (const act of day.activities) {
        ensureSpace(8);
        setFont(8, "normal");
        setColor(colors.muted);
        addLine("•", MARGIN + 3, y);
        setColor(colors.white);
        const lines = doc.splitTextToSize(act, CONTENT_W - 10);
        doc.text(lines, MARGIN + 7, y);
        y += lines.length * 5 + 2;
      }

      // Pro tip
      if (day.tips) {
        ensureSpace(12);
        doc.setFillColor(45, 38, 18);
        const tipLines = doc.splitTextToSize(`💡 ${day.tips}`, CONTENT_W - 8);
        const tipH = tipLines.length * 5 + 6;
        doc.roundedRect(MARGIN + 2, y, CONTENT_W - 4, tipH, 1.5, 1.5, "F");
        setFont(8, "normal");
        setColor(colors.amber);
        doc.text(tipLines, MARGIN + 5, y + 5);
        y += tipH + 4;
      }

      y += 6;
    }
  }

  // ── Footer on every page ─────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFillColor(...colors.bg);
    doc.rect(0, 287, PAGE_W, 10, "F");
    doc.setFillColor(...colors.primary);
    doc.rect(0, 295, PAGE_W, 2, "F");
    setFont(7, "normal");
    setColor(colors.muted);
    addLine(
      `${dest} · AI Travel Plan · Page ${p} of ${totalPages}`,
      PAGE_W / 2,
      292,
      { align: "center" },
    );
  }

  doc.save(`${dest.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-itinerary.pdf`);
}
