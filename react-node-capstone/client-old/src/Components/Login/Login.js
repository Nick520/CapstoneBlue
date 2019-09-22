import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: [event.target.value]
    });
  }

  handleSubmit(event) {
    
    this.callBackendAPI()
    .then(res => this.setState( {username : res.express}))
    .catch(err => console.log(err));

    event.preventDefault();
  }

  callBackendAPI = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="p-5" id="Login">
        <div className="LoginBar">
          <div className="LoginContent">
            <h2 className="text-center">Please Log In</h2>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                />
                <br />

                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Sign In
              </button>
                </div>
              </div>
            </form>
            <div className="text-center newAccount">
              <Link to="/Signup">Dont have an account? Click here to sign up.</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;