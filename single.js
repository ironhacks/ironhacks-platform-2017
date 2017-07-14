import React from "react";
import TopicsListItem from "./topics-list-item";
import TopicComments from "./comments/list";
import CommentForm from "./comments/form";
import moment from "moment";
import io from "socket.io-client";
import util from "../util";
import ReactMarkdown from "react-markdown";

export default class App extends React.Component {
    constructor (props) {
        super(props);
        const topic = util.normalizeTopic(window._pageData.topic);
        this.socket = io.connect("/topic");
        this.socket.on("updated", topic => {
            if (this.state.topic._id !== topic._id) { return; }
            util.normalizeTopic(topic);
            this.setState({ topic });
        });
        this.state = {
            topic: topic,
            user: window._pageData.user
        };
        util.post("/api/stats", {
            event: "view-topic",
            metadata: {
                topic_id: topic._id,
                topic_author: topic.author._id
            }
        });
    }
    renderCommentForm () {
        if (!this.state.user) {
            return (<p><a href="/">Sign in</a> to comment.</p>);
        }
        return <CommentForm topic={this.state.topic} />
    }
    render () {
        return (
            <div>
                <TopicsListItem
                    {...this.state.topic}
                />
                <ReactMarkdown className="topic-body-markdown" source={this.state.topic.body} escapeHtml={true}/>
                <hr />
                <h4>Comments</h4>
                <TopicComments comments={this.state.topic.comments} />
                {this.renderCommentForm()}
            </div>
        );
    }
}
