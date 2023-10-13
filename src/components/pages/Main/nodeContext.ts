import {createContext, useContext } from "react";

//initialize context for later use in graphcomponent.js
const NodeContext = createContext(undefined); 

export default NodeContext;

export function useNodeContext(){
    return useContext(NodeContext) 
}
