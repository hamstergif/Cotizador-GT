# Global Trip Cotizador

Primera versión del cotizador web de Global Trip, desarrollada con React + Vite.

## Requisitos

- Node.js 20 o superior
- npm

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

## Configuración comercial

Los valores editables están centralizados en:

- `src/utils/rates.js`

Ahí podés ajustar:

- número de WhatsApp
- tarifa de seguro
- costo marítimo por kg
- costo de importación compartida por m3
- alícuotas normales y reducidas
- tabla de tarifas de courier aéreo

## Logo

La app intenta cargar el logo real desde:

- `public/logo-global-trip.svg`

Si ese archivo no existe, usa un logo vectorial de fallback para que el proyecto siga funcionando.

## Nota sobre la tarifa aérea

Como en este workspace no había un Excel cargado al momento de desarrollar, la tabla aérea en `src/utils/rates.js` quedó armada como estructura editable de referencia. Cuando agregues el Excel real, podés reemplazar esos valores sin tocar los componentes.
