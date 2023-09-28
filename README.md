# Netdata data source for Grafana

_Enhanced high-fidelity troubleshooting data source for the Open Source community!_

![Image](https://user-images.githubusercontent.com/82235632/193311991-a6d167ab-b845-49b7-817c-976b780e427e.png)

## How to install the plugin?

To start using the Netdata data source plugin on your Grafana environment, local or Cloud. Here are some tips to get through this depending on your setup:
* Directly through the Grafana UI
* Docker
* Linux (local)
* Windows (local - powershell)
* Building the plugin locally

The installations below will use different tools like: curl, docker, jq, wget, unzip and xcopy.

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

1. Setup your grafana docker container with the the permissions to load netdata plugin

   ```
   docker run -d --name=grafana grafana/grafana
   ```

2. Ensure you have the desired version of the plugin you want to install, get it from github releases 

   ```
   wget `curl -s https://api.github.com/repos/netdata/netdata-grafana-datasource-plugin/releases/latest | jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'`
   ```

3. Copy the contents of the Netdata data source plugin to Grafana plugins directory, by default /var/lib/grafana/plugins

   ```
   unzip netdata-datasource-<version_number>.zip
   docker cp netdata-datasource grafana:/var/lib/grafana/plugins/
   ```

4. Restart grafana container
   
   ```
   docker restart grafana
   ```

### Linux (local)

1. Ensure you have the desired version of the plugin you want to install, get it from github releases 

   ```
   wget `curl -s https://api.github.com/repos/netdata/netdata-grafana-datasource-plugin/releases/latest | jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'`
   ```

2. Copy the contents of the Netdata data source plugin to Grafana plugins directory, by default /var/lib/grafana/plugins

   ```
   unzip netdata-datasource-<version_number>.zip
   cp -rf netdata-datasource /var/lib/grafana/plugins
   ```

3. After adding the plugin a restart of grafana server is needed

   For init.d based services you can use the command:
   ```
   sudo service grafana-server restart
   ```

   For systemd based services you can use the following:
   ```
   systemctl restart grafana-server
   ```

### Windows (local - powershell)

1. Ensure you have the desired version of the plugin you want to install, get it from github releases by:
   * Going to https://github.com/netdata/netdata-grafana-datasource-plugin/releases/latest
   * Downloading the zip file with the latest release, e.g. netdata-datasource-1.0.12.zip

2. Copy the contents of the Netdata data source plugin to the Grafana plugins directory, by default C:\Program Files\GrafanaLabs\grafana\data\plugins

   ```
   Expand-Archive \.netdata-datasource-<version_number>.zip \.
   xcopy .\netdata-datasource\ "C:\Program Files\GrafanaLabs\grafana\data\plugins\netdata-datasource\" /E
   ```

3. After adding the plugin a restart of grafana server is needed

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
