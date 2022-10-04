#!/usr/bin/env bash

set -e -o pipefail


readonly CONTAINER_NAME="grafana-netdata-plugin-demo"
readonly CONTAINER_PORT=3000
readonly GRAFANA_DOCKER_IMAGE="grafana/grafana:9.1.6"
readonly NETDATA_PLUGIN_REPO="netdata/netdata-grafana-datasource-plugin"
readonly PROGNAME=$(basename $0)
readonly ARG=$1

function pre_check() {
   docker version &>/dev/null || echo "Problems with docker! Check if docker is installed or/and docker daemon is running."
   if [ "$(docker ps --filter name=$CONTAINER_NAME | wc -l)" -eq 2 ]; then
      echo "Docker container $CONTAINER_NAME is already running!"
      exit 1
   fi
   command -v jq &>/dev/null || ( echo "no jq"; exit 1;)
   command -v curl &>/dev/null || ( echo "no curl"; exit 1;)
}

function get_latest_plugin() {
  curl -s https://api.github.com/repos/${NETDATA_PLUGIN_REPO}/releases/latest \
    | jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'
}

function run() {
  echo "get the latest netdata plugin"
  declare plugin_url
  plugin_url="$(get_latest_plugin)"
  set -x
  docker run -d -p 127.0.0.1::$CONTAINER_PORT -e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=netdata-datasource \
    --name $CONTAINER_NAME --entrypoint /bin/sleep $GRAFANA_DOCKER_IMAGE inf
  docker exec -it $CONTAINER_NAME \
    bash -c "cd /var/lib/grafana/plugins && wget $plugin_url && unzip *.zip"
  docker exec -d $CONTAINER_NAME bash -c "/run.sh"
  set +x
}

function grafana_url() {
  endpoint=$(docker ps --filter "name=$CONTAINER_NAME" --format '{{ index (split .Ports "-") 0 }}')
  echo "Grafana with netdata plugin is available under: http://${endpoint} use admin/admin credentials to get access."
}

function remove() {
  set -x
  docker rm -f $CONTAINER_NAME
  set +x
}


function usage() {
  cat <<-EOF
usage: $PROGNAME options

$PROGNAME spin up Grafana instance with netdata datasource plugin.

OPTIONS
  run     run grafana docker container with netdata datasource plugin
  remove  remove docker container
EOF
}

if [ "$ARG" == "run" ]; then
  pre_check
  run
  grafana_url
elif [ "$ARG" == "remove" ]; then
  remove
else
  usage
fi
