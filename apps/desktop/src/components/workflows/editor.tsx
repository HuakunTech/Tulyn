import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  addEdge,
  type OnConnect,
  type Edge,
} from "reactflow";
import { trace, info, error, attachConsole } from "@tauri-apps/plugin-log";
import TextUpdaterNode from "./TextUpdateNode.tsx";

const initialEdges = [
  { id: "1-2", source: "1", target: "2", label: "pass", animated: true },
] satisfies Edge[];

const initialNodes = [
  {
    id: "1",
    data: { label: "File Filter" },
    position: { x: 0, y: 0 },
    type: "input",
  },
  {
    id: "2",
    data: { label: "Open with App" },
    position: { x: 100, y: 100 },
  },
];

const nodeTypes = { textUpdater: TextUpdaterNode };

export function FlowEditor() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges],
  );
  useEffect(() => {
    info("FlowEditor loaded");
  }, []);

  return (
    <div className="h-full">
      <ReactFlow
        nodes={nodes}
        // nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        // edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
