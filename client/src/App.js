import React, {Component} from 'react';
import './App.css';

// Component to fetch data and pass to FilterableStudentTable component
class App extends Component {
  constructor(props) {
    super(props);

    this.state = { data: [], loading: true };
  }

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ data: res.data, loading:false }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/data');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  render() {
    const { loading } = this.state;
    if(loading) return null;
    return (
      <div className="App">
      <h1> Synocate Exercise </h1>
        <FilterableStudentTable students={this.state.data} />
      </div>
    );
  }
}

// Component to display row of table
class StudentRow extends React.Component {
  render() {
    const student = this.props.student;

    return (
      <tr>
        <td>{student.ID}</td>
        <td>{student.Name}</td>
        <td>{student.Age}</td>
        <td>{student.Major}</td>
        <td>{student.College}</td>
      </tr>
    );
  }
}

// Component to add DropDowns for Sorting
class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {criteria: '', order: 'Ascending'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    if(this.state.criteria !== 'undefined' && this.state.criteria !== "" && this.state.order !== 'undefined' && this.state.order !== "")
      this.props.sortStudentsStateBy(this.state.criteria, this.props.students, this.state.order);
    else
      alert('Please select sort criteria before submitting.');
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <label className="custom-dropdown">
          <select defaultValue="Select" name="criteria" onChange={this.handleChange}>
            <option value="Select" disabled>Select criteria to sort</option>
            <option value="ID">ID    </option>
            <option value="Name">Name  </option>
            <option value="Age">Age   </option>
            <option value="Major">Major </option>
            <option value="College">College</option>
          </select>
        </label>

        <label className="custom-dropdown">
          <select name="order" onChange={this.handleChange}>
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>
        </label>

        <input type="submit" value="Submit"/>
      </form>
    );
  }
}

// Component to add Filter Dropdowns
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {criteria: 'id', value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let set = new Set();
    var filteredRows = [];

    if(event.target.name === "criteria") {
      for(var student in this.props.students) {
        set.add(this.props.students[student][event.target.value]);
      }

      filteredRows.push("<option value=\"Select\">Select value to filter</option>");

      set.forEach(function (val) {  
          filteredRows.push("<option value=\"" + val + "\">" + val + "</option>");
      });
      document.getElementById("filteredValues").innerHTML = filteredRows;
      this.setState({ value: '' });
    }

    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    if(this.state.criteria !== 'undefined' && this.state.criteria !== "" && this.state.value !== 'undefined' && this.state.value !== "")
      this.props.filterStudentsBy(this.state.criteria, this.props.students, this.state.value);
    else
      alert('Please select filter creteria/value before submitting.');
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>

        <label className="custom-dropdown">
          <select defaultValue="Select" name="criteria" onChange={this.handleChange} label="Select">
            <option value="Select" disabled>Select cretiria to filter</option>
            <option value="ID">ID</option>
            <option value="Name">Name</option>
            <option value="Age">Age</option>
            <option value="Major">Major</option>
            <option value="College">College</option>
          </select>
        </label>

        <label className="custom-dropdown">
          <select defaultValue="Select" name="value" onChange={this.handleChange} id="filteredValues">
          </select>
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}

// Student Table component
class StudentTable extends React.Component {
  render() {
    const rows = [];
    
    this.props.students.forEach((student) => {
      rows.push(
        <StudentRow 
          student={student}
          key={student.ID}/>
      );
    });

    return (
      <table id="students">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Major</th>
            <th>College</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

// Component receiving data from App component
class FilterableStudentTable extends React.Component {
  state = {
   'students': this.props.students,
   'order':'Ascending'
  };

  sortStudentsStateBy = (criteria, students, order) => {
    
    students.sort(compareValues(criteria, order));
    
    this.setState({'students': students, 'order': order});
  };

  filterStudentsBy = (criteria, students, val) => {

    students = students.filter(student => {return student[criteria].toString() === val});

    this.setState({'students': students});
  };

  render() {
    return (
      <div>
        <StudentTable students={this.state.students} />
        <DropDown direction={this.state.order} students={this.props.students} sortStudentsStateBy={this.sortStudentsStateBy}/>
        <Filter students={this.props.students} filterStudentsBy={this.filterStudentsBy} />
        
      </div>
    );
  }
}

// utility method used for sorting
function compareValues(key, order='Ascending') {
  return function(a, b) {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        return 0; 
    }

    const varA = (typeof a[key] === 'string') ? 
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? 
      b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'Descending') ? (comparison * -1) : comparison
    );
  };
}

export default App;
