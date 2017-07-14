import React from "react";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import util from "../../util";
import UpvoteCommentItem from "./upvote-comment-item";
import UpdateCommentForm from "./update-comment-form";

export default class TopicCommentsItem extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            editing: false
        };
    }

    renderVotes () {
        const user = _pageData.user;
        if (!user) {
            return "";
        }
        return <UpvoteCommentItem {...this.props} user={user}/>
    }

    renderCommentContent () {
        if (this.state.editing) {
            return <UpdateCommentForm {...this.props} user={_pageData.user} toggleCommentEdit={this.toggleCommentEdit.bind(this)} />
        }

        return <ReactMarkdown source={this.props.body} escapeHtml={true} />
    }

    renderCommentControls () {
        if (window._pageData.isAdmin || this.props.author._id === window._pageData.user._id) {
            return <span className="comment-controls">
                <span><a href="#" onClick={this.toggleCommentEdit.bind(this)}>Edit</a></span>
                <span><a href="#" onClick={this.onCommentDelete.bind(this)}>Delete</a></span>
            </span>
        }
    }

    toggleCommentEdit (e) {
         e.preventDefault();
        this.setState({
            editing: !this.state.editing
        });
    }

    onCommentDelete (e) {
        e.preventDefault()
        if (!confirm("Do you really want to delete this comment?")) {
            return;
        }
        util.post(`${util.topicUrl(this.props.topic)}/comments`, {
            delete_comment_id: this.props._id
        })
    }

    render () {
        const createdAt = moment(this.props.created_at);
        return (
            <div className="topic-comment-item">
                {this.renderVotes()}
                <div className="comment-content">
                    {this.renderCommentContent()}
                    <hr />
                    <div className="comment-metadata">
                        <a href={`/users/${this.props.author.username}`} className="comment-profile-link-text">
                            <span>{this.props.author.username}</span>
                        </a>,
                        {" "}
                        posted <span className="comment-date" title={createdAt.format("LLLL")}>{createdAt.fromNow()}</span>
                        {this.renderCommentControls()}
                    </div>
                    <a href={`/users/${this.props.author.username}`} className="comment-profile-link">
                        <img title={this.props.author.username} src={this.props.author.profile.picture} />
                    </a>
                </div>
            </div>
        );
    }
}
