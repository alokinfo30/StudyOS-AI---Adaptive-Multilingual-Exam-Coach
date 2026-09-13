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
  ArrowRight,
  Compass,
  Check,
  AlertCircle,
} from 'lucide-react';
import { ConceptMastery, MindMapNode } from '../../types';

interface ConceptMindMapViewProps {
  activeChapterId?: string;
  onSelectConcept?: (conceptId: string, conceptName: string) => void;
  masteries?: Record<string, ConceptMastery>;
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
          prerequisites: ['sub_physics'],
          description: 'Electric charge flow, potential difference and Ohm’s law',
          children: [
            {
              id: 'concept_ohms_law',
              name: "Ohm's Law (V = IR)",
              category: 'sub_concept',
              masteryScore: 96,
              difficulty: 'easy',
              formula: 'V = I * R',
              prerequisites: ['ch_electricity'],
              description: 'Current is directly proportional to potential difference across conductor ends.',
            },
            {
              id: 'concept_resistivity',
              name: 'Resistivity (R = ρL/A)',
              category: 'sub_concept',
              masteryScore: 88,
              difficulty: 'medium',
              formula: 'R = rho * (L / A)',
              prerequisites: ['concept_ohms_law', 'ch_electricity'],
              description: 'Material-specific resistance factor independent of geometry.',
            },
            {
              id: 'concept_joule_heating',
              name: 'Joule’s Heating (H = I²Rt)',
              category: 'formula',
              masteryScore: 84,
              difficulty: 'medium',
              formula: 'H = I^2 * R * t',
              prerequisites: ['concept_ohms_law', 'concept_resistivity'],
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
          prerequisites: ['sub_physics'],
          description: 'Reflection, Refraction, Mirror and Lens formulas',
          children: [
            {
              id: 'concept_snell',
              name: "Snell's Law (n₁ sin θ₁ = n₂ sin θ₂)",
              category: 'formula',
              masteryScore: 82,
              difficulty: 'medium',
              formula: 'n1 * sin(θ1) = n2 * sin(θ2)',
              prerequisites: ['ch_light'],
              description: 'Refraction across boundary between two optical media.',
            },
            {
              id: 'concept_mirror_formula',
              name: 'Mirror Formula (1/f = 1/v + 1/u)',
              category: 'sub_concept',
              masteryScore: 74,
              difficulty: 'hard',
              formula: '1/f = 1/v + 1/u',
              prerequisites: ['ch_light', 'concept_snell'],
              description: 'Spherical concave & convex mirror image coordinates.',
            },
            {
              id: 'concept_lens_power',
              name: 'Lens Power (P = 1/f)',
              category: 'sub_concept',
              masteryScore: 89,
              difficulty: 'easy',
              formula: 'P = 1 / f (in meters)',
              prerequisites: ['concept_mirror_formula', 'ch_light'],
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
          prerequisites: ['sub_math'],
          description: 'Second-degree polynomials and roots',
          children: [
            {
              id: 'concept_discriminant',
              name: 'Discriminant (D = b² - 4ac)',
              category: 'sub_concept',
              masteryScore: 95,
              difficulty: 'easy',
              formula: 'D = b^2 - 4ac',
              prerequisites: ['ch_quadratics'],
              description: 'Determines real, equal, or imaginary nature of roots.',
            },
            {
              id: 'concept_quadratic_formula',
              name: 'Quadratic Formula',
              category: 'formula',
              masteryScore: 92,
              difficulty: 'medium',
              formula: 'x = (-b ± sqrt(D)) / (2a)',
              prerequisites: ['concept_discriminant', 'ch_quadratics'],
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
          prerequisites: ['sub_math'],
          description: 'Pythagorean trigonometric ratios and identities',
          children: [
            {
              id: 'concept_pythagorean_id',
              name: 'sin²θ + cos²θ = 1',
              category: 'formula',
              masteryScore: 88,
              difficulty: 'easy',
              formula: 'sin^2(θ) + cos^2(θ) = 1',
              prerequisites: ['ch_trig'],
              description: 'Fundamental trigonometric Pythagorean identity.',
            },
            {
              id: 'concept_sec_tan',
              name: '1 + tan²θ = sec²θ',
              category: 'formula',
              masteryScore: 72,
              difficulty: 'hard',
              formula: '1 + tan^2(θ) = sec^2(θ)',
              prerequisites: ['concept_pythagorean_id', 'ch_trig'],
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
          prerequisites: ['sub_chemistry'],
          description: 'pH scale, indicator reactions and neutralizations',
          children: [
            {
              id: 'concept_ph_formula',
              name: 'pH = -log₁₀[H⁺]',
              category: 'formula',
              masteryScore: 91,
              difficulty: 'medium',
              formula: 'pH = -log10[H+]',
              prerequisites: ['ch_acids'],
              description: 'Logarithmic hydrogen ion concentration scale from 0 to 14.',
            },
            {
              id: 'concept_neutralization',
              name: 'Acid + Base → Salt + H₂O',
              category: 'sub_concept',
              masteryScore: 94,
              difficulty: 'easy',
              formula: 'HCl + NaOH -> NaCl + H2O',
              prerequisites: ['concept_ph_formula', 'ch_acids'],
              description: 'Proton exchange leading to salt and water synthesis.',
            },
          ],
        },
      ],
    },
  ],
};

// Helper to compute live node mastery score from masteries object or children hierarchy
export const getNodeMasteryScore = (
  node: MindMapNode,
  masteries?: Record<string, ConceptMastery>
): number => {
  if (masteries && masteries[node.id]?.overallMastery !== undefined) {
    return masteries[node.id].overallMastery;
  }
  // If this node has children, compute average of children
  if (node.children && node.children.length > 0) {
    const scores = node.children.map((c) => getNodeMasteryScore(c, masteries));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }
  return node.masteryScore || 75;
};

export const ConceptMindMapView: React.FC<ConceptMindMapViewProps> = ({
  activeChapterId,
  onSelectConcept,
  masteries,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'physics' | 'math' | 'chemistry'>('all');
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform | null>(null);
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<{
    node: MindMapNode;
    prerequisites: MindMapNode[];
    dependents: MindMapNode[];
  } | null>(null);

  // Helper to jump to any concept by ID
  const handleSelectConceptById = (conceptId: string) => {
    const findInNode = (curr: MindMapNode): MindMapNode | null => {
      if (curr.id === conceptId) return curr;
      if (curr.children) {
        for (const ch of curr.children) {
          const res = findInNode(ch);
          if (res) return res;
        }
      }
      return null;
    };
    const node = findInNode(NCERT_CONCEPT_TREE);
    if (node) {
      setSelectedNode(node);
      if (onSelectConcept) {
        onSelectConcept(node.id, node.name);
      }
    }
  };

  // Filter tree dataset based on selected subject filter
  const currentTreeData: MindMapNode = React.useMemo(() => {
    if (filterCategory === 'all') return NCERT_CONCEPT_TREE;
    const matchId =
      filterCategory === 'physics'
        ? 'sub_physics'
        : filterCategory === 'math'
        ? 'sub_math'
        : 'sub_chemistry';
    const found = NCERT_CONCEPT_TREE.children?.find((c) => c.id === matchId);
    if (!found) return NCERT_CONCEPT_TREE;
    return {
      id: 'root_filtered',
      name: `${found.name} Hierarchy`,
      category: 'subject',
      masteryScore: found.masteryScore,
      description: found.description,
      children: found.children,
    };
  }, [filterCategory]);

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
    const treeData = d3.hierarchy<MindMapNode>(currentTreeData);
    const treeLayout = d3.tree<MindMapNode>().size([height - 80, width - 260]);
    treeLayout(treeData);

    // Zoom to fit initial center
    svg.call(zoom.transform, d3.zoomIdentity.translate(80, 40).scale(0.85));

    // Links (Curved cubic Bezier paths)
    const linkElements = g
      .selectAll('.mindmap-link')
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

    // Fast lookup of hierarchy nodes
    const hierarchyMap = new Map<string, d3.HierarchyNode<MindMapNode>>();
    treeData.descendants().forEach((d) => {
      hierarchyMap.set(d.data.id, d);
    });

    // Helper: Collect all prerequisite IDs (both tree ancestors and explicit prerequisite relations)
    const getPrerequisiteIds = (targetNode: d3.HierarchyNode<MindMapNode>): Set<string> => {
      const prereqIds = new Set<string>();

      // 1. Hierarchical ancestors (e.g. Current Electricity -> Physics)
      targetNode.ancestors().forEach((a) => {
        if (a !== targetNode && a.data.id !== 'root_science' && a.data.id !== 'root_filtered') {
          prereqIds.add(a.data.id);
        }
      });

      // 2. Explicit prerequisite nodes recursively
      const addExplicitPrereqs = (pList?: string[]) => {
        if (!pList) return;
        pList.forEach((pId) => {
          if (!prereqIds.has(pId)) {
            prereqIds.add(pId);
            const pNode = hierarchyMap.get(pId);
            if (pNode && pNode.data.prerequisites) {
              addExplicitPrereqs(pNode.data.prerequisites);
            }
          }
        });
      };
      addExplicitPrereqs(targetNode.data.prerequisites);

      return prereqIds;
    };

    // Helper: Collect all dependent IDs (descendants + concepts that require this concept)
    const getDependentIds = (targetNode: d3.HierarchyNode<MindMapNode>): Set<string> => {
      const depIds = new Set<string>();

      // Descendants in hierarchy
      targetNode.descendants().forEach((desc) => {
        if (desc !== targetNode) depIds.add(desc.data.id);
      });

      // Any node in graph citing this targetNode as a prerequisite
      treeData.descendants().forEach((n) => {
        if (n.data.prerequisites && n.data.prerequisites.includes(targetNode.data.id)) {
          depIds.add(n.data.id);
        }
      });

      return depIds;
    };

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

    // Node Circles / Shields with live mastery color
    nodes
      .append('circle')
      .attr('class', 'node-core-circle')
      .attr('r', (d) => {
        if (d.depth === 0) return 18;
        if (d.depth === 1) return 14;
        if (d.depth === 2) return 10;
        return 7;
      })
      .attr('fill', (d) => {
        const score = getNodeMasteryScore(d.data, masteries);
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
      .attr('class', 'node-label')
      .attr('dy', (d) => (d.children ? -12 : -4))
      .attr('x', (d) => (d.children ? 0 : 12))
      .attr('text-anchor', (d) => (d.children ? 'middle' : 'start'))
      .text((d) => d.data.name)
      .attr('font-size', (d) => (d.depth === 0 ? '13px' : d.depth === 1 ? '11px' : '10px'))
      .attr('font-family', 'sans-serif')
      .attr('font-weight', (d) => (d.depth <= 1 ? 'bold' : 'normal'))
      .attr('fill', (d) => (d.depth <= 1 ? '#f4f4f5' : '#d4d4d8'))
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.9)');

    // Real-Time Progress Bar on Each Node
    const pbarGroup = nodes
      .append('g')
      .attr('class', 'node-progress-bar')
      .attr('transform', (d) => (d.children ? 'translate(-26, 8)' : 'translate(12, 6)'));

    // Progress bar track background
    pbarGroup
      .append('rect')
      .attr('width', 46)
      .attr('height', 4.5)
      .attr('rx', 2.25)
      .attr('fill', '#27272a')
      .attr('stroke', '#3f3f46')
      .attr('stroke-width', 0.5);

    // Progress bar fill indicating live percentage
    pbarGroup
      .append('rect')
      .attr('width', (d) => {
        const score = getNodeMasteryScore(d.data, masteries);
        return Math.max(3, (score / 100) * 46);
      })
      .attr('height', 4.5)
      .attr('rx', 2.25)
      .attr('fill', (d) => {
        const score = getNodeMasteryScore(d.data, masteries);
        if (score >= 90) return '#10b981';
        if (score >= 80) return '#f59e0b';
        if (score >= 70) return '#3b82f6';
        return '#f43f5e';
      });

    // Progress bar numeric percentage label
    pbarGroup
      .append('text')
      .attr('x', 50)
      .attr('y', 4.5)
      .attr('font-size', '8.5px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('fill', (d) => {
        const score = getNodeMasteryScore(d.data, masteries);
        if (score >= 90) return '#34d399';
        if (score >= 80) return '#fbbf24';
        return '#93c5fd';
      })
      .text((d) => `${getNodeMasteryScore(d.data, masteries)}%`);

    // Pulse effect on active node
    nodes
      .filter((d) => {
        const score = getNodeMasteryScore(d.data, masteries);
        return d.data.id === activeChapterId || score >= 95;
      })
      .append('circle')
      .attr('r', 16)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3 3')
      .attr('class', 'animate-spin');

    // -------------------------------------------------------------
    // Pedagogical Prerequisite Flow Hover Interaction
    // -------------------------------------------------------------
    nodes
      .on('mouseenter', (_, d) => {
        const prereqIds = getPrerequisiteIds(d);
        const depIds = getDependentIds(d);

        // Update React HUD state
        const prereqNodes = Array.from(prereqIds)
          .map((id) => hierarchyMap.get(id)?.data)
          .filter(Boolean) as MindMapNode[];
        const depNodes = Array.from(depIds)
          .map((id) => hierarchyMap.get(id)?.data)
          .filter(Boolean) as MindMapNode[];

        setHoveredNodeInfo({
          node: d.data,
          prerequisites: prereqNodes,
          dependents: depNodes,
        });

        // 1. Highlight links:
        // Prerequisite links glow in electric sky cyan with animated dash
        linkElements
          .transition()
          .duration(150)
          .attr('stroke', (l: any) => {
            const isTargetHovered = l.target.data.id === d.data.id;
            const isTargetPrereq = prereqIds.has(l.target.data.id);
            const isSourcePrereq = prereqIds.has(l.source.data.id);

            if (isTargetHovered || (isTargetPrereq && isSourcePrereq)) {
              return '#38bdf8'; // Electric Cyan for prerequisite flow
            }
            if (depIds.has(l.target.data.id) && (l.source.data.id === d.data.id || depIds.has(l.source.data.id))) {
              return '#34d399'; // Mint Emerald for unlocked downstream flow
            }
            return '#27272a'; // Dimmed for focus
          })
          .attr('stroke-width', (l: any) => {
            const isTargetHovered = l.target.data.id === d.data.id;
            const isTargetPrereq = prereqIds.has(l.target.data.id);
            const isSourcePrereq = prereqIds.has(l.source.data.id);

            if (isTargetHovered || (isTargetPrereq && isSourcePrereq)) {
              return 3.5;
            }
            if (depIds.has(l.target.data.id) && l.source.data.id === d.data.id) {
              return 2.5;
            }
            return 1;
          })
          .attr('stroke-dasharray', (l: any) => {
            const isTargetHovered = l.target.data.id === d.data.id;
            const isTargetPrereq = prereqIds.has(l.target.data.id);
            const isSourcePrereq = prereqIds.has(l.source.data.id);
            if (isTargetHovered || (isTargetPrereq && isSourcePrereq)) {
              return '6 3'; // Prerequisite directional flow dash
            }
            return l.target.data.category === 'formula' ? '4 2' : 'none';
          })
          .attr('opacity', (l: any) => {
            const isTargetHovered = l.target.data.id === d.data.id;
            const isTargetPrereq = prereqIds.has(l.target.data.id);
            const isSourcePrereq = prereqIds.has(l.source.data.id);
            const isDep = depIds.has(l.target.data.id);
            if (isTargetHovered || (isTargetPrereq && isSourcePrereq) || isDep) {
              return 1;
            }
            return 0.12; // Dim non-connected paths for pedagogical isolation
          });

        // 2. Highlight nodes:
        nodes
          .transition()
          .duration(150)
          .attr('opacity', (n: any) => {
            if (n.data.id === d.data.id || prereqIds.has(n.data.id) || depIds.has(n.data.id)) {
              return 1;
            }
            return 0.18; // Dim non-involved nodes
          });

        // Highlight node circle borders:
        nodes
          .selectAll('circle.node-core-circle')
          .transition()
          .duration(150)
          .attr('r', (n: any) => {
            const baseR = n.depth === 0 ? 18 : n.depth === 1 ? 14 : n.depth === 2 ? 10 : 7;
            if (n.data.id === d.data.id) return baseR + 4;
            if (prereqIds.has(n.data.id)) return baseR + 3;
            return baseR;
          })
          .attr('stroke', (n: any) => {
            if (n.data.id === d.data.id) return '#f59e0b'; // Amber Gold for hovered concept
            if (prereqIds.has(n.data.id)) return '#38bdf8'; // Cyan border for prerequisite concepts
            if (depIds.has(n.data.id)) return '#10b981'; // Emerald for unlocked forward concepts
            return '#18181b';
          })
          .attr('stroke-width', (n: any) => {
            if (n.data.id === d.data.id) return 4;
            if (prereqIds.has(n.data.id)) return 3.5;
            return 2.5;
          });

        // Highlight node labels:
        nodes
          .selectAll('text.node-label')
          .transition()
          .duration(150)
          .attr('fill', (n: any) => {
            if (n.data.id === d.data.id) return '#fbbf24'; // Gold
            if (prereqIds.has(n.data.id)) return '#38bdf8'; // Cyan
            if (depIds.has(n.data.id)) return '#34d399'; // Mint
            return n.depth <= 1 ? '#71717a' : '#52525b';
          })
          .attr('font-weight', (n: any) => {
            if (n.data.id === d.data.id || prereqIds.has(n.data.id)) return 'bold';
            return n.depth <= 1 ? 'bold' : 'normal';
          });
      })
      .on('mouseleave', () => {
        setHoveredNodeInfo(null);

        // Restore links
        linkElements
          .transition()
          .duration(200)
          .attr('stroke', '#3f3f46')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', (l: any) => (l.target.data.category === 'formula' ? '4 2' : 'none'))
          .attr('opacity', 0.85);

        // Restore nodes opacity
        nodes
          .transition()
          .duration(200)
          .attr('opacity', 1);

        // Restore node circles
        nodes
          .selectAll('circle.node-core-circle')
          .transition()
          .duration(200)
          .attr('r', (n: any) => (n.depth === 0 ? 18 : n.depth === 1 ? 14 : n.depth === 2 ? 10 : 7))
          .attr('stroke', '#18181b')
          .attr('stroke-width', 2.5);

        // Restore node labels
        nodes
          .selectAll('text.node-label')
          .transition()
          .duration(200)
          .attr('fill', (n: any) => (n.depth <= 1 ? '#f4f4f5' : '#d4d4d8'))
          .attr('font-weight', (n: any) => (n.depth <= 1 ? 'bold' : 'normal'));
      });
  }, [filterCategory, activeChapterId, masteries, currentTreeData]);

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
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Compass className="w-3 h-3" /> Pedagogical Flow
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Interactive visual hierarchy connecting core concepts, formulas, and prerequisite learning paths
            </p>
          </div>
        </div>

        {/* Subject Filter Pills and Graph Controls */}
        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Filter Pills */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-all text-[11px] ${
                filterCategory === 'all'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('physics')}
              className={`px-2.5 py-1 rounded-md transition-all text-[11px] ${
                filterCategory === 'physics'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Physics
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('math')}
              className={`px-2.5 py-1 rounded-md transition-all text-[11px] ${
                filterCategory === 'math'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Math
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory('chemistry')}
              className={`px-2.5 py-1 rounded-md transition-all text-[11px] ${
                filterCategory === 'chemistry'
                  ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Chemistry
            </button>
          </div>

          {/* Graph Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 text-xs transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 text-xs transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/40 text-xs transition-all flex items-center gap-1"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mastery Color Legend & Pedagogical Flow Tip */}
      <div className="px-4 py-2 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Mastery Heatmap:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>90%+ Mastered</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>80–89% Proficient</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>70–79% Learning</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Review</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Hover on any concept node to highlight connected prerequisite paths</span>
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

          {/* Floating Pedagogical Prerequisite Flow HUD */}
          {hoveredNodeInfo && (
            <div className="absolute top-3 left-3 right-3 z-10 p-3 bg-zinc-950/95 border border-cyan-500/50 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    Pedagogical Prerequisite Flow
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                    Mastery: {getNodeMasteryScore(hoveredNodeInfo.node, masteries)}%
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase font-semibold">
                    {hoveredNodeInfo.node.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Prerequisite Sequence Breadcrumbs */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {/* Prerequisites list */}
                {hoveredNodeInfo.prerequisites.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">PREREQUISITES:</span>
                    {hoveredNodeInfo.prerequisites.map((p) => {
                      const pScore = getNodeMasteryScore(p, masteries);
                      const isMastered = pScore >= 80;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectConceptById(p.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-200 text-[11px] font-medium transition-all group shadow-sm"
                          title="Click to view prerequisite details"
                        >
                          {isMastered ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-amber-400" />
                          )}
                          <span className="group-hover:underline">{p.name}</span>
                          <span
                            className={`text-[9px] font-mono px-1 rounded ${
                              isMastered ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {pScore}%
                          </span>
                        </button>
                      );
                    })}
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>Root Curriculum Foundation ➔</span>
                  </span>
                )}

                {/* Hovered Target Concept */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/70 text-amber-300 text-xs font-bold shadow-md">
                  <span>{hoveredNodeInfo.node.name}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500 text-zinc-950 font-extrabold">
                    CURRENT
                  </span>
                </div>

                {/* Downstream Unlocks */}
                {hoveredNodeInfo.dependents.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">UNLOCKS:</span>
                    {hoveredNodeInfo.dependents.slice(0, 2).map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleSelectConceptById(d.id)}
                        className="px-2 py-0.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[10px] transition-colors"
                      >
                        {d.name}
                      </button>
                    ))}
                    {hoveredNodeInfo.dependents.length > 2 && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        +{hoveredNodeInfo.dependents.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-3 bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2.5 py-1 text-[10px] font-mono text-zinc-400 backdrop-blur-xs">
            💡 Drag canvas to pan • Scroll to zoom • Hover over nodes to trace prerequisites
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

              {/* Real-Time Mastery Score Progress */}
              {(() => {
                const liveScore = getNodeMasteryScore(selectedNode, masteries);
                const attempts = masteries?.[selectedNode.id]?.attempts || 0;
                return (
                  <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Real-Time Concept Mastery</span>
                      <span
                        className={`font-bold ${
                          liveScore >= 90
                            ? 'text-emerald-400'
                            : liveScore >= 80
                            ? 'text-amber-400'
                            : liveScore >= 70
                            ? 'text-blue-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {liveScore}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          liveScore >= 90
                            ? 'bg-emerald-500'
                            : liveScore >= 80
                            ? 'bg-amber-500'
                            : liveScore >= 70
                            ? 'bg-blue-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${liveScore}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
                      <span>{attempts > 0 ? `${attempts} attempts tracked` : 'Curriculum baseline'}</span>
                      <span className="uppercase">{liveScore >= 90 ? 'Diamond Tier' : liveScore >= 80 ? 'Proficient' : 'In Practice'}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Pedagogical Prerequisites Section */}
              {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pedagogical Prerequisites</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400/80">
                      Learn First
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Master these foundational concepts to build a strong theoretical base before tackling this topic:
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {selectedNode.prerequisites.map((pId) => {
                      // Find prerequisite node
                      const findInNode = (curr: MindMapNode): MindMapNode | null => {
                        if (curr.id === pId) return curr;
                        if (curr.children) {
                          for (const ch of curr.children) {
                            const res = findInNode(ch);
                            if (res) return res;
                          }
                        }
                        return null;
                      };
                      const prereq = findInNode(NCERT_CONCEPT_TREE);
                      if (!prereq) return null;
                      const pScore = getNodeMasteryScore(prereq, masteries);
                      const isMastered = pScore >= 80;

                      return (
                        <button
                          key={pId}
                          type="button"
                          onClick={() => handleSelectConceptById(pId)}
                          className="w-full p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/30 text-left text-xs text-zinc-200 flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            {isMastered ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            )}
                            <span className="group-hover:text-cyan-300 font-medium">{prereq.name}</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isMastered ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {pScore}%
                          </span>
                        </button>
                      );
                    })}
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
                Click on any node in the D3 mind map to inspect its formula derivations, prerequisite foundations, and mastery progression.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
