import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import ImageUploadComponent from "./ImageUploadComponent";
import ImageListComponent from "./ImageListComponent";
import ImageDetailsComponent from "./ImageDetailsComponent";

const App = () => {
  return (
    <Router>
      <div className="container mt-3">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">
            Image App
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/upload">
                  Upload Image
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/list">
                  Image List
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Switch>
          <Route path="/" exact component={ImageListComponent} />
          <Route path="/upload" component={ImageUploadComponent} />
          <Route path="/list" component={ImageListComponent} />
          <Route path="/details/:id" component={ImageDetailsComponent} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
