import AppShell from '@/components/AppShell';
import ComparePage from '@/components/pages/ComparePage';
export function generateStaticParams() { return [{ type: 'largecap' }, { type: 'midcap' }]; }
export default function Page({ params }: { params: { type: string } }) {
  return <AppShell title={`${params.type === 'largecap' ? 'Large Cap' : 'Mid Cap'} Comparison`}><ComparePage type={params.type} /></AppShell>;
}
