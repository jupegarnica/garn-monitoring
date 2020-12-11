# garn-monitoring
### Get an email when your sites are down


## Usage

```sh
mkdir monitoring && cd monitoring
deno install -Af --unstable -n monitor https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/app.ts
monitor
```

# CI

Run it every hour with google actions. It takes aprox 744 min / month.  (FREE 2000 min / month)

Go to https://github.com/:userName/:repoName/settings/secrets/actions to configure your smtp settings

```
SMTP_HOST: ${{ secrets.SMTP_HOST }}
SMTP_PORT: ${{ secrets.SMTP_PORT }}
SMTP_USERNAME: ${{ secrets.SMTP_USERNAME }}
SMTP_FROM: ${{ secrets.SMTP_FROM }}
SMTP_TO: ${{ secrets.SMTP_TO }}
SMTP_PASSWORD: ${{ secrets.SMTP_PASSWORD }}

```

## locally

```sh
git clone git@github.com:jupegarnica/garn-monitoring.git
cd garn-monitoring
```

1. Fill `config.yaml`
2. Optionally create `.env` based on `.env.example`
3. Run it `deno run -A --unstable app.ts`
4. Or run it once `deno run -A --unstable app.ts --once`


## Docker support

Watch docker-compose.yml

```sh
docker-compose up
```
