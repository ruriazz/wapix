import { Manager } from "@vendor";

import initAccountAPIRoute from "@api/account/domain/routes";

export default function loadRouter(manager: Manager) {
    const routes = [initAccountAPIRoute(manager)];

    manager.Server.App.use(...routes);
}
