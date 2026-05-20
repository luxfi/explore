# DEPRECATED — see `~/work/lux/explorer/`

> The standalone Next.js frontend in this repo is no longer deployed.
> Its build output is embedded directly into the Lux Explorer Go
> binary (`ghcr.io/luxfi/explorer:1.2.1`) via `go:embed`. Run that
> single binary in production.
>
> This repo is preserved as the source of the embedded SPA assets.
> Updates to the UI ship via a rebuild of the explorer image, not by
> deploying this Next.js app separately.
>
> Canonical deploy: `~/work/lux/explorer/` (Go binary, single process,
> indexer + GraphQL + SPA, port 8090).

<h1 align="center">Lux Explore frontend (legacy)</h1>

<p align="center">
    <span>Frontend application for </span>
    <a href="https://explore.lux.network">Lux Network</a>
    <span> blockchain explorer</span>
</p>

## Running and configuring the app

App is distributed as a docker image. Here you can find information about the [package](https://github.com/blockscout/frontend/pkgs/container/frontend) and its recent [releases](https://github.com/blockscout/frontend/releases).

You can configure your app by passing necessary environment variables when starting the container. See full list of ENVs and their description [here](./docs/ENVS.md).

```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> ghcr.io/blockscout/frontend:latest
```

Alternatively, you can build your own docker image and run your app from that. Please follow this [guide](./docs/CUSTOM_BUILD.md).

For more information on migrating from the previous frontend, please see the [frontend migration docs](https://docs.blockscout.com/setup/deployment/frontend-migration).

## Contributing

See our [Contribution guide](./docs/CONTRIBUTING.md) for pull request protocol. We expect contributors to follow our [code of conduct](./CODE_OF_CONDUCT.md) when submitting code or comments.

## Resources
- [App ENVs list](./docs/ENVS.md)
- [Contribution guide](./docs/CONTRIBUTING.md)
- [Making a custom build](./docs/CUSTOM_BUILD.md)
- [Frontend migration guide](https://docs.blockscout.com/setup/deployment/frontend-migration)
- [Manual deployment guide with backend and microservices](https://docs.blockscout.com/setup/deployment/manual-deployment-guide)

## License

[![License: GPL v3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
