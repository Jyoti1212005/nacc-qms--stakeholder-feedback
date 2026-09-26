import React, { useState, useEffect, useRef } from 'react';
import { Award, Sparkles, RotateCw, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CriterionNode {
  id: string;
  name: string;
  shortName: string;
  criterionNumber: number;
  weight: number;
  score: number;
  target: number;
  color: string;
  description: string;
}

const CRITERIA_NODES: CriterionNode[] = [
  {
    id: 'cat-1',
    criterionNumber: 1,
    shortName: 'Curricular',
    name: 'Criterion 1: Curricular Aspects',
    weight: 15,
    score: 88.4,
    target: 85,
    color: '#ff7a50',
    description: 'Outcome-based curriculum, choice-based credit system, industry revisions.',
  },
  {
    id: 'cat-2',
    criterionNumber: 2,
    shortName: 'Pedagogy',
    name: 'Criterion 2: Teaching-Learning & Evaluation',
    weight: 35,
    score: 91.2,
    target: 90,
    color: '#2563eb',
    description: 'Faculty qualifications, student satisfaction (SSS), mentor-mentee ratio.',
  },
  {
    id: 'cat-3',
    criterionNumber: 3,
    shortName: 'Research',
    name: 'Criterion 3: Research, Innovations & Extension',
    weight: 12,
    score: 78.6,
    target: 80,
    color: '#8b5cf6',
    description: 'Scopus/SCI publications, seed research grants, incubation startups.',
  },
  {
    id: 'cat-4',
    criterionNumber: 4,
    shortName: 'Infrastructure',
    name: 'Criterion 4: Infrastructure & Learning Resources',
    weight: 10,
    score: 84.1,
    target: 85,
    color: '#0d9488',
    description: 'Smart classrooms, high-bandwidth Wi-Fi, lab equipment, digital library.',
  },
  {
    id: 'cat-5',
    criterionNumber: 5,
    shortName: 'Student Support',
    name: 'Criterion 5: Student Support & Progression',
    weight: 13,
    score: 86.5,
    target: 85,
    color: '#f59e0b',
    description: 'Placements, higher education progression, competitive exam guidance.',
  },
  {
    id: 'cat-6',
    criterionNumber: 6,
    shortName: 'Governance',
    name: 'Criterion 6: Governance, Leadership & Management',
    weight: 10,
    score: 82.0,
    target: 80,
    color: '#ec4899',
    description: 'Decentralized leadership, faculty development, financial transparency.',
  },
  {
    id: 'cat-7',
    criterionNumber: 7,
    shortName: 'Values',
    name: 'Criterion 7: Institutional Values & Best Practices',
    weight: 5,
    score: 89.3,
    target: 85,
    color: '#10b981',
    description: 'Green energy campus, gender equity cell, waste recycling systems.',
  },
];

export const ThreeDQualityOrbit: React.FC = () => {
  const { setActivePage } = useApp();
  const [selectedNode, setSelectedNode] = useState<CriterionNode | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 18, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.45) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isRotating]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = (y / (rect.height / 2)) * -18 + 18;
    const tiltY = (x / (rect.width / 2)) * 22;
    setMouseTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 18, y: 0 });
  };

  // Adjust radius based on screen size so nodes never clip the container
  const orbitRadius = isMobile ? 122 : 175;

  return (
    <div className="w-full bg-linear-to-b from-[#0a192f] via-[#0d223f] to-[#0a192f] rounded-3xl p-4 sm:p-6 md:p-8 text-white relative overflow-hidden border border-[#234573] shadow-2xl">
      {/* 3D Atmospheric Background Gradients */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#ff7a50]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#1e3a8a]/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-[#1f3a61]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold text-[#ffa07a] uppercase tracking-wider bg-[#ff7a50]/20 px-2 py-0.5 rounded border border-[#ff7a50]/30">
              Interactive 3D Quality Spatial Matrix
            </span>
            <span className="text-[10px] text-blue-200">Continuous Assessment Loop</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-black text-white mt-1 tracking-tight">
            Institutional Quality Assurance Orbit (7 Criteria)
          </h3>
          <p className="text-xs text-blue-200/80 mt-0.5 max-w-xl">
            Real-time multi-dimensional visualization of NAAC criteria performance, feedback indices, and closed-loop continuous progress.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
              isRotating
                ? 'bg-[#1b3a63] text-[#fed7aa] border-[#2b5182]'
                : 'bg-[#ff7a50] text-white border-[#ff9d7a]'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>{isRotating ? 'Pause Orbit' : 'Resume 3D Orbit'}</span>
          </button>
          <button
            onClick={() => setActivePage('quality-indicators')}
            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-[#0a192f] hover:bg-[#fff0e6] transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Indicators</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#ff7a50]" />
          </button>
        </div>
      </div>

      {/* 3D Orbit Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1200px', touchAction: 'pan-y' }}
        className="relative h-[340px] sm:h-[420px] flex items-center justify-center select-none"
      >
        <div
          style={{
            transform: `rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* 3D Concentric Orbit Rings in Perspective */}
          <div
            style={{
              transform: 'rotateX(72deg) translateZ(0px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full border-2 border-dashed border-[#ff7a50]/40 pointer-events-none shadow-[0_0_50px_rgba(255,122,80,0.15)] animate-[spin_60s_linear_infinite]"
          />
          <div
            style={{
              transform: 'rotateX(72deg) translateZ(-15px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] rounded-full border border-blue-400/30 pointer-events-none"
          />

          {/* Central 3D Core Card - Institutional Quality Index */}
          <div
            style={{
              transform: 'translateZ(35px)',
              transformStyle: 'preserve-3d',
            }}
            className="absolute z-20 bg-linear-to-br from-[#0f274a] to-[#071324] border-2 border-[#ff7a50] rounded-2xl p-3 sm:p-5 shadow-2xl text-center max-w-[170px] sm:max-w-[240px] backdrop-blur-md"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-[#ff7a50] to-[#f97316] text-white flex items-center justify-center mx-auto mb-1.5 sm:mb-2 shadow-lg shadow-orange-900/30">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-extrabold text-[#ffa07a] uppercase tracking-wider">Institutional Index</p>
            <div className="flex items-baseline justify-center space-x-1 mt-0.5">
              <span className="text-2xl sm:text-4xl font-black text-white tracking-tight">84.6</span>
              <span className="text-xs text-[#fed7aa] font-bold">/100</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-blue-200 mt-0.5 sm:mt-1 font-semibold">Continuous Quality Loop</p>
            <div className="mt-1.5 sm:mt-2.5 inline-flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-bold border border-emerald-500/30">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Above Target (+3.6%)</span>
            </div>
          </div>

          {/* Orbiting 3D Criteria Nodes */}
          {CRITERIA_NODES.map((node, idx) => {
            const angleDeg = (idx * (360 / CRITERIA_NODES.length) + rotationAngle) % 360;
            const angleRad = (angleDeg * Math.PI) / 180;

            const x = Math.cos(angleRad) * orbitRadius;
            const z = Math.sin(angleRad) * orbitRadius;
            const isFront = z > 0;
            const isCurrentSelected = selectedNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(node);
                }}
                style={{
                  transform: `translate3d(${x.toFixed(1)}px, ${(Math.sin(angleRad * 2) * (isMobile ? 12 : 20)).toFixed(1)}px, ${z.toFixed(1)}px)`,
                  zIndex: isFront ? 30 : 10,
                  transformStyle: 'preserve-3d',
                }}
                className="absolute cursor-pointer transition-transform duration-75 group"
              >
                <div
                  className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all text-center flex flex-col items-center justify-center backdrop-blur-md ${
                    isCurrentSelected
                      ? 'bg-white text-[#0a192f] border-[#ff7a50] shadow-2xl scale-110 ring-4 ring-[#ff7a50]/40'
                      : isFront
                      ? 'bg-[#0f2444]/90 hover:bg-[#16355d] text-white border-[#2c4e7a] hover:border-[#ffa07a] shadow-lg'
                      : 'bg-[#0a192f]/70 text-blue-200/70 border-[#1c3350] opacity-85 hover:opacity-100'
                  }`}
                  style={{ minWidth: isMobile ? '82px' : '105px' }}
                >
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center text-[10px] sm:text-[11px] font-black mb-1 text-white shadow-xs"
                    style={{ backgroundColor: node.color }}
                  >
                    C{node.criterionNumber}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-extrabold truncate max-w-[78px] sm:max-w-[95px] leading-tight">
                    {node.shortName}
                  </span>
                  <div className="flex items-center space-x-1 mt-0.5 sm:mt-1">
                    <span className="text-[11px] sm:text-xs font-black" style={{ color: isCurrentSelected ? '#0a192f' : node.color }}>
                      {node.score}%
                    </span>
                    <span className="text-[8px] sm:text-[9px] opacity-70">({node.weight}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Drawer / Info Ribbon */}
      <div className="relative z-10 mt-3 sm:mt-4 p-3.5 sm:p-4 rounded-2xl bg-[#081628] border border-[#213f68] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        {selectedNode ? (
          <>
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-black text-white"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  C{selectedNode.criterionNumber} ({selectedNode.weight}% Weight)
                </span>
                <span className="text-xs font-bold text-white">{selectedNode.name}</span>
              </div>
              <p className="text-xs text-blue-200/80 mt-1">{selectedNode.description}</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-blue-300 font-medium">Criterion Attainment</p>
                <p className="text-sm sm:text-base font-black text-[#ffa07a]">{selectedNode.score}% / 100%</p>
              </div>
              <button
                onClick={() => setActivePage('quality-indicators')}
                className="min-h-[44px] px-3.5 py-2 bg-[#ff7a50] hover:bg-[#ea580c] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center"
              >
                Inspect Metrics
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between w-full text-xs text-blue-200">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#ffa07a] shrink-0" />
              <span>Tap any of the 7 orbiting Criteria nodes to inspect real-time performance and weights.</span>
            </div>
            <span className="text-[11px] text-[#ffa07a] font-bold hidden sm:inline">
              NAAC QMS Cycle 3 Benchmark
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
