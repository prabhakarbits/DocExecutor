pragma solidity >=0.4.21 <0.7.0;

contract Purchasedocexs {

    // declare purchaserdocex
    address[16] public purchaserdocex;

    // function to purchase, accepts and returns vars of type integer
    function purchase(uint reId) public returns (uint) {
        // check if reId in range of purchaserdocex array
        require(reId >= 0 && reId <= 15);

        // if in range
        // msg.sender is address of person or smart contract who called function
        purchaserdocex[reId] = msg.sender;

        // return reId as confirmation
        return reId;
    }

    // Retrieve purchaserdocex
    function getPurchasers() public view returns ( address[16] memory) {
        return purchaserdocex;
    }

}