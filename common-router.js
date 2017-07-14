import React from "react";
import Topics from "./posts";
import TopicPage from "./posts/single";
import TopicEditor from "./posts/editor";

import ComponentLoader from "./component-loader";

ComponentLoader.register("topics", <Topics />);
ComponentLoader.register("topic-page", <TopicPage />);
ComponentLoader.register("edit-topic", <TopicEditor />);
