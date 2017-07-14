import React from "react";
import CsrfInput from "../util/csrf-input";
import Editor from "react-md-editor";
import AdminArea from "./new-topic-admin-area";

export default class TopicEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            topic: window._pageData.topic,
            user: window._pageData.user
        };
    }

    renderAdminFields () {

        if (!_pageData.isAdmin) {
            return null;
        }

        let formSectionSticky = <div className="form-section">
            <label><input ref="sticky" name="sticky" type="checkbox" defaultChecked={this.state.topic.sticky} /> Make this a sticky post. Sticky posts appear on the top of the page.</label>
        </div>;

        let formSectionTarget = null;

        if (location.pathname === "/new") {
            formSectionTarget = <AdminArea />;
        }

        return <div className="admin-area">
            <h3>Admin tools</h3>
            {formSectionTarget}
            {formSectionSticky}
        </div>
    }

    render () {
        const actionUrl = this.state.topic.url ? `${this.state.topic.url}/edit` : "/new";
        return (
            <form className="edit-topic" method="post" action={actionUrl}>
                <CsrfInput />
                <textarea ref="body" name="body" hidden defaultValue={this.state.topic.body}></textarea>
                <div className="form-section">
                    <input className="full-width" ref="title" name="title" type="text" placeholder="Topic title" defaultValue={this.state.topic.title} autoFocus />
                </div>
                {this.renderAdminFields()}
                <div className="form-section">
                    <p>Write the topic content below. <a href="https://simplemde.com/markdown-guide" target="_blank">Styling with Markdown</a> is supported (use the editor buttons; for links and images, see the examples below):</p>
                    <strong>Links</strong>
                    <pre>[Text to display](http://www.example.com)</pre>
                    <strong>Images &nbsp; <small>Need to upload an image? <a href="http://imgur.com/" target="_blank">Imgur</a> has a great interface.</small></strong>
                    <pre>![](http://www.example.com/image.jpg)</pre>
                    <Editor value={this.state.topic.body} onChange={this.updateBody.bind(this)} />
                </div>
                <div className="form-section">
                    <button className="btn">Submit</button>
                </div>
            </form>
        );
    }

    updateBody (comment) {
        this.refs.body.value = comment;
    }
}
