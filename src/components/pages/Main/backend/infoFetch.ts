import neo4j from 'neo4j-driver';
import { useState } from 'react';

const infoFetch = async (address: String) => {
    const driver = neo4j.driver('neo4j+s://c2eda242.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'dat12345678'));
    const session = driver.session();

    //fetch data to display in InfoTable component
    let result = await session.run('MATCH (n:account {addressId :'+"'"+address+"'"+'}) RETURN n');
        //if the result array has length 0, means no data matched, in that case the function will perform another query
        if (result.records.length == 0){
            result = await session.run('MATCH (t: transfer {hash :'+"'"+address+"'"+'}) RETURN t'); 
        }
    return result; 
}

export default infoFetch;
