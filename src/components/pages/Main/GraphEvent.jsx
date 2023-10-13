import { SigmaContainer, useRegisterEvents, useSigma, useSetSettings, useLoadGraph } from "@react-sigma/core";
import {useState,useEffect} from "react";
import {useNodeContext} from "./NodeContext";
import neo4j, { graph } from 'neo4j-driver';


export default function GraphEvents () {

    const registerEvents = useRegisterEvents();
    const {address, setAddress} = useNodeContext();
    const [hoveredNode, setHoveredNode] = useState(null);
    const [selectedNode, setSelectedNode] = useState(null)
    const setSettings = useSetSettings();
    const sigma = useSigma();
    
    // Highlighting selected nodes and edges
    useEffect(() => {
      setSettings({
        // setting for when a node is selected
        nodeReducer: (node,data) => {
          const graph = sigma.getGraph(); 
          const newData = { ...data, highlighted: data.highlighted}

          if (selectedNode){
            if (node == selectedNode || graph.neighbors(selectedNode).includes(node)){
              newData.highlighted = true
            }
            else{
              newData.highlighted = false
            }
          }
          return newData
        },
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };

          if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)){
            newData.color = "#D3D3D3";
            newData.size = 8;`1`
          }
          else if (hoveredNode && graph.extremities(edge).includes(hoveredNode)){
            newData.color = "#000033";
            newData.size = 13;
          }
          return newData;
        },
      });
    }, [hoveredNode,selectedNode, setSettings, sigma]);

    useEffect(() => {
      // Register the events
      registerEvents({
        enterNode: (event) => setHoveredNode(event.node),
        leaveNode: () => setHoveredNode(null),
        clickNode: (event) => 
        {
          const clicked = event.node
          console.log(clicked)
          setAddress(clicked)
          setSelectedNode(clicked)
        }
      });
    }, [registerEvents,address, selectedNode]);

    return null;
  };