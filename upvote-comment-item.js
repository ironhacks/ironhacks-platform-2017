import React from "react";
import util from "../../util";

export default class UpvoteCommentItem extends React.Component {

    get upvoted () {
        return this.props.votes.includes(this.props.user._id)
    }

    render () {
        return (
            <span className="upvote-comment">
                {this.renderUpvoteBtn()}
                {
                    this.props.votes.length ?
                        <span className="comment-votes-count">
                            {this.props.votes.length} <i className="fa fa-heart" aria-hidden="true"></i>
                        </span> : ""
                }
            </span>
        )
    }

    renderUpvoteBtn () {
        return <a href="#" className={this.upvoted ? "upvoted" : "not-upvoted"} onClick={this.toggleVote.bind(this)}>
            <i className="fa fa-chevron-up" aria-hidden="true"></i>
        </a>;
    }

    toggleVote (e) {
        util.post(`${location.pathname}/comments`, {
            comment: this.props._id,
            toggleVote: "on"
        });
        e.preventDefault();
    }
}
