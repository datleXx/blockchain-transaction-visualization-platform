import React, { useState, useEffect } from 'react';
import { useNodeContext } from '../Main/NodeContext';
import neo4j, { DateTime, graph } from 'neo4j-driver';
import truncateAddress from '../Main/truncateAddress';
import Tooltip from '@mui/material/Tooltip';
import fetchTransactions from '../Main/backend/transactionFetch';

const driver = neo4j.driver('neo4j+s://c2eda242.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'dat12345678'));
const session = driver.session();

const transfer_records = await session.run('MATCH (n:account {addressId : "0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4"})-[r1]->(t:transfer {from_address:"0x8d08aad4b2bac2bb761ac4781cf62468c9ec47b4"})-[r2]->(m:account {addressId: t.to_address}) RETURN t')
export default function TransactionTable () {
    const { address, setAddress } = useNodeContext();
    const [transfers, setTransfers] = useState(transfer_records);
    const [timeLimit, setTimeLimit] = useState(false)
    const [message,setMessage] = useState("")

    //this function will convert the Unix code into real time 
    const TimeConverter = (timestamp) => {
        const date = new Date(timestamp * 1000)

        return date.toString()
    }
    //**This useEffect will be trigger when the address is changed, to fetch the corresponding transaction attached to that node */
    useEffect(() => {
        if (address != undefined) {
            try {
                const result = fetchTransactions(address)       //backend implementation
                .then(result => {
                    if (result.records.length != 0) {
                        setTransfers(result)    //store the result in the transfer variable
                    }
                })
            }
            catch (error) {
                setMessage("Unexpected Error:", error)
                setTimeLimit(true)

                setTimeout(()=>{
                    setTimeLimit(false)
                },3000)
            }
        }
    }, [address])

    //**This useEffect will store the fetched data into a transfer_records variable, this variable will be used to display the transaction */
    useEffect(() => {
        try {
            transfers.records.map(transfer => {
                if (!transfer_records.records.includes(transfer)) {
                    transfer_records.records.push(transfer)
                }
            })
            setMessage("Transactions loaded successfully")
            setTimeLimit(true)
        } catch (error) {
            setMessage("Unexpected error:", error)
            setTimeLimit(true)
        }
        setTimeout(() => {
            setTimeLimit(false)
        },3000)

    }, [transfers])

    return (
        <div className="overflow-x-auto mt-[100px]">
            <table className="min-w-full bg-white rounded-xl overflow-hidden table-responsive">
                <thead className=''>
                    <tr>
                        <th className="py-2 px-4 bg-blue-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 responsive-header">Sender</th>
                        <th className="py-2 px-4 bg-blue-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 responsive-header">Receiver</th>
                        <th className="py-2 px-4 bg-blue-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 responsive-header">Amount</th>
                        <th className="py-2 px-4 bg-blue-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 responsive-header">Hash</th>
                        <th className="py-2 px-4 bg-blue-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 responsive-header">Block Number</th>
                        <th className="py-2 px-4 bg-blue-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 responsive-header">Block Hash</th>
                        <th className="py-2 px-4 bg-blue-200 font-bold uppercase text-sm text-gray-600 border-b border-gray-200 responsive-header">Block Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {transfer_records.records.map((transaction) => (
                        <tr>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <Tooltip title={transaction._fields[0].properties.from_address} arrow>
                                    {truncateAddress(transaction._fields[0].properties.from_address)}
                                </Tooltip>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <Tooltip title={transaction._fields[0].properties.to_address} arrow>
                                    {truncateAddress(transaction._fields[0].properties.to_address)}
                                </Tooltip>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <Tooltip title={transaction._fields[0].properties.value.toString()} arrow>
                                    {transaction._fields[0].properties.value}
                                </Tooltip>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <Tooltip title={transaction._fields[0].properties.hash} arrow>
                                    {truncateAddress(transaction._fields[0].properties.hash)}
                                </Tooltip>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <Tooltip title={transaction._fields[0].properties.block_number} arrow>
                                    {transaction._fields[0].properties.block_number}
                                </Tooltip>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <Tooltip title={transaction._fields[0].properties.block_hash} arrow>
                                    {truncateAddress(transaction._fields[0].properties.block_hash)}
                                </Tooltip>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200 text-center">
                                <Tooltip title={transaction._fields[0].properties.block_timestamp} arrow>
                                    {TimeConverter(transaction._fields[0].properties.block_timestamp)}
                                </Tooltip>
                            </td>
                         
                            
                        </tr>
                    ))}
                </tbody>
            </table>
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
    );
}