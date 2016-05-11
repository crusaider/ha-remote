# HA Remote
A simplified GUI for Home Assistant making is possible to choose a subset of devices managed by a Home Assistant installation and make them visible in a separate GUI from home assistant.
The main idea behind the project has been to make easier to "sell" home automation to not to technical family members by mimicing physical controls but still makeing them available in a mobile device.
# Screenshots
`![Alt Main Screen](screenshots/buttons-screen.png "Main Screen")`
`![Alt Menu](screenshots/menu.png "Menu")`
`![Alt Login screen](screenshots/login-screen.png "Login Screen")`
# Installation and configuration

## Installation
Glone the repo to a location on your machine, from the root direcotry of the repo chnage to the `client`directory and issue the `npm install --production` command.
Chnage to the `server` directory and once more run the command  `npm install --production`


## Device Configuration
Devices that should be possible to switch on and off from the application has to be listed in a json file, by default the file is located in the directory where the server is started and is named `configuration.json`. Name and location of the file can be changed before starting the server - see *Server Runtime Configuration*.
### Controls
A sample configuration file: 

	{
    "controls": [
        {
            "caption": "Vardagsrum",
            "device_id": "group.vardagsrum",
            "service": {
                "domain": "switch",
                "onService": "turn_on",
                "offService": "turn_off"
            }
        },
        {
            "caption": "Kontor",
            "device_id": "group.kontor",
            "service": {
                "domain": "switch",
                "onService": "turn_on",
                "offService": "turn_off"
            }
        },
    ]
}

Each device that should be possible to control needs to be listed in the file as part of the array named `"controls"`.

* ´"caption"` is the name of the device that will be visible in the application gui.
* `"device_id"` is the id of the device in the Home Assistant system that manages the device.

The `"service"` object defines how the device can be switched on and off trough the Home Assistant REST API Endpoint `/api/services` please refer to the [Home Assistant API documentation](https://home-assistant.io/developers/rest_api/#post-apiservicesltdomainltservice).


## Server Runtime Configuration
The application is configured trough a number of environment variables that can be set before the server is started.

| Variable | Default Value | Comment |
|:---------|:--------------|:--------|
|`LOGLEVEL`|`info`|Granulairity of server side log messages, has to be one of `debug`, `info`, `warn` or `error`.|
|`PORT`| 8080|HTTP Ports the server will listen on|
|`CONFIGFILE`|`config.json`|The file in where to read information about the controls to render to the user and how to associate them to devices in Home Assistant.|
|`PASSWORD`|Empty string|The password users has to supply in the web GUI to login to the application.|
|`TOKEN_SALT`|None - has to be set, if not the server will not start.|A salt used to generate the authentication token as part of the login and authorization. Any randoom string will do, the longer the better. Can for example be generated using openssl: `openssl rand -base64 64`|
|`HA_SERVER`|`http://localhost:8123`|Remote Home Assistant instance to delegate controll commands to.|
|`HA_PASSWORD`|Empty string|Password to use to authenticate to the Home Assistance instance.|

## SSL
The repo contains a set of SLL files that is self signed. To use another certificate replace the files in `server/app/sll`.

# Starting the server
In the directory `server` run the comand `npm start`. This will start the server and start loggin to `STDOUT`. *(Please note that the server will not start if it does not find the environment varaible `TOKEN_SALT`)*.

# Running the app
If no chnages to the default runtime configuration has been made the application is now being server on port 8080 of the host where it was started. Point your broweser to `https://localhost:8080' (asuming you run it locally). If you are running with the supplied SSL certificate you will have to accept them as untrusted in your browser. You should now be presented with the login screen. If no password has been set, the application will accept an empty password for login.

# TODO
**TODO:** The build system could be unified to one npm package to make it easier to install.

**TODO:** It would be neat to be able to add and remove devices from the GUI.

**TODO:** The client app is in no way optimized, there is lots to do such as minification, making sprites of SVG:s etc.

**TODO:** Security - even if the current solution probably is good enough for this kind of app it could be improved and would need a second pair of eyes (that know that kind of stuff) to have a look.


# Contact
Questions, comments, suggestions: jonas.m.andreasson(a)gmail.com.

Development: Send a pull request on github [https://github.com/crusaider/ha-remote](https://github.com/crusaider/ha-remote)

# License
## The MIT License (MIT)
  Copyright (c) 2016 Jonas Andreasson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,                  and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.