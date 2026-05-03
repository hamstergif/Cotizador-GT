import {
  formatDimensions,
  formatKg,
  formatM3,
  formatOptionalText,
  formatUsd,
  formatYesNo,
} from "./formatters";
import { WHATSAPP_NUMBER } from "./rates";

function buildObservations(formData) {
  const notes = [];

  if (String(formData.observations ?? "").trim()) {
    notes.push(String(formData.observations).trim());
  }

  if (formData.hasEstimatedData) {
    notes.push("Se cargaron datos estimados para esta simulacion.");
  }

  return notes.length > 0 ? notes.join(" | ") : "Sin observaciones.";
}

function buildCalculationLine(quote) {
  if (quote.service.id === "air-courier") {
    return `Peso aplicable: ${formatKg(quote.weights.applicableWeightKg)}`;
  }

  if (quote.service.id === "maritime-courier") {
    return `Peso de calculo: ${formatKg(quote.weights.maritimeChargeableWeightKg)}`;
  }

  return `Base de calculo: ${formatM3(quote.volumes.sharedChargeableVolumeM3)}`;
}

export function buildWhatsAppMessage(formData, quote) {
  const originLabel = [formData.originCountry, formData.originCityOrSupplier]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(" / ");

  const messageLines = [
    `Hola, quiero consultar por una operacion de ${quote.service.title} con Global Trip.`,
    "",
    "Datos del contacto:",
    `Nombre: ${formatOptionalText(formData.fullName)}`,
    `Empresa: ${formatOptionalText(formData.company)}`,
    `WhatsApp: ${formatOptionalText(formData.whatsapp)}`,
    `Email: ${formatOptionalText(formData.email)}`,
    "",
    "Datos de la operacion:",
    `Producto: ${formatOptionalText(formData.product)}`,
    `Origen: ${formatOptionalText(originLabel)}`,
    `Destino: ${formatOptionalText(formData.destinationArgentina)}`,
    `Link: ${formatOptionalText(formData.productLink)}`,
    `Valor FOB: ${formatUsd(quote.costs.fobUsd)}`,
    `Cantidad de bultos: ${formatOptionalText(formData.packageCount)}`,
    `Peso bruto: ${formatKg(quote.weights.grossWeightKg)}`,
    `Medidas: ${formatDimensions(formData.lengthCm, formData.widthCm, formData.heightCm)}`,
    `Volumen estimado: ${formatM3(quote.volumes.totalVolumeM3)}`,
    `Peso volumetrico: ${
      quote.service.id === "air-courier"
        ? formatKg(quote.weights.volumetricWeightKg)
        : "No aplica"
    }`,
    buildCalculationLine(quote),
    `Producto tecnologico / bien de capital: ${formatYesNo(formData.isTechProduct)}`,
  ];

  if (quote.service.id === "maritime-courier") {
    messageLines.push(
      `Peso equivalente por volumen (1 m3 = 200 kg): ${formatKg(quote.weights.maritimeEquivalentWeightKg)}`,
    );
  }

  if (quote.service.id === "shared-import") {
    messageLines.push(
      `Volumen equivalente por peso (1 tn = 1 m3): ${formatM3(quote.volumes.sharedEquivalentVolumeM3)}`,
    );
  }

  messageLines.push("");
  messageLines.push("Estimacion generada:");
  messageLines.push(`Tiempo estimado: ${quote.service.etaLabel}`);
  if (quote.requiresManualQuote) {
    messageLines.push(`Resultado: ${quote.manualQuoteMessage ?? "A cotizar manualmente"}`);
  } else {
    messageLines.push(`Costo servicio: ${formatUsd(quote.costs.serviceCostUsd)}`);
    if (quote.costs.additionalChargesUsd > 0) {
      messageLines.push(`Tasa de desembolso: ${formatUsd(quote.costs.additionalChargesUsd)}`);
    }
    messageLines.push(`Seguro estimado para CIF: ${formatUsd(quote.costs.insuranceUsd)}`);
    messageLines.push(`CIF: ${formatUsd(quote.costs.cifUsd)}`);
    messageLines.push(`Derechos de importacion: ${formatUsd(quote.taxes.importDutyUsd)}`);
    messageLines.push(`Tasa de estadistica: ${formatUsd(quote.taxes.statisticsUsd)}`);
    messageLines.push(`Base IVA: ${formatUsd(quote.costs.baseVatUsd)}`);
    messageLines.push(`IVA: ${formatUsd(quote.taxes.vatUsd)}`);

    if (quote.service.id === "shared-import") {
      messageLines.push(`IVA adicional: ${formatUsd(quote.taxes.additionalVatUsd)}`);
      messageLines.push(`Ganancias: ${formatUsd(quote.taxes.earningsTaxUsd)}`);
      messageLines.push(`Ingresos Brutos: ${formatUsd(quote.taxes.grossIncomeTaxUsd)}`);
    }

    messageLines.push(`Impuestos estimados: ${formatUsd(quote.costs.taxesTotalUsd)}`);
    messageLines.push(
      `Total puesto en Argentina (No incluye el valor del producto): ${formatUsd(quote.costs.totalEstimatedUsd)}`,
    );
    messageLines.push(
      "Aclaracion total: el seguro se usa para el CIF y el total no incluye el valor del producto (FOB).",
    );
  }
  messageLines.push("");
  messageLines.push(`Observaciones: ${buildObservations(formData)}`);
  messageLines.push("");
  messageLines.push("Consulta generada desde el cotizador web de Global Trip.");
  messageLines.push(
    "Entiendo que los valores son estimativos y quedan sujetos a revision de Global Trip.",
  );

  return messageLines.join("\n");
}

export function buildWhatsAppLink(formData, quote) {
  const message = buildWhatsAppMessage(formData, quote);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
