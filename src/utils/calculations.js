import {
  AIR_COURIER_RATE_TABLE,
  COURIER_MARITIME_USD_PER_KG,
  GLOBAL_NOTES,
  INSURANCE_RATE,
  SERVICES,
  SHARED_IMPORT_USD_PER_M3,
  TAX_PROFILES,
} from "./rates";
import { formatKg, formatM3 } from "./formatters";

const REQUIRED_TEXT_FIELDS = {
  fullName: "Ingresá tu nombre.",
  whatsapp: "Ingresá un WhatsApp de contacto.",
  product: "Indicá el producto a importar.",
  originCountry: "Indicá el país de origen.",
  destinationArgentina: "Indicá el destino en Argentina.",
};

const REQUIRED_NUMERIC_FIELDS = {
  fobUsd: "Ingresá un FOB mayor a 0.",
  packageCount: "Ingresá una cantidad de bultos mayor a 0.",
  grossWeightKg: "Ingresá un peso bruto mayor a 0.",
  lengthCm: "Ingresá un largo mayor a 0.",
  widthCm: "Ingresá un ancho mayor a 0.",
  heightCm: "Ingresá un alto mayor a 0.",
};

function hasText(value) {
  return String(value ?? "").trim().length > 0;
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

export function validateForm(formData) {
  const errors = {};

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

  if (hasText(formData.packageCount) && !Number.isInteger(toNumber(formData.packageCount))) {
    errors.packageCount = "La cantidad de bultos debe ser un número entero.";
  }

  if (hasText(formData.email)) {
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(formData.email).trim());

    if (!isValidEmail) {
      errors.email = "Ingresá un email válido o dejalo vacío.";
    }
  }

  return errors;
}

export function calculateQuote(serviceId, formData) {
  const service = getServiceById(serviceId);
  const taxProfile = getTaxProfile(serviceId, formData.isTechProduct);
  const validationErrors = validateForm(formData);

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
    serviceCostUsd = grossWeightKg * COURIER_MARITIME_USD_PER_KG;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatKg(grossWeightKg),
    };
  }

  if (serviceId === "shared-import") {
    serviceCostUsd = totalVolumeM3 * SHARED_IMPORT_USD_PER_M3;
    calculationBase = {
      label: service.calculationLabel,
      displayValue: formatM3(totalVolumeM3),
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

  if (formData.isTechProduct) {
    notes.push(GLOBAL_NOTES.techDisclaimer);
  }

  if (formData.hasEstimatedData) {
    notes.push("La simulación incluye datos estimados informados por el cliente.");
  }

  return {
    service,
    taxProfile,
    isReady: Object.keys(validationErrors).length === 0,
    calculationBase,
    volumes: {
      volumePerPackageM3,
      totalVolumeM3,
    },
    weights: {
      grossWeightKg,
      volumetricWeightKg,
      applicableWeightKg,
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
