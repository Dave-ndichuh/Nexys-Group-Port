export interface Project {
  id: string;
  title: string;
  category: 'AI & Software' | 'Smart Habitats' | 'Physical Engineering' | 'Cultural Tech';
  brief: string;
  techStack: string[];
  bgGradient: string;
  stage: 'Concept' | 'In Market' | 'Scaling';
  region: string;
  thesis: string;
}

export const projects: Project[] = [
  {
    id: 'activeshifts',
    title: 'Active Shifts',
    category: 'AI & Software',
    brief: 'Workforce management SaaS engineered for scalable agentic workflows targeting the US market.',
    techStack: ['Next.js', 'Multi-Agent Frameworks', 'PostgreSQL'],
    bgGradient: 'from-slate-900 to-blue-900',
    stage: 'Scaling',
    region: 'Remote-first · US-focused',
    thesis:
      'Agentic workflows will redefine how distributed teams schedule, coordinate, and respond to demand in real time.',
  },
  {
    id: 'bomalink',
    title: 'BomaLink OS',
    category: 'Smart Habitats',
    brief: 'Off-grid intelligence. Integrating solar, water management, and smart OS tech for modern Kenyan coastal living.',
    techStack: ['IoT Sensors', 'Solar Architecture', 'React Native'],
    bgGradient: 'from-slate-800 to-emerald-900',
    stage: 'In Market',
    region: 'Kenyan coast · Rural & peri-urban',
    thesis:
      'Resilient living in emerging markets demands software-defined infrastructure that can thrive off-grid.',
  },
  {
    id: 'overland',
    title: 'Overland Engineering',
    category: 'Physical Engineering',
    brief: 'Custom vehicle builds (Jimny/Juke) designed for the harshest terrains with an unmistakable Gikuyu sage aesthetic.',
    techStack: ['Mechanical Fabrication', 'Off-Grid 12V Systems', 'Custom Suspension'],
    bgGradient: 'from-stone-800 to-orange-900',
    stage: 'In Market',
    region: 'East Africa · Overland & rural',
    thesis:
      'Precision engineering rooted in local knowledge builds machines that outlast generic global platforms.',
  },
  {
    id: 'unipost',
    title: 'UniPost',
    category: 'AI & Software',
    brief: 'Agentic social media management platform powered by autonomous workflows.',
    techStack: ['Python', 'LLM Agents', 'FastAPI'],
    bgGradient: 'from-indigo-900 to-purple-900',
    stage: 'Concept',
    region: 'Global · Content teams & agencies',
    thesis:
      'Small teams will compete with networks by orchestrating swarms of focused, brand-safe content agents.',
  },
  {
    id: 'lyra',
    title: 'Lyra',
    category: 'AI & Software',
    brief: 'Advanced AI audio processing and deep stem separation with automated talkbacks.',
    techStack: ['Audio API', 'Machine Learning', 'Python'],
    bgGradient: 'from-slate-900 to-pink-900',
    stage: 'In Market',
    region: 'Global · Creators & studios',
    thesis:
      'High-fidelity, AI-native audio tooling unlocks new forms of expression for artists and production teams.',
  },
  {
    id: 'gikuyu-api',
    title: 'Gikuyu Dictionary API',
    category: 'Cultural Tech',
    brief: 'Digitizing cultural heritage and linguistics for modern developer integration.',
    techStack: ['REST API', 'JSON', 'Linguistic DB'],
    bgGradient: 'from-slate-800 to-teal-900',
    stage: 'Concept',
    region: 'Mount Kenya region · Diaspora',
    thesis:
      'Encoding language and proverb-level knowledge as APIs keeps culture alive inside the tools of tomorrow.',
  },
];

export const categories = ['All', 'AI & Software', 'Smart Habitats', 'Physical Engineering', 'Cultural Tech'] as const;
