import React from "react";
import Timeline from "./timeline";
import ComponentLoader from "./component-loader";
import AdminView from "./admin";
import Scores from "./scores";

ComponentLoader.register("timeline", <Timeline />);
ComponentLoader.register("admin-view", <AdminView />);
ComponentLoader.register("scores", <Scores />);
