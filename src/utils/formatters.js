function safeNumber(value) {
  return Number.isFinite(value) ? value : 0;
}

export function formatUsd(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeNumber(value));
}

export function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safeNumber(value));
}

export function formatKg(value) {
  return `${formatNumber(value, 2)} kg`;
}

export function formatM3(value) {
  return `${formatNumber(value, 3)} m3`;
}

export function formatPercent(value) {
  return `${formatNumber(safeNumber(value) * 100, 1)}%`;
}

export function formatDimensions(length, width, height) {
  const hasValues = [length, width, height].some((item) => String(item ?? "").trim().length > 0);

  if (!hasValues) {
    return "No informado";
  }

  const parts = [length, width, height].map((item) => {
    const normalized = Number(String(item ?? "").replace(",", "."));
    return Number.isFinite(normalized) && normalized > 0 ? formatNumber(normalized, 2) : "0,00";
  });

  return `${parts[0]} x ${parts[1]} x ${parts[2]} cm`;
}

export function formatOptionalText(value, fallback = "No informado") {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : fallback;
}

export function formatYesNo(value) {
  return value ? "Si" : "No";
}
