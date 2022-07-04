const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentraBank = artifacts.require("DecentraBank");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Tether);
  await deployer.deploy(RWD);

  // get the deployed Reward Contract
  const rwd = await RWD.deployed();

  // get the deployed Tether Contract
  const tether = await Tether.deployed();

  await deployer.deploy(DecentraBank, rwd.address, tether.address);
  const decentraBank = await DecentraBank.deployed();

  //  tranfer all rwd tokens to the DecentraBank
  await rwd.transfer(decentraBank.address, "1000000000000000000000000");

  // distribute 100 tether tokens to each investor

  await tether.transfer(accounts[1], "100000000000000000000");
};
