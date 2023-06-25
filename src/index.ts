import Manager from "@src/core/manager";
import loadRouter from "./router";

const manager = new Manager();

loadRouter(manager);
manager.Server.runServer();
