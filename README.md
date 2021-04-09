# garn-monitoring
### Get an email when your sites are down


## Usage

```sh
mkdir monitoring && cd monitoring
deno install -Af --unstable -n monitor https://raw.githubusercontent.com/jupegarnica/garn-monitoring/master/app.ts
monitor --config monitor.config.yaml
```

## once


Run only once:

```sh
monitor --config monitor.config.yaml --once
```

### CI

Run it every hour with google actions. It takes aprox 744 min / month.  (FREE 2000 min / month)

Go to https://github.com/:userName/:repoName/settings/secrets/actions to configure your smtp settings

```yml
# monitor.config.yaml
SMTP_HOST: ${{ secrets.SMTP_HOST }}
SMTP_PORT: ${{ secrets.SMTP_PORT }}
SMTP_USERNAME: ${{ secrets.SMTP_USERNAME }}
SMTP_FROM: ${{ secrets.SMTP_FROM }}
SMTP_TO: ${{ secrets.SMTP_TO }}
SMTP_PASSWORD: ${{ secrets.SMTP_PASSWORD }}

```


### Run in Docker

Watch docker-compose.yml

```sh
docker-compose up
```
