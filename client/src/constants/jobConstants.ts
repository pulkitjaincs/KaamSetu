import { Coffee, Sparkles, Truck, Building2, HeartPulse, Store, Calendar, Settings, PenTool, ShieldCheck } from 'lucide-react';

export const JOB_CATEGORIES = [
    { name: 'Food & Hospitality', icon: Coffee },
    { name: 'Cleaning', icon: Sparkles },
    { name: 'Logistics', icon: Truck },
    { name: 'Construction', icon: Building2 },
    { name: 'Healthcare', icon: HeartPulse },
    { name: 'Retail', icon: Store },
    { name: 'Events', icon: Calendar },
    { name: 'Manufacturing', icon: Settings },
    { name: 'Maintenance', icon: PenTool },
    { name: 'Security', icon: ShieldCheck }
];

export const CATEGORY_OPTIONS = JOB_CATEGORIES.map(cat => ({
    label: cat.name,
    value: cat.name
}));
