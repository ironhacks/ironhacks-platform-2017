import React from "react";
import CsrfInput from "../../util/csrf-input";

export default class UserItem extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            expanded: false
        };
    }

    onToggle (e) {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    onUserDelete (e) {
        if (!confirm("Do you really want to delete this user?")) {
            return e.preventDefault()
        }
    }

    render () {
        const phaseData = this.props.user.profile[this.props.phases[this.props.user.profile.hack_type]] || {};
        const commits = this.props.user.profile.commits || [];
        const commitItems = commits.map((c, i) => <li key={i}>
            <a target="blank" href={c.html_url}><code>{c.commit.message}</code></a>
        </li>);
        return (
            <div className="user-item" data-id={this.props.user._id}>
                <div className="pointer user-username" onClick={this.onToggle.bind(this)}>
                    <h3>{this.props.user.username}</h3>
                </div>
                <div className={this.state.expanded ? "expanded" : "hide"}>
                    <input name="user-hack-type" type="hidden" value={this.props.user.profile.hack_type} />
                    <div className="username">
                        <span className="user-label">Username:</span> {this.props.user.username}
                    </div>
                    <div className="email">
                       <span className="user-label">Email:</span> {this.props.user.email}
                    </div>
                    <div className="total-score">
                       <span className="user-label">Total Score:</span> {phaseData.score_total}
                    </div>
                    <div className="project-url">
                        <span className="user-label">Project URL:</span> <input type="text" name="project_url" key={`poject-url-${Date.now()}`} defaultValue={phaseData.project_url} />
                    </div>
                    <div className="github-repo-url">
                        <span className="user-label">GitHub Repository URL:</span> <input type="text" name="github_repo_url" key={`github-repo-url-${Date.now()}`} defaultValue={phaseData.github_repo_url} />
                    </div>
                    <div className="score-technical">
                        <span className="user-label">Technical score:</span> <input type="number" name="score_technical" key={`score-technical-${Date.now()}`} defaultValue={phaseData.score_technical || 0} />
                    </div>
                    <div className="score-info-viz">
                        <span className="user-label">Info Viz Score:</span> <input type="number" name="score_info_viz" key={`score-info-viz-${Date.now()}`} defaultValue={phaseData.score_info_viz || 0} />
                    </div>
                    <div className="score-novelty">
                        <span className="user-label">Novelty Score:</span> <input type="number" name="score_novelty" key={`score-novelty-${Date.now()}`} defaultValue={phaseData.score_novelty || 0} />
                    </div>
                    <div className="score-custom">
                        <span className="user-label">User Requirements:</span> <input type="number" name="score_custom" key={`score-novelty-${Date.now()}`} defaultValue={phaseData.score_custom} />
                    </div>
                    <div className="score-total">
                        <span className="user-label">Total:</span> <input type="number" name="score_total" key={`score-total-${Date.now()}`} defaultValue={phaseData.score_total} />
                    </div>
                    <div className="user-role">
                        <span className="user-label">User role:</span>
                        <select name="role" key={`user-role-${Date.now()}`} defaultValue={this.props.user.role}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="user-commits">
                        <span className="user-label">Commits ({commits.length})</span>
                        <ul>
                            {commitItems}
                        </ul>
                    </div>
                    <div className="user-delete">
                        <span className="user-label">User delete:</span>
                        <form action="/admin" method="POST" className="inline-block" onSubmit={this.onUserDelete.bind(this)}>
                            <CsrfInput />
                            <input type="hidden" name="delete-user-id" value={this.props.user._id} />
                            <input type="submit" value="Delete user" className="btn btn-small" />
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
