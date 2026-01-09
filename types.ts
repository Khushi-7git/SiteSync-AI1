
export enum OnboardingStage {
  BLUEPRINT_SYNC = 'BLUEPRINT_SYNC',
  LIVE_WALKTHROUGH = 'LIVE_WALKTHROUGH',
  GENERATIVE_VISUALIZATION = 'GENERATIVE_VISUALIZATION'
}

export interface Hazard {
  id: string;
  room: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  coordinates: { x: number; y: number };
}

export interface SiteReport {
  id: string;
  timestamp: string;
  type: 'RFI' | 'Audit' | 'Safety';
  status: 'Draft' | 'Sent';
  summary: string;
}

export interface UserLanguage {
  code: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: UserLanguage[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'zh', name: '中文' }
];

export const TRANSLATIONS: Record<string, any> = {
  en: {
    title: "VIBE.SYSTEMS",
    subtitle: "Site Intelligence v4.2",
    calibration: "Calibration",
    audit: "Structural Audit",
    rendering: "Vibe Rendering",
    issueRfi: "Issue RFI",
    protocol: "Start Audit",
    credential: "Credential",
    region: "Region",
    placeholder: "What visual intent should we apply?",
    generate: "Generate",
    rendering_tx: "Rendering",
    sync_progress: "Global Sync",
    archive: "Archive Ledger",
    rfi_title: "REQUEST FOR INFORMATION",
    confirm_dispatch: "Confirm & Dispatch",
    operational_workflow: "Operational Workflow",
    live_intelligence: "Live Intelligence",
    analytic_log: "Analytic Log",
    help_tip: "Help Me Operate",
    next_step: "Next Step",
    sync_btn: "Sync Datum",
    lock_btn: "Lock Alignment",
    coach_tip: "Tip: Align the reticle with a vertical door frame for 99% calibration accuracy."
  },
  es: {
    title: "VIBE.SISTEMAS",
    subtitle: "Inteligencia de Sitio v4.2",
    calibration: "Calibración",
    audit: "Auditoría Estructural",
    rendering: "Renderizado Vibe",
    issueRfi: "Emitir RFI",
    protocol: "Iniciar Auditoría",
    credential: "Credencial",
    region: "Región",
    placeholder: "¿Qué intención visual debemos aplicar?",
    generate: "Generar",
    rendering_tx: "Renderizando",
    sync_progress: "Sincronización Global",
    archive: "Libro de Archivos",
    rfi_title: "SOLICITUD DE INFORMACIÓN",
    confirm_dispatch: "Confirmar y Enviar",
    operational_workflow: "Flujo Operativo",
    live_intelligence: "Inteligencia en Vivo",
    analytic_log: "Registro Analítico",
    help_tip: "Ayuda de Operación",
    next_step: "Próximo Paso",
    sync_btn: "Sincronizar Datum",
    lock_btn: "Bloquear Alineación",
    coach_tip: "Consejo: Alinea la retícula con el marco de una puerta para un 99% de precisión."
  }
};
