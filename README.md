# garn-monitoring
### Get an email when your sites are down

## Usage locally

```sh
git clone git@github.com:jupegarnica/garn-monitoring.git
cd garn-monitoring
```

1. Fill `config.yaml`
2. Optionally create `.env` based on `.env.example`
3. Run it once `deno run -A --unstable monitoring-once.ts`
4. Or run it forever `deno run -A --unstable monitoring-continuous.ts`


## Usage remotely

```sh
mkdir monitoring && cd monitoring
deno run -A --unstable https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/monitoring-continuous.ts
# or run only once
# deno run -A --unstable https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/monitoring-once.ts
```
