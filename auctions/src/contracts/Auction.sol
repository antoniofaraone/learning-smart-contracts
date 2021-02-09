// SPDX-License-Identifier: UNLICENSED"
pragma solidity >=0.4.0 <=0.9.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract Auction is Ownable {
    // Variables
    uint256 public basePrice;
    uint256 public incrementMin;
    uint256 public currentWinnerBid;
    uint256 public beginTime;
    uint256 public endTime;
    address payable public auctioneer;
    address public currentWinner;

    // Structs
    struct Product {
        string name;
        string description;
        string imgURL;
    }
    Product public product;

    //Events
    event ProposedBid(address indexed bidder, uint256 value);
    event CloseAuction(uint256 amount);

    constructor(
        string memory productName,
        string memory description,
        uint256 _basePrice,
        uint256 _incrementMin,
        uint256 _endTime,
        string memory imageURL
    ) public {
        basePrice = _basePrice;
        incrementMin = _incrementMin;
        beginTime = now;
        endTime = _endTime;
        auctioneer = msg.sender;

        Product memory p =
            Product({
                name: productName,
                description: description,
                imgURL: imageURL
            });
        product = p;
    }

    //functions

    function proposeBid() public payable onlyGreatherBid(msg.value) {
        currentWinnerBid = msg.value;
        currentWinner = msg.sender;

        emit ProposedBid(msg.sender, msg.value);
    }

    function getDetailProduct()
        public
        view
        returns (
            string memory name,
            string memory description,
            string memory imgURL
        )
    {
        return (product.name, product.description, product.imgURL);
    }

    function closeAuction() public onlyOwner {
        uint256 balance = address(this).balance;
        auctioneer.transfer(balance);

        emit CloseAuction(balance);
    }

    //modifiers
    modifier onlyGreatherBid(uint256 _bid) {
        require(
            _bid > currentWinnerBid,
            "Not greather bid: you should propos a greather bid"
        );
        _;
    }
}
