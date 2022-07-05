let DecentraBank = artifacts.require("DecentraBank");

module.exports = async function issueRewards(cb) {
  let decentraBank = await DecentraBank.deployed();
  await decentraBank.issueTokens();
  console.log("Tokens were issued");
  cb();
};
