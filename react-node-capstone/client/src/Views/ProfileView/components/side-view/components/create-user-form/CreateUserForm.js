import React from "react";
import MessageBox from "../../../../../../components/Form/MessageBox/MessageBox"
import {post, get} from "../../../../../../ApiHelper/ApiHelper";
import DialogForm from "../../../../../CalenderView/components/forms/dialog-form/DialogForm";
import FormInputFields from "../../../../../../components/Form/FormInputFields";
import LengthValidatorForMultipleValues from "../../../../../../utils/length-utils/LengthValidatorForMultipleValues";


class CreateUserForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "message": "",
            "isLoading": false,
            "user_type": "",
            "advisors": [],
        };

    }

    hideMessage = () => {
        this.setState({"message": ""});
    };


    commonData = () => {
        return {
            commonFields: [
                {
                    "name": "user_type",
                    "type": "select",
                    "label": "User Type",
                    "require": true,
                    "onChange": this.handleChangeInUserType,
                    "options": [{"name": "Student", "value": "student"}, {"name": "Faculty", "value": "faculty"}]
                },
                {"name": "first_name", "type": "text", "label": "First Name", "required": true},
                {"name": "last_name", "type": "text", "label": "Last Name", "required": true},
                {"name": "campusEmail", "type": "email", "label": "Campus Email", "required": true, fullWidth: true},

            ],

            passwordFields: [
                {"name": "password", "type": "password", "label": "Password", "required": true},
                {"name": "confirmPassword", "type": "password", "label": "Confirm Password", "required": true},
            ],
            studentFields: [
                {"name": "major", "type": "text", "label": "Major", "required": true},
                {
                    "name": "advisor_id",
                    "type": "select",
                    "label": "Select Advisor",
                    "require": true,
                    onChange: this.handleChangeInAdvisors,
                    "options": this.state.advisors
                },
                {
                    "name": "classification",
                    "label": "Classification",
                    "type": "select",
                    "required": true,
                    "options": [{"name": "Freshman", "value": "freshman"}, {
                        "name": "Sophomore",
                        "value": "sophomore"
                    }, {"name": "Junior", "value": "junior"}, {"name": "Senior", "value": "senior"}]
                },
            ],
        }
    };

    handleChangeInAdvisors = (value) => {
        this.setState({advisor_id: value});
    };

    handleChangeInUserType = (value) => {

        this.setState({"user_type": value});

        if (value === "student") {
            this.loadAllAdvisers();
        }

    };

    loadAllAdvisers = () => {
        get("/user_info/advisors", (res) => {
            if (res.success) {
                let advisors = [];
                res.results.forEach(d => {
                    advisors.push({"name": d.first_name + " " + d.last_name, "value": d.user_id});
                });
                this.setState({"advisors": advisors});
            }
        });
    };

    getFields = () => {

        let studentFields = [];

        if (this.state.user_type === "student") {
            studentFields = this.commonData().studentFields;
        }

        return this.commonData().commonFields.concat(studentFields).concat(this.commonData().passwordFields);
    };

    handleSubmit = () => {
        this.setState({"isLoading": true});
        if (LengthValidatorForMultipleValues.containsEmptyValue([this.state.first_name, this.state.last_name,
            this.state.campusEmail, this.state.password, this.state.confirmPassword, this.state.user_type])) {
            this.setState({message: "Please enter all required values"});
            return false;
        }
        let data = {
            "first_name": this.state.first_name,
            "last_name": this.state.last_name,
            "campusEmail": this.state.campusEmail,
            "password": this.state.password,
            "confirmPassword": this.state.confirmPassword,
            "user_type": this.state.user_type,
        };

        if (this.state.user_type === "student") {
            if (LengthValidatorForMultipleValues.containsEmptyValue([this.state.classification, this.state.advisor_id, this.state.major])) {
                alert("empty");
                return false;
            }

            data["classification"] = this.state.classification;
            data["advisor_id"] = this.state.advisor_id;
            data["major"] = this.state.major;
        }

        post("/auth/createUser", data, (res) => {
            this.setState({
                "message": res.message,
                "isLoading": false
            });
        });
    };

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value});
    };

    buttons = [
        {name: "Cancel", onClick: this.props.onClose},
        {name: "Submit", onClick: this.handleSubmit},
    ];

    render() {

        let fields = this.getFields();

        return (
            <DialogForm open={this.props.open} buttons={this.buttons} onClose={this.props.onClose}
                        progress={this.state.isLoading}
                        title="Create a New User"
                        text="To create a new user, enter his information and hit submit.">
                <MessageBox message={this.state.message} hideMessage={this.hideMessage}/>
                <FormInputFields onChange={this.handleChange} fields={fields}/>
            </DialogForm>
        );
    }
}

export default CreateUserForm;