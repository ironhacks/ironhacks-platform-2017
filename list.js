import React from "react";
import TopicCommentsItem from "./item";

export default class TopicComments extends React.Component {

    renderComments () {
        return this.props.comments.map((c, index) => {
            return (
                <TopicCommentsItem
                    key={index}
                    {...c}
                />
            )
        });
    }

    render () {
        if (this.props.comments.length) {
            return (
                <div>
                    {this.renderComments()}
                </div>
            );
        }
        return (
            <div>
                No comments. Be the first!
            </div>
        );
    }
}
