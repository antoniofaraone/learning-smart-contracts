// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity >=0.4.22 <0.9.0;
import "./Auction.sol";

contract AuctionFactory {
    uint256 constant maxLimit = 20;

    Auction[] private _auctions;

    event AuctionCreated(Auction indexed auctions, address indexed owner);

    function createAuction(
        string memory productName,
        string memory description,
        uint256 _basePrice,
        uint256 _incrementMin,
        uint256 _endTime,
        string memory imageURL
    ) public {
        Auction auction =
            new Auction(
                productName,
                description,
                _basePrice,
                _incrementMin,
                _endTime,
                imageURL
            );
        _auctions.push(auction);
        emit AuctionCreated(auction, msg.sender);
    }

    function auctions(uint256 limit, uint256 offset)
        public
        view
        returns (Auction[] memory coll)
    {
        require(offset <= auctionCount(), "offset out of bounds");

        uint256 size = auctionCount() - offset;
        size = size < limit ? size : limit;
        size = size < maxLimit ? size : maxLimit;
        coll = new Auction[](size);

        for (uint256 i = 0; i < size; i++) {
            coll[i] = _auctions[offset + i];
        }

        return coll;
    }

    function auctionCount() public view returns (uint256) {
        return _auctions.length;
    }
}
