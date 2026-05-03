import { formatKg, formatM3 } from "./formatters";
import {
  COURIER_MARITIME_CUSTOMS_USD_PER_KG,
  COURIER_MARITIME_FIXED_USD,
  COURIER_MARITIME_USD_PER_KG,
  COURIER_MAX_FOB_USD,
  COURIER_MAX_UNIT_WEIGHT_KG,
  GLOBAL_NOTES,
  INSURANCE_RATE,
  MARITIME_COURIER_KG_PER_M3,
  SERVICES,
  SHARED_IMPORT_CUSTOMS_USD_PER_M3,
  SHARED_IMPORT_KG_PER_M3,
  SHARED_IMPORT_MIN_BILLABLE_M3,
  SHARED_IMPORT_USD_PER_M3,
  TARIFAS_COURIER_FEDEX,
  TAX_PROFILES,
} from "./rates";

const REQUIRED_TEXT_FIELDS = {
  fullName: "Ingresa tu nombre.",
  whatsapp: "Ingresa un WhatsApp de contacto.",
  product: "Indica el producto a importar.",
  originCountry: "Indica el pais de origen.",
  destinationArgentina: "Indica el destino en Argentina.",
};

const REQUIRED_NUMERIC_FIELDS = {
  fobUsd: "Ingresa un FOB mayor a 0.",
  packageCount: "Ingresa una cantidad de bultos mayor a 0.",
  grossWeightKg: "Ingresa un peso bruto mayor a 0.",
  lengthCm: "Ingresa un largo mayor a 0.",
  widthCm: "Ingresa un ancho mayor a 0.",
  heightCm: "Ingresa un alto mayor a 0.",
};

function hasText(value) {
  return String(value ?? "").trim().length > 0;
}

function isCourierService(serviceId) {
  return serviceId === "air-courier" || serviceId === "maritime-courier";
}

export function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (!hasText(value)) {
    return 0;
  }

  const normalized = String(value).replace(/\s+/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundUpToHalfKg(value) {
  const normalizedValue = Math.max(toNumber(value), 0);
  return normalizedValue > 0 ? Math.ceil(normalizedValue * 2) / 2 : 0;
}

export function calcularPesoVolumetrico(
  largoCm,
  anchoCm,
  altoCm,
  cantidadBultos = 1,
) {
  const pesoVol =
    (toNumber(largoCm) * toNumber(anchoCm) * toNumber(altoCm) * toNumber(cantidadBultos)) /
    5000;

  return roundUpToHalfKg(pesoVol);
}

export function calcularPesoAplicable(
  pesoBrutoKg,
  largoCm,
  anchoCm,
  altoCm,
  cantidadBultos = 1,
) {
  const pesoVolumetricoKg = calcularPesoVolumetrico(
    largoCm,
    anchoCm,
    altoCm,
    cantidadBultos,
  );

  return Math.max(toNumber(pesoBrutoKg), pesoVolumetricoKg);
}

export function buscarTarifaCourierFedEx(pesoAplicableKg) {
  const normalizedWeightKg = toNumber(pesoAplicableKg);

  if (!normalizedWeightKg || normalizedWeightKg <= 0) {
    return null;
  }

  if (normalizedWeightKg > 300) {
    return null;
  }

  return (
    TARIFAS_COURIER_FEDEX.find(
      (tramo) =>
        normalizedWeightKg >= tramo.desdeKg && normalizedWeightKg <= tramo.hastaKg,
    ) ?? null
  );
}

function toMoney(value) {
  return Number(toNumber(value).toFixed(2));
}

export function calcularCourierFedEx({
  pesoBrutoKg,
  largoCm,
  anchoCm,
  altoCm,
  cantidadBultos = 1,
  altaDemandaUsd = 0,
}) {
  const normalizedGrossWeightKg = toNumber(pesoBrutoKg);
  const normalizedHighDemandUsd = Math.max(toNumber(altaDemandaUsd), 0);
  const pesoVolumetricoKg = calcularPesoVolumetrico(
    largoCm,
    anchoCm,
    altoCm,
    cantidadBultos,
  );
  const pesoAplicableKg = Math.max(normalizedGrossWeightKg, pesoVolumetricoKg);
  const tarifa = buscarTarifaCourierFedEx(pesoAplicableKg);

  if (!tarifa) {
    return {
      pesoBrutoKg: toMoney(normalizedGrossWeightKg),
      pesoVolumetricoKg: toMoney(pesoVolumetricoKg),
      pesoAplicableKg: toMoney(pesoAplicableKg),
      requiereCotizacionManual: true,
      mensaje: "A cotizar manualmente",
      ventaUsdKg: 0,
      costoUsdKg: 0,
      ventaFleteUsd: 0,
      costoFleteUsd: 0,
      altaDemandaUsd: toMoney(normalizedHighDemandUsd),
      ventaTotalUsd: toMoney(normalizedHighDemandUsd),
      costoTotalUsd: toMoney(normalizedHighDemandUsd),
      gananciaFleteUsd: 0,
    };
  }

  const ventaFleteUsd = pesoAplicableKg * tarifa.ventaUsdKg;
  const costoFleteUsd = pesoAplicableKg * tarifa.costoUsdKg;
  const ventaTotalUsd = ventaFleteUsd + normalizedHighDemandUsd;
  const costoTotalUsd = costoFleteUsd + normalizedHighDemandUsd;
  const gananciaFleteUsd = ventaFleteUsd - costoFleteUsd;

  return {
    pesoBrutoKg: toMoney(normalizedGrossWeightKg),
    pesoVolumetricoKg: toMoney(pesoVolumetricoKg),
    pesoAplicableKg: toMoney(pesoAplicableKg),
    ventaUsdKg: tarifa.ventaUsdKg,
    costoUsdKg: tarifa.costoUsdKg,
    ventaFleteUsd: toMoney(ventaFleteUsd),
    costoFleteUsd: toMoney(costoFleteUsd),
    altaDemandaUsd: toMoney(normalizedHighDemandUsd),
    ventaTotalUsd: toMoney(ventaTotalUsd),
    costoTotalUsd: toMoney(costoTotalUsd),
    gananciaFleteUsd: toMoney(gananciaFleteUsd),
    requiereCotizacionManual: false,
    mensaje: null,
  };
}

function getServiceById(serviceId) {
  return SERVICES.find((service) => service.id === serviceId) ?? SERVICES[0];
}

function getTaxProfile(serviceId, isTechProduct) {
  return isTechProduct ? TAX_PROFILES.reduced[serviceId] : TAX_PROFILES.standard[serviceId];
}

export function validateForm(formData, serviceId) {
  const errors = {};
  const service = getServiceById(serviceId);

  Object.entries(REQUIRED_TEXT_FIELDS).forEach(([field, message]) => {
    if (!hasText(formData[field])) {
      errors[field] = message;
    }
  });

  Object.entries(REQUIRED_NUMERIC_FIELDS).forEach(([field, message]) => {
    if (!hasText(formData[field]) || toNumber(formData[field]) <= 0) {
      errors[field] = message;
    }
  });

  const packageCount = toNumber(formData.packageCount);
  const grossWeightKg = toNumber(formData.grossWeightKg);
  const fobUsd = toNumber(formData.fobUsd);

  if (hasText(formData.packageCount) && !Number.isInteger(packageCount)) {
    errors.packageCount = "La cantidad de bultos debe ser un numero entero.";
  }

  if (hasText(formData.email)) {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email).trim());

    if (!isValidEmail) {
      errors.email = "Ingresa un email valido o dejalo vacio.";
    }
  }

  if (isCourierService(serviceId)) {
    if (fobUsd > COURIER_MAX_FOB_USD) {
      errors.fobUsd = `Para ${service.title} el FOB total no puede superar USD ${COURIER_MAX_FOB_USD}.`;
    }

    if (packageCount > 0 && grossWeightKg > 0) {
      const averageUnitWeightKg = grossWeightKg / packageCount;

      if (averageUnitWeightKg > COURIER_MAX_UNIT_WEIGHT_KG) {
        errors.grossWeightKg =
          `Para ${service.title} el peso promedio por bulto no puede superar ${COURIER_MAX_UNIT_WEIGHT_KG} kg.`;
      }
    }
  }

  return errors;
}

export function calculateQuote(serviceId, formData) {
  const service = getServiceById(serviceId);
  const taxProfile = getTaxProfile(serviceId, formData.isTechProduct);
  const validationErrors = validateForm(formData, serviceId);

  const packageCount = toNumber(formData.packageCount);
  const grossWeightKg = toNumber(formData.grossWeightKg);
  const lengthCm = toNumber(formData.lengthCm);
  const widthCm = toNumber(formData.widthCm);
  const heightCm = toNumber(formData.heightCm);
  const fobUsd = toNumber(formData.fobUsd);
  const altaDemandaUsd = toNumber(formData.altaDemandaUsd ?? formData.highDemandUsd);

  const volumePerPackageM3 = (lengthCm * widthCm * heightCm) / 1000000;
  const totalVolumeM3 = volumePerPackageM3 * packageCount;
  const volumetricWeightKg = calcularPesoVolumetrico(
    lengthCm,
    widthCm,
    heightCm,
    packageCount,
  );
  const applicableWeightKg = calcularPesoAplicable(
    grossWeightKg,
    lengthCm,
    widthCm,
    heightCm,
    packageCount,
  );
  const averageUnitWeightKg = packageCount > 0 ? grossWeightKg / packageCount : 0;

  const maritimeEquivalentWeightKg = totalVolumeM3 * MARITIME_COURIER_KG_PER_M3;
  const maritimeChargeableWeightKg = Math.max(grossWeightKg, maritimeEquivalentWeightKg);

  const sharedEquivalentVolumeM3 = grossWeightKg / SHARED_IMPORT_KG_PER_M3;
  const sharedChargeableVolumeM3 = Math.max(
    totalVolumeM3,
    sharedEquivalentVolumeM3,
    SHARED_IMPORT_MIN_BILLABLE_M3,
  );

  let serviceCostUsd = 0;
  let additionalChargesUsd = 0;
  let customsFreightUsd = 0;
  let insuranceUsd = fobUsd * INSURANCE_RATE;
  let cifUsd = 0;
  let importDutyUsd = 0;
  let statisticsUsd = 0;
  let baseVatUsd = 0;
  let vatUsd = 0;
  let additionalVatUsd = 0;
  let earningsTaxUsd = 0;
  let grossIncomeTaxUsd = 0;
  let taxesTotalUsd = 0;
  let totalEstimatedUsd = 0;
  let requiresManualQuote = false;
  let manualQuoteMessage = null;
  let courierFedEx = null;
  let calculationBase = {
    label: service.calculationLabel,
    displayValue: formatKg(applicableWeightKg),
  };

  if (serviceId === "air-courier") {
    courierFedEx = calcularCourierFedEx({
      pesoBrutoKg: grossWeightKg,
      largoCm: lengthCm,
      anchoCm: widthCm,
      altoCm: heightCm,
      cantidadBultos: packageCount,
      altaDemandaUsd,
    });

    requiresManualQuote = courierFedEx.requiereCotizacionManual;
    manualQuoteMessage = courierFedEx.mensaje;
    serviceCostUsd = courierFedEx.ventaTotalUsd;
    additionalChargesUsd = 0;
    customsFreightUsd = courierFedEx.costoTotalUsd;
    insuranceUsd = fobUsd * INSURANCE_RATE;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatKg(courierFedEx.pesoAplicableKg),
    };

    if (!requiresManualQuote) {
      cifUsd = fobUsd + customsFreightUsd + insuranceUsd;
      importDutyUsd = cifUsd * taxProfile.importDuty;
      statisticsUsd = cifUsd * taxProfile.statisticsRate;
      baseVatUsd = cifUsd + importDutyUsd + statisticsUsd;
      vatUsd = baseVatUsd * taxProfile.vat;
      additionalVatUsd = baseVatUsd * taxProfile.additionalVat;
      earningsTaxUsd = baseVatUsd * taxProfile.earningsTax;
      grossIncomeTaxUsd = baseVatUsd * taxProfile.grossIncomeTax;
      taxesTotalUsd =
        importDutyUsd +
        statisticsUsd +
        vatUsd +
        additionalVatUsd +
        earningsTaxUsd +
        grossIncomeTaxUsd;
      totalEstimatedUsd = serviceCostUsd + taxesTotalUsd;
    }
  }

  if (serviceId === "maritime-courier") {
    serviceCostUsd = maritimeChargeableWeightKg * COURIER_MARITIME_USD_PER_KG + COURIER_MARITIME_FIXED_USD;
    customsFreightUsd = maritimeChargeableWeightKg * COURIER_MARITIME_CUSTOMS_USD_PER_KG;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatKg(maritimeChargeableWeightKg),
    };

    cifUsd = fobUsd + customsFreightUsd + insuranceUsd;
    importDutyUsd = cifUsd * taxProfile.importDuty;
    statisticsUsd = cifUsd * taxProfile.statisticsRate;
    baseVatUsd = cifUsd + importDutyUsd + statisticsUsd;
    vatUsd = baseVatUsd * taxProfile.vat;
    additionalVatUsd = baseVatUsd * taxProfile.additionalVat;
    earningsTaxUsd = baseVatUsd * taxProfile.earningsTax;
    grossIncomeTaxUsd = baseVatUsd * taxProfile.grossIncomeTax;
    taxesTotalUsd =
      importDutyUsd +
      statisticsUsd +
      vatUsd +
      additionalVatUsd +
      earningsTaxUsd +
      grossIncomeTaxUsd;
    totalEstimatedUsd = serviceCostUsd + taxesTotalUsd;
  }

  if (serviceId === "shared-import") {
    serviceCostUsd = sharedChargeableVolumeM3 * SHARED_IMPORT_USD_PER_M3;
    customsFreightUsd = sharedChargeableVolumeM3 * SHARED_IMPORT_CUSTOMS_USD_PER_M3;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatM3(sharedChargeableVolumeM3),
    };

    cifUsd = fobUsd + customsFreightUsd + insuranceUsd;
    importDutyUsd = cifUsd * taxProfile.importDuty;
    statisticsUsd = cifUsd * taxProfile.statisticsRate;
    baseVatUsd = cifUsd + importDutyUsd + statisticsUsd;
    vatUsd = baseVatUsd * taxProfile.vat;
    additionalVatUsd = baseVatUsd * taxProfile.additionalVat;
    earningsTaxUsd = baseVatUsd * taxProfile.earningsTax;
    grossIncomeTaxUsd = baseVatUsd * taxProfile.grossIncomeTax;
    taxesTotalUsd =
      importDutyUsd +
      statisticsUsd +
      vatUsd +
      additionalVatUsd +
      earningsTaxUsd +
      grossIncomeTaxUsd;
    totalEstimatedUsd = serviceCostUsd + taxesTotalUsd;
  }

  const notes = [GLOBAL_NOTES.estimatorDisclaimer, GLOBAL_NOTES.taxDisclaimer];

  if (isCourierService(serviceId)) {
    notes.push(
      `Para courier, el FOB total permitido es hasta USD ${COURIER_MAX_FOB_USD} y cada bulto no debe superar ${COURIER_MAX_UNIT_WEIGHT_KG} kg unitarios.`,
    );
  }

  if (serviceId === "air-courier") {
    notes.push("En courier aereo usamos el mayor entre peso real y peso volumetrico.");

    if (requiresManualQuote && manualQuoteMessage) {
      notes.push(`${manualQuoteMessage}. Para este peso necesitamos revisar la operacion manualmente.`);
    }

    if (courierFedEx && courierFedEx.altaDemandaUsd > 0) {
      notes.push("La alta demanda se toma como pass-through: suma venta y costo, pero no agrega margen.");
    }
  }

  if (serviceId === "maritime-courier") {
    notes.push(
      `En courier maritimo usamos el mayor entre peso bruto y la equivalencia de 1 m3 = ${MARITIME_COURIER_KG_PER_M3} kg, y sumamos un fijo de USD ${COURIER_MARITIME_FIXED_USD}.`,
    );
  }

  if (serviceId === "shared-import") {
    notes.push(
      `En importacion compartida usamos el mayor entre volumen real, la equivalencia de 1 tonelada = 1 m3 y un minimo facturable de ${SHARED_IMPORT_MIN_BILLABLE_M3} m3.`,
    );
  }

  if (formData.isTechProduct) {
    notes.push(GLOBAL_NOTES.techDisclaimer);
  }

  if (formData.hasEstimatedData) {
    notes.push("La simulacion incluye datos estimados informados por el cliente.");
  }

  return {
    service,
    taxProfile,
    isReady:
      Object.keys(validationErrors).length === 0 &&
      !(serviceId === "air-courier" && requiresManualQuote),
    requiresManualQuote,
    manualQuoteMessage,
    calculationBase,
    courierFedEx,
    volumes: {
      volumePerPackageM3,
      totalVolumeM3,
      sharedEquivalentVolumeM3,
      sharedChargeableVolumeM3,
    },
    weights: {
      grossWeightKg,
      averageUnitWeightKg,
      volumetricWeightKg,
      applicableWeightKg,
      maritimeEquivalentWeightKg,
      maritimeChargeableWeightKg,
    },
    costs: {
      fobUsd,
      serviceCostUsd,
      additionalChargesUsd,
      customsFreightUsd,
      insuranceUsd,
      cifUsd,
      baseVatUsd,
      taxesTotalUsd,
      totalEstimatedUsd,
    },
    taxes: {
      importDutyUsd,
      statisticsUsd,
      vatUsd,
      additionalVatUsd,
      earningsTaxUsd,
      grossIncomeTaxUsd,
    },
    notes,
  };
}
