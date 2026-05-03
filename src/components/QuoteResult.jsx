import {
  formatDimensions,
  formatKg,
  formatM3,
  formatPercent,
  formatUsd,
} from "../utils/formatters";

function ResultRow({ label, value, highlight = false }) {
  return (
    <div className={`result-row ${highlight ? "result-row--highlight" : ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function QuoteResult({ quote, formData, copyState, onWhatsAppClick, onCopyClick }) {
  const copyButtonLabel =
    copyState === "copied"
      ? "Resumen copiado"
      : copyState === "error"
        ? "No se pudo copiar"
        : "Copiar resumen";

  return (
    <aside className="result-panel">
      <div className="surface-card result-card">
        <div className="result-card__header">
          <div>
            <p className="section-kicker">Paso 2</p>
            <h2>Estimacion orientativa</h2>
          </div>
          <span className={`status-chip ${quote.isReady ? "status-chip--ready" : ""}`}>
            {quote.isReady ? "Lista para enviar" : "Revisar datos y limites"}
          </span>
        </div>

        <p className="result-card__lead">
          {quote.isReady
            ? "Ya podes copiar el resumen o enviarlo por WhatsApp para que Global Trip revise la operacion."
            : "Mientras completas el formulario, la estimacion se actualiza en tiempo real."}
        </p>

        <div className="metric-grid">
          <div className="metric-box">
            <span>Servicio</span>
            <strong>{quote.service.title}</strong>
          </div>
          <div className="metric-box">
            <span>Tiempo estimado</span>
            <strong>{quote.service.etaLabel}</strong>
          </div>
          <div className="metric-box">
            <span>{quote.calculationBase.label}</span>
            <strong>{quote.calculationBase.displayValue}</strong>
          </div>
          <div className="metric-box metric-box--accent">
            <span>Total estimado</span>
            <strong>{formatUsd(quote.costs.totalEstimatedUsd)}</strong>
          </div>
        </div>

        <div className="result-section">
          <h3>Datos logisticos usados</h3>
          <ResultRow label="Peso bruto total" value={formatKg(quote.weights.grossWeightKg)} />
          <ResultRow
            label="Peso promedio por bulto"
            value={formatKg(quote.weights.averageUnitWeightKg)}
          />
          <ResultRow label="Volumen total" value={formatM3(quote.volumes.totalVolumeM3)} />

          {quote.service.id === "air-courier" ? (
            <>
              <ResultRow
                label="Peso volumetrico"
                value={formatKg(quote.weights.volumetricWeightKg)}
              />
              <ResultRow
                label="Peso aplicable"
                value={formatKg(quote.weights.applicableWeightKg)}
              />
            </>
          ) : null}

          {quote.service.id === "maritime-courier" ? (
            <>
              <ResultRow
                label="Peso equivalente por volumen (1 m3 = 200 kg)"
                value={formatKg(quote.weights.maritimeEquivalentWeightKg)}
              />
              <ResultRow
                label="Peso de calculo maritimo"
                value={formatKg(quote.weights.maritimeChargeableWeightKg)}
              />
            </>
          ) : null}

          {quote.service.id === "shared-import" ? (
            <>
              <ResultRow
                label="Volumen equivalente por peso (1 tn = 1 m3)"
                value={formatM3(quote.volumes.sharedEquivalentVolumeM3)}
              />
              <ResultRow
                label="Base de calculo compartida"
                value={formatM3(quote.volumes.sharedChargeableVolumeM3)}
              />
            </>
          ) : null}

          <ResultRow
            label="Medidas por bulto"
            value={formatDimensions(formData.lengthCm, formData.widthCm, formData.heightCm)}
          />
        </div>

        <div className="result-section">
          <h3>Desglose estimado</h3>
          <ResultRow label="FOB" value={formatUsd(quote.costs.fobUsd)} />
          <ResultRow
            label="Costo logistico / servicio"
            value={formatUsd(quote.costs.serviceCostUsd)}
          />
          <ResultRow label="Seguro estimado" value={formatUsd(quote.costs.insuranceUsd)} />
          <ResultRow label="CIF" value={formatUsd(quote.costs.cifUsd)} />
          <ResultRow label="Base IVA" value={formatUsd(quote.costs.baseVatUsd)} />
        </div>

        <div className="result-section">
          <h3>Impuestos estimados</h3>
          <ResultRow
            label={`Derechos de importacion (${formatPercent(quote.taxProfile.importDuty)})`}
            value={formatUsd(quote.taxes.importDutyUsd)}
          />
          <ResultRow
            label={`Tasa de estadistica (${formatPercent(quote.taxProfile.statisticsRate)})`}
            value={formatUsd(quote.taxes.statisticsUsd)}
          />
          <ResultRow
            label={`IVA (${formatPercent(quote.taxProfile.vat)})`}
            value={formatUsd(quote.taxes.vatUsd)}
          />
          {quote.service.id === "shared-import" ? (
            <>
              <ResultRow
                label={`IVA adicional (${formatPercent(quote.taxProfile.additionalVat)})`}
                value={formatUsd(quote.taxes.additionalVatUsd)}
              />
              <ResultRow
                label={`Ganancias (${formatPercent(quote.taxProfile.earningsTax)})`}
                value={formatUsd(quote.taxes.earningsTaxUsd)}
              />
              <ResultRow
                label={`Ingresos Brutos (${formatPercent(quote.taxProfile.grossIncomeTax)})`}
                value={formatUsd(quote.taxes.grossIncomeTaxUsd)}
              />
            </>
          ) : null}
          <ResultRow
            label="Total estimado en USD"
            value={formatUsd(quote.costs.totalEstimatedUsd)}
            highlight
          />
        </div>

        <div className="result-section">
          <h3>Aclaraciones importantes</h3>
          <ul className="note-list">
            {quote.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="result-actions">
          <button className="btn btn--primary" type="button" onClick={onWhatsAppClick}>
            Enviar consulta por WhatsApp
          </button>
          <button className="btn btn--secondary" type="button" onClick={onCopyClick}>
            {copyButtonLabel}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default QuoteResult;
