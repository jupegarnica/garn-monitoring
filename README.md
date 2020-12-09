# garn-monitoring
### Get an email when your sites are down

## Usage locally

```sh
git clone git@github.com:jupegarnica/garn-monitoring.git
cd garn-monitoring
```

1. Fill `config.yaml`
2. Optionally create `.env` based on `.env.example`
3. Run it `deno run -A --unstable app.ts`
4. Or run it once `deno run -A --unstable app.ts --once`


## Usage remotely

```sh
mkdir monitoring && cd monitoring
deno run -A --unstable https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/app.ts
# or run it only once
# deno run -A --unstable https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/app.ts --once
```
