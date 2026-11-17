import type { Metadata } from 'next';
import StyleguideClient from './StyleguideClient';

export const metadata: Metadata = {
  title: 'Styleguide — Aure',
  robots: { index: false, follow: false },
};

export default function StyleguidePage() {
  return <StyleguideClient />;
}
