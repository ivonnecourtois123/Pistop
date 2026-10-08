import { useState } from 'react';
import TopNavBar from '../components/layout/TopNavBar.jsx';
import ExecutiveKpiDashboard from '../components/reports/ExecutiveKpiDashboard.jsx';
import StageDurationsReport from '../components/reports/StageDurationsReport.jsx';
import CapacityDashboard from '../components/reports/CapacityDashboard.jsx';
import { GROUP_BRANDS, DEFAULT_AGENCIES } from '../constants/immobilized.js';

const REPORT_TABS = [
  { key: 'executive', label: 'Tablero Central KPIs', icon: 'dashboard' },
  { key: 'tpe', label: 'TPE y Tiempos por Etapa', icon: 'timer' },
  { key: 'capacity', label: 'Capacidad Instalada MO', icon: 'engineering' },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('executive');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [agencyFilter, setAgencyFilter] = useState('ALL');

  return (
    <div className="min-h-screen text-on-surface">
      <TopNavBar />

      <main className="mx-auto flex max-w-container-max flex-col gap-gutter px-margin-desktop py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-2xl" data-icon="bar_chart">bar_chart</span>
            </span>
            <div>
              <h1 className="font-headline-lg text-2xl font-black text-primary">Reportes y KPIs</h1>
              <p className="font-body-md text-xs text-on-surface-variant">
                Métricas ejecutivas de taller, tiempos promedio (TPE), capacidad de mano de obra y refacciones.
              </p>
            </div>
          </div>

          {/* Filtros de Marca y Sucursal */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="font-label-caps text-[10px] text-on-surface-variant">MARCA:</span>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-label-caps text-[11px] text-primary focus:border-primary focus:outline-none"
              >
                <option value="ALL">Todas las marcas</option>
                {GROUP_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-label-caps text-[10px] text-on-surface-variant">AGENCIA:</span>
              <select
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="rounded-lg border border-outline-variant bg-white px-2.5 py-1 font-label-caps text-[11px] text-primary focus:border-primary focus:outline-none"
              >
                <option value="ALL">Todas las agencias</option>
                {DEFAULT_AGENCIES.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pestañas de Reportes */}
        <div className="flex flex-wrap border-b border-outline-variant">
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 font-label-caps text-xs font-bold transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de la pestaña activa */}
        <div className="pt-2">
          {activeTab === 'executive' && <ExecutiveKpiDashboard />}
          {activeTab === 'tpe' && <StageDurationsReport />}
          {activeTab === 'capacity' && <CapacityDashboard />}
        </div>
      </main>
    </div>
  );
}

