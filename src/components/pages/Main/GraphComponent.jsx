import {React, useState, useEffect} from "react";
import "@react-sigma/core/lib/react-sigma.min.css";
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer,ControlsContainer,
  ZoomControl,
  FullScreenControl,
  useLoadGraph, 
  useSigma,
  useRegisterEvents} from "@react-sigma/core";
import GraphEvents from "./GraphEvent";
import DragNdrop from "./DragAndDrop";
import neo4j, { graph } from 'neo4j-driver';
import InfoTable from "./InfoTable";
import NodeContext, { useNodeContext }  from "./NodeContext";
import truncateAddress from "./truncateAddress";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { useWorkerLayoutForce,
LayoutForceControl} from "@react-sigma/layout-force";
import { useLayoutRandom } from "@react-sigma/layout-random";
import { useWorkerLayoutForceAtlas2, 
LayoutForceAtlas2Control,
useLayoutForceAtlas2} from "@react-sigma/layout-forceatlas2";
import { SearchControl } from "./SearchControl";
import fetchData from "./backend/server";
import forceAtlas2 from "graphology-layout-forceatlas2";

//initial data, after this data will be fetched using the backend function
const driver = neo4j.driver('neo4j+s://c2eda242.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'dat12345678'));
const session = driver.session();

const node_records = await session.run('MATCH (n:account {addressId : "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4"})  RETURN n');
const rel_records = await session.run('MATCH (n:account {addressId : "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4"})-[r1]->(t:transfer {from_address:"0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4"})-[r2]->(m:account {addressId: t.to_address}) RETURN r1,r2')
const transfer_records = await session.run('MATCH (n:account {addressId : "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4"})-[r1]->(t:transfer {from_address:"0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4"})-[r2]->(m:account {addressId: t.to_address}) RETURN t')

const GraphComponent = () => {
  //the address context used to store the address of the clicked node
  const {address,setAddress} = useNodeContext();
  //these 3 following useStates is used to store the fetched data
  const [nodes,setNodes] = useState(node_records); 
  const[rels,setRels] = useState(rel_records);
  const[transfers,setTransfers]= useState(transfer_records); 
  //this useState is used to display the message, improving user friendly
  const [message,setMessage] = useState("");
  const [timeLimit, setTimeLimit] = useState(false)
  const graph = new MultiDirectedGraph();

  //function to set the color of the edge that will be used later on
  const edgeColor = (StartNode,EndNode) => {
    let color; 
    if (address == StartNode){ 
      color = "rgb(41,209,125)"
    }
    else if (address == EndNode){
      color = "rgb(230,31,71)"
    }
    else {
      color = "rgb(0,0,0)"
    }
    return color;
  }

  //whenever a node is clicked, the address changes, 
  //this use effect will be triggered to fetch data from the server
  //using the fetchData backend function
  useEffect(()=>{
    if (address != undefined) {
      try {
        const response = fetchData(address)
        .then (response => {
          if (response.nodes){
            setNodes(response.nodes)
          }
          if (response.rels){
            setRels(response.rels)
          }
          if (response.transfers){
            setTransfers(response.transfers)
          }
        })
      } catch (error) {
        console.log('Error fetching data:' + error)
      }
    }
  },[address])

  //after the data is fetched
  //this useEffect hook will be triggered to loaded the fetched data into the array of nodes, edges and transfers
  //that will be used to load into the graph
  useEffect(()=> {
    try {
      nodes.records.map(node => {
        if (!node_records.records.includes(node)){
          node_records.records.push(node)
          //nodes.records.splice(nodes.records.indexOf(node),1)
        }
      })
      rels.records.map(rel => {
        if (!rel_records.records.includes(rel)){
          rel_records.records.push(rel)
          //rels.records.splice(rels.records.indexOf(rel),1)
        }
      })
      transfers.records.map(transfer => {
        if (!transfer_records.records.includes(transfer)){
          transfer_records.records.push(transfer)
          //transfers.records.splice(transfers.records.indexOf(transfer),1)
        }
      })
    } catch(error) {
      console.log("Error mapping: " + error)
    }
  },[nodes])


  // Create a graph with layout
  const Graph = () => {
    const {position,assign} = useLayoutCircular()
    const loadGraph = useLoadGraph();
    const { start,stop, kill, isRunning } = useWorkerLayoutForceAtlas2({ settings: {slowDown:10, gravity:0, scalingRatio: 0.001}});
    useEffect(() =>{
    if (node_records.records.length > 1){
      try {

        //loop through the list of node, check if the node exist in the graph, then load it into the graph
        node_records.records.map(node => {
          if (!graph.hasNode(node._fields[0].properties.addressId)){
            graph.addNode(node._fields[0].properties.addressId,
             {x:0, y:0,
              label:truncateAddress(node._fields[0].properties.addressId), 
              acctype: node._fields[0].properties.type, 
              walletId: node._fields[0].properties.addressId, 
              size:5, 
              color:address == node._fields[0].properties.addressId? "rgb(255,247,0)" : "rgb(153,155,159)" 
              })
            }
          }
        )
        
        //loop through the list of transfer nodes, check if the node exist in the graph, then load it into the graph
        transfer_records.records.map(transferNode => {
          if (!graph.hasNode(transferNode._fields[0].properties.hash)){
            graph.addNode(transferNode._fields[0].properties.hash,
              {x:0, y:0,
               label:truncateAddress(transferNode._fields[0].properties.hash), 
               value: transferNode._fields[0].properties.value, 
               hash: transferNode._fields[0].properties.hash,
               from: transferNode._fields[0].properties.from_address,
               to:transferNode._fields[0].properties.to_address, 
               size:5, 
               color:"#B30095" 
               })
          }
        })

        //loop through the list of edges, check if the edge exist in the graph, then load it into the graph
        rel_records.records.map(relationship => 
          {
            relationship._fields.map(rel => {
              if (!graph.hasEdge(rel.elementId)){
                graph.addEdgeWithKey(
                  rel.elementId, 
                  rel.properties.start , 
                  rel.properties.end ,
                  {type:'arrow',
                  size:address == rel.properties.start? 4 : 2, 
                  hash:rel.properties.hash, 
                  value:rel.properties.value,
                  start: rel.properties.start, 
                  end: rel.properties.end ,
                  from: rel.properties.from,
                  to: rel.properties.to,
                  color: edgeColor(rel.properties.from,
                    rel.properties.to),
                  }
                )
                  }
                }
              )
            }
          )
        
        //set the message to displayed on to the screen 
        setMessage("Nodes, Edges added successfully !")
        setTimeLimit(true)
      }
      catch (error) {
        setMessage("Unexpected errors:" + error)
        setTimeLimit(true)
      }

    } else{
      if (!graph.hasNode(node_records.records[0]._fields[0].properties.addressId)){
        graph.addNode(node_records.records[0]._fields[0].properties.addressId, {x:0, y:0,label:truncateAddress(node_records.records[0]._fields[0].properties.addressId), acctype: node_records.records[0]._fields[0].properties.type, walletId: node_records.records[0]._fields[0].properties.addressId, size:5, color:address == node_records.records[0]._fields[0].elementId? "rgb(255,247,0)" : "rgb(153,155,159)" })
      }
    }

    //set the limit of the displayed message to 3 secs
    setTimeout(() => {
        setTimeLimit(false); 
      }, 3000)

    console.log(graph)

    assign()
  },[node_records, transfer_records, rel_records])

  //start the layout when the component mounts and kill the layout when the component unmounts
  useEffect(() => {
    loadGraph(graph)
    start();
    return () => {
      kill();
    }
  }, [start,kill]);
  }
 
  

  return (

    <div className="flex md:flex-row justify-between my-6 items-center flex-col">
          
          {/* components stored inside nodecontext provider to have access to the context */}
                <div>
                    <InfoTable/>
                </div>
        
                <SigmaContainer style={{height:"400px"}}>
                  <DragNdrop/>
                  <GraphEvents/>
                  <Graph/>
                  <ControlsContainer position={"bottom-left"}>
                    <ZoomControl/>
                    <FullScreenControl />
                  </ControlsContainer>
                    <SearchControl labels={{
                          text: "Search for a node",
                          placeholder: "Start typing..."
                      }} style={{ width: "200px" ,
                                position: "absolute",
                                top: "60px",
                                right: "10px",
                                background: "white",
                                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)"}} />
                </SigmaContainer>
                <div className={!timeLimit ? "hidden" : ""} style={{
                  color: "red",
                  border: "1px solid red",
                  position: "fixed",
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "10px"}}>
                      {message}
              </div>                  
    </div>
    
  ) 
};

export default GraphComponent;