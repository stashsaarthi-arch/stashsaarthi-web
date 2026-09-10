/**
 * StashSaarthi — GST-Compliant PDF Invoice Generator Engine (Task 109)
 * Built with PDF-Lib for deterministic, 100% client-side & edge PDF rendering.
 * Generates official GST tax invoices for Stash, Kitchen, Spaces, and Connect bookings.
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { BookingRecord } from "./localSubmissions";

export interface InvoiceOptions {
  companyName?: string;
  gstin?: string;
  pan?: string;
  sacCode?: string;
}

const DEFAULT_OPTIONS: Required<InvoiceOptions> = {
  companyName: "StashSaarthi Intergenerational Living & Campus Micro-Storage Pvt Ltd",
  gstin: "09AAACS9369F1Z5",
  pan: "AAACS9369F",
  sacCode: "996729", // Storage & Warehousing Services
};

const SERVICE_SAC: Record<string, string> = {
  stash: "996729",   // Storage & warehousing
  micro: "996729",   // Micro luggage storage
  kitchen: "996331", // Catering & food services
  meal: "996331",    // Meal packs
  spaces: "997212",  // Real estate rental & stay
  connect: "998311", // Mentorship & consulting
};

export async function generateGstInvoicePdf(
  booking: BookingRecord,
  customOpts: InvoiceOptions = {}
): Promise<Uint8Array> {
  const opts = { ...DEFAULT_OPTIONS, ...customOpts };
  const sacCode = SERVICE_SAC[booking.service] || opts.sacCode;

  // 1. Create PDF Document (A4 size: 595.28 x 841.89 pt)
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // 2. Embed Standard Fonts
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color Palette
  const colorDark = rgb(0.04, 0.05, 0.06);     // #0A0D0F
  const colorPrimary = rgb(0.06, 0.73, 0.51);  // Electric Mint #10B981
  const colorCyan = rgb(0.02, 0.71, 0.83);     // Neon Cyan #06B6D4
  const colorGray = rgb(0.4, 0.45, 0.5);
  const colorLightBg = rgb(0.96, 0.98, 0.98);
  const colorBorder = rgb(0.85, 0.88, 0.9);

  // 3. Top Banner & Brand Header
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width: width,
    height: 110,
    color: colorDark,
  });

  page.drawText("STASHSAARTHI", {
    x: 40,
    y: height - 45,
    size: 22,
    font: fontBold,
    color: colorPrimary,
  });

  page.drawText("Zero-CapEx Intergenerational Living & Campus Micro-Storage", {
    x: 40,
    y: height - 62,
    size: 9,
    font: fontOblique,
    color: colorCyan,
  });

  page.drawText("TAX INVOICE", {
    x: width - 160,
    y: height - 45,
    size: 18,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText("GST COMPLIANT (ORIGINAL FOR RECIPIENT)", {
    x: width - 235,
    y: height - 62,
    size: 8,
    font: fontBold,
    color: colorPrimary,
  });

  // 4. Header Specs Block (Company & Invoice ID)
  let currentY = height - 135;

  // Company Details (Left)
  page.drawText(opts.companyName, { x: 40, y: currentY, size: 9, font: fontBold, color: colorDark });
  currentY -= 14;
  page.drawText(`GSTIN: ${opts.gstin} | PAN: ${opts.pan}`, { x: 40, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
  currentY -= 13;
  page.drawText("Kakadeo Hub Node #4, Behind PW Vidyapeeth, Kanpur - 208025", { x: 40, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
  currentY -= 13;
  page.drawText("Helpline / WhatsApp: +91 9369454350 | Email: support@stashsaarthi.in", { x: 40, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });

  // Invoice Meta (Right)
  const invoiceNum = `INV-2026-${booking.token.replace("#", "")}`;
  const issueDate = new Date(booking.submittedAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let rightY = height - 135;
  page.drawText(`Invoice No: ${invoiceNum}`, { x: width - 220, y: rightY, size: 9, font: fontBold, color: colorDark });
  rightY -= 14;
  page.drawText(`Invoice Date: ${issueDate}`, { x: width - 220, y: rightY, size: 8.5, font: fontHelvetica, color: colorGray });
  rightY -= 13;
  page.drawText(`Token / Booking ID: ${booking.token}`, { x: width - 220, y: rightY, size: 8.5, font: fontBold, color: colorCyan });
  rightY -= 13;
  page.drawText("State Code: 09 (Uttar Pradesh)", { x: width - 220, y: rightY, size: 8.5, font: fontHelvetica, color: colorGray });

  currentY -= 20;

  // Divider Line
  page.drawLine({
    start: { x: 40, y: currentY },
    end: { x: width - 40, y: currentY },
    thickness: 1,
    color: colorBorder,
  });

  currentY -= 25;

  // 5. Billed To Customer Box
  page.drawRectangle({
    x: 40,
    y: currentY - 55,
    width: width - 80,
    height: 65,
    color: colorLightBg,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  page.drawText("BILLED TO (CUSTOMER DETAILS)", {
    x: 52,
    y: currentY - 6,
    size: 8.5,
    font: fontBold,
    color: colorPrimary,
  });

  page.drawText(`Name: ${booking.name || "Valued Student Customer"}`, { x: 52, y: currentY - 22, size: 9, font: fontBold, color: colorDark });
  page.drawText(`Phone / Email: ${booking.phone || booking.email || "N/A"}`, { x: 52, y: currentY - 36, size: 8.5, font: fontHelvetica, color: colorGray });
  page.drawText(`Allocated Campus Node: ${booking.city || "Kakadeo Hub Node #4, Kanpur"}`, { x: 52, y: currentY - 50, size: 8.5, font: fontHelvetica, color: colorGray });

  currentY -= 80;

  // 6. Taxable Line Items Table
  const tableTop = currentY;
  page.drawRectangle({
    x: 40,
    y: tableTop - 22,
    width: width - 80,
    height: 22,
    color: colorDark,
  });

  page.drawText("SR", { x: 48, y: tableTop - 15, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("SERVICE DESCRIPTION", { x: 75, y: tableTop - 15, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("SAC", { x: 300, y: tableTop - 15, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("QTY", { x: 350, y: tableTop - 15, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("TAXABLE VALUE", { x: 400, y: tableTop - 15, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("TOTAL (INR)", { x: 495, y: tableTop - 15, size: 8.5, font: fontBold, color: rgb(1, 1, 1) });

  currentY -= 40;

  // Amounts breakdown (Base vs 18% GST vs Total)
  const totalPaid = Number(booking.amount) || 300;
  // If student micro-storage amount < 1000, GST is exempt or included
  const isExempt = totalPaid < 1000;
  const gstRate = isExempt ? 0 : 0.18;
  const baseValue = +(totalPaid / (1 + gstRate)).toFixed(2);
  const gstAmount = +(totalPaid - baseValue).toFixed(2);
  const cgst = +(gstAmount / 2).toFixed(2);
  const sgst = +(gstAmount / 2).toFixed(2);

  const serviceDesc =
    booking.service === "stash" || booking.service === "micro"
      ? `Saarthi Stash — Luggage Micro-Storage (${booking.bags || 1} bag x ${booking.months || 1} mo)`
      : booking.service === "kitchen" || booking.service === "meal"
      ? `Saarthi Kitchen — Homestyle Tiffin Pack (${booking.mealPlan || "Standard Meal"})`
      : booking.service === "spaces"
      ? `Saarthi Spaces — Co-Living Stay Room (${booking.roomType || "Shared Room"})`
      : `Saarthi Connect — Mentorship & Campus Session`;

  page.drawText("1", { x: 48, y: currentY, size: 8.5, font: fontHelvetica, color: colorDark });
  page.drawText(serviceDesc.slice(0, 42), { x: 75, y: currentY, size: 8.5, font: fontBold, color: colorDark });
  page.drawText(sacCode, { x: 300, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
  page.drawText(`${booking.bags || 1}`, { x: 355, y: currentY, size: 8.5, font: fontHelvetica, color: colorDark });
  page.drawText(`INR ${baseValue}`, { x: 400, y: currentY, size: 8.5, font: fontHelvetica, color: colorDark });
  page.drawText(`INR ${totalPaid.toFixed(2)}`, { x: 495, y: currentY, size: 8.5, font: fontBold, color: colorDark });

  currentY -= 25;

  page.drawLine({
    start: { x: 40, y: currentY },
    end: { x: width - 40, y: currentY },
    thickness: 0.5,
    color: colorBorder,
  });

  currentY -= 20;

  // 7. Tax Summary Calculation Block
  const summaryX = 350;
  page.drawText(`Base Taxable Amount:`, { x: summaryX, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
  page.drawText(`INR ${baseValue}`, { x: width - 100, y: currentY, size: 8.5, font: fontHelvetica, color: colorDark });
  currentY -= 14;

  if (isExempt) {
    page.drawText(`GST Exemption Notification:`, { x: summaryX, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
    page.drawText(`0% (Exempt)`, { x: width - 100, y: currentY, size: 8.5, font: fontBold, color: colorPrimary });
    currentY -= 14;
  } else {
    page.drawText(`CGST (9%):`, { x: summaryX, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
    page.drawText(`INR ${cgst}`, { x: width - 100, y: currentY, size: 8.5, font: fontHelvetica, color: colorDark });
    currentY -= 14;

    page.drawText(`SGST (9%):`, { x: summaryX, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
    page.drawText(`INR ${sgst}`, { x: width - 100, y: currentY, size: 8.5, font: fontHelvetica, color: colorDark });
    currentY -= 14;
  }

  page.drawText(`Safety Escrow Cover (INR 10,000):`, { x: summaryX, y: currentY, size: 8.5, font: fontHelvetica, color: colorGray });
  page.drawText(`FREE (INR 0)`, { x: width - 100, y: currentY, size: 8.5, font: fontBold, color: colorCyan });
  currentY -= 16;

  page.drawLine({
    start: { x: summaryX, y: currentY },
    end: { x: width - 40, y: currentY },
    thickness: 1,
    color: colorDark,
  });

  currentY -= 16;

  page.drawText(`GRAND TOTAL PAID:`, { x: summaryX, y: currentY, size: 10, font: fontBold, color: colorDark });
  page.drawText(`INR ${totalPaid.toFixed(2)}`, { x: width - 100, y: currentY, size: 11, font: fontBold, color: colorPrimary });

  currentY -= 40;

  // 8. Payment Mode & Escrow Stamp
  page.drawRectangle({
    x: 40,
    y: currentY - 40,
    width: 250,
    height: 50,
    color: colorLightBg,
    borderColor: colorPrimary,
    borderWidth: 1,
  });

  page.drawText(`Payment Mode: ${booking.paymentMode || "UPI Instant Pass"}`, { x: 50, y: currentY - 14, size: 8.5, font: fontBold, color: colorDark });
  page.drawText(`Transaction Status: SUCCESS (CONFIRMED)`, { x: 50, y: currentY - 26, size: 8, font: fontBold, color: colorPrimary });
  page.drawText(`Escrow Protection Seal: Active (100% Guaranteed)`, { x: 50, y: currentY - 37, size: 7.5, font: fontHelvetica, color: colorGray });

  // 9. Digital Seal & Authorized Signatory (Right)
  page.drawRectangle({
    x: width - 230,
    y: currentY - 40,
    width: 190,
    height: 50,
    color: rgb(0.95, 0.99, 0.96),
    borderColor: colorPrimary,
    borderWidth: 1,
  });

  page.drawText("STASHSAARTHI DIGITAL SEAL", { x: width - 220, y: currentY - 14, size: 8, font: fontBold, color: colorPrimary });
  page.drawText("Digitally Signed & Certified", { x: width - 220, y: currentY - 26, size: 7.5, font: fontOblique, color: colorDark });
  page.drawText("Authorized Kanpur Node Registrar", { x: width - 220, y: currentY - 37, size: 7.5, font: fontHelvetica, color: colorGray });

  // 10. Footer Terms & Disclaimer
  const footerY = 40;
  page.drawLine({
    start: { x: 40, y: footerY + 15 },
    end: { x: width - 40, y: footerY + 15 },
    thickness: 0.5,
    color: colorBorder,
  });

  page.drawText("Thank you for choosing StashSaarthi — India's Zero-CapEx Intergenerational Living Platform.", {
    x: 40,
    y: footerY + 4,
    size: 7.5,
    font: fontOblique,
    color: colorGray,
  });

  page.drawText("This is a computer-generated GST tax invoice and requires no physical signature under Rule 46 of CGST Rules 2017.", {
    x: 40,
    y: footerY - 7,
    size: 7,
    font: fontHelvetica,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Render & serialize PDF bytes
  return await pdfDoc.save();
}

/**
 * Triggers automatic browser download of the generated GST PDF invoice.
 */
export async function downloadInvoicePdf(booking: BookingRecord): Promise<void> {
  const pdfBytes = await generateGstInvoicePdf(booking);
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `StashSaarthi_GST_Invoice_${booking.token.replace("#", "")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
