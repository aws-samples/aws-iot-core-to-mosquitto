# Welcome to AWS IoT Core to Local Mosquitto Broker👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: MIT--0](https://img.shields.io/badge/License-MIT--0-yellow.svg)](#)

> In this document we built an Application that interfaces with the cloud and sends data to a local mosquitto Mqtt Broker. As of version 1.0.0 this application is only a one way communication from AWS Cloud to a Local Mosquitto broker. Future implementations will handle multi way communication. Included there is a docker file definition and a docker composer to setup the applciaiton and the mosquitto broker.

## Objectives

This Code is intended for whom is engaging with customers that need a light containerized component to communicate from AWS IoT Core to local Mosquitto broker.

## Description

This component is responsible for listening on messages on a AWS IoT Core topic in the format `cmd/localDevice/${process.env.ENV}/${process.env.DEVICE_ID}`. This is a command topic, containing information regarding on which topic the message should be published to Mosquitto Mqtt broker, the message, and just enough information to tie the received messaged to the source that generated it in the cloud. This information identifying the source is just for logging purposes.

Information is processed in the cloud and sent in the command topic to the local device. The payload should contain at least the message to be sent to mosquitto and the topic that this message should be sent to. This topic should be known beforehand.
This component is simply a bridge and should be as simple and fast as possible. Also, one assumption is that the local components are in a network constraint environment, behind the security firewalls and proxies for tsecurity purposes. For these motives, the mosquitto broker to connect allows anonymous connections without authentication.

The main function `start()` in `index.js` runs a process that create a connection configuration to AWS IoT Core based on enviromental variables containing device information, environment configuration variables and environment information, such as dev, or prod. Then, events are created to act on messages received from the cloud and the event callback function sends message to the local mosquitto broker. Aditionally the initial configuration add log capability when errors occur in the connection created to AWS IoT Core. The general overview can be seen as follows:

![AWS IoT Core to Mosquitto Solution](iotcore-to-mosquitto-listener/../docs/images/iotCore-to-mosquitto-Architecture.png)

## Installing the Application

#### Pre-requisites:

- Nodejs 14+
- Npm package Manager for the node version
- AWS CLI
- Docker
- A running container of [mosquitto broker](https://hub.docker.com/_/eclipse-mosquitto) (You can follow instructions on the mosquitto repo)
- [Create an IoT Thing](https://docs.aws.amazon.com/iot/latest/developerguide/iot-moisture-create-thing.html) in AWS [IoT Console](https://console.aws.amazon.com/iot/home) and save it's certificates and keys to the `/certs` folder
- Save [AmazonRootCA1](https://www.amazontrust.com/repository/AmazonRootCA1.pem) in `.pem` format alongside the certificates.

### Local Installation

#### Install

Install all packages for development and production.

```sh
npm install
```

#### Running the application

There some options to run the application locally for development purposes. Packages dotenv and nodemon are installed from the command above and babel will be used to transpile the application.
For Environmental variables the applciaitons uses dotenv packages to build this variables, so when running locally don't forget to crate and set the .env file.

---

##### For simple local run:

> Create a .env file with the following fields and fill them with your AWS accoutn and thing data:

_Please fill all the data where the <...> are_

```sh
DEVICE_ID=<DEVICE_ID>
MQTT_BROKER_ADDRESS=<AWS_IOT_ENDPOINT>
MQTT_KEY_FILE=<DEVICE_PRIVATE_KEY>
MQTT_CERT_FILE=<DEVICE_CERTIFICATE>
MQTT_CA_FILE=<AMAZON_ROOT_CA>
MQTT_CLIENT_ID=aws_iot_core_to_mqtt_device
ENV=<YOUR_ENVIRONMENT>
# Proxy Identification for IoT using proxy
# mtls or wss
MQTT_PROTOCOL=mtls
USE_PROXY=false <true or false, wether to use proxy or not>
PROXY_HOST=<PROXY_HOSTS>
PROXY_PORT=<PROXY_PORT>
PROXY_USER=<PROXY_USER>
PROXY_PASS=<PROXY_PASSWORD>
# AWS Credentials should be Set directly in the environment, not Through the docker layer.

# Local MOsquitto MOSQUITTO_URI
MOSQUITTO_URI=<MOSQUITTO_REFERENCE_URI> # usually mqtt://localhost:1883
```

After setting the .env file, run the application.

```sh
npm run start-local
```

---

##### For debug and better stack tracing options, use:

```sh
npm run start-debug

```

---

#### Docker Container Application

##### Building the image

login into aws public ECR gallery with:

```sh
 aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

Copy the things certificates and Amazon root CA of your choice to a folder in the root of the project, in the same level as the docker file, called `certs/`.

If you created the .env file from the previous steps, please run `export $(grep -v '^#' .env | xargs)` to export the file as environment variables. If not, you can either create the .env file now or enter the data required for the build in the place of the `$` variables.

> To build the image, please run:

```sh
docker build \
-t aws-iot-core-to-mosquitto:dev \
--build-arg ENV=$ENV \
--build-arg DEVICE_ID=$DEVICE_ID \
--build-arg MQTT_BROKER_ADDRESS=$MQTT_BROKER_ADDRESS \
--build-arg MQTT_KEY_FILE=$MQTT_KEY_FILE \
--build-arg MQTT_CERT_FILE=$MQTT_CERT_FILE \
--build-arg MQTT_CA_FILE=$MQTT_CA_FILE \
--build-arg MQTT_CLIENT_ID=$MQTT_CLIENT_ID \
--build-arg MOSQUITTO_URI=$MOSQUITTO_URI \
--build-arg MQTT_PROTOCOL=$MQTT_PROTOCOL \
--build-arg USE_PROXY=$USE_PROXY \
--build-arg PROXY_HOST=$PROXY_HOST \
--build-arg PROXY_PORT=$PROXY_PORT \
--build-arg PROXY_USER=$PROXY_USER \
--build-arg PROXY_PASS=$PROXY_PASS .
```

##### Running the image

```sh
docker run aws-iot-core-to-mosquitto:dev
```

### Run a complete Solution with a localMOsquitto Broker and the AWS IoT Core connect solution

The Project also includes a docker composer where you can build and test and run the moquitto broker and the current solution so you can observe the results directly in the components.

#### Build the docker compose Solution, run:

<br/>

Login in AWS public ECR repo to obtain the node image:

```sh
aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws
```

Now build and than run the docker composer solution based on the current application code, run:

```sh
docker-compose build
docker-compose up

```

### Expected response

If the applciaiton was able to sucessfully connect and subscribe to AWs IoT core Topic the output should be something like:

```sh
debug: 01-Dec-2021 04:30:38: Subscribing to IoT Topic
debug: 01-Dec-2021 04:30:38: MQTT Host: <YOUR IOT ENDPOINT>
Subscribing to Topic cmd/localDevice/dev/00123
debug: 01-Dec-2021 04:30:38: Connection Details: {"_events":{"error":[null,null]},"_eventsCount":3,"corked":false,"_handle":{},"client":{"handle":{},"bootstrap":{"handle":{}}},"config":{"client_id":"aws_iot_core_to_mqtt_device","host_name":"<YOUR IOT ENDPOINT>","socket_options":{"handle":{}},"port":443,"use_websocket":false,"clean_session":true,"keep_alive":30,"username":"?SDK=NodeJSv2&Version=1.10.2","tls_ctx":{"handle":{}},"ping_timeout":2000},"tls_ctx":{"handle":{}}}
Listening to messages on topic cmd/localDevice/dev/00123
debug: 01-Dec-2021 04:30:39: Connected, Subscribing to Topic.
debug: 01-Dec-2021 04:30:39: Subscribed to topic without errors.
```

### Testing the app

To test if the application is receveing correctly and sending data to a mosquitto broker. A message should be in the following format:

```json
{
  "mosquittoTopic": "data/mosquitto/topic",
  "message": "Hello Mosquitto Broker from AWS IoT console"
}
```

Navigate to [AWS IoT Testing Console](https://console.aws.amazon.com/iot/home?region=us-east-1#/test), click on `Publish to a Topic`, enter the topic name in Topic Name field, in this sample `cmd/localDevice/dev/00123`, and copy and paste the message payload as above. Press the button below `Publish`.

You should se a response on the aws-iot-core-to-mosquitto solution close to:

```sh
info: 01-Dec-2021 04:41:11: Payload from Cloud: {  "mosquittoTopic": "data/mosquitto/topic",  "message": "Hello Mosquitto Broker from AWS IoT console"}
info: 01-Dec-2021 04:41:11: Mosquitto Broker: tcp://mosquitto:1883
debug: 01-Dec-2021 04:41:11: Connected to MQTT Mosquitto broker...
info: 01-Dec-2021 04:41:11: Sending message on topic: data/mosquitto/topic
info: 01-Dec-2021 04:41:11: Message Sent to Mosquitto Topic
```

### Check responses directly in the mosquitto broker container

To check if the information is reaching the mosquitto broker, let's monitor the message isnide of it.

Run `docker ps` and find out the container id for the `eclipse-mosquitto:2.0.10` container.

Begin an Interaction shell session with the container: `

```sh
docker exec -it <Your Mosquitto Container Id> /bin/sh
```

A session should begin and you would see a `/#` in fornt of your cursor. We are now inside the mosquitto container, run the folloqing command to listen to all topics arriving at the mosquitto Broker:

```sh
 mosquitto_sub -t \#
```

Repeat the instructions above to send a message from teh cloud to your local solution. Inside the Mosquitto container you should see the following response:

```sh
mosquitto_sub -t \#

"Hello Mosquitto Broker from AWS IoT console"
```

### Run Unit tests

The test suite used for this applciation is jest. THe mocking occured as close as possible of appliccation external access.

```sh
npm run unit-test
```

### Run Linting

Eslint with the airbnb-base style guide was used to lint the whole applicaiton.Please, run:

```sh
npm run linting
```

## Author

👤 **Cesar Javaroni - AWS Cloud Application Architect Consultant**
