import React from "react";

export default class HackTypeAndIdSelector extends React.Component {
    render () {
        let hackTypeOptions = ["All"]
          , hackIdOptions = ["All"]
          ;

        this.props.users.forEach(user => {
            if (!hackTypeOptions.includes(user.profile.hack_type)) {
                hackTypeOptions.push(user.profile.hack_type);
            }
            if (!hackIdOptions.includes(+user.profile.hack_id)) {
                hackIdOptions.push(+user.profile.hack_id);
            }
        });

        hackTypeOptions = hackTypeOptions.map((c, i) => {
            return <option key={i} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
        });

        hackIdOptions = hackIdOptions.map((c, i) => {
            return <option key={i} value={c}>{c}</option>
        });

        const hackTypeSelect = <select defaultValue="All" name="hackType">
            {hackTypeOptions}
        </select>;

        const hackIdSelect = <select defaultValue="All" name="hackId">
            {hackIdOptions}
        </select>;

        const exportTypeSelect = this.props.show_export_type ? <select name="exportType">
            <option value="users">User Details</option>
            <option value="forum_details">Forum Details</option>
        </select> : null;

        return <span>
            {hackTypeSelect}
            {hackIdSelect}
            {exportTypeSelect}
        </span>;
    }
}
