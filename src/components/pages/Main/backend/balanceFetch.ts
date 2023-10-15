import Web3 from "web3";

//etherium node API
const web3 = new Web3("https://mainnet.infura.io/v3/6725306487624c2e8da91c6f255f7865"); 

const fetchBalance = async (address: string) => {

    const balance = await web3.eth.getBalance(address);
    console.log(typeof(balance))
    
    return balance; 
}

export default fetchBalance; 