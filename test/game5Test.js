const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");
const { ethers, network } = require("hardhat");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();
    const signer = ethers.provider.getSigner(0);

    const threshold = 0x00ffffffffffffffffffffffffffffffffffffff;
    let valid;
    let address;
    let wallet;
    while (!valid) {
      wallet = ethers.Wallet.createRandom();
      address = await wallet.getAddress();

      if (address < threshold) {
        valid = true;
        wallet = wallet.connect(ethers.provider);
      }
    }
    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("0.1"),
    });

    return { game, wallet };
  }
  it("should be a winner", async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
