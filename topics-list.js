import React from "react";
import TopicsListItem from "./topics-list-item";
import AdminTopicFilters from "./admin-topic-filters";

export default class TopicsList extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            topics: this.props.topics
        };
    }

    updateTopics (topics) {
        this.setState({ topics });
    }

    renderItems () {
        const topics = this.state.topics || this.props.topics || [];
        return topics.map((c, index) => {
            return (
                <TopicsListItem
                    key={index}
                    itemNumber={index + 1}
                    {...c}
                    id={index}
                />
            )
        });
    }

    render () {
        if (!this.props.topics) {
            return <p>Loading...</p>;
        }
        if (!this.props.topics.length) {
            return <p className="tutorial">Create your first topic! :)</p>;
        }
        return (
            <div className="posts-list">
                <h1>
                    Latest posts
                    { _pageData.isAdmin ? <AdminTopicFilters topics={this.props.topics} updateTopics={this.updateTopics.bind(this)} /> : null }
                </h1>
                {this.renderItems()}
            </div>
        )
    }
}
