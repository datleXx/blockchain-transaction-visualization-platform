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
            //this will highlight the selected node
            if (node == selectedNode){
              newData.highlighted = true
            }
            else{
              newData.highlighted = false
            }
          }
          return newData
        },
        //setting for edge when a node is hovered but not clicked
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };

          if (hoveredNode != null){
            //if the edge source or end node address equal to the hovered node address --> bold the connection otherwise will be hidden
            if (graph.getEdgeAttributes(edge).from == hoveredNode || graph.getEdgeAttributes(edge).to == hoveredNode){
              // newData.color = "#000033";
              //newData.size = 5;
              newData.hidden = false; 
            }
            else if ((graph.getEdgeAttributes(edge).start == hoveredNode || graph.getEdgeAttributes(edge).end == hoveredNode) && (graph.getEdgeAttributes(edge).start != graph.getEdgeAttributes(edge).from || graph.getEdgeAttributes(edge).end != graph.getEdgeAttributes(edge).to)){
              // newData.color = "#000033";
              //newData.size = 5;
              newData.hidden = false; 
            }
            else {
              newData.hidden = true; 
            }
          }
          return newData;
        },
      });
    }, [hoveredNode,selectedNode, setSettings, sigma]);

    useEffect(() => {
      // Register the events
      registerEvents({
        enterNode: (event) => setHoveredNode(event.node), //when the mouse enter a node --> set the hovered node to be that node
        leaveNode: () => setHoveredNode(null), // when the mouse leave that hovered node --> set the hovered node to be null
        clickNode: (event) => 
        {
          const clicked = event.node
          console.log(clicked)
          setAddress(clicked)
          setSelectedNode(clicked)
          setHoveredNode(null)
        }
      });
    }, [registerEvents,address, selectedNode]);

    return null;
  };