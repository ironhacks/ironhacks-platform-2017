import React from "react";
import HackItem from "./hack";
import forEach from "iterate-object";

export default class AdminHackTypeItem extends React.Component {
    renderItems () {
        const items = [];
        let index = -1;
        forEach(this.props.hackType, (hackObj, hackId) => {
            if (typeof hackObj === "string") { return; }
            hackObj.id = hackId;
            items.push(<HackItem hack={hackObj} key={++index} phases={this.props.phases} />);
        });
        return items;
    }
    render () {
        return (
            <div>
                <h2>HackType: <span className="hack-type-name">{this.props.hackType.name}</span></h2>
                {this.renderItems()}
            </div>
        );
    }
}
