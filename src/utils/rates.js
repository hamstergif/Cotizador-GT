export const WHATSAPP_NUMBER = "5491131411755";
export const INSURANCE_RATE = 0.01;
export const COURIER_MARITIME_USD_PER_KG = 10;
export const COURIER_MARITIME_FIXED_USD = 50;
export const SHARED_IMPORT_USD_PER_M3 = 450;
export const SHARED_IMPORT_MIN_BILLABLE_M3 = 1;
export const AIR_COURIER_CUSTOMS_FUEL_RATE = 0.085;
export const COURIER_MARITIME_CUSTOMS_USD_PER_KG = 0.5;
export const SHARED_IMPORT_CUSTOMS_USD_PER_M3 = 50;
export const AIR_COURIER_AWB_USD = 75;
export const AIR_COURIER_HIGH_SEASON_RATE = 0.215;
export const AIR_COURIER_TAXABLE_SERVICE_VAT_RATE = 0.21;

export const COURIER_MAX_FOB_USD = 3000;
export const COURIER_MAX_UNIT_WEIGHT_KG = 50;
export const MARITIME_COURIER_KG_PER_M3 = 200;
export const SHARED_IMPORT_KG_PER_M3 = 1000;

export const AIR_COURIER_RATE_TABLE = [
  { label: "Hasta 5 kg", maxKg: 5, usdPerKg: 45, minimumUsd: 0 },
  { label: "Hasta 10 kg", maxKg: 10, usdPerKg: 28, minimumUsd: 225 },
  { label: "Hasta 20 kg", maxKg: 20, usdPerKg: 20, minimumUsd: 280 },
  { label: "Hasta 30 kg", maxKg: 30, usdPerKg: 18, minimumUsd: 400 },
  { label: "Hasta 50 kg", maxKg: 50, usdPerKg: 12.8, minimumUsd: 540 },
  { label: "Hasta 70 kg", maxKg: 70, usdPerKg: 12.6, minimumUsd: 640 },
  { label: "Hasta 100 kg", maxKg: 100, usdPerKg: 12.5, minimumUsd: 882 },
  { label: "Hasta 150 kg", maxKg: 150, usdPerKg: 12.3, minimumUsd: 1250 },
  { label: "Hasta 300 kg", maxKg: 300, usdPerKg: 12, minimumUsd: 1845 },
  { label: "Mas de 300 kg", maxKg: Number.POSITIVE_INFINITY, usdPerKg: 0, minimumUsd: 0 },
];

export const AIR_COURIER_CUSTOMS_HALF_KG_ZONE_A = [
  { kg: 0.5, totalUsd: 72.17 },
  { kg: 1, totalUsd: 78.64 },
  { kg: 1.5, totalUsd: 85.12 },
  { kg: 2, totalUsd: 91.59 },
  { kg: 2.5, totalUsd: 98.07 },
  { kg: 3, totalUsd: 106.22 },
  { kg: 3.5, totalUsd: 114.38 },
  { kg: 4, totalUsd: 122.53 },
  { kg: 4.5, totalUsd: 130.69 },
  { kg: 5, totalUsd: 138.84 },
  { kg: 5.5, totalUsd: 144.72 },
  { kg: 6, totalUsd: 150.6 },
  { kg: 6.5, totalUsd: 156.48 },
  { kg: 7, totalUsd: 162.36 },
  { kg: 7.5, totalUsd: 168.24 },
  { kg: 8, totalUsd: 174.12 },
  { kg: 8.5, totalUsd: 180 },
  { kg: 9, totalUsd: 185.88 },
  { kg: 9.5, totalUsd: 191.76 },
  { kg: 10, totalUsd: 197.64 },
  { kg: 10.5, totalUsd: 201.77 },
  { kg: 11, totalUsd: 205.9 },
  { kg: 11.5, totalUsd: 210.03 },
  { kg: 12, totalUsd: 214.16 },
  { kg: 12.5, totalUsd: 218.29 },
  { kg: 13, totalUsd: 222.42 },
  { kg: 13.5, totalUsd: 226.55 },
  { kg: 14, totalUsd: 230.68 },
  { kg: 14.5, totalUsd: 234.81 },
  { kg: 15, totalUsd: 238.94 },
  { kg: 15.5, totalUsd: 243.07 },
  { kg: 16, totalUsd: 247.2 },
  { kg: 16.5, totalUsd: 251.33 },
  { kg: 17, totalUsd: 255.46 },
  { kg: 17.5, totalUsd: 259.59 },
  { kg: 18, totalUsd: 263.72 },
  { kg: 18.5, totalUsd: 267.85 },
  { kg: 19, totalUsd: 271.98 },
  { kg: 19.5, totalUsd: 276.11 },
  { kg: 20, totalUsd: 280.24 },
  { kg: 20.5, totalUsd: 284.37 },
];

export const AIR_COURIER_CUSTOMS_USD_PER_KG_BREAKS = [
  { fromKg: 20.5, usdPerKg: 12.4 },
  { fromKg: 45, usdPerKg: 9.46 },
  { fromKg: 71, usdPerKg: 9.9625 },
  { fromKg: 100, usdPerKg: 9.8916666667 },
  { fromKg: 150, usdPerKg: 9.8333333333 },
  { fromKg: 300, usdPerKg: 9.49 },
  { fromKg: 500, usdPerKg: 9.41 },
  { fromKg: 1000, usdPerKg: 9.3 },
];

export const AIR_COURIER_DISBURSEMENT_BRACKETS = [
  { maxTaxesUsd: 5, feeUsd: 0 },
  { maxTaxesUsd: 10, feeUsd: 36 },
  { maxTaxesUsd: 20, feeUsd: 50 },
  { maxTaxesUsd: 50, feeUsd: 58 },
  { maxTaxesUsd: 100, feeUsd: 65 },
  { maxTaxesUsd: 400, feeUsd: 72 },
  { maxTaxesUsd: 800, feeUsd: 84 },
  { maxTaxesUsd: 1000, feeUsd: 96 },
  { maxTaxesUsd: Number.POSITIVE_INFINITY, feeUsd: 120 },
];

const COURIER_STANDARD_TAXES = {
  importDuty: 0.2,
  statisticsRate: 0.03,
  vat: 0.21,
  additionalVat: 0,
  earningsTax: 0,
  grossIncomeTax: 0,
};

const COURIER_REDUCED_TAXES = {
  importDuty: 0,
  statisticsRate: 0,
  vat: 0.105,
  additionalVat: 0,
  earningsTax: 0,
  grossIncomeTax: 0,
};

const SHARED_STANDARD_TAXES = {
  importDuty: 0.2,
  statisticsRate: 0.03,
  vat: 0.21,
  additionalVat: 0.2,
  earningsTax: 0.06,
  grossIncomeTax: 0.025,
};

const SHARED_REDUCED_TAXES = {
  importDuty: 0,
  statisticsRate: 0,
  vat: 0.105,
  additionalVat: 0.1,
  earningsTax: 0.06,
  grossIncomeTax: 0.025,
};

export const TAX_PROFILES = {
  standard: {
    "air-courier": COURIER_STANDARD_TAXES,
    "maritime-courier": COURIER_STANDARD_TAXES,
    "shared-import": SHARED_STANDARD_TAXES,
  },
  reduced: {
    "air-courier": COURIER_REDUCED_TAXES,
    "maritime-courier": COURIER_REDUCED_TAXES,
    "shared-import": SHARED_REDUCED_TAXES,
  },
};

export const SERVICES = [
  {
    id: "air-courier",
    shortLabel: "Urgente",
    title: "Courier Aereo",
    etaLabel: "10 a 15 dias",
    description:
      "Para cargas urgentes o de menor volumen. Estimacion rapida con llegada aproximada de 10 a 15 dias.",
    calculationLabel: "Peso aplicable",
  },
  {
    id: "maritime-courier",
    shortLabel: "Costo / kg",
    title: "Courier Maritimo",
    etaLabel: "Aproximadamente 90 dias",
    description:
      "Para cargas menos urgentes donde buscas optimizar costo por kilo. Llegada estimada aproximada de 90 dias.",
    calculationLabel: "Peso de calculo",
  },
  {
    id: "shared-import",
    shortLabel: "Regimen general",
    title: "Importacion Compartida",
    etaLabel: "Aproximadamente 90 dias",
    description:
      "Para operaciones consolidadas bajo regimen general, calculadas por volumen. Llegada estimada aproximada de 90 dias.",
    calculationLabel: "Base de calculo",
  },
];

export const GLOBAL_NOTES = {
  estimatorDisclaimer:
    "Los calculos son estimativos y no constituyen una cotizacion final. La operacion queda sujeta a revision documental, normativa vigente, clasificacion arancelaria, disponibilidad del servicio y validacion del equipo de Global Trip.",
  techDisclaimer:
    "La reduccion impositiva queda sujeta a validacion de posicion arancelaria y normativa vigente.",
  taxDisclaimer:
    "Los impuestos mostrados son estimativos, estan expresados en USD y no incluyen percepciones en pesos ni conversiones a ARS.",
};
