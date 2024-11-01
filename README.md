# Métro Automatique à Grand Gabarit de l'Agglomération LYonnaise (MAGGALY)

MAGGALY is the name of the Metro Line D's autopilot. The aim of this project is to recreate some kind of autopilot working on a pseudo-network.

This pseudo-network isn't meant to recreate exactly the state of the Line D, but rather an imaginary line.

**Please note that for knowledge reasons, some aspects of an automatic line may not be simulated like in real-life**

### Components

1. `network_simulator`

Contains every element to create a network and simulate it. It can also provide a UI to see the network in real-time.

It also acts as a glue between `maggaly` and `train_bot` as it will be responsible of informing each other of the network state and share message between them.

2. `maggaly`

Contains every component needed to operate the network. As it's meant to be used on a real network, nothing will be done thinking it's just an emulation.

3. `train_bot`

Contains every component needed to operate manually a train, make it work when it's offline, react to unexpected and sudden network events (loss of power, ...)

### How I see things (technically)

`network_simulator` will be connected to two servers through a `Server-Side Events` connection, meaning both parties can "freely" chat with the simulator. The first connection will be `maggaly` and the second `train_bot`.

Two kind of messages can be exchanged through all the pairs:
- `train_control` events: between `maggaly` and `train_bot`
- `network_control` events: between `maggaly` and `network_simulator`

**`train_bot` and `network_simulator` CAN'T communicate because, in real life, trains have no interactions with the network since `maggaly` does all the magic**

**More events and modifications in the structure of communications may appear in later versions: especially a possible `network_update` event to notify every peer of a change on the network (Current train speed or position.)**

### Roadmap
- [ ] Network
	- [ ] Components
		- [ ] Trains
		- [ ] Traffic lights
		- [ ] Switches
		- [ ] Stations
		- [ ] Train depot
		- [ ] Rail section
	- [ ] Events
		- [ ] Passenger event (faint, holding doors, emergency break, ...)
		- [ ] Exploitation event (errors, no more energy, delays, ...)
		- [ ] Network event (tables modification, ...)
- [ ] Network controller
	- [ ] Autopilot
	- [ ] Manual controller