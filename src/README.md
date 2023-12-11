# Netdata data source for Grafana

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

### 3. Install Netdata data source plugin

### 4. Add your API token to the Netdata data source plugin configuration

Once you have added your API token to Netdata data source plugin you’re ready to start taking advantage of Netdata’s troubleshooting capabilities in Grafana by starting creating your charts and dashboards!

![image](https://user-images.githubusercontent.com/82235632/189398814-1efbf1c7-1a62-4d5f-abe8-6a9297a3f008.png)
