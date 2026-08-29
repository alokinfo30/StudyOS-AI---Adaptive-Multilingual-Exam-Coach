import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  BookOpen,
  Award,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { MindMapNode } from '../../types';

interface ConceptMindMapViewProps {
  activeChapterId?: string;
  onSelectConcept?: (conceptId: string, conceptName: string) => void;
}

// Rich Hierarchical NCERT Concept Graph Dataset
const NCERT_CONCEPT_TREE: MindMapNode = {
  id: 'root_science',
  name: 'NCERT & JEE Syllabus',
  category: 'subject',
  masteryScore: 82,
  description: 'Integrated Science & Math Mastery Hierarchy',
  children: [
    {
      id: 'sub_physics',
      name: 'Physics (Class 10 & 12)',
      category: 'chapter',
      masteryScore: 85,
      description: 'Optics, Electromagnetism & Modern Physics',
      children: [
        {
          id: 'ch_electricity',
          name: 'Current Electricity',
          category: 'core_concept',
          masteryScore: 92,
          difficulty: 'medium',
          description: 'Electric charge flow, potential difference and Ohm’s law',
          children: [
            {
              id: 'concept_ohms_law',
              name: "Ohm's Law (V = IR)",
              category: 'sub_concept',
              masteryScore: 96,
              difficulty: 'easy',
              formula: 'V = I * R',
              description: 'Current is directly proportional to potential difference across conductor ends.',
            },
            {
              id: 'concept_resistivity',
              name: 'Resistivity (R = ρL/A)',
              category: 'sub_concept',
              masteryScore: 88,
              difficulty: 'medium',
              formula: 'R = rho * (L / A)',
              description: 'Material-specific resistance factor independent of geometry.',
            },
            {
              id: 'concept_joule_heating',
              name: 'Joule’s Heating (H = I²Rt)',
              category: 'formula',
              masteryScore: 84,
              difficulty: 'medium',
              formula: 'H = I^2 * R * t',
              description: 'Thermal energy generation across resistive components.',
            },
          ],
        },
        {
          id: 'ch_light',
          name: 'Light: Optics',
          category: 'core_concept',
          masteryScore: 78,
          difficulty: 'hard',
          description: 'Reflection, Refraction, Mirror and Lens formulas',
          children: [
            {
              id: 'concept_snell',
              name: "Snell's Law (n₁ sin θ₁ = n₂ sin θ₂)",
              category: 'formula',
              masteryScore: 82,
              difficulty: 'medium',
              formula: 'n1 * sin(θ1) = n2 * sin(θ2)',
              description: 'Refraction across boundary between two optical media.',
            },
            {
              id: 'concept_mirror_formula',
              name: 'Mirror Formula (1/f = 1/v + 1/u)',
              category: 'sub_concept',
              masteryScore: 74,
              difficulty: 'hard',
              formula: '1/f = 1/v + 1/u',
              description: 'Spherical concave & convex mirror image coordinates.',
            },
            {
              id: 'concept_lens_power',
              name: 'Lens Power (P = 1/f)',
              category: 'sub_concept',
              masteryScore: 89,
              difficulty: 'easy',
              formula: 'P = 1 / f (in meters)',
              description: 'Convergence or divergence capacity in Dioptres.',
            },
          ],
        },
      ],
    },
    {
      id: 'sub_math',
      name: 'Mathematics',
      category: 'chapter',
      masteryScore: 80,
      description: 'Algebra, Trigonometry, Coordinate Geometry & Calculus',
      children: [
        {
          id: 'ch_quadratics',
          name: 'Quadratic Equations',
          category: 'core_concept',
          masteryScore: 86,
          difficulty: 'medium',
          description: 'Second-degree polynomials and roots',
          children: [
            {
              id: 'concept_discriminant',
              name: 'Discriminant (D = b² - 4ac)',
              category: 'sub_concept',
              masteryScore: 95,
              difficulty: 'easy',
              formula: 'D = b^2 - 4ac',
              description: 'Determines real, equal, or imaginary nature of roots.',
            },
            {
              id: 'concept_quadratic_formula',
              name: 'Quadratic Formula',
              category: 'formula',
              masteryScore: 92,
              difficulty: 'medium',
              formula: 'x = (-b ± sqrt(D)) / (2a)',
              description: 'Universal root solver for ax² + bx + c = 0.',
            },
          ],
        },
        {
          id: 'ch_trig',
          name: 'Trigonometry',
          category: 'core_concept',
          masteryScore: 76,
          difficulty: 'hard',
          description: 'Pythagorean trigonometric ratios and identities',
          children: [
            {
              id: 'concept_pythagorean_id',
              name: 'sin²θ + cos²θ = 1',
              category: 'formula',
              masteryScore: 88,
              difficulty: 'easy',
              formula: 'sin^2(θ) + cos^2(θ) = 1',
              description: 'Fundamental trigonometric Pythagorean identity.',
            },
            {
              id: 'concept_sec_tan',
              name: '1 + tan²θ = sec²θ',
              category: 'formula',
              masteryScore: 72,
              difficulty: 'hard',
              formula: '1 + tan^2(θ) = sec^2(θ)',
              description: 'Secant and tangent identity.',
            },
          ],
        },
      ],
    },
    {
      id: 'sub_chemistry',
      name: 'Chemistry',
      category: 'chapter',
      masteryScore: 81,
      description: 'Acids, Bases, Chemical Reactions & Stoichiometry',
      children: [
        {
          id: 'ch_acids',
          name: 'Acids, Bases & Salts',
          category: 'core_concept',
          masteryScore: 87,
          difficulty: 'easy',
          description: 'pH scale, indicator reactions and neutralizations',
          children: [
            {
              id: 'concept_ph_formula',
              name: 'pH = -log₁₀[H⁺]',
              category: 'formula',
              masteryScore: 91,
              difficulty: 'medium',
              formula: 'pH = -log10[H+]',
              description: 'Logarithmic hydrogen ion concentration scale from 0 to 14.',
            },
            {
              id: 'concept_neutralization',
              name: 'Acid + Base → Salt + H₂O',
              category: 'sub_concept',
              masteryScore: 94,
              difficulty: 'easy',
              formula: 'HCl + NaOH -> NaCl + H2O',
              description: 'Proton exchange leading to salt and water synthesis.',
            },
          ],
        },
      ],
    },
  ],
};

export const ConceptMindMapView: React.FC<ConceptMindMapViewProps> = ({
  activeChapterId,
  onSelectConcept,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'physics' | 'math' | 'chemistry'>('all');
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform | null>(null);

  // Render D3 Tree Graph
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = 540;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous renders

    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('class', 'mindmap-content');

    // Zoom and Pan Behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomTransform(event.transform);
      });

    svg.call(zoom);

    // Initial Tree Layout
    const treeData = d3.hierarchy<MindMapNode>(NCERT_CONCEPT_TREE);
    const treeLayout = d3.tree<MindMapNode>().size([height - 80, width - 260]);
    treeLayout(treeData);

    // Zoom to fit initial center
    svg.call(zoom.transform, d3.zoomIdentity.translate(80, 40).scale(0.85));

    // Links (Curved cubic Bezier paths)
    g.selectAll('.mindmap-link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'mindmap-link')
      .attr(
        'd',
        d3
          .linkHorizontal<any, any>()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#3f3f46')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d) => (d.target.data.category === 'formula' ? '4 2' : 'none'))
      .attr('opacity', 0.85);

    // Node Groups
    const nodes = g
      .selectAll('.mindmap-node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'mindmap-node cursor-pointer group')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .on('click', (_, d) => {
        setSelectedNode(d.data);
        if (onSelectConcept) {
          onSelectConcept(d.data.id, d.data.name);
        }
      });

    // Node Circles / Shields
    nodes
      .append('circle')
      .attr('r', (d) => {
        if (d.depth === 0) return 18;
        if (d.depth === 1) return 14;
        if (d.depth === 2) return 10;
        return 7;
      })
      .attr('fill', (d) => {
        const score = d.data.masteryScore || 75;
        if (score >= 90) return '#10b981'; // Emerald
        if (score >= 80) return '#f59e0b'; // Amber Gold
        if (score >= 70) return '#3b82f6'; // Blue
        return '#f43f5e'; // Rose
      })
      .attr('stroke', '#18181b')
      .attr('stroke-width', 2.5)
      .attr('filter', 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))');

    // Node Labels
    nodes
      .append('text')
      .attr('dy', (d) => (d.children ? -12 : 4))
      .attr('x', (d) => (d.children ? 0 : 12))
      .attr('text-anchor', (d) => (d.children ? 'middle' : 'start'))
      .text((d) => d.data.name)
      .attr('font-size', (d) => (d.depth === 0 ? '13px' : d.depth === 1 ? '11px' : '10px'))
      .attr('font-family', 'sans-serif')
      .attr('font-weight', (d) => (d.depth <= 1 ? 'bold' : 'normal'))
      .attr('fill', (d) => (d.depth <= 1 ? '#f4f4f5' : '#d4d4d8'))
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.9)');

    // Pulse effect on active node
    nodes
      .filter((d) => d.data.id === activeChapterId || d.data.masteryScore! >= 95)
      .append('circle')
      .attr('r', 16)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 3')
      .attr('class', 'animate-spin');
  }, [filterCategory, activeChapterId]);

  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 1.25);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(d3.zoom<SVGSVGElement, unknown>().scaleBy, 0.8);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(400).call(
      d3.zoom<SVGSVGElement, unknown>().transform,
      d3.zoomIdentity.translate(80, 40).scale(0.85)
    );
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Mind Map Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <span>NCERT Concept Mastery Mind Map</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                D3 Graph Engine
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Interactive visual hierarchy connecting core concepts, formulas, and prerequisites
            </p>
          </div>
        </div>

        {/* Graph Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 text-xs transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 text-xs transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 text-xs transition-all flex items-center gap-1"
            title="Reset View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Mastery Color Legend */}
      <div className="px-4 py-2 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400 flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <span className="text-zinc-500">Mastery Heatmap:</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Mastered (90%+)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Proficient (80–89%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Learning (70–79%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Review Needed</span>
          </span>
        </div>
      </div>

      {/* SVG Container & Selected Node Inspector Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative min-h-[480px]">
        {/* Left: D3 Graph Canvas */}
        <div
          ref={containerRef}
          className="lg:col-span-8 bg-zinc-950 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing border-b lg:border-b-0 lg:border-r border-zinc-800"
          style={{ minHeight: '480px' }}
        >
          <svg ref={svgRef} className="w-full h-[520px]" />
          
          <div className="absolute bottom-3 left-3 bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2.5 py-1 text-[10px] font-mono text-zinc-400 backdrop-blur-xs">
            💡 Drag canvas to pan • Scroll to zoom • Click node to inspect details
          </div>
        </div>

        {/* Right: Selected Node Breakdown */}
        <div className="lg:col-span-4 p-4 sm:p-5 bg-zinc-950 space-y-4 overflow-y-auto max-h-[520px]">
          {selectedNode ? (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {selectedNode.category.replace('_', ' ')}
                  </span>
                  {selectedNode.difficulty && (
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      • {selectedNode.difficulty}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-zinc-100">{selectedNode.name}</h4>
              </div>

              {/* Mastery Score Progress */}
              {selectedNode.masteryScore !== undefined && (
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">Concept Mastery Level</span>
                    <span className="text-amber-400 font-bold">{selectedNode.masteryScore}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full transition-all"
                      style={{ width: `${selectedNode.masteryScore}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedNode.description && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Overview
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
                    {selectedNode.description}
                  </p>
                </div>
              )}

              {/* Mathematical Formula if available */}
              {selectedNode.formula && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block">
                    Core Equation
                  </span>
                  <div className="font-mono text-xs font-bold text-amber-200">
                    {selectedNode.formula}
                  </div>
                </div>
              )}

              {/* Children Concepts List */}
              {selectedNode.children && selectedNode.children.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                    Connected Sub-Nodes ({selectedNode.children.length})
                  </span>
                  <div className="space-y-1">
                    {selectedNode.children.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => setSelectedNode(child)}
                        className="w-full p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left text-xs text-zinc-200 flex items-center justify-between transition-colors group"
                      >
                        <span className="group-hover:text-amber-300 truncate">{child.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-2">
              <Eye className="w-8 h-8 text-zinc-600 animate-pulse" />
              <div className="text-xs font-medium">No Concept Selected</div>
              <p className="text-[11px] text-zinc-600">
                Click on any node in the D3 mind map to inspect its formula derivations and mastery progression.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
