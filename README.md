##### ***important note:*** *SSR not implemented yet, this is the initial repo commit*
# IoTStation
### Make your own IoT devises, monitor and control them.
IoTStation is a generalized system that let’s you create, monitor and control your IoT Devices.

The main advantage of this system is that you only code your IoT Device, you don’t need to touch the backend or frontend, the system will represent the device features in the proper way.

## Create your own IoT devices
With IoTStation you only need to write software for the hardware side (ex: Arduino), add your own features like a door state [open, close], or a light switch [on, off]. Type and number of features does not matter here, the system can handle them with ease, that because the system communicate with hardware devises via a standard representation, the system frontend and backend can accept any thing as long as it’s within the standard representation of data.

## System Standard Representation (SSR)
We have two types of states, **informative** state and **controller** state. Informative state can only send data to server when update occurs on the hardware, no need to communicate with server if no update occurs on the hardware side. The controller state in the other hand need to operate in both ways, send and fetch data from the server. That to update the server about hardware status, and vise versa.

When a device has at lest one controller states, by default it has to communicate in both ways. To reduce the number of API requests and make the communication process more efficient, we utilize the *request - response* behavior by sending hardware status with the http *request*, and get server status with the http *********response*********.

### Known & Unknown states
Device states are divided into two groups, known and unknown states. Known state have representation in the frontend by icons or other means, but the Unknown states don’t, they are represented by plain text [hardware row data] without icons.

![Screenshot](images/kukstates.png)

Example of SSR:
```
data:{
	informative:{
		look:"closed",  # known state								
		power-watt:"600.82",  # known state
		state_3:"medium"
		water_flow:"9.16m^3", # unknown state
	},
	controller:{
		switch_1:"off", # unknown state
		light:"on",  # known state
	}
}
```
