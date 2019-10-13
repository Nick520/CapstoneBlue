import React from 'react';
import MessageBox from "../../../../components/Form/MessageBox/MessageBox"
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DateTimePicker,
} from '@material-ui/pickers';
import TextField from "@material-ui/core/TextField"
import MaterialButton from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Header from "../parts/Header";
import Progress from "../parts/progress";
import { get, post } from "../../../../ApiHelper/ApiHelper";
import Select from "../../../../components/Select/Select";



export default class EventForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            "start": new Date(),
            "end": new Date(),
            "message": "",
            "title": "",
            "description": "",
            "event_type": "",
            "attendee_emails": "",
            "progress": false,
            "calendarId": "",
            "calendarOptions": [],
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.hideMessage = this.hideMessage.bind(this);
    }

    hideMessage() {
        this.setState({message: ""});
    }

    handleChange(name, value) {

        var newState = {};
        newState[name] = value;

        this.setState(newState);
    }

    componentDidMount() {

        this.setState({ "isLoading": true });

        get("calendar/all", (res) => {
            if (res.success) {

                let calendarOptions = [];

                if (res.data) {
                    res.data(d => {
                        calendarOptions.push({ "name": d.name, "value": d.id });
                    });
                }

                this.setState({ "isLoading": false, "calendarOptions": calendarOptions });

            } else {
                this.setState({ "isLoading": false, message: res.message });
            }
        });
    }

    handleSave() {

        this.setState({ progress: true });

        let requiredKeys = ["start", "end", "message", "title", "description", "event_type"];
        let data = {};

        for (var i = 0; i < requiredKeys.length; i++) {

            let key = requiredKeys[i];

            if (!this.state[key] || ("" + this.state[key]).length == 0) {
                this.setState({ progress: false, "message": "Please enter all fields. Don't forget to add " + key });
                return false;
            } else {
                data[key] = this.state[key];
            }
        }

        data["attendee_emails"] = this.state.attendee_emails || "";

        if (this.props.mode) {

        } else {
            post("events", data, (res) => {

                if (res.success) {
                    this.setState({ "progress": false })
                    this.props.onClose();
                } else {
                    this.setState({ "progress": false, "message": res.message })
                }
            }); 
        }
        
    }

    render() {

        const type = this.props.type || "event";

        const headerActions = { "name": "Close", "onClick": this.props.onCancel };
        const menuOptions = [];
        const onMenuOptionClick = (selectedMenuOptionKey) => {

        };

        return (
            <div>
                <Dialog open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
                    <DialogTitle style={{ backgroundColor: "#01579B", "color": "#fff" }} id="form-dialog-title">
                        <h4>{this.props.title || "Add Event"}</h4>
                    </DialogTitle>

                    <Progress show={this.state.progress} />

                    <DialogContent>

                            <div>
                                <MessageBox noPadding message={this.state.message} hideMessage={this.hideMessage} />
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="center">

                                        <DateTimePicker
                                            fullWidth
                                            autoOk
                                            disablePast
                                            inputVariant="outlined"
                                            margin="normal"
                                            label="Start Time"
                                            value={this.state.start}
                                            onChange={(value) => this.handleChange("start", value)}
                                        />
                                        <DateTimePicker
                                            fullWidth
                                            autoOk
                                            disablePast
                                            inputVariant="outlined"
                                            margin="normal"
                                            label="End Time"
                                            value={this.state.end}
                                            onChange={(value) => this.handleChange("end", value)}
                                        />

                                        <TextField
                                            fullWidth
                                            type="text"
                                            onChange={(event) => this.handleChange("title", event.target.value)}
                                            value={this.state.title}
                                            label={"Enter title for " + type}
                                            margin="normal" />

                                        <TextField
                                            fullWidth
                                            type="text"
                                            onChange={(event) => this.handleChange("description", event.target.value)}
                                            value={this.state.description}
                                            label={"Enter description for " + type}
                                            margin="normal" />

                                        <TextField
                                            fullWidth
                                            type="text"
                                            onChange={(event) => this.handleChange("event_type", event.target.value)}
                                            value={this.state.event_type}
                                            label={"Enter type of " + type}
                                            margin="normal" />

                                        <TextField
                                            fullWidth
                                            type="text"
                                            onChange={(event) => this.handleChange("attendeeEmails", event.target.value)}
                                            value={this.state.attendeeEmails}
                                            label={"Enter comma separated emails of users to invite them"}
                                            margin="normal" />

                                    <Select
                                        label="Calendar"
                                        helperText="Select the Calendar to associate this event in"
                                        value={this.state.calendarId}
                                        options={this.state.calendarOptions}
                                        onChange={(value) => this.handleChange("calendarId", value)} />

                                    </Grid>
                                </MuiPickersUtilsProvider>
                            </div>

                    </DialogContent>
                    <DialogActions>
                        <MaterialButton onClick={this.props.onCancel} color="primary">
                            Cancel
                    </MaterialButton>
                        <MaterialButton onClick={this.handleSave} color="primary">
                            Save
                    </MaterialButton>
                    </DialogActions>
                </Dialog>
            </div>
            
        );
    }
}
