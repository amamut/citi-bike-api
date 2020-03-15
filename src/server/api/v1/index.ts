import express from "express";
import { Stations } from "./stations";
import { Dockable } from "./dockable";

export const v1api = express();

// Stations
v1api.get("/stations", Stations.getStations);
v1api.get("/stations/in-service", Stations.getInServiceStations);
v1api.get("/stations/not-in-service", Stations.getOutOfServiceStations);
v1api.get("/stations/:searchstring", Stations.searchStations);

// Dockable
v1api.get("/dockable/:stationid/:bikestoreturn", Dockable.returnBikes);
