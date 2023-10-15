import {LiaArrowCircleLeftSolid,LiaArrowCircleRightSolid} from "react-icons/lia";
import React, { useEffect, useState } from "react";
import neo4j from 'neo4j-driver';
import { useNodeContext } from "./NodeContext";        
import infoFetch from "./backend/infoFetch"; 
import fetchBalance from "./backend/balanceFetch";

const InfoTable = () => {
    //set the clicked node prepare for displaying data
    const {address, setAddress} = useNodeContext(); //implement the context to get the address from other component
    const [node, setNode] = useState()
    //these usestates is use to check if a node is clicked or not, and if that node is an account node or a transfer node
    const [nodeClicked, setNodeClicked] = useState(false)
    const [accountNode, setAccountNode] = useState(false)
    //this useState used to store the fetched balance from etherium node
    const [balance, setBalance] = useState(); 

    useEffect(() => { 
        if (address != undefined) {
            try {
                const result = infoFetch(address)
                .then(result => {                   // this useEffect will use the infoFetch from backend folder to get the node's data
                    setNode(result)
                    setNodeClicked(true)
                } )
            }
            catch (error) {
                console.log("Error getting table info's data:", error)
            } 

            if (accountNode) {
                try {
                    const result = fetchBalance(address)
                    .then(result => {
                        setBalance(result.toString()) //retrieve the balance of the node being fetched using etherium node
                    } )

                }
                catch (error) {
                    console.log("Error getting node's balance:", error)
                } 
            }
        }
    },[address])

    useEffect(() => {
        if (node != undefined){
            if (node.records[0]._fields[0].labels[0] == "account"){ 
                setAccountNode(true)
            }
            else {                          //logic to check if the node is an account or a transfer node
                setAccountNode(false)
            }
        }
    },[node])

    const [click, setClick] = useState(false)
    const handleClick =() =>
    {           
        setClick(!click)            //set the state of the arrow icon, 
    }

    

    return (
        <div className="flex justify-between items-center">
            <div className="mx-3 my-5 border-r ">
                <div className="font-arial my-4 w-full">
                    <div>
                        <div className="flex justify-between items-center">
                            <p className={!click?"font-semibold text-lg ease-in-out duration-500":"fixed right-[100%]"} >
                                 {node != undefined && accountNode  ? "Account Details" : node != undefined && !accountNode ? "Transaction Details" : "Account Details"}
                            </p>
                            <div onClick={handleClick}>
                                {!click ? <LiaArrowCircleLeftSolid size={20} /> : <LiaArrowCircleRightSolid size={20}/>}
                            </div>
                        </div>
                        <p className={!click?"hover:text-[#4b64d1] font-bold text-xl text-center my-3":"fixed right-[100%]"}> 
                            {node != undefined && accountNode ? node.records[0]._fields[0].properties.addressId : node != undefined && !accountNode ?  node.records[0]._fields[0].properties.hash : "N/A"}
                        </p>
                    </div>
                </div>
                <div className={!click ? "text-sm border border-t-3 border-x-0 border-b-0 ease-linear duration-500" : "fixed right-[100%]"}>
                    <table className="w-full">
                        <tbody className="p-4 text-left">
                        <tr className="">
                            <th className="py-2 font-normal">
                                {node != undefined && accountNode ? "Account Type" : node != undefined && !accountNode ?  "Transaction Hash" : "Account Type"}
                            </th>
                            <td className="px-3 font-bold text-right text-gray-400">
                                {node != undefined && accountNode ? node.records[0]._fields[0].properties.type : node != undefined && !accountNode ?  node.records[0]._fields[0].properties.hash : "N/A"}
                            </td>
                        </tr>
                        <tr className={node != undefined && !accountNode ? "hidden" : node == undefined ? "hidden" : ""}>
                            <th className="py-2 font-normal">Balance</th>
                            <td className="px-3 font-bold text-right text-gray-400">{balance}</td>
                        </tr>
                        <tr className={node != undefined && accountNode ? "hidden" : node == undefined ? "hidden" : ""}>
                            <th className="py-2 font-normal">From</th>
                            <td className="px-3 font-bold text-right text-gray-400">{node != undefined && !accountNode ? node.records[0]._fields[0].properties.from_address : "N/A"}</td>
                        </tr>
                        <tr className={node != undefined && accountNode ? "hidden" : node == undefined ? "hidden" : ""}>
                            <th className="py-2 font-normal">To</th>
                            <td className="px-3 font-bold text-right text-gray-400">{node != undefined && !accountNode ? node.records[0]._fields[0].properties.to_address : "N/A"}</td>
                        </tr>
                        <tr className={node != undefined && accountNode ? "hidden" : node == undefined ? "hidden" : ""}>
                            <th className="py-2 font-normal">Amount</th>
                            <td className="px-3 font-bold text-right text-gray-400">{node != undefined && !accountNode ? node.records[0]._fields[0].properties.value : "N/A"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    
    );
  };
  export default InfoTable;