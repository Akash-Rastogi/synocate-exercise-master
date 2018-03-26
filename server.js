const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/data', (req, res) => {
  res.send({
    data: [
      { ID: 13942, Name: 'John Doe', Age: 18, Major: 'Bioengineering', College: 'UCLA' },
      { ID: 12481, Name: 'Mary Jane', Age: 19, Major: 'Sociology', College: 'Columbia University' },
      { ID: 28202, Name: 'Paul Smith', Age: 20, Major: 'Economics', College: 'UPenn' },
      { ID: 41294, Name: 'Peter Chang', Age: 19, Major: 'Computer Science', College: 'MIT' },
      { ID: 39040, Name: 'Anant Patel', Age: 21, Major: 'Mathematics', College: 'UCLA' },
      { ID: 91204, Name: 'Derek Lee', Age: 19, Major: 'Electrical Engineering', College: 'UC Berkeley' },
      { ID: 83920, Name: 'Rohan Gupta', Age: 19, Major: 'Computer Science', College: 'Columbia University' },
      { ID: 71200, Name: 'Jasmine Ang', Age: 20, Major: 'Physics', College: 'Stanford University' },
    ]
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));