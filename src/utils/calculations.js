import { formatKg, formatM3 } from "./formatters";
import {
  AIR_COURIER_RATE_TABLE,
  COURIER_MARITIME_USD_PER_KG,
  COURIER_MAX_FOB_USD,
  COURIER_MAX_UNIT_WEIGHT_KG,
  GLOBAL_NOTES,
  INSURANCE_RATE,
  MARITIME_COURIER_KG_PER_M3,
  SERVICES,
  SHARED_IMPORT_KG_PER_M3,
  SHARED_IMPORT_USD_PER_M3,
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

function getServiceById(serviceId) {
  return SERVICES.find((service) => service.id === serviceId) ?? SERVICES[0];
}

function getTaxProfile(serviceId, isTechProduct) {
  return isTechProduct ? TAX_PROFILES.reduced[serviceId] : TAX_PROFILES.standard[serviceId];
}

function getAirPricing(applicableWeightKg) {
  if (applicableWeightKg <= 0) {
    return {
      bracket: AIR_COURIER_RATE_TABLE[0],
      serviceCostUsd: 0,
      usdPerKg: 0,
    };
  }

  const bracket =
    AIR_COURIER_RATE_TABLE.find((entry) => applicableWeightKg <= entry.maxKg) ??
    AIR_COURIER_RATE_TABLE[AIR_COURIER_RATE_TABLE.length - 1];

  return {
    bracket,
    usdPerKg: bracket.usdPerKg,
    serviceCostUsd: applicableWeightKg * bracket.usdPerKg,
  };
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

  const volumePerPackageM3 = (lengthCm * widthCm * heightCm) / 1000000;
  const totalVolumeM3 = volumePerPackageM3 * packageCount;
  const volumetricWeightKg = ((lengthCm * widthCm * heightCm) / 5000) * packageCount;
  const applicableWeightKg = Math.max(grossWeightKg, volumetricWeightKg);
  const averageUnitWeightKg = packageCount > 0 ? grossWeightKg / packageCount : 0;

  const maritimeEquivalentWeightKg = totalVolumeM3 * MARITIME_COURIER_KG_PER_M3;
  const maritimeChargeableWeightKg = Math.max(grossWeightKg, maritimeEquivalentWeightKg);

  const sharedEquivalentVolumeM3 = grossWeightKg / SHARED_IMPORT_KG_PER_M3;
  const sharedChargeableVolumeM3 = Math.max(totalVolumeM3, sharedEquivalentVolumeM3);

  let serviceCostUsd = 0;
  let calculationBase = {
    label: service.calculationLabel,
    displayValue: formatKg(applicableWeightKg),
  };

  if (serviceId === "air-courier") {
    serviceCostUsd = getAirPricing(applicableWeightKg).serviceCostUsd;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatKg(applicableWeightKg),
    };
  }

  if (serviceId === "maritime-courier") {
    serviceCostUsd = maritimeChargeableWeightKg * COURIER_MARITIME_USD_PER_KG;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatKg(maritimeChargeableWeightKg),
    };
  }

  if (serviceId === "shared-import") {
    serviceCostUsd = sharedChargeableVolumeM3 * SHARED_IMPORT_USD_PER_M3;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatM3(sharedChargeableVolumeM3),
    };
  }

  const insuranceUsd = (fobUsd + serviceCostUsd) * INSURANCE_RATE;
  const cifUsd = fobUsd + serviceCostUsd + insuranceUsd;
  const importDutyUsd = cifUsd * taxProfile.importDuty;
  const statisticsUsd = cifUsd * taxProfile.statisticsRate;
  const baseVatUsd = cifUsd + importDutyUsd + statisticsUsd;
  const vatUsd = baseVatUsd * taxProfile.vat;
  const additionalVatUsd = baseVatUsd * taxProfile.additionalVat;
  const earningsTaxUsd = baseVatUsd * taxProfile.earningsTax;
  const grossIncomeTaxUsd = baseVatUsd * taxProfile.grossIncomeTax;
  const totalEstimatedUsd =
    cifUsd +
    importDutyUsd +
    statisticsUsd +
    vatUsd +
    additionalVatUsd +
    earningsTaxUsd +
    grossIncomeTaxUsd;

  const notes = [GLOBAL_NOTES.estimatorDisclaimer, GLOBAL_NOTES.taxDisclaimer];

  if (isCourierService(serviceId)) {
    notes.push(
      `Para courier, el FOB total permitido es hasta USD ${COURIER_MAX_FOB_USD} y cada bulto no debe superar ${COURIER_MAX_UNIT_WEIGHT_KG} kg unitarios.`,
    );
  }

  if (serviceId === "air-courier") {
    notes.push("En courier aereo usamos el mayor entre peso real y peso volumetrico.");
  }

  if (serviceId === "maritime-courier") {
    notes.push(
      `En courier maritimo usamos el mayor entre peso bruto y la equivalencia de 1 m3 = ${MARITIME_COURIER_KG_PER_M3} kg.`,
    );
  }

  if (serviceId === "shared-import") {
    notes.push("En importacion compartida usamos el mayor entre volumen real y la equivalencia de 1 tonelada = 1 m3.");
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
    isReady: Object.keys(validationErrors).length === 0,
    calculationBase,
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
      insuranceUsd,
      cifUsd,
      baseVatUsd,
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
