import neo4j from 'neo4j-driver';
import { useState } from 'react';

//the function accept an address prop in string type
const fetchTransactions = async (address: String) => {
    //connect to the server 
    const driver = neo4j.driver('neo4j+s://c2eda242.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'dat12345678'));
    const session = driver.session();
    
    //fetch the transaction data
    const result = await session.run('MATCH (n:account {addressId :' + "'" + address + "'" + '})-[r1]->(t:transfer {from_address: ' + "'" + address + "'" + '})-[r2]->(m:account {addressId: t.to_address}) RETURN t');

    return result;
}

export default fetchTransactions; 