import React from "react";
import uFirst from "uc-first";

export default class TopicEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            selectedHackType: _pageData.user.profile.hack_type
        };
    }

    onHackTypeChange (e) {
        this.setState({
            selectedHackType: e.target.value
        });
        this.refs.hackid.value = "0";
    }

    render () {
        const hackTypes = _pageData.hackTypes;
        const $selectOpts = Object.keys(hackTypes).map((hackTypeName, index) => {
            return <option key={index} data-subforums={hackTypes[hackTypeName].subforums} value={hackTypeName}>{uFirst(hackTypeName)}</option>
        });

        const $select = <select name="hack_type" defaultValue={this.state.selectedHackType} onChange={this.onHackTypeChange.bind(this)}>
            {$selectOpts}
        </select>

        const maxSubforums = hackTypes[this.state.selectedHackType].subforums;

        return (
            <div className="form-section">
                <div className="row">
                    <div className="col">
                        <h3>HackType</h3>
                        <p>Choose the hack type. Without changing these, you will post the topic on the forum you belong to.</p>
                        {$select}
                    </div>
                    <div className="col">
                        <h3>Hack ID</h3>
                        <p>This should be the forum id: between <code>0</code> and <code>{maxSubforums}</code> for {uFirst(this.state.selectedHackType)}.</p>
                        <input ref="hackid" name="hackId" type="number" placeholder="Hack Id" defaultValue="0" min="0" max={maxSubforums} defaultValue={_pageData.user.profile.hack_id || 0} />
                    </div>
                </div>
            </div>
        );
    }
}
