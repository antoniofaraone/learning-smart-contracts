const AuctionContract = artifacts.require("Auction.sol");

contract("Auction: development", (accounts) => {
  beforeEach(async () => {
    auction = await AuctionContract.new(
      prod_name,
      desc,
      base_price,
      incrementMin,
      endTime,
      imageURL
    );
  });
  let auction;
  const prod_name = "Name";
  const desc = "Description";
  const base_price = web3.utils.toWei("0.1");
  const incrementMin = web3.utils.toWei("0.1");
  const endTime = 1;
  const imageURL = "http://fakeimg.com";
  const auctioneer = accounts[0];

  describe("initialization", () => {
    it("New Auction", async () => {
      const { name, description, imgURL } = await auction.getDetailProduct();
      const actualOwner = await auction.auctioneer();
      assert.equal(name, prod_name, "should have the same name");
      assert.equal(desc, description, "should have the same description");
      assert.equal(imageURL, imgURL, "should have the same image");
      assert.equal(auctioneer, actualOwner, "should be the right auctioneer");
    });
  });

  describe("bids", () => {
    const value = web3.utils.toWei("0.1");
    const bidder = accounts[1];
    it("prop a valid bid", async () => {
      await auction.proposeBid({ from: bidder, value });
      const actualWinner = await auction.currentWinner();
      const actualbid = await auction.currentWinnerBid();
      assert.equal(actualbid, value, "should be 0.1 wei");
      assert.equal(actualWinner, bidder, "should be the current winner");
    });

    it("propose a non valid bid", async () => {
      await auction.proposeBid({ from: bidder, value });
      try {
        const little_bid = web3.utils.toWei("0.1");
        await auction.proposeBid({ from: bidder, value: little_bid });
        assert.fail("Only greather prop. must be accepted");
      } catch (e) {
        const expectedError =
          "Not greather bid: you should propos a greather bid";
        const actualError = e.reason;
        assert.equal(expectedError, actualError, "should not be permitted");
      }
    });

    it("emits the ProposedBid event", async () => {
      const tx = await auction.proposeBid({ from: bidder, value });
      const expectedEvent = "ProposedBid";
      const actualEvent = tx.logs[0].event;
      assert.equal(actualEvent, expectedEvent, "events should match");
    });

    it("transfer balance to the auctioneer", async () => {
      const bid = web3.utils.toWei("0.1");
      await auction.proposeBid({ from: accounts[2], value: bid });

      const currentContractBalance = await web3.eth.getBalance(auction.address);
      const currentAuctioneerBalance = await web3.eth.getBalance(
        await auction.auctioneer()
      );
      assert.equal(bid, currentContractBalance, "current deposit amount");
      await auction.closeAuction({ from: auctioneer });
      const newContractBalance = await web3.eth.getBalance(auction.address);
      assert.equal(newContractBalance, 0, "sould have a 0 balance");

      await auction.closeAuction({ from: await auction.auctioneer() });
      const newAuctioneerBalance = await web3.eth.getBalance(
        await auction.auctioneer()
      );

      assert.isAbove(
        Number(newAuctioneerBalance),
        Number(currentAuctioneerBalance),
        "auctioneer should receive all the funds"
      );
    });
  });
});
