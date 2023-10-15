import neo4j from 'neo4j-driver';
import { useState } from 'react';

const fetchArray = new Array<string>()
const fetchData = async (address: string) => {
    const driver = neo4j.driver('neo4j+s://c2eda242.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'dat12345678'));
    const session = driver.session();

    const data = {
        nodes: await session.run('MATCH (n:account {addressId :'+"'"+ address +"'"+'})-[r1]->(t:transfer {from_address: ' + "'" + address + "'" + '})-[r2]->(m:account {addressId: t.to_address})  RETURN DISTINCT m'),
        rels: await session.run('MATCH (n:account {addressId :'+"'"+ address +"'"+'})-[r1]->(t:transfer {from_address: ' + "'" + address + "'" + '})-[r2]->(m:account {addressId: t.to_address}) RETURN DISTINCT r1,r2'),
        transfers: await session.run('MATCH (n:account {addressId :'+"'"+ address +"'"+'})-[r1]->(t:transfer {from_address: ' + "'" + address + "'" + '})-[r2]->(m:account {addressId: t.to_address}) RETURN t'),  
    }
    
    return data ; 
}

export default fetchData;
