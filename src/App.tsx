/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Lightbulb, 
  Droplets, 
  Settings, 
  ArrowUpRight,
  Info,
  Layers,
  MapPin,
  Clock,
  Plus,
  Trash2,
  FileText,
  Menu,
  X,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Consolidated Types
type AppSection = 'dashboard' | 'lighting' | 'hydraulic' | 'electrical';

interface RoomLightingTask {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  targetLux: number;
  lampLumens: number;
  maintenanceFactor: number; // Factor k
  utilizationFactor: number; // Factor u
}

interface HydraulicTask {
  id: string;
  name: string;
  occupants: number;
  daysReserve: number;
  consumptionPerDay: number;
}

interface ElectricalCircuit {
  id: string;
  name: string;
  power: number;
  voltage: number;
  powerFactor: number;
  length: number;
}

interface TaskHistory {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'MODIFIED' | 'STORED' | 'ERROR';
}

// Consolidated Constants
const LUX_STANDARDS = [
  { label: 'Depósitos/Arquivos', value: 200 },
  { label: 'Circulação/Corredores', value: 100 },
  { label: 'Escritórios (Geral)', value: 500 },
  { label: 'Cozinhas', value: 300 },
  { label: 'Banheiros', value: 200 },
  { label: 'Salas de Aula', value: 300 },
  { label: 'Oficinas', value: 500 },
];

const HYDRAULIC_CONSUMPTION = [
  { label: 'Apartamento de luxo', value: 300 },
  { label: 'Apartamento Médio', value: 200 },
  { label: 'Casa Popular', value: 150 },
  { label: 'Escritórios', value: 50 },
  { label: 'Escolas', value: 50 },
  { label: 'Hotéis (com café)', value: 250 },
];

const CONDUCTOR_RECORDS = [
  { section: 1.5, current: 15.5 },
  { section: 2.5, current: 21 },
  { section: 4, current: 28 },
  { section: 6, current: 36 },
  { section: 10, current: 50 },
  { section: 16, current: 68 },
  { section: 25, current: 89 },
  { section: 35, current: 110 },
  { section: 50, current: 134 },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [lightingTasks, setLightingTasks] = useState<RoomLightingTask[]>([
    {
      id: '1',
      name: 'Sala de Estudo - Fortaleza',
      length: 5,
      width: 4,
      height: 2.8,
      targetLux: 300,
      lampLumens: 1600,
      maintenanceFactor: 0.8,
      utilizationFactor: 0.6
    }
  ]);

  const [hydroTasks, setHydroTasks] = useState<HydraulicTask[]>([
    {
      id: '1',
      name: 'Residência Eusébio',
      occupants: 5,
      daysReserve: 2,
      consumptionPerDay: 200
    }
  ]);

  const [electricalCircuits, setElectricalCircuits] = useState<ElectricalCircuit[]>([
    {
      id: '1',
      name: 'Circuito 1 - Tomadas Geral',
      power: 2200,
      voltage: 220,
      powerFactor: 0.95,
      length: 15
    }
  ]);

  const stats = useMemo(() => ({
    lighting: lightingTasks.length,
    hydraulic: hydroTasks.length,
    electrical: electricalCircuits.length,
    active: lightingTasks.length + hydroTasks.length + electricalCircuits.length
  }), [lightingTasks, hydroTasks, electricalCircuits]);

  const [history] = useState<TaskHistory[]>([
    { id: '1', action: 'CALC_INIT', target: 'RESID_EUSEBIO', timestamp: '15:12', status: 'SUCCESS' },
    { id: '2', action: 'UPDATE', target: 'SALA_ESTUDO_FOR', timestamp: '14:45', status: 'MODIFIED' },
    { id: '3', action: 'REPORT_GEN', target: 'OBRA_124_PDF', timestamp: '11:30', status: 'STORED' },
    { id: '4', action: 'CALC_INIT', target: 'APT_COCO_02', timestamp: '10:20', status: 'SUCCESS' },
    { id: '5', action: 'VAL_CHECK', target: 'NBR_8995_REV', timestamp: '09:15', status: 'SUCCESS' },
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-orange-500/30">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl z-30"
          >
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center font-black text-lg">E</div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">EngOfice</h1>
                  <div className="flex items-center gap-1.5 text-[9px] text-orange-500 font-mono font-bold tracking-tighter">
                    <MapPin size={8} /> CEARÁ REGIONAL
                  </div>
                </div>
              </div>
            </div>

            <nav className="flex-1 py-8 px-4 space-y-1">
              <NavButton icon={<LayoutDashboard size={20} />} label="Início" active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
              <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Módulos Técnicos</div>
              <NavButton icon={<Lightbulb size={20} />} label="Luminotécnico" active={activeSection === 'lighting'} onClick={() => setActiveSection('lighting')} />
              <NavButton icon={<Droplets size={20} />} label="Hidráulico" active={activeSection === 'hydraulic'} onClick={() => setActiveSection('hydraulic')} />
              <NavButton icon={<Zap size={20} />} label="Elétrico" active={activeSection === 'electrical'} onClick={() => setActiveSection('electrical')} />
              <div className="pt-4 pb-2 px-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Arquivo</div>
              <NavButton icon={<FileText size={20} />} label="Relatórios" active={false} onClick={() => {}} />
            </nav>

            <div className="p-6 border-t border-slate-800">
               <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-orange-200">SERVER_ACTIVE: CE-01</span>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <header className="sticky top-0 z-20 h-16 glass flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-md transition-colors text-slate-400"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-500">ENG_HUB</span>
              <span className="text-slate-700">/</span>
              <span className="text-orange-500 font-bold uppercase">{activeSection}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <Clock size={12} className="text-orange-500" />
              {new Date().toLocaleDateString('pt-BR')}
            </div>
            <button className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Settings size={14} />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {activeSection === 'dashboard' && <Dashboard stats={stats} history={history} onNavigate={setActiveSection} />}
              {activeSection === 'lighting' && <LightingModule tasks={lightingTasks} setTasks={setLightingTasks} />}
              {activeSection === 'hydraulic' && <HydraulicModule tasks={hydroTasks} setTasks={setHydroTasks} />}
              {activeSection === 'electrical' && <ElectricalModule circuits={electricalCircuits} setCircuits={setElectricalCircuits} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all group
        ${active ? 'bg-orange-600 text-white shadow-lg shadow-orange-950/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
      `}
    >
      <span className={active ? 'text-white' : 'text-slate-500 group-hover:text-orange-400 transition-colors'}>{icon}</span>
      <span className="font-semibold">{label}</span>
      {active && <motion.div layoutId="nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
    </button>
  );
}

function Dashboard({ stats, history, onNavigate }: { stats: any, history: TaskHistory[], onNavigate: (s: AppSection) => void }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BannerCard 
          title="Módulo Luz" 
          value={stats.lighting} 
          subtitle="Cálculos Lúmen" 
          color="bg-amber-500" 
          icon={<Lightbulb />}
          onClick={() => onNavigate('lighting')}
        />
        <BannerCard 
          title="Módulo Hidro" 
          value={stats.hydraulic} 
          subtitle="Reservatórios" 
          color="bg-blue-600" 
          icon={<Droplets />}
          onClick={() => onNavigate('hydraulic')}
        />
        <BannerCard 
          title="Módulo Elétrico" 
          value={stats.electrical} 
          subtitle="Circuitos Ativos" 
          color="bg-purple-600" 
          icon={<Zap />}
          onClick={() => onNavigate('electrical')}
        />
        <BannerCard 
          title="Consolidado" 
          value={stats.active} 
          subtitle="Processamento" 
          color="bg-emerald-600" 
          icon={<Layers />}
          onClick={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionBox title="Normas vigentes (CE)" icon={<Info className="text-orange-500" />}>
           <div className="space-y-4">
             <NormItem 
               code="NBR 8995-1" 
               desc="Iluminação de locais de trabalho internos." 
               status="VIGENTE"
               detail="Define níveis de iluminância, uniformidade e controle de ofuscamento."
               url="https://www.abntcatalogo.com.br/"
             />
             <NormItem 
               code="NBR 5626" 
               desc="Sistemas prediais de água fria e quente." 
               status="VIGENTE"
               detail="Diretrizes para projeto e execução de sistemas hidráulicos prediais."
               url="https://www.abntcatalogo.com.br/"
             />
             <NormItem 
               code="NBR 5410" 
               desc="Instalações elétricas de baixa tensão." 
               status="VIGENTE"
               detail="A norma base para qualquer instalação elétrica predial segura."
               url="https://www.abntcatalogo.com.br/"
             />
           </div>
        </SectionBox>

        <SectionBox title="Log de Processamento" icon={<Clock className="text-orange-500" />}>
           <div className="space-y-4 font-mono text-[11px]">
             {history.slice(0, 5).map((item) => (
               <div key={item.id} className="flex justify-between items-center p-3 rounded bg-slate-900/50 border border-slate-800">
                 <div className="flex flex-col gap-1">
                   <span className="text-slate-400 font-bold">{item.action}: {item.target}</span>
                   <span className="text-[9px] text-slate-600 uppercase">TIME: {item.timestamp}</span>
                 </div>
                 <span className={`font-bold transition-all ${
                   item.status === 'SUCCESS' ? 'text-emerald-500' : 
                   item.status === 'MODIFIED' ? 'text-amber-500' : 
                   item.status === 'STORED' ? 'text-blue-500' : 'text-red-500'
                 }`}>
                   {item.status}
                 </span>
               </div>
             ))}
           </div>
        </SectionBox>
      </div>
    </div>
  );
}

function ElectricalModule({ circuits, setCircuits }: { circuits: ElectricalCircuit[], setCircuits: any }) {
  const addCircuit = () => {
    const newCircuit: ElectricalCircuit = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Circuito',
      power: 1200,
      voltage: 220,
      powerFactor: 0.92,
      length: 10
    };
    setCircuits([...circuits, newCircuit]);
  };

  const update = (id: string, field: keyof ElectricalCircuit, val: any) => {
    setCircuits(circuits.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1 text-purple-500">Dimensionamento Elétrico</h2>
          <p className="text-slate-500 text-xs font-mono uppercase">Cálculo de condutores e proteção (NBR 5410)</p>
        </div>
        <button onClick={addCircuit} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-purple-900/20">
          <Plus size={16} /> Novo Circuito
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {circuits.map(c => {
          const current = c.power / (c.voltage * c.powerFactor);
          const conductor = CONDUCTOR_RECORDS.find(r => r.current >= current) || CONDUCTOR_RECORDS[CONDUCTOR_RECORDS.length - 1];
          const voltageDrop = (2 * 0.0178 * c.length * current) / conductor.section;
          const dropPercentage = (voltageDrop / c.voltage) * 100;

          return (
            <div key={c.id} className="glass p-8 rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-8 relative group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setCircuits(circuits.filter(item => item.id !== c.id))} className="text-slate-500 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <InputBox label="Identificação do Circuito" value={c.name as any} onChange={v => update(c.id, 'name', v)} type="text" />
                <div className="grid grid-cols-2 gap-4">
                  <InputBox label="Potência (W)" value={c.power} onChange={v => update(c.id, 'power', parseFloat(v))} />
                  <InputBox label="Tensão (V)" value={c.voltage} onChange={v => update(c.id, 'voltage', parseFloat(v))} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputBox label="Fator de Potência" value={c.powerFactor} onChange={v => update(c.id, 'powerFactor', parseFloat(v))} step={0.01} />
                  <InputBox label="Comp. Trecho (m)" value={c.length} onChange={v => update(c.id, 'length', parseFloat(v))} />
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>CORRENTE DE PROJETO (Ib)</span>
                    <span className="text-purple-400 font-bold">{current.toFixed(2)} A</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>QUEDA DE TENSÃO</span>
                    <span className={dropPercentage > 4 ? 'text-red-500' : 'text-emerald-500'}>{dropPercentage.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                 <p className="text-[10px] font-mono font-bold text-purple-500 uppercase tracking-widest mb-4">Seção do Condutor</p>
                 <span className="text-6xl font-black italic tracking-tighter text-white">{conductor.section} <span className="text-xl">mm²</span></span>
                 <div className="mt-6 pt-6 border-t border-purple-500/10 w-full font-mono text-[10px] text-slate-400 uppercase">
                    Disjuntor Sugerido: {Math.ceil(current * 1.25)}A
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LightingModule({ tasks, setTasks }: { tasks: RoomLightingTask[], setTasks: any }) {
  const addTask = () => {
    const newTask: RoomLightingTask = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Ambiente',
      length: 5, width: 4, height: 2.8, targetLux: 300,
      lampLumens: 1600, maintenanceFactor: 0.8, utilizationFactor: 0.6
    };
    setTasks([...tasks, newTask]);
  };

  const update = (id: string, field: keyof RoomLightingTask, val: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: val } : t));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Cálculo de Lúmens</h2>
          <p className="text-slate-500 text-xs font-mono uppercase">Dimensionamento por fluxo luminoso total</p>
        </div>
        <button onClick={addTask} className="px-6 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-orange-900/20">
          <Plus size={16} /> Adicionar Local
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {tasks.map(task => {
          const area = task.length * task.width;
          const fluxTotal = (task.targetLux * area) / (task.utilizationFactor * task.maintenanceFactor);
          const n = Math.ceil(fluxTotal / task.lampLumens);
          
          return (
            <div key={task.id} className="glass p-8 rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-8 relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-slate-500 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest block mb-2">Identificação</label>
                  <input 
                    value={task.name} 
                    onChange={e => update(task.id, 'name', e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700/50 p-3 rounded font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputBox label="Compr. (m)" value={task.length} onChange={v => update(task.id, 'length', parseFloat(v))} />
                  <InputBox label="Largura (m)" value={task.width} onChange={v => update(task.id, 'width', parseFloat(v))} />
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Área Total</span>
                  <span className="text-xl font-black font-mono text-orange-400">{area.toFixed(2)} m²</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest block mb-2">Ambiente NBR</label>
                  <select 
                    value={task.targetLux} 
                    onChange={e => update(task.id, 'targetLux', parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-sm focus:outline-none"
                  >
                    {LUX_STANDARDS.map(s => <option key={s.label} value={s.value}>{s.label} ({s.value} lx)</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputBox label="E (Lux)" value={task.targetLux} onChange={v => update(task.id, 'targetLux', parseInt(v))} />
                  <InputBox label="Fluxo Lâmpada" value={task.lampLumens} onChange={v => update(task.id, 'lampLumens', parseInt(v))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputBox label="k (Manut.)" value={task.maintenanceFactor} onChange={v => update(task.id, 'maintenanceFactor', parseFloat(v))} step={0.05} />
                  <InputBox label="u (Utiliz.)" value={task.utilizationFactor} onChange={v => update(task.id, 'utilizationFactor', parseFloat(v))} step={0.05} />
                </div>
              </div>

              <div className="bg-orange-600/10 border border-orange-500/20 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                 <p className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest mb-4">Luminárias Necessárias</p>
                 <span className="text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">{n}</span>
                 <div className="mt-6 pt-6 border-t border-orange-500/10 w-full font-mono text-[10px] text-slate-400 uppercase">
                    Fluxo Total: {Math.round(fluxTotal).toLocaleString()} Lúmens
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HydraulicModule({ tasks, setTasks }: { tasks: HydraulicTask[], setTasks: any }) {
  const addTask = () => {
    const newTask: HydraulicTask = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Novo Prédio',
      occupants: 4, daysReserve: 2, consumptionPerDay: 200
    };
    setTasks([...tasks, newTask]);
  };

  const update = (id: string, field: keyof HydraulicTask, val: any) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, [field]: val } : t));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1 text-blue-500">Reservatórios</h2>
          <p className="text-slate-500 text-xs font-mono uppercase">Capacidade de armazenamento predial</p>
        </div>
        <button onClick={addTask} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
          <Plus size={16} /> Novo Projeto
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map(task => {
          const total = task.occupants * task.consumptionPerDay * task.daysReserve;
          return (
            <div key={task.id} className="glass p-8 rounded-2xl space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <label className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest block mb-1">Localização/Ident.</label>
                  <input 
                    value={task.name} 
                    onChange={e => update(task.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-slate-700 font-bold p-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-slate-600 hover:text-red-500 ml-4">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="text-[10px] font-mono text-slate-500 uppercase block mb-2">Padrão de Consumo</label>
                  <select 
                    value={task.consumptionPerDay}
                    onChange={e => update(task.id, 'consumptionPerDay', parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 p-3 rounded text-sm focus:outline-none"
                  >
                    {HYDRAULIC_CONSUMPTION.map(s => <option key={s.label} value={s.value}>{s.label} ({s.value} L/dia)</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputBox label="Nº Ocupantes" value={task.occupants} onChange={v => update(task.id, 'occupants', parseInt(v))} />
                  <InputBox label="Reserva (Dias)" value={task.daysReserve} onChange={v => update(task.id, 'daysReserve', parseInt(v))} />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-mono text-slate-500 uppercase mb-1">Volume de Projeto</p>
                  <div className="text-4xl font-black text-blue-400 font-mono italic">
                    {total.toLocaleString()} <span className="text-lg underline underline-offset-8">L</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-700 uppercase">Equivalente</p>
                  <div className="text-xl font-bold text-slate-400 font-mono tracking-tighter">{(total/1000).toFixed(2)} m³</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Reusable Components
function BannerCard({ title, value, subtitle, color, icon, onClick }: { 
  title: string, value: number, subtitle: string, color: string, icon: any, onClick: () => void 
}) {
  return (
    <button 
      onClick={onClick}
      className={`${color} p-6 rounded-2xl relative overflow-hidden group transition-all hover:scale-[1.02] active:scale-[0.98] text-white text-left`}
    >
      <div className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform">
        {icon && <div className="scale-[5]">{icon}</div>}
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80">{title}</div>
        <div className="mt-8">
          <div className="text-5xl font-black italic tracking-tighter font-mono">{value.toString().padStart(2, '0')}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1 flex items-center gap-1">
             {subtitle} <ArrowUpRight size={12} />
          </div>
        </div>
      </div>
    </button>
  );
}

function SectionBox({ title, icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-widest tracking-tighter">
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function NormItem({ code, desc, status, detail, url }: { code: string, desc: string, status: string, detail: string, url: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-900 rounded-xl border border-slate-800 transition-all hover:border-slate-600">
       <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center font-mono text-xs text-orange-500 font-bold shrink-0">
         #
       </div>
       <div className="flex-1">
         <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold font-mono text-slate-200">{code}</h4>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold border ${
                status === 'VIGENTE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                'bg-orange-500/10 text-orange-400 border-orange-500/20'
              }`}>{status}</span>
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              <ArrowUpRight size={14} />
            </a>
         </div>
         <p className="text-[10px] text-slate-200 mt-1 font-bold">{desc}</p>
         <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{detail}</p>
       </div>
    </div>
  );
}

function InputBox({ label, value, onChange, step = 1, type = "number" }: { 
  label: string, 
  value: any, 
  onChange: (v: string) => void, 
  step?: number,
  type?: "number" | "text"
}) {
  return (
    <div>
      <label className="text-[9px] font-mono font-bold text-slate-500 uppercase block mb-1.5">{label}</label>
      <input 
        type={type} 
        value={value} 
        step={step}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-900/80 border border-slate-700/50 p-2.5 rounded font-mono text-sm focus:outline-none focus:border-orange-500 transition-colors"
      />
    </div>
  );
}
