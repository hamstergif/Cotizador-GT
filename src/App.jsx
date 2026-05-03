import { useDeferredValue, useState } from "react";
import Disclaimer from "./components/Disclaimer";
import Header from "./components/Header";
import QuoteForm from "./components/QuoteForm";
import QuoteResult from "./components/QuoteResult";
import ServiceTabs from "./components/ServiceTabs";
import { calculateQuote, validateForm } from "./utils/calculations";
import { SERVICES } from "./utils/rates";
import { buildWhatsAppLink, buildWhatsAppMessage } from "./utils/whatsapp";

const INITIAL_FORM_DATA = {
  fullName: "",
  company: "",
  whatsapp: "",
  email: "",
  product: "",
  originCountry: "",
  originCityOrSupplier: "",
  destinationArgentina: "",
  productLink: "",
  fobUsd: "",
  packageCount: "",
  grossWeightKg: "",
  lengthCm: "",
  widthCm: "",
  heightCm: "",
  isTechProduct: false,
  hasEstimatedData: false,
  observations: "",
};

function App() {
  const [selectedService, setSelectedService] = useState(SERVICES[0].id);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState({});
  const [copyState, setCopyState] = useState("idle");

  const deferredFormData = useDeferredValue(formData);
  const quote = calculateQuote(selectedService, deferredFormData);

  const updateField = (field, value) => {
    setFormData((previousData) => {
      const nextData = { ...previousData, [field]: value };

      if (Object.keys(errors).length > 0) {
        setErrors(validateForm(nextData));
      }

      return nextData;
    });
  };

  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
  };

  const ensureValidForm = () => {
    const nextErrors = validateForm(formData);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleWhatsAppClick = () => {
    if (!ensureValidForm()) {
      return;
    }

    const currentQuote = calculateQuote(selectedService, formData);
    const whatsappLink = buildWhatsAppLink(formData, currentQuote);
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  const handleCopySummary = async () => {
    if (!ensureValidForm()) {
      return;
    }

    try {
      const currentQuote = calculateQuote(selectedService, formData);
      await navigator.clipboard.writeText(buildWhatsAppMessage(formData, currentQuote));
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2200);
    } catch (error) {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2200);
    }
  };

  const activeService = SERVICES.find((service) => service.id === selectedService) ?? SERVICES[0];

  return (
    <div className="app-shell">
      <div className="page">
        <Header />

        <ServiceTabs
          services={SERVICES}
          selectedService={selectedService}
          onSelectService={handleServiceChange}
        />

        <main className="workspace">
          <QuoteForm
            service={activeService}
            formData={formData}
            errors={errors}
            onFieldChange={updateField}
          />

          <QuoteResult
            quote={quote}
            formData={formData}
            copyState={copyState}
            onWhatsAppClick={handleWhatsAppClick}
            onCopyClick={handleCopySummary}
          />
        </main>

        <Disclaimer />
      </div>
    </div>
  );
}

export default App;
