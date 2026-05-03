import { useState } from "react";
import logoFallback from "../assets/logo-fallback.svg";

function Header() {
  const [logoSource, setLogoSource] = useState("/logo-global-trip.svg");

  return (
    <header className="hero">
      <div className="hero__panel">
        <div className="hero__brand">
          <img
            className="hero__logo"
            src={logoSource}
            alt="Global Trip"
            onError={() => setLogoSource(logoFallback)}
          />
          <div>
            <p className="hero__eyebrow">Global Trip</p>
            <p className="hero__microcopy">Comercio exterior y logística internacional</p>
          </div>
        </div>

        <div className="hero__content">
          <span className="hero__badge">Estimación orientativa en USD</span>
          <h1 className="hero__title">Cotizá tu operación de comercio exterior</h1>
          <p className="hero__subtitle">
            Completá los datos de tu carga y recibí una estimación orientativa. Si te
            interesa avanzar, envianos la consulta por WhatsApp y nuestro equipo revisa tu
            operación.
          </p>

          <div className="hero__signals">
            <div className="hero__signal">
              <strong>3 modalidades</strong>
              <span>Courier aéreo, courier marítimo e importación compartida.</span>
            </div>
            <div className="hero__signal">
              <strong>Flujo simple</strong>
              <span>Sin login, sin guardado y con cierre directo por WhatsApp.</span>
            </div>
            <div className="hero__signal">
              <strong>Lenguaje claro</strong>
              <span>Costos e impuestos separados para que la lectura sea inmediata.</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
