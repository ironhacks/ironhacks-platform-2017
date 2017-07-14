import React from "react";
import CsrfInput from "../../util/csrf-input";
import Editor from "react-md-editor";

export default class CommentForm extends React.Component {
    render () {
        return <div className="post-comment-form-wrapper">
            <h3>Post a comment</h3>
            <form className="post-comment-form" method="post" action={`${this.props.topic.url}/comments`}>
                <CsrfInput />
                <textarea ref="commentBody" name="body" hidden></textarea>
                <Editor onChange={this.updateCommentBody.bind(this)} />
                <button className="btn btn-small">Post</button>
            </form>
        </div>
    }

    updateCommentBody (comment) {
        this.refs.commentBody.value = comment;
    }
}
