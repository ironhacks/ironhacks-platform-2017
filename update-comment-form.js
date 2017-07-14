import React from "react";
import CsrfInput from "../../util/csrf-input";
import util from "../../util/";
import Editor from "react-md-editor";


export default class CommentForm extends React.Component {
    render () {
        const topicUrl = util.topicUrl(this.props.topic);
        return <form className="edit-comment-form" method="post" action={`${topicUrl}/comments`}>
            <CsrfInput />
            <input type="hidden" name="update_comment_id" value={this.props._id} />
            <textarea ref="commentBody" name="body" hidden></textarea>
            <Editor value={this.props.body} onChange={this.updateCommentBody.bind(this)} />
	    <div className="form-buttons">
                <button onClick={this.props.toggleCommentEdit} className="btn btn-small btn-cancel">Cancel</button>
                <button className="btn btn-small btn-update">Update</button>
            </div>
        </form>
    }

    updateCommentBody (comment) {
        this.refs.commentBody.value = comment;
    }
}
