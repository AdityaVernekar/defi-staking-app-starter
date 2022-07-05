const assert = require("assert");

const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentraBank = artifacts.require("DecentraBank");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("DecentraBank", ([owner, customer]) => {
  let tether, rwd, decentraBank;

  const tokens = (number) => {
    return web3.utils.toWei(number, "ether");
  };

  before(async () => {
    // load the deployed contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentraBank = await DecentraBank.new(rwd.address, tether.address);

    // transfer all rwd tokens to the DecentraBank
    await rwd.transfer(decentraBank.address, tokens("1000000"));

    // distribute 100 tether tokens to each investor
    await tether.transfer(customer, tokens("100"), { from: owner });
  });

  describe("Mock Tether Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await tether.name();
      assert.equal(name, "Tether");
    });
  });
  describe("Reward Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await rwd.name();
      assert.equal(name, "Reward Token");
    });
  });

  describe("DecentraBank Deployment", async () => {
    it("matches name successfully", async () => {
      const name = await decentraBank.name();
      assert.equal(name, "DecentraBank");
    });
    it("contract has tokens", async () => {
      let balance = await rwd.balanceOf(decentraBank.address);
      assert.equal(balance, tokens("1000000"));
    });

    describe("Yield Farming", async () => {
      it("Reward token for staking", async () => {
        let result = await tether.balanceOf(customer);
        assert.equal(result.toString(), tokens("100"), "customer has 100 tether tokens");
        // stake 100 tether tokens
        await tether.approve(decentraBank.address, tokens("100"), { from: customer });
        await decentraBank.depositTokens(tokens("100"), { from: customer });
        result = await tether.balanceOf(customer);
        assert.equal(result.toString(), tokens("0"), "customer has 0 tether tokens");

        let bankBalance = await tether.balanceOf(decentraBank.address);
        assert.equal(bankBalance.toString(), tokens("100"), "bank has 100 tether tokens");

        let hasStaked = await decentraBank.isStaking(customer);
        assert.equal(hasStaked.toString(), "true", "customer has staked");
      });
      it("If rewards are successful", async () => {
        await decentraBank.issueTokens({ from: owner });
        await decentraBank.issueTokens({ from: customer }).should.be.rejected;
      });
      it("Unstake tokens", async () => {
        await decentraBank.unstakeTokens({ from: customer });
        result = await tether.balanceOf(customer);
        assert.equal(result.toString(), tokens("100"), "customer has 100 tether tokens");

        let bankBalance = await tether.balanceOf(decentraBank.address);
        assert.equal(bankBalance.toString(), tokens("0"), "bank has 0 tether tokens");

        let hasStaked = await decentraBank.isStaking(customer);
        assert.equal(hasStaked.toString(), "false", "customer has unstaked");
      });
    });
  });
});
