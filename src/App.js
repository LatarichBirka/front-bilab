import './App.css';
import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch} from "react-router-dom";
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import MainPage from './MainPage/MainPage';
import Procedures from './Procedures/Procedures';
import SpecialOffer from './SpecialOffer/SpecialOffer';
import About from './About/About';
import Employee from './Employee/Employee';
import UserProfile from './Profile/UserProfile/UserProfile';
import EmployeeProfile from './Profile/EmployeeProfile/EmployeeProfile';
import AdminProfile from './Profile/AdminProfile/AdminProfile';
import ProcedureDetail from "./сomponents/ProcedureDetail/ProcedureDetail";
import ProcedureSearch from './сomponents/ProcedureSearch/ProcedureSearch';
import SpecialOfferDetail from './сomponents/SpecialOfferDetail/SpecialOfferDetail';
import EmployeeDetail from './сomponents/EmployeeDetail/EmployeeDetail';
// import NavigationBar from './components/NavigationBar/NavigationBar';

function App(props) {
  useEffect(() => {
    // Clear local storage when the application starts
    localStorage.clear();
  }, []); // Empty dependency array ensures this runs only once
  
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/sign-in" render={(props) => <SignIn {...props} />} />
          <Route exact path="/sign-up" render={(props) => <SignUp {...props} />} />
          <Route exact path="/" render={(props) => <MainPage {...props} />} />
          <Route exact path="/procedures" render={(props) => <Procedures {...props} />} />
          <Route exact path="/procedure/:id" render={(props) => <ProcedureDetail {...props} />} />
          <Route exact path="/specialOffer/:id" render={(props) => <SpecialOfferDetail {...props} />} />
          <Route exact path="/procedure-search" render={(props) => <ProcedureSearch {...props} />} />
          <Route exact path="/specialOffer" render={(props) => <SpecialOffer {...props} />} />
          <Route exact path="/about" render={(props) => <About {...props} />} />
          <Route exact path="/employee" render={(props) => <Employee {...props} />} />
          <Route exact path="/employee/:id" render={(props) => <EmployeeDetail {...props} />} />
          <Route exact path="/user-profile" render={(props) => <UserProfile {...props} />} />
          <Route exact path="/employee-profile" render={(props) => <EmployeeProfile {...props} />} />
          <Route exact path="/admin-profile" render={(props) => <AdminProfile {...props} />} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
