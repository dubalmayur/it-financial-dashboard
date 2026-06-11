import AppShell from '@/components/AppShell';
import CompanyPage from '@/components/pages/CompanyPage';
import { COMPANIES } from '@/lib/data';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return COMPANIES.map(c => ({ id: c.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  const company = COMPANIES.find(c => c.id === params.id);
  if (!company) return notFound();
  return <AppShell title={`${company.shortName} — ${company.theme}`}><CompanyPage companyId={params.id} /></AppShell>;
}
