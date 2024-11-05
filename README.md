# Métro Automatique à Grand Gabarit de l'Agglomération LYonnaise (MAGGALY)

MAGGALY is the name of the Metro Line D's autopilot. The aim of 
this project is to recreate some kind of autopilot working on a pseudo-network.

This pseudo-network isn't meant to recreate exactly the state of the Line D, but rather an imaginary line.

**Please note that for knowledge reasons, some aspects of an automatic line may not be simulated like in real-life**

### Components

1. `network_simulator`

Contains every element to create a network and simulate it. It can also provide a UI to see the network in real-time.

It also acts as a glue between `maggaly` and `train_bot` as it will be responsible of informing each other of the network state and share message between them.

This component WILL BE considered as an interface to communicate important data between every device of the network (`maggaly`, trains, signals, ...) Hence, it's an interface and it can be replaced by an interface between a real network and `maggaly`/`train_bot`.

2. `maggaly`

Contains every component needed to operate the network. As it's meant to be used on a real network, nothing will be done thinking it's just an emulation.

3. `train_bot`

Contains every component needed to operate manually a train, make it work when it's offline, react to unexpected and sudden network events (loss of power, ...)

### How I see things (technically)

1. Communication between services

`network_simulator` will be connected to two servers through a `Server-Side Events` connection, meaning both parties can "freely" chat with the simulator. The first connection will be `maggaly` and the second `train_bot`.

Two kind of messages can be exchanged through all the pairs:
- `train_control` events: between `maggaly` and `train_bot`
- `network_control` events: between `maggaly` and `network_simulator`

**`train_bot` and `network_simulator` CAN'T communicate because, in real life, trains have no interactions with the network since `maggaly` does all the magic**

**More events and modifications in the structure of communications may appear in later versions: especially a possible `network_update` event to notify every peer of a change on the network (Current train speed or position.)**

2. Network simulator updates

The network simulator, at each tick, will:
a. Update static components (incl. triggering events)
b. Trigger `maggaly`
c. Update moving components

### Mathematic formulas

1. Get current speed from inertia through time

Get speed $v$ in m/s, during time $t$ in seconds from an inert position ($t = 0$, where $P$ is the Watt acceleration power and $W$ the object weight in kgs:

$$ v=\sqrt{2Pt/W} $$

2. Get current speed $a$ from top speed, decelerating without brakes, through time. 

We assume $u$, the friction rate, is $0.25$ on rails.:

$$a = u * 9.81$$

**Get current speed at any point of time while decelerating:** with $t$ the elapsed time in seconds and $v^0$ the top speed before starting decelerating:

$$v = v^0 - a * t$$

### Network specificities

1. [Signaling](http://www.ferro-lyon.net/Metro-sur-pneus/ligne-D/signalisation-et-equipements-ligne-d)

Since MAGGALY uses "Cantons Mobiles Déformable" instead of static cantons lightings, there's no available physical signaling.

The only signaling of the network are white lights near switches that notify of their state:

![lights](http://www.ferro-lyon.net/xmedia/Images/Metro/ligneD/Signa-D/oeilleton.png)

Hence, only those lights are gonna be implemented. And "Cantons Mobiles Déformables" will be a part of MAGGALY autopilot.

### Roadmap
- [ ] Network
	- [ ] Components (To be extended later)	
		- [X] Trains: moving component
		- [ ] Traffic lights: static component
			- [ ] Try to know how are switches lights placed on the network
		- [X] Switches: moving component
		- [X] Stations: static component
		- [X] Train depot: static component
		- [X] Rail section: static component
	- [ ] Events
		- [ ] Passenger event (faint, holding doors, emergency break, ...)
		- [ ] Exploitation event (errors, no more energy, delays, ...)
		- [ ] Network event (tables modification, ...)
- [ ] Network controller
	- [ ] Autopilot
		- [ ] Consider comfort levels defined by speed.
	- [X] Manual controller