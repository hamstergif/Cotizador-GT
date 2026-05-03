import {
  COURIER_MAX_FOB_USD,
  COURIER_MAX_UNIT_WEIGHT_KG,
  MARITIME_COURIER_KG_PER_M3,
  SHARED_IMPORT_KG_PER_M3,
} from "../utils/rates";

function InputField({
  field,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  helper,
  required = false,
  inputMode,
  step,
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">
        {label}
        {required ? <em>*</em> : null}
      </span>
      <input
        data-field={field}
        className={`form-input ${error ? "form-input--error" : ""}`}
        type={type}
        inputMode={inputMode}
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(field, event.target.value)}
      />
      {helper ? <span className="form-field__helper">{helper}</span> : null}
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}

function TextareaField({ field, label, value, onChange, error, placeholder, helper }) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <textarea
        data-field={field}
        className={`form-textarea ${error ? "form-input--error" : ""}`}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(field, event.target.value)}
      />
      {helper ? <span className="form-field__helper">{helper}</span> : null}
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}

function CheckboxField({ field, label, helper, checked, onChange }) {
  return (
    <label className="checkbox-card">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(field, event.target.checked)}
      />
      <span className="checkbox-card__content">
        <strong>{label}</strong>
        <span>{helper}</span>
      </span>
    </label>
  );
}

function QuoteForm({ service, formData, errors, onFieldChange }) {
  const hasErrors = Object.keys(errors).length > 0;
  const isCourierService =
    service.id === "air-courier" || service.id === "maritime-courier";

  return (
    <section className="form-panel">
      <div className="surface-card form-intro">
        <div>
          <p className="section-kicker">Paso 1</p>
          <h2>Completa los datos de tu operacion</h2>
        </div>
        <p>
          {service.description} Los valores son orientativos y el equipo de Global Trip
          valida cada caso antes de confirmar una cotizacion.
        </p>
        <div className="service-pill-row">
          <span className="service-pill">Tiempo estimado: {service.etaLabel}</span>
          <span className="service-pill">Moneda: USD</span>
        </div>

        {isCourierService ? (
          <p className="service-rule">
            Para courier, el FOB total no puede superar USD {COURIER_MAX_FOB_USD} y el peso
            promedio por bulto no puede superar {COURIER_MAX_UNIT_WEIGHT_KG} kg. Si algun
            bulto unitario supera ese limite, consultanos antes de avanzar.
          </p>
        ) : null}

        {service.id === "maritime-courier" ? (
          <p className="service-rule">
            En courier maritimo usamos la equivalencia 1 m3 = {MARITIME_COURIER_KG_PER_M3} kg
            para calcular el servicio.
          </p>
        ) : null}

        {service.id === "shared-import" ? (
          <p className="service-rule">
            En importacion compartida usamos la equivalencia 1 tonelada ={" "}
            {SHARED_IMPORT_KG_PER_M3} kg = 1 m3 para definir la base de calculo.
          </p>
        ) : null}
      </div>

      <form className="quote-form" onSubmit={(event) => event.preventDefault()}>
        {hasErrors ? (
          <div className="inline-alert">
            Revisa los campos marcados y los limites del servicio para poder copiar el
            resumen o enviar la consulta por WhatsApp.
          </div>
        ) : null}

        <fieldset className="surface-card form-section">
          <legend>Datos de contacto</legend>
          <div className="form-grid">
            <InputField
              field="fullName"
              label="Nombre y apellido"
              required
              value={formData.fullName}
              onChange={onFieldChange}
              error={errors.fullName}
              placeholder="Ej: Juan Perez"
            />
            <InputField
              field="company"
              label="Empresa"
              value={formData.company}
              onChange={onFieldChange}
              error={errors.company}
              placeholder="Ej: Comercial ABC"
            />
            <InputField
              field="whatsapp"
              label="WhatsApp"
              required
              value={formData.whatsapp}
              onChange={onFieldChange}
              error={errors.whatsapp}
              type="tel"
              placeholder="Ej: 11 2345 6789"
            />
            <InputField
              field="email"
              label="Email"
              value={formData.email}
              onChange={onFieldChange}
              error={errors.email}
              type="email"
              placeholder="Ej: compras@empresa.com"
            />
          </div>
        </fieldset>

        <fieldset className="surface-card form-section">
          <legend>Datos de la operacion</legend>
          <div className="form-grid">
            <InputField
              field="product"
              label="Producto a importar"
              required
              value={formData.product}
              onChange={onFieldChange}
              error={errors.product}
              placeholder="Ej: Repuestos electronicos"
            />
            <InputField
              field="originCountry"
              label="Pais de origen"
              required
              value={formData.originCountry}
              onChange={onFieldChange}
              error={errors.originCountry}
              placeholder="Ej: China"
            />
            <InputField
              field="originCityOrSupplier"
              label="Ciudad / proveedor de origen"
              value={formData.originCityOrSupplier}
              onChange={onFieldChange}
              error={errors.originCityOrSupplier}
              placeholder="Opcional"
              helper="Podes indicar ciudad, proveedor o ambos."
            />
            <InputField
              field="destinationArgentina"
              label="Destino en Argentina"
              required
              value={formData.destinationArgentina}
              onChange={onFieldChange}
              error={errors.destinationArgentina}
              placeholder="Ej: CABA"
            />
            <InputField
              field="productLink"
              label="Link del producto / proveedor"
              value={formData.productLink}
              onChange={onFieldChange}
              error={errors.productLink}
              type="url"
              placeholder="https://"
            />
            <InputField
              field="fobUsd"
              label="Valor FOB total en USD"
              required
              value={formData.fobUsd}
              onChange={onFieldChange}
              error={errors.fobUsd}
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Ej: 2500"
            />
          </div>
        </fieldset>

        <fieldset className="surface-card form-section">
          <legend>Datos logisticos</legend>
          <div className="form-grid form-grid--two">
            <InputField
              field="packageCount"
              label="Cantidad de bultos"
              required
              value={formData.packageCount}
              onChange={onFieldChange}
              error={errors.packageCount}
              type="number"
              inputMode="numeric"
              step="1"
              placeholder="Ej: 4"
            />
            <InputField
              field="grossWeightKg"
              label="Peso bruto total en kg"
              required
              value={formData.grossWeightKg}
              onChange={onFieldChange}
              error={errors.grossWeightKg}
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Ej: 38.5"
            />
            <InputField
              field="lengthCm"
              label="Largo en cm"
              required
              value={formData.lengthCm}
              onChange={onFieldChange}
              error={errors.lengthCm}
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Ej: 40"
            />
            <InputField
              field="widthCm"
              label="Ancho en cm"
              required
              value={formData.widthCm}
              onChange={onFieldChange}
              error={errors.widthCm}
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Ej: 30"
            />
            <InputField
              field="heightCm"
              label="Alto en cm"
              required
              value={formData.heightCm}
              onChange={onFieldChange}
              error={errors.heightCm}
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Ej: 25"
            />
          </div>

          <p className="section-helper">
            Usamos una sola linea de medidas promedio por bulto. Si no conoces un dato
            exacto, podes cargar un estimado y marcarlo debajo.
          </p>

          <div className="checkbox-stack">
            <CheckboxField
              field="isTechProduct"
              label="Mi producto es tecnologico o bien de capital"
              helper="Selecciona esta opcion solo si tu producto puede aplicar a una reduccion impositiva. Global Trip validara la clasificacion antes de confirmar la cotizacion."
              checked={formData.isTechProduct}
              onChange={onFieldChange}
            />

            <CheckboxField
              field="hasEstimatedData"
              label="Estoy cargando datos estimados"
              helper="Usa esta opcion si alguno de los datos aun no es exacto. El resumen lo va a dejar aclarado."
              checked={formData.hasEstimatedData}
              onChange={onFieldChange}
            />
          </div>
        </fieldset>

        <fieldset className="surface-card form-section">
          <legend>Observaciones</legend>
          <TextareaField
            field="observations"
            label="Observaciones"
            value={formData.observations}
            onChange={onFieldChange}
            error={errors.observations}
            placeholder="Podes sumar aclaraciones de producto, proveedor, documentacion o datos a validar."
            helper="Si algun dato es aproximado, tambien podes detallarlo aca."
          />
        </fieldset>
      </form>
    </section>
  );
}

export default QuoteForm;
