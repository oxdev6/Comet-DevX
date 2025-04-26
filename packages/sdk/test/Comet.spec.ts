/// Start of Selection
import { ethers } from "ethers";
import { Comet } from "../src/Comet";

describe("Comet SDK Core Methods", () => {
  let comet: Comet;

  beforeAll(() => {
    // Use a dummy provider, or direct it to a local test RPC if you want.
    const provider = new ethers.JsonRpcProvider("https://arb-sepolia.g.alchemy.com/v2/WU4lUat2tzS281NCprT48LqOSpONW1nY");
     // Create a test wallet with a private key (for local tests)
       // Replace the 0xDEADBEEF... with any valid private key
    const wallet = new ethers.Wallet("024b201993dbc4f5f4b328e8b75d106e3520eed6d7279844a07299193906bbc3", provider);

    // Create our Comet instance, referencing 'sepolia' from your config
    comet = new Comet("sepolia", wallet);
  });

  // it("should have a supply method that returns a promise", async () => {
  //   const txPromise = comet.supply("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", 1000000);
  //   expect(txPromise).toBeInstanceOf(Promise);
  // });

  // it("should have a borrow method that returns a promise", async () => {
  //   const txPromise = comet.borrow(200);
  //   expect(txPromise).toBeInstanceOf(Promise);
  // });

  it("should have a repay method that returns a promise", async () => {
    const txPromise = await comet.repay(200);
    expect(txPromise).toBeInstanceOf(Promise);
  });
});