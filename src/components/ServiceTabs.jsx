function ServiceTabs({ services, selectedService, onSelectService }) {
  return (
    <section className="tabs-section" aria-label="Tipos de servicio">
      <div className="tabs-grid">
        {services.map((service) => {
          const isActive = service.id === selectedService;

          return (
            <button
              key={service.id}
              className={`tab-card ${isActive ? "tab-card--active" : ""}`}
              type="button"
              onClick={() => onSelectService(service.id)}
            >
              <span className="tab-card__kicker">{service.shortLabel}</span>
              <strong className="tab-card__title">{service.title}</strong>
              <span className="tab-card__eta">{service.etaLabel}</span>
              <span className="tab-card__description">{service.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ServiceTabs;
