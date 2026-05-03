import { useState } from "react";
import logoFallback from "../assets/logo-fallback.svg";

function Header() {
  const [logoSource, setLogoSource] = useState("/logo-global-trip-wordmark.png");

  return (
    <header className="hero">
      <div className="hero__panel">
        <div className="hero__brand hero__brand--stacked">
          <img
            className="hero__logo hero__logo--wordmark"
            src={logoSource}
            alt="Global Trip"
            onError={() => setLogoSource(logoFallback)}
          />
          <p className="hero__microcopy">Comercio exterior y logistica internacional</p>
        </div>

        <div className="hero__content">
          <span className="hero__badge">Estimacion orientativa en USD</span>
          <h1 className="hero__title">Cotiza tu operacion de comercio exterior</h1>
          <p className="hero__subtitle">
            Completa los datos de tu carga y recibi una estimacion orientativa. Si te
            interesa avanzar, envianos la consulta por WhatsApp y nuestro equipo revisa tu
            operacion.
          </p>

          <div className="hero__signals">
            <div className="hero__signal">
              <strong>3 modalidades</strong>
              <span>Courier aereo, courier maritimo e importacion compartida.</span>
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
