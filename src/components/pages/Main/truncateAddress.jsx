const truncateAddress = (address) => {
    return address.substring(0, 4) + "..." + address.substring(address.length - 4);     //shorten form of the address for better visualization of the graph or transaction table
};

export default truncateAddress;
