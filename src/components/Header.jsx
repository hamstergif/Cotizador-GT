import { useState } from "react";
import logoFallback from "../assets/logo-fallback.svg";

function Header() {
  const [logoSource, setLogoSource] = useState("/logo-global-trip-box.png");

  return (
    <header className="hero">
      <div className="hero__panel">
        <div className="hero__brand hero__brand--lockup">
          <img
            className="hero__symbol"
            src={logoSource}
            alt="Global Trip"
            onError={() => setLogoSource(logoFallback)}
          />

          <div className="hero__wordmark">
            <p className="hero__wordmark-title">GlobalTrip</p>
            <span className="hero__wordmark-divider" />
            <p className="hero__wordmark-subtitle">COMERCIO EXTERIOR</p>
          </div>
        </div>

        <div className="hero__content">
          <span className="hero__badge">Estimacion orientativa en USD</span>
          <h1 className="hero__title">Cotiza tu importacion</h1>
          <p className="hero__subtitle">
            Completa los datos de tu carga y recibi una estimacion orientativa. Si te
            interesa avanzar, envianos la consulta por WhatsApp y nuestro equipo revisa tu
            operacion.
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
