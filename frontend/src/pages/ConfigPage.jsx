import TopNavBar from '../components/layout/TopNavBar.jsx';
import UsersSection from '../components/config/UsersSection.jsx';
import TechniciansSection from '../components/config/TechniciansSection.jsx';
import CapacitySettingsSection from '../components/config/CapacitySettingsSection.jsx';
import StatusMappingsSection from '../components/config/StatusMappingsSection.jsx';

export default function ConfigPage() {
  return (
    <div className="min-h-screen text-on-surface">
      <TopNavBar />

      <main className="mx-auto flex max-w-container-max flex-col gap-gutter px-margin-desktop py-12">
        <h1 className="font-headline-lg text-headline-lg text-primary">Configuración</h1>
        <UsersSection />
        <TechniciansSection />
        <CapacitySettingsSection />
        <StatusMappingsSection />
      </main>
    </div>
  );
}
