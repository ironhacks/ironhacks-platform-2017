import React from "react";
import UserItem from "./user";
import forEach from "iterate-object";

export default class HackItem extends React.Component {
    renderItems () {
        const items = [];
        let index = -1;
        forEach(this.props.hack, user => {
            items.push(<UserItem user={user} key={++index} phases={this.props.phases} />);
        });
        return items;
    }
    render () {
        return (
            <div>
                <h3>Hack ID: {this.props.hack.id}</h3>
                {this.renderItems()}
            </div>
        );
    }
}
