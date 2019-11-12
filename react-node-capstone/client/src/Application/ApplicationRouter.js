import React from "react";
import {Route, Switch, BrowserRouter as Router} from "react-router-dom";
import Header from "../BaseLayout/Header/Header";
import Footer from "../BaseLayout/Footer/Footer";
import Main from "../BaseLayout/Main/Main";
import Profile from "../Authentication/Profile/Profile";
import CalenderView from "../Views/CalenderView/CalenderView";
import GroupView from "../BaseLayout/GroupView/GroupView";
import EventsView from "../BaseLayout/EventsView/EventsView";
import RequestEvent from "../components/EventsPage/RequestEvent";
import ViewAllEvents from "../components/EventsPage/ViewAllEvents";
import CreateEvent from "../components/EventsPage/CreateEvent";
import CreateGroupEvent from "../BaseLayout/GroupView/CreateGroupEvent";
import ApproveEvent from "../components/EventsPage/ApproveEvent";
import ForgotPassword from "../Authentication/ForgotPassword/ForgotPassword";
import Login from "../Authentication/Login/Login";
import Register from "../Authentication/Register/Register";
import AuthRoute from "../Route/AuthRoute";
import ProfileView from "../Views/ProfileView/ProfileView";
import "./images/background.jpg";

import "./styles/application-styles.css";
import "./styles/flex-styles.css";
import "./styles/text-and-background-colors.css";
import "./styles/background-images.css";


export default function ApplicationRouter(props) {

    let header = <div/>;
    let footer = <div/>;
    let wrapperClassName = "mdl-layout mdl-js-layout flex-column mdl-layout--fixed-header full";
    let contentClassName = "mdl-layout__content";


    if (props.auth) {

        header = <Header/>;
        footer = <Footer/>;

        wrapperClassName += " ";
        contentClassName += " flex-column flex-full mdl-color--grey-200";
    } else {

        wrapperClassName += "flex-full ulm-library-image";
        contentClassName += "";
    }


    let routesHtml = [];

    if (props.auth) {

        routesHtml.push(<Route auth={props.auth} path="/profile" component={Profile}/>);
        routesHtml.push(<Route auth={props.auth} path="/calenderView" component={CalenderView}/>);
        routesHtml.push(<Route auth={props.auth} path="/groupView" component={GroupView}/>);
        routesHtml.push(<Route auth={props.auth} path="/eventsView" component={EventsView}/>);
        routesHtml.push(<Route auth={props.auth} path="/viewAllEvents" component={ViewAllEvents}/>);
        routesHtml.push(<Route auth={props.auth} path="/createGroupEvent" component={CreateGroupEvent}/>);
        routesHtml.push(<Route auth={props.auth} path="/requestEvent" component={RequestEvent}/>);
        routesHtml.push(<Route auth={props.auth} path="/viewAllEvents" component={ViewAllEvents}/>);
        routesHtml.push(<Route auth={props.auth} path="/createEvent" component={CreateEvent}/>);
        routesHtml.push(<Route auth={props.auth} path="/profileView" component={ProfileView}/>);
        routesHtml.push(<Route auth={props.auth} path="/approveEvent" component={ApproveEvent}/>);
        routesHtml.push(<Route auth={props.auth} path="/" component={Main}/>);


    } else {

        routesHtml.push(<AuthRoute auth={props.auth} path="/login" component={Login}/>);
        routesHtml.push(<AuthRoute auth={props.auth} path="/register" component={Register}/>);
        routesHtml.push(<AuthRoute auth={props.auth} path="/forgotPassword" component={ForgotPassword}/>);
        routesHtml.push(<AuthRoute auth={props.auth} path="/" component={Login}/>);
    }

    return (
        <Router>
            <div className={wrapperClassName}>

                {header}

                <main className={contentClassName}>
                    <div className="flex-column flex-full">

                        <Switch>
                            {routesHtml}
                        </Switch>
                    </div>

                    {footer}
                </main>
            </div>
        </Router>);
}