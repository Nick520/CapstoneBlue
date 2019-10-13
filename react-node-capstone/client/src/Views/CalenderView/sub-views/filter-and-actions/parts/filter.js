import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Header from "../../parts/Header";
import Select from "../../../../../components/Select/Select"
import Checkbox from '@material-ui/core/Checkbox';
import EventTypesFilter from "./eventTypesFilter";
import CalendarFilter from "./calendarFilter";


const commonData = {
    style: { overflowY: "scroll", "maxHeight": window.innerHeight * 0.8, padding: "8px" },
};


export default class Filter extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "eventTypes": { "advisingSlots": false, "attendingEvents": true, "createdEvents": false, "requestedAppointments": false, "approvedAppointments": false },
        };

        this.onDisplayEventTypesChange = this.onDisplayEventTypesChange.bind(this);
        this.handleAddEvent = this.handleAddEvent.bind(this);
    }


    onDisplayEventTypesChange(value, show) {
        this.props.onChangeCalendarData("data-type", value, show);
    }

    handleAddEvent(mode) {
        this.props.openPopup("eventForm", { "mode": "event" });
    }

    render() {

        let classes = makeStyles(theme => ({
            root: {
                width: '100%',
            },
            heading: {
                fontSize: theme.typography.pxToRem(15),
                fontWeight: theme.typography.fontWeightRegular,
            }
        }));

        let menuOptions = [
            { key: "event", name: "Add Event" },
            { key: "appointment", name: "Add Appointment" },
            { key: "advisingSlot", name: "Add Advising Slots" },
        ];

        const onMenuOptionClick = (mode) => {
            this.handleAddEvent(mode, "");

        };

        return (
            <div className="calendarView_side_card">

                <Header title="Calendar Options" menuOptions={menuOptions} onMenuOptionClick={onMenuOptionClick} action={{ name: "Add Event", onClick: this.handleAddEvent }} />

                <div style={commonData.style} className="styleScroll">

                    <div className={classes.root}>

                        <EventTypesFilter onChangeCalendarData={this.props.onChangeCalendarData} />

                        <CalendarFilter onChangeCalendarData={this.props.onChangeCalendarData} />

                    </div>

                </div>
            </div>

        );
    }

}
