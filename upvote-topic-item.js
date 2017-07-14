import React from "react";

export default class UpvoteTopicItem extends React.Component {

    render () {
        return (
            <div className="upvote-topic">
                {this.renderUpvoteBtn()}
            </div>
        )
    }

    renderUpvoteBtn () {
        return <a href="#" className={this.props.upvoted ? "upvoted" : "not-upvoted"} onClick={this.props.toggleVote}>
            <i className="fa fa-chevron-up" aria-hidden="true"></i>
        </a>;
    }
}
