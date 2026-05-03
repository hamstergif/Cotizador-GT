export const WHATSAPP_NUMBER = "5491131411755";
export const INSURANCE_RATE = 0.01;
export const COURIER_MARITIME_USD_PER_KG = 10;
export const COURIER_MARITIME_FIXED_USD = 50;
export const SHARED_IMPORT_USD_PER_M3 = 450;
export const SHARED_IMPORT_MIN_BILLABLE_M3 = 1;
export const COURIER_MARITIME_CUSTOMS_USD_PER_KG = 0.5;
export const SHARED_IMPORT_CUSTOMS_USD_PER_M3 = 50;

export const COURIER_MAX_FOB_USD = 3000;
export const COURIER_MAX_UNIT_WEIGHT_KG = 50;
export const MARITIME_COURIER_KG_PER_M3 = 200;
export const SHARED_IMPORT_KG_PER_M3 = 1000;

export const TARIFAS_COURIER_FEDEX = [
  {
    desdeKg: 0.01,
    hastaKg: 5,
    costoUsdKg: 25,
    ventaUsdKg: 45,
  },
  {
    desdeKg: 5.01,
    hastaKg: 10,
    costoUsdKg: 17.55,
    ventaUsdKg: 28,
  },
  {
    desdeKg: 10.01,
    hastaKg: 20,
    costoUsdKg: 13.5,
    ventaUsdKg: 20,
  },
  {
    desdeKg: 20.01,
    hastaKg: 30,
    costoUsdKg: 12.4,
    ventaUsdKg: 18,
  },
  {
    desdeKg: 30.01,
    hastaKg: 50,
    costoUsdKg: 9.46,
    ventaUsdKg: 12.8,
  },
  {
    desdeKg: 50.01,
    hastaKg: 70,
    costoUsdKg: 9.95,
    ventaUsdKg: 12.6,
  },
  {
    desdeKg: 70.01,
    hastaKg: 100,
    costoUsdKg: 9.96,
    ventaUsdKg: 12.5,
  },
  {
    desdeKg: 100.01,
    hastaKg: 150,
    costoUsdKg: 9.89,
    ventaUsdKg: 12.3,
  },
  {
    desdeKg: 150.01,
    hastaKg: 300,
    costoUsdKg: 9.83,
    ventaUsdKg: 12,
  },
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
