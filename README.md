# Netdata data source for Grafana

[![Build](https://github.com/grafana/grafana-starter-datasource/workflows/CI/badge.svg)](https://github.com/grafana/grafana-starter-datasource/actions?query=workflow%3A%22CI%22)

_Enhanced high-fidelity troubleshooting data source for the Open Source community!_

![Image](https://user-images.githubusercontent.com/82235632/193311991-a6d167ab-b845-49b7-817c-976b780e427e.png)

## What is Netdata data source plugin for Grafana?

We are huge fans of Open Source culture and it is rooted deeply into our DNA, so we thought that the Open Source community would hugely benefit from Netdata providing a Grafana data source plugin that would expose its powerful data collection engine.

With this data source plugin we expose the troubleshooting capabilities of Netdata in Grafana, making them available more widely. Some of the key capabilities:
- Real-time monitoring with single-second granularity.
- Installation and out-of-the-box integrations available in seconds from one line of code.
- 2,000+ metrics from across your whole Infrastructure, with insightful metadata associated with them.
- Access to our fresh ML metrics (anomaly rates) - exposing our ML capabilities at the edge!


## Getting started

### 1. Connect your Nodes to Netdata Cloud

Netdata’s data source plugin connects directly to our Netdata Cloud API’s, meaning that you’ll need to have your nodes (hosts) connected to [Netdata Cloud](https://app.netdata.cloud/?utm_source=grafana&utm_content=data_source_plugin) in order to be able to have them exposed on our plugin. For security purposes you will also need an API token for authentication (which you can get from within your Netdata profile).

Note: If you don't have an account [sign-up](https://app.netdata.cloud/?utm_source=grafana&utm_content=data_source_plugin) for free to get one! 

> Netdata Agent will need to be installed and running on your server, VM and/or cluster, so that it can start collecting all the relevant metrics you have from the server 
and applications running on it. More info at https://learn.netdata.cloud/docs/get-started.

### 2. Ensure you have an API Token for authentication purposes.

Once you have all your nodes connected to Netdata Hub you must proceed with creating an API token, which will be linked to your Netdata Cloud  account. The API token provides a means to authenticate external calls to our APIs, allowing the same access as you to the Spaces and Rooms you can see on Netdata Hub.

![image](https://user-images.githubusercontent.com/82235632/189399116-2df5da8a-49d2-42b2-bdec-64b7f7d9bd83.png)

### 3. Install Netdata data source plugin on Grafana Cloud or locally

For detailed instructions on how to install the plugin on Grafana Cloud or locally, please checkout the Plugin installation docs.

### 4. Add your API token to the Netdata data source plugin configuration

Once you have added your API token to Netdata data source plugin you’re ready to start taking advantage of Netdata’s troubleshooting capabilities in Grafana by starting creating your charts and dashboards!

![image](https://user-images.githubusercontent.com/82235632/189398814-1efbf1c7-1a62-4d5f-abe8-6a9297a3f008.png)

## How to install the plugin?

To start using the Netdata data source plugin on your Grafana environment, local or Cloud, you need to install the plugin manually - it currently isn't signed. Here are some tips to get through this depending on your setup:
* Docker
* Linux (local)
* Windows (local)
* Building the plugin locally

### Docker

#### Pre-buit script - setup-demo-environment
We provide you a script `setup-demo-environment.sh` that will help you setting this up real fast.
To start the container with the Netdata datasource plugin already installed you just need to:
```
setup-demo-environment.sh run
```

To remove container:
```
setup-demo-environment.sh remove
```

This script will:
1. Spin up a grafana container without starting grafana itself
1. Retrieve the latest available release of the Netdata datasource plugin
1. Install the Netdata datasource plugin in /var/lib/grafana/plugins
1. Start grafana

#### Manual step-by-step

1. Setup your grafana docker container with the the permissions to load netdata plugin as unsinged

   ```
   docker run -d --env GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=netdata-datasource --name=grafana grafana/grafana
   ```

2. Ensure you have the desired version of the plugin you want to install, get it from github releases 

   ```
   curl -s https://api.github.com/repos/netdata/netdata-grafana-datasource-plugin/releases/latest \
   jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'
   ```

3. Grafana plugins, by default, should be under /var/lib/grafana/plugins. Create a folder for netdata inside the container. Enter in an interactive session

   ```
   docker exec -ti grafana bash
   mkdir /var/lib/grafana/plugins/netdata
   ```

4. Copy the contents of the Netdata data source plugin to the new plugin folder created on step 2

   ```
   unzip netdata-datasource-<version_number>.zip
   docker cp netdata-datasource grafana:/var/lib/grafana/plugins/netdata/
   ```

### Linux (local)

1. Ensure you have the desired version of the plugin you want to install, get it from github releases 

   ```
   curl -s https://api.github.com/repos/netdata/netdata-grafana-datasource-plugin/releases/latest \
   jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'
   ```

2. Grafana plugins, by default, should be under /var/lib/grafana/plugins. Create a folder for netdata

   ```
   mkdir /var/lib/grafana/plugins/netdata
   ```

3. Copy the contents of the Netdata data source plugin to the new plugin folder created on step 2

   ```
   unzip netdata-datasource-<version_number>.zip
   cp -rf netdata-datasource/ /var/lib/grafana/plugins/netdata
   ```

4. Ensure that Netdata plugin which currently isn’t signed can be registered

   ```
   vi /etc/grafana/grafana.ini
   ```

	On `allow_loading_unsigned_plugins` entry add **netdata-datasource**

   ```
   allow_loading_unsigned_plugins = netdata-datasource
   ```

5. After adding the plugin a restart of grafana server is needed

   For init.d based services you can use the command:
   ```
   sudo service grafana-server restart
   ```

   For systemd based services you can use the following:
   ```
   systemctl restart grafana-server
   ```

### Windows (local)

1. Ensure you have the desired version of the plugin you want to install, get it from github releases 

   ```
   curl -s https://api.github.com/repos/netdata/netdata-grafana-datasource-plugin/releases/latest \
   jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'
   ```

2. Grafana plugins, by default, should be under C:\Program Files\GrafanaLabs\grafana\data\plugins. Create a folder for netdata

   ```
   mkdir ‘C:\Program Files\GrafanaLabs\grafana\data\plugins\netdata’
   ```

3. Copy the contents of the Netdata data source plugin to the new plugin folder created on step 2

   ```
   wzunzip -d netdata-datasource-<version_number>.zip
   ```
   or
   ```
   gzip -d < netdata-datasource-<version_number>.zip 
   cp .\netdata-datasource\* "C:\Program Files\GrafanaLabs\grafana\data\plugins\netdata"
   ```

4. Ensure that Netdata plugin which currently isn’t signed can be registered

	```
   notepad ‘C:\Program Files\GrafanaLabs\grafana\conf\default.ini’
   ```

	On `allow_loading_unsigned_plugins` entry add **netdata-datasource**

   ```
   allow_loading_unsigned_plugins = netdata-datasource
   ```

5. After adding the plugin a restart of grafana server is needed

   ```
   net stop Grafana
   net start Grafana
   ```

### Building the plugin locally

For any of the above steps if you prefer to build this plugin locally instead of retrieving it from from the releases you can:

1. Clone this repo 
   ```
   git clone https://github.com/netdata/netdata-grafana-datasource-plugin
   ```

2. Build it locally
   ```
   yarn
   yarn build
   ```

3. Place the contents of the `/dist` folder under the netdata folder in Grafana plugins directory.

## Learn more

- What is Netdata? - https://learn.netdata.cloud/docs/overview/what-is-netdata
- Netdata Cloud - https://learn.netdata.cloud/docs/cloud
- Netdata Agent - https://learn.netdata.cloud/docs/get-started
