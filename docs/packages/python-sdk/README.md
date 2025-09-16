### comet-devx (Python SDK)

High-level Python client for Compound V3 (Comet), powered by web3.py.

#### Install
```bash
pip install comet-devx
```

#### Quick start
```python
from web3 import Web3
from comet_devx.comet import Comet

web3 = Web3(Web3.HTTPProvider("https://sepolia.infura.io/v3/<KEY>"))
acct  = web3.toChecksumAddress("0x...")
comet = Comet(network="sepolia", web3=web3, account=acct)

# Example: supply (requires prior token approval)
# receipt = await comet.supply(asset=USDC, amount=amount, private_key=PK)
```

#### Configuration
Networks are defined in `comet_devx/config/networks.py`:
```python
NETWORKS = {
  "sepolia": {"cometProxyAddress": "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"}
}
```

#### API Reference
- `Comet(network: str, web3: Web3, account: Optional[str])`
  - Initializes the contract using configured `cometProxyAddress`

- `await supply(asset: str, amount: int, private_key: str, config: Optional[TxConfig]) -> TxReceipt`
  - Calls `Comet.supply(asset, amount)`; ERC20 approval required

- `await borrow(amount: int, private_key: str, config: Optional[TxConfig]) -> TxReceipt`
  - Calls `Comet.withdraw(baseToken, amount)`; ensure collateral

- `await repay(amount: int, private_key: str, config: Optional[TxConfig]) -> TxReceipt`
  - Calls `Comet.supply(baseToken, amount)`

- `get_network() -> str`
  - Returns the connected network label

Events helper:
- `EventHandler.subscribe(event_name, callback, from_block=None)`
- `EventHandler.get_events(event_name, from_block, to_block=None)`
- `EventHandler.process_events()`

#### Examples
See `packages/python-sdk/examples/*` for borrow/repay/event scripts.

#### Troubleshooting
- Ensure your account has ETH for gas on the target network.
- Confirm ERC20 approvals before calling `supply`/`repay`.
- Verify addresses in `config/networks.py` for your network.

#### See also
- [Getting Started](../../getting-started.md)
- [Scenarios](../scenarios/README.md)
- [FAQ](../../faq.md)


