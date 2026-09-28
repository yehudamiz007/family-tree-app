import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const FamilyTree = ({ data, onNodeClick }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!data || !data.people || data.people.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 600;

    // Build tree structure
    const buildTree = () => {
      const peopleMap = new Map(data.people.map(p => [p.id, { ...p, children: [] }]));
      const rootCandidates = new Set(data.people.map(p => p.id));

      // Process parent relationships
      data.relationships.forEach(rel => {
        if (rel.relationship_type === 'parent') {
          const parent = peopleMap.get(rel.person1_id);
          const child = peopleMap.get(rel.person2_id);
          if (parent && child) {
            parent.children.push(child);
            rootCandidates.delete(rel.person2_id);
          }
        }
      });

      // Find root (or create virtual root)
      let root;
      if (rootCandidates.size === 0) {
        root = { id: 'root', first_name: 'שורש', children: Array.from(peopleMap.values()) };
      } else if (rootCandidates.size === 1) {
        root = peopleMap.get(Array.from(rootCandidates)[0]);
      } else {
        root = { 
          id: 'root', 
          first_name: 'שורשים', 
          children: Array.from(rootCandidates).map(id => peopleMap.get(id)) 
        };
      }

      return root;
    };

    const rootData = buildTree();

    // Create hierarchy
    const hierarchy = d3.hierarchy(rootData, d => d.children);
    
    // Create tree layout
    const treeLayout = d3.tree()
      .size([height - 100, width - 200])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    const treeData = treeLayout(hierarchy);

    // Create SVG group with zoom
    const g = svg.append("g")
      .attr("transform", "translate(100,50)");

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Draw links
    g.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      )
      .style("fill", "none")
      .style("stroke", "#ccc")
      .style("stroke-width", "2px");

    // Draw nodes
    const node = g.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.data.id !== 'root') {
          onNodeClick(d.data);
        }
      });

    // Add circles
    node.append("circle")
      .attr("r", 20)
      .style("fill", d => {
        if (d.data.id === 'root') return '#ff6b6b';
        return d.data.gender === 'male' ? '#74b9ff' : 
               d.data.gender === 'female' ? '#fd79a8' : '#a29bfe';
      })
      .style("stroke", "#2d3436")
      .style("stroke-width", "2px");

    // Add labels
    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -25 : 25)
      .style("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(d => d.data.first_name + (d.data.last_name ? ` ${d.data.last_name}` : ''));

    // Add birth year
    node.append("text")
      .attr("dy", "1.5em")
      .attr("x", d => d.children ? -25 : 25)
      .style("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", "10px")
      .style("fill", "#666")
      .text(d => d.data.birth_date ? d.data.birth_date.split('-')[0] : '');

  }, [data, onNodeClick]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <svg 
        ref={svgRef} 
        width="100%" 
        height="100%"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
};

export default FamilyTree;