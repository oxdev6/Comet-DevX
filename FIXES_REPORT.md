# What Was Fixed

This summary describes the remediation steps taken after the security audit to resolve the high severity issues.

## Resolved Issues
- **Removed Example Secrets**: The `create-comet-app` templates now rely on `RPC_URL` and `PRIVATE_KEY` environment variables instead of embedding example keys.
- **Hardhat Configuration**: `packages/hardhat-comet/hardhat.config.ts` now reads the Infura API key from `INFURA_API_KEY` rather than including it directly in the repository.
- **SDK Tests**: Unit tests for the TypeScript SDK were updated to use a mocked provider and wallet. This prevents unwanted external RPC calls during test runs.
- **Python Library**: The `Comet` class transaction methods (`supply`, `borrow`, and `repay`) accept a `private_key` argument, removing reliance on internal attributes and ensuring callers explicitly pass credentials.

These fixes eliminate plaintext secrets from version control and make the test suite self-contained.
