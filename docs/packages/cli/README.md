### create-comet-app (CLI)

Scaffold React or Node.js apps pre-wired to `@comet-devx/sdk`.

#### Install
```bash
npm install -g create-comet-app
```

#### Usage
```bash
create-comet-app create my-comet-react-app --template react
create-comet-app create my-comet-node-app --template node
```

#### React template
- Generates `public/index.html`, `src/App.tsx`, `src/index.tsx`
- Includes example `Comet` instantiation

#### Node template
- Generates `src/index.ts` with a basic `Comet` usage example

#### Next steps
- Add your `RPC_URL` and `PRIVATE_KEY` as env vars
- Install deps and run according to the generated README

#### See also
- [Getting Started](../../getting-started.md)
- [TS SDK](../sdk/README.md)
- [Hardhat Plugin](../hardhat-comet/README.md)


