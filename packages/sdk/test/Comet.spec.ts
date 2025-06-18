/// Start of Selection
import { ethers } from "ethers";
import { Comet } from "../src/Comet";

describe("Comet SDK Core Methods", () => {
  let comet: Comet;

  beforeAll(() => {
    const provider = new ethers.JsonRpcProvider();
    const wallet = new ethers.Wallet("0x59c6995e998f97a5a0044966f09453894be93910e1f9d6b9961c6ff93d5d56e9", provider);

    // Create our Comet instance, referencing 'sepolia' from your config
    comet = new Comet("sepolia", wallet);
    (comet as any).contract.supply = jest.fn().mockResolvedValue({});
  });

  // it("should have a supply method that returns a promise", async () => {
  //   const txPromise = comet.supply("0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d", 1000000);
  //   expect(txPromise).toBeInstanceOf(Promise);
  // });

  // it("should have a borrow method that returns a promise", async () => {
  //   const txPromise = comet.borrow(200);
  //   expect(txPromise).toBeInstanceOf(Promise);
  // });

  it("should have a repay method that returns a promise", () => {
    const txPromise = comet.repay(200);
    expect(txPromise).toBeInstanceOf(Promise);
  });
});