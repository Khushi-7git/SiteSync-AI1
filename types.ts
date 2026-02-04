export enum OnboardingStage {
  BLUEPRINT_SYNC = 'BLUEPRINT_SYNC',
  LIVE_WALKTHROUGH = 'LIVE_WALKTHROUGH',
  GENERATIVE_VISUALIZATION = 'GENERATIVE_VISUALIZATION'
}

export interface ProjectDetails {
  userName: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  constructorName: string;
  constructorEmail: string;
}

export interface DesignIteration {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface Hazard {
  id: string;
  room: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  coordinates: { x: number; y: number };
}

export interface MissingWorkElement {
  id: string;
  task: string;
  trade: 'Structural' | 'MEP' | 'Finishes' | 'Safety';
  coordinates: { x: number; y: number };
}

export interface RFI {
  id: string;
  issue: string;
  location: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  status: 'SENT_TO_SLACK' | 'PENDING' | 'DISPATCHED_TO_SAFETY';
  safetyEmail?: string;
  siteDetails?: string;
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

export const DESIGN_THEMES = [
  { id: 'brutalist', label: 'Brutalist Raw', prompt: 'Raw concrete, geometric forms, exposed structural elements, high contrast industrial lighting' },
  { id: 'scandinavian', label: 'Nordic Clean', prompt: 'Light oak wood, white plaster walls, clean lines, airy feel, minimalist furniture' },
  { id: 'industrial', label: 'Loft Industrial', prompt: 'Exposed brick, black steel beams, copper accents, warm Edison bulb lighting' },
  { id: 'biophilic', label: 'Biophilic Green', prompt: 'Vertical gardens, natural stone, organic textures, sunlight filtration through leaves' }
];

export const ARCH_PALETTES = [
  { name: 'Sienna Earth', colors: ['#A44A3F', '#F2EFEA'], prompt: 'terracotta and warm clay tones' },
  { name: 'Industrial Zinc', colors: ['#71717A', '#18181B'], prompt: 'brushed metal and charcoal finishes' },
  { name: 'Nordic Pine', colors: ['#D4A373', '#FAF9F6'], prompt: 'light wood and eggshell white' },
  { name: 'Midnight Slate', colors: ['#2D241E', '#8B5E3C'], prompt: 'dark stone and leather textures' }
];

export const TRANSLATIONS: Record<string, any> = {
  en: {
    title: "SITESYNC AI",
    subtitle: "Site Intelligence v4.2",
    design_lab: "Design Lab",
    compare: "Compare Mode",
    iterate: "Refine Design",
    upload_ref: "Reference Image",
    theme_select: "Style Preset",
    color_suggest: "Architectural Palettes",
    placeholder: "Describe the architectural change...",
    operational_workflow: "Operational Workflow",
    calibration: "Spatial Calibration",
    audit: "Live Site Audit",
    rendering: "Generative Rendering",
    lock_btn: "Lock Spatial Datum",
    help_tip: "Help Me Operate",
    next_step: "Initiate Audit",
    blueprint_sync: "Blueprint Ingestion",
    sync_btn: "Sync PDF / BIM File",
    thought_signatures: "Thought Signatures",
    slack_rfi: "Slack RFI Ledger",
    sending: "Broadcasting to #site-updates...",
    guide_calibration: "Datum Sync: Align physical floor to BIM ledger.",
    guide_audit: "Live Audit: Real-time hazard & MEP clash detection.",
    guide_design: "Design Lab: Transform site with AI-renders and iterations.",
    guide_compare: "Slider: Drag to see before vs. after.",
    close: "Dismiss Guide",
    missing_work: "Construction Delta",
    build_progress: "Physical Build Progress",
    safety_ledger: "Safety Dispatches",
    auto_dispatch_status: "Auto-Fed Site Intelligence"
  }
};