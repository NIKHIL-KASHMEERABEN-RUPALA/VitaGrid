import React, { useState } from 'react';
import { Network, ChevronDown, ChevronRight, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { DEPOT_TREE_DATA } from '../../data/supplyChainData';
import { DepotTreeNode } from '../../types/supplyChain';

interface HierarchyTreeProps {
  onSelectDepot?: (depotName: string) => void;
  onScanVulnerability?: (nodeName: string) => void;
}

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  onSelectDepot,
  onScanVulnerability,
}) => {
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [scanningNodeId, setScanningNodeId] = useState<string | null>(null);

  const toggleNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleScan = (nodeName: string, nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setScanningNodeId(nodeId);
    setTimeout(() => {
      setScanningNodeId(null);
      if (onScanVulnerability) onScanVulnerability(nodeName);
      if (onSelectDepot) onSelectDepot(nodeName);
    }, 500);
  };

  const getBadgeStyle = (variant: string) => {
    switch (variant) {
      case 'green':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold';
      case 'solid-red':
        return 'bg-red-600 text-white font-bold shadow-2xs';
      case 'red':
        return 'bg-red-100 text-red-700 border border-red-200 font-semibold';
      case 'watchlist':
        return 'bg-slate-100 text-slate-700 border border-slate-200 font-medium';
      case 'stable':
        return 'bg-blue-50 text-blue-700 border border-blue-200 font-medium';
      case 'nominal':
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200 font-medium';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs p-4 flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-blue-600">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Hierarchy Depot Tree
            </h3>
          </div>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200">
            5 Levels
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Multi-echelon distribution network status and downstream fulfillment channels.
        </p>

        {/* Tree Container */}
        <div className="space-y-2 text-xs">
          {/* Root: National Strategic Hub */}
          <div
            onClick={() => onSelectDepot && onSelectDepot('Nairobi Central Hub')}
            className="flex items-center justify-between p-2 rounded-md bg-blue-50/40 border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleNode(DEPOT_TREE_DATA.id, e)}
                className="w-4 h-4 rounded flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                {collapsedNodes[DEPOT_TREE_DATA.id] ? (
                  <ChevronRight className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
              <div>
                <div className="font-bold text-slate-900 leading-tight">
                  {DEPOT_TREE_DATA.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {DEPOT_TREE_DATA.subtitle}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => handleScan(DEPOT_TREE_DATA.name, DEPOT_TREE_DATA.id, e)}
                title="Scan downstream fulfillment vulnerability"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 font-medium"
              >
                <Activity className={`w-2.5 h-2.5 ${scanningNodeId === DEPOT_TREE_DATA.id ? 'animate-spin' : ''}`} />
                <span>Scan</span>
              </button>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${getBadgeStyle(
                  DEPOT_TREE_DATA.badgeVariant
                )}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {DEPOT_TREE_DATA.badgeText}
              </span>
            </div>
          </div>

          {/* Children Echelons */}
          {!collapsedNodes[DEPOT_TREE_DATA.id] && (
            <div className="pl-3.5 ml-2 border-l border-slate-200 space-y-2 pt-1">
              {DEPOT_TREE_DATA.children?.map((child) => (
                <div key={child.id} className="space-y-1.5">
                  {/* Branch Level 1 */}
                  <div
                    onClick={() => onSelectDepot && onSelectDepot(child.subtitle)}
                    className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleNode(child.id, e)}
                        className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 group-hover:text-slate-600"
                      >
                        {collapsedNodes[child.id] ? (
                          <ChevronRight className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                      <div>
                        <div className="font-semibold text-slate-800 leading-tight">
                          {child.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {child.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleScan(child.name, child.id, e)}
                        title="Scan downstream fulfillment vulnerability"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 font-medium"
                      >
                        <Activity className={`w-2.5 h-2.5 ${scanningNodeId === child.id ? 'animate-spin' : ''}`} />
                        <span>Scan</span>
                      </button>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${getBadgeStyle(
                          child.badgeVariant
                        )}`}
                      >
                        {child.badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Sub-children Level 2 */}
                  {!collapsedNodes[child.id] && child.children && (
                    <div className="pl-4 ml-2 border-l border-slate-200 space-y-1.5 py-0.5">
                      {child.children.map((subChild) => (
                        <div
                          key={subChild.id}
                          onClick={() => onSelectDepot && onSelectDepot(subChild.name)}
                          className="flex items-center justify-between py-1 px-1 rounded hover:bg-slate-50 transition-colors cursor-pointer group"
                        >
                          <div>
                            <div className="font-medium text-slate-800 leading-tight">
                              {subChild.name}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {subChild.subtitle}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleScan(subChild.name, subChild.id, e)}
                              title="Scan downstream fulfillment vulnerability"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-700 hover:underline flex items-center gap-0.5 font-medium"
                            >
                              <Activity className={`w-2.5 h-2.5 ${scanningNodeId === subChild.id ? 'animate-spin' : ''}`} />
                              <span>Scan</span>
                            </button>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded ${getBadgeStyle(
                                subChild.badgeVariant
                              )}`}
                            >
                              {subChild.badgeText}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Active Echelon Fill Rate */}
      <div className="pt-4 border-t border-slate-100 mt-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 tracking-wider uppercase mb-2">
          <span>ACTIVE ECHELON FILL RATE</span>
          <span className="text-slate-900 font-extrabold">91.4%</span>
        </div>

        {/* Triple-segmented progress bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full" style={{ width: '74%' }} title="Normal: 74%"></div>
          <div className="bg-amber-400 h-full" style={{ width: '17%' }} title="Warning: 17%"></div>
          <div className="bg-red-600 h-full" style={{ width: '9%' }} title="Stockout: 9%"></div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Stockout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
