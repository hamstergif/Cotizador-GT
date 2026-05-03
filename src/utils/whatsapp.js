import { formatDimensions, formatKg, formatM3, formatOptionalText, formatUsd, formatYesNo } from "./formatters";
import { WHATSAPP_NUMBER } from "./rates";

function buildObservations(formData) {
  const notes = [];

  if (String(formData.observations ?? "").trim()) {
    notes.push(String(formData.observations).trim());
  }

  if (formData.hasEstimatedData) {
    notes.push("Se cargaron datos estimados para esta simulación.");
  }

  return notes.length > 0 ? notes.join(" | ") : "Sin observaciones.";
}

export function buildWhatsAppMessage(formData, quote) {
  const originLabel = [formData.originCountry, formData.originCityOrSupplier]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(" / ");

  const messageLines = [
    `Hola, quiero consultar por una operación de ${quote.service.title} con Global Trip.`,
    "",
    "Datos del contacto:",
    `Nombre: ${formatOptionalText(formData.fullName)}`,
    `Empresa: ${formatOptionalText(formData.company)}`,
    `WhatsApp: ${formatOptionalText(formData.whatsapp)}`,
    `Email: ${formatOptionalText(formData.email)}`,
    "",
    "Datos de la operación:",
    `Producto: ${formatOptionalText(formData.product)}`,
    `Origen: ${formatOptionalText(originLabel)}`,
    `Destino: ${formatOptionalText(formData.destinationArgentina)}`,
    `Link: ${formatOptionalText(formData.productLink)}`,
    `Valor FOB: ${formatUsd(quote.costs.fobUsd)}`,
    `Cantidad de bultos: ${formatOptionalText(formData.packageCount)}`,
    `Peso bruto: ${formatKg(quote.weights.grossWeightKg)}`,
    `Medidas: ${formatDimensions(formData.lengthCm, formData.widthCm, formData.heightCm)}`,
    `Volumen estimado: ${formatM3(quote.volumes.totalVolumeM3)}`,
    `Peso volumétrico: ${
      quote.service.id === "air-courier"
        ? formatKg(quote.weights.volumetricWeightKg)
        : "No aplica"
    }`,
    `Peso aplicable: ${
      quote.service.id === "air-courier"
        ? formatKg(quote.weights.applicableWeightKg)
        : quote.calculationBase.displayValue
    }`,
    `Producto tecnológico / bien de capital: ${formatYesNo(formData.isTechProduct)}`,
    "",
    "Estimación generada:",
    `Tiempo estimado: ${quote.service.etaLabel}`,
    `Costo servicio: ${formatUsd(quote.costs.serviceCostUsd)}`,
    `Seguro estimado: ${formatUsd(quote.costs.insuranceUsd)}`,
    `CIF: ${formatUsd(quote.costs.cifUsd)}`,
    `Derechos de importación: ${formatUsd(quote.taxes.importDutyUsd)}`,
    `Tasa de estadística: ${formatUsd(quote.taxes.statisticsUsd)}`,
    `Base IVA: ${formatUsd(quote.costs.baseVatUsd)}`,
    `IVA: ${formatUsd(quote.taxes.vatUsd)}`,
  ];

  if (quote.service.id === "shared-import") {
    messageLines.push(`IVA adicional: ${formatUsd(quote.taxes.additionalVatUsd)}`);
    messageLines.push(`Ganancias: ${formatUsd(quote.taxes.earningsTaxUsd)}`);
    messageLines.push(`Ingresos Brutos: ${formatUsd(quote.taxes.grossIncomeTaxUsd)}`);
  }

  messageLines.push(`Total estimado: ${formatUsd(quote.costs.totalEstimatedUsd)}`);
  messageLines.push("");
  messageLines.push(`Observaciones: ${buildObservations(formData)}`);
  messageLines.push("");
  messageLines.push("Consulta generada desde el cotizador web de Global Trip.");
  messageLines.push(
    "Entiendo que los valores son estimativos y quedan sujetos a revisión de Global Trip.",
  );

  return messageLines.join("\n");
}

export function buildWhatsAppLink(formData, quote) {
  const message = buildWhatsAppMessage(formData, quote);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
