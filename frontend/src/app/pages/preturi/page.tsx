import React from 'react';
import PricingClient from './pricing-client';

export const metadata = {
  title: 'Prețuri | AI Content Maker',
  description: 'Pachete și prețuri pentru generarea de conținut cu AI Content Maker',
};

// Forțăm pagina să fie complet statică
export const dynamic = 'force-static';

export default function PricingPage() {
  return <PricingClient />;
} 