import { GLOBAL_NOTES } from "../utils/rates";

function Disclaimer() {
  return (
    <section className="surface-card disclaimer-card">
      <p className="section-kicker">Aclaración visible</p>
      <h2>Información importante antes de avanzar</h2>
      <p className="disclaimer-card__copy">{GLOBAL_NOTES.estimatorDisclaimer}</p>
      <p className="disclaimer-card__copy">{GLOBAL_NOTES.techDisclaimer}</p>
      <p className="disclaimer-card__copy">{GLOBAL_NOTES.taxDisclaimer}</p>
    </section>
  );
}

export default Disclaimer;
