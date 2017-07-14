import React from "react";
import util from "../util";
import CsrfInput from "../util/csrf-input";
import UpvoteTopicItem from "./upvote-topic-item";

export default class TopicsListItem extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: _pageData.user
        };
    }
    renderUpvote () {
        const user = _pageData.user;
        if (!user) {
            return "";
        }
        return <UpvoteTopicItem upvoted={this.upvoted} toggleVote={this.toggleVote.bind(this)} {...this.props} user={user}/>
    }

    get upvoted () {
        return this.props.votes.includes(this.state.user._id)
    }

    toggleVote (e) {
        util.post(`${this.props.url}/toggle-vote`, {
            topic: this.props._id
        });
        e.preventDefault();
    }

    renderAdminInfo () {
        if (window._pageData.isAdmin) {
            return <span className="post-info-section">
                HackType: <span className="hack-type-name">{this.props.metadata.hack_type}</span> <span>{this.props.metadata.hack_id}</span>
            </span>
        }
    }

    renderEdit () {
        if (window._pageData.isAdmin || this.props.author._id === window._pageData.user._id) {
            return <span className="post-info-section">
                <a href={`${this.props.url}/edit`}>Edit</a>
            </span>;
        }
        return "";
    }

    onDeleteIntent (e) {
        if (!confirm('Are you sure you wish to delete?')) {
            return e.preventDefault();
        }
    }

    renderDelete () {
        if (window._pageData.isAdmin || this.props.author._id === window._pageData.user._id) {
            return  <form onSubmit={this.onDeleteIntent} action={`${this.props.url}/delete`} method="post" className="inline-block">
                <CsrfInput />
                <button className="btn btn-small btn-delete">Delete</button>
            </form>
        }
        return "";
    }

    render () {
        let itemNumber = this.props.itemNumber ? <div className="item-number">{this.props.itemNumber}</div> : "";
        let commentsCount = this.props.comments.length;
        return <div className={`post-item ${this.props.sticky ? "topic-sticky" : "topic-not-sticky"}`}>
            {itemNumber}
            {this.renderUpvote()}
            <div className="topic-content">
                <a href={this.props.url} className="post-item-title">
                    <h2>
                        {this.props.title}
                    </h2>
                </a>
                <div className="post-info">
                    <span className="post-info-section">
                        <a href={`/users/${this.props.author.username}`}>
                            <strong>{this.props.author.username}</strong>
                        </a>
                    </span>
                    <span className="post-info-section">
                        <span className={this.upvoted ? "post-upvoted" : "post-not-upvoted"} onClick={this.toggleVote.bind(this)}>{this.props.votes.length} <i className="fa fa-heart" aria-hidden="true"></i></span>
                    </span>
                    {" | "}
                    <span className="post-info-section">
                        {this.props.created_at.fromNow()}
                    </span>
                    <span className="hide-xs">
                    {" | "}
                    <span className="post-info-section">
                        {commentsCount} Comment{commentsCount!== 1 ? "s" : ""}
                    </span>
                    </span>
                    {this.renderEdit()}
                    {this.renderDelete()}
                    {this.renderAdminInfo()}
                    <div className="comments-count">
                        <i className="fa fa-comment-o" aria-hidden="true"></i>
                        <span className="comments-number">{commentsCount}</span>
                    </div>
                </div>
            </div>
        </div>;
    }
}
