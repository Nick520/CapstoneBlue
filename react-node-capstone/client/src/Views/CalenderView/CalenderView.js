import React from "react";
import Calendar from "./Calendar/Calendar";
import EventsList from "./SubViews/events/EventsList";
import CalendarOptions from "./SubViews/filter-and-actions/FilterAndActions"
import ls from "local-storage"
import { get } from "../../ApiHelper/ApiHelper"
import "./main.css";
import "./scroll.css"
import EventForm from "./SubViews/forms/EventForm";
import EventDetails from "./SubViews/eventDetails/EventDetails"
import AdvisingSlotForm from "./SubViews/forms/AdvisingSlotForm";
import EventTypesData from "./Data/EventTypesData";



class CalenderView extends React.Component {

    state = {
        "userType": ls.get("user_type"),
        "isLoading": false,
        "eventForm": false,
        "eventDetails": false,
        "formMode": "event",
        "advisingSlotForm": false,
        "cals": ["main"],
        "eventTypes": ["attendingEvents"],
        "eventFormData": {},
        "sharedCals": []
    };

    constructor(props) {
        super(props);

        this.onDisplayEventTypesChange = this.onDisplayEventTypesChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.onChangeCalendarData = this.onChangeCalendarData.bind(this);
        this.getProcessedEventsToDisplay = this.getProcessedEventsToDisplay.bind(this);
        this.handlePopupSave = this.handlePopupSave.bind(this);
        this.handlePopupCancel = this.handlePopupCancel.bind(this);
        this.handlePopupClose = this.handlePopupClose.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.onChangeCalendarOptions = this.onChangeCalendarOptions.bind(this);
    }

    onCalendarDateClick = (date) => {
        console.log(date);

    }

    onCalendarEventClick = (event)  =>{
        console.log(event);

    }

    onChangeCalendarData(action, values) {

        if (action === "eventTypes") {
            this.onDisplayEventTypesChange(values);
        } else if (action === "clear") {
            this.setState({ "data": [] });
        } else if (action === "cal") {
            this.onChangeCalendarOptions(values);
        } else if (action === "sharedCal") {
            this.onChangeSharedCalendarOptions(values);
        }

    }

    onChangeCalendarOptions(values) {

        const calId = values.id;

        if (values.show) {

            this.state.eventTypes.forEach((type) => {
                const name = type + calId;

                const allEvents = this.state[name];

                if (allEvents == null || allEvents.length === 0) {
                    this.loadData(type, calId);
                }
            });

            this.setState({ "cals": [...this.state.cals, calId] })

        } else {

            var nState = {};

            this.state.eventTypes.forEach((type) => {
                const name = type + calId;
                nState[name] = [];
            });

            nState["cals"] = this.state.cals.filter((id) => { return id !== calId ? true : false });
            this.setState(nState);
        }
        console.log(values);
    }

    onChangeSharedCalendarOptions(values) {

        const calId = values.id;
        const name = "sharedCalData-" + calId;
        if (values.show) {

            if (this.state[name] == null || this.state[name].length === 0) {
                this.loadSharedCalendarData(calId);
                this.setState({ "sharedCals": [...this.state.sharedCals, calId] })
            }

        } else {
           
            var nState = {};

            nState[name] = [];
            nState["sharedCals"] = this.state.sharedCals.filter((id) => { return id !== calId ? true : false });
            this.setState(nState);
        }
        console.log(values);
    }

    onDisplayEventTypesChange(showEventTypes) {

        //this.setState({ "displayDataType": displayDataType });

        if (showEventTypes == null || showEventTypes.length === 0) {
            return;
        }

        let eventTypes = [];
        for (var eventType in showEventTypes) {

            const eType = eventType;

            if (showEventTypes[eType]) {
                const type = eType;
                this.state.cals.forEach((id) => {
                    const name = type + id;

                    console.log(this.state);
                    console.log(this.state[name]);

                    var currentData = this.state[name];
                    if (currentData == null || currentData.length === 0) {
                        this.loadData(eType, id);
                    }
                });

                eventTypes.push(eType);

            } else {
                let newState = {};
                this.state.cals.forEach(function (id) {
                    const name = eType + id;
                    newState[name] = [];
                });
                this.setState(newState);
            }
        }
        this.setState({ "eventTypes": eventTypes });
        console.log(showEventTypes);
    }



    openPopup(name, data) {

        if (name === "eventForm") {

            let mode = "";

            if (!data || !data.mode) {
                mode = "event";
            } else {
                mode = data.mode;
            }

            this.setState({ "eventForm": true, "formMode": mode });

        } else if (name === "eventDetails") {

            this.setState({ "eventDetails": true });

        } else if (name === "advisingSlotForm") {

            this.setState({ "advisingSlotForm": true });

        } else if (name === "editAppointment") {

            this.setState({ "eventForm": true, "formMode": "editAppointment", "eventFormData": data });

        }



    }

    handlePopupCancel(popupName) {



        this.handlePopupClose(popupName);
    }

    handlePopupSave(popupName, data) {
        this.handlePopupClose(popupName);
    }

    handlePopupClose(popupName) {

        this.setState({ [popupName]: false })
    }


    loadData(displayDataType, calId) {

        if (calId == null || calId.length === 0) {
            calId = "main";
        }

        if (this.state.isLoading) {
            return;
        }

        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
        }

        let url = EventTypesData.dataMapping[displayDataType].url;

        if (calId != null && (calId.length > 0)) {
            url += "/" + calId;
        }
        get(url, (res) => {

            let data = [];

            if (res.success) {

                res.results.forEach(d => {
                    console.log(d);
                    data.push({
                        "key": d.eventID,
                        "start": d.start,
                        "end": d.end,
                        "id": d.eventID,
                        "title": d.title,
                        "description": d.description,
                        "color": "white",
                        "backgroundColor": "#880E4F",
                        "eventType": d.event_type,
                    });
                    data = EventTypesData.addEventSpecificData(displayDataType, data);
                });

            }
            const name = displayDataType + calId;
            var newState = {};
            newState[name] = data;
            newState["isLoading"] = false;
            console.log(newState);
            this.setState(newState);
        });

    }

    loadSharedCalendarData(calId) {

        if (calId == null || calId.length === 0) {
            calId = "main";
        }

        if (this.state.isLoading) {
            return;
        }

        if (!this.state.isLoading) {
            this.setState({ isLoading: true });
        }

        let url = "/events/sharedCalendar/" + calId;

        get(url, (res) => {

            let data = [];

            if (res.success) {

                res.results.forEach(d => {
                    console.log(d);
                    data.push({
                        "key": d.eventID,
                        "start": d.start,
                        "end": d.end,
                        "id": d.eventID,
                        "title": d.title,
                        "description": d.description,
                        "color": "white",
                        "backgroundColor": "#E65100",
                        "eventType": d.event_type,
                    });
                });

            } else {
                console.log("ERROR");
                console.log(res.message);
                console.log("ERROR");

            }
            const name = "sharedCalData-" + calId;
            var newState = {};
            newState[name] = data;
            newState["isLoading"] = false;
            console.log(newState);
            this.setState(newState);
        });

    }


    componentDidMount() {

        this.loadData("attendingEvents", "main");

    }

    getProcessedEventsToDisplay() {
        let events = [];

        this.state.eventTypes.forEach((type) => {

            this.state.cals.forEach(id => {
                const name = type + id;
                const currentEvents = this.state[name];
                console.log(name);
                console.log(currentEvents);
                if (currentEvents != null && currentEvents.length > 0) {

                    events = events.concat(currentEvents);
                }

            });
        });

        this.state.sharedCals.forEach((sCal) => {

            const name = "sharedCalData-" + sCal;
            const list = this.state[name];
            if (list != null && list.length > 0) {
                events = events.concat(list);
            }
            
        });

        console.log(events);
        return events;
    }

    render() {

        console.log(this.state);

        let events = this.getProcessedEventsToDisplay();

        let title = "Selected Events";

        if (this.state.isLoading) {
            title = "Loading .....";
        }

        return (
            <div className="calendarViewRoot">

                <AdvisingSlotForm onCancel={() => this.handlePopupCancel("advisingSlotForm")} onClose={() => this.handlePopupClose("advisingSlotForm")} onSave={(data) => this.handlePopupSave("advisingSlotForm", data)} open={this.state.advisingSlotForm} />

                <EventForm eventFormData={this.state.eventFormData} formMode={this.state.formMode} onCancel={() => this.handlePopupCancel("eventForm")} onClose={() => this.handlePopupClose("eventForm")} onSave={(data) => this.handlePopupSave("eventForm", data)} open={this.state.eventForm} />

                <EventDetails mode={this.state.mode} onCancel={() => this.handlePopupCancel("eventDetails")} onClose={() => this.handlePopupClose("eventDetails")} onSave={(data) => this.handlePopupSave("eventDetails", data)} open={this.state.eventDetails} />

                <div className="calendarViewContainer">

                    <CalendarOptions openPopup={this.openPopup} isLoading={this.state.isLoading} onChangeCalendarData={this.onChangeCalendarData} events={events} userType={this.state.userType} />

                    <Calendar onEventClick={this.onCalendarEventClick} onDateClick={this.onCalendarDateClick} events={events} />

                    <EventsList openPopup={this.openPopup} title={title} isLoading={this.state.isLoading} events={events} />


                </div>
            </div>
        );
    }
}


export default CalenderView;
