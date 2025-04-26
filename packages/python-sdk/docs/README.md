# Compound V3 Python SDK Documentation

## Installation

```bash
pip install comet-devx
```

## Quick Start

```python
from web3 import Web3
from comet_devx import Comet

# Initialize Web3 and Comet
w3 = Web3(Web3.HTTPProvider('YOUR_RPC_URL'))
comet = Comet('sepolia', w3, account='YOUR_ACCOUNT_ADDRESS')

# Supply collateral
await comet.supply(
    asset="0x1234...",  # Asset address
    amount=1000000      # Amount in smallest units
)

# Listen for events
async def handle_supply(event):
    print(f"Supply event: {event}")

await comet.events.subscribe('Supply', handle_supply)
```

## Core Features

### Transaction Methods

#### supply(asset: str, amount: int) -> TxReceipt
Supply collateral to the protocol.

```python
tx_receipt = await comet.supply(
    "0x1234...",  # Asset address
    1000000       # Amount
)
```

#### borrow(amount: int) -> TxReceipt
Borrow base asset from the protocol.

```python
tx_receipt = await comet.borrow(1000000)
```

#### repay(amount: int) -> TxReceipt
Repay borrowed base asset.

```python
tx_receipt = await comet.repay(1000000)
```

### Event Handling

#### Subscribe to Events
```python
async def handle_event(event):
    print(f"Event received: {event}")

await comet.events.subscribe('Supply', handle_event)
```

#### Get Historical Events
```python
events = await comet.events.get_events(
    'Supply',
    from_block=1234567
)
```

## Error Handling

The SDK provides specific error types:
- `CometException`: Base exception for SDK errors
- `InsufficientFundsError`: Raised when there are insufficient funds

```python
try:
    await comet.supply(asset, amount)
except InsufficientFundsError:
    print("Insufficient funds for supply")
except CometException as e:
    print(f"Operation failed: {e}")
```

## Network Configuration

Supported networks:
- Sepolia (Ethereum testnet)
  - Comet proxy: 0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d
  - Base asset: USDC
