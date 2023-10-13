const truncateAddress = (address) => {
    return address.substring(0, 4) + "..." + address.substring(address.length - 4);
};

export default truncateAddress;
