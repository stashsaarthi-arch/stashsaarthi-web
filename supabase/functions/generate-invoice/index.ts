// Supabase Edge Function: generate-invoice (Task 109)
// Generates GST-compliant PDF invoice bytes using pdf-lib on Deno / Supabase Edge Runtimes

// @ts-ignore: Deno standard library URL import for Supabase Edge Runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno Skypack CDN import for Supabase Edge Runtime
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1?dts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { booking } = await req.json();

    if (!booking || !booking.token) {
      return new Response(JSON.stringify({ error: "Booking record is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const colorDark = rgb(0.04, 0.05, 0.06);
    const colorPrimary = rgb(0.06, 0.73, 0.51);

    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: colorDark,
    });

    page.drawText("STASHSAARTHI", {
      x: 40,
      y: height - 45,
      size: 22,
      font: fontBold,
      color: colorPrimary,
    });

    page.drawText("GST TAX INVOICE", {
      x: width - 180,
      y: height - 45,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`Invoice No: INV-2026-${booking.token.replace("#", "")}`, {
      x: 40,
      y: height - 140,
      size: 10,
      font: fontBold,
      color: colorDark,
    });

    page.drawText(`Customer: ${booking.name || "Student User"}`, {
      x: 40,
      y: height - 160,
      size: 10,
      font: fontHelvetica,
      color: colorDark,
    });

    page.drawText(`Total Amount Paid: INR ${booking.amount || 300}`, {
      x: 40,
      y: height - 180,
      size: 12,
      font: fontBold,
      color: colorPrimary,
    });

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Invoice_${booking.token}.pdf`,
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
