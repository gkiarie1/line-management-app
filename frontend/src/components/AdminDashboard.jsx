import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [employees, setEmployees] = useState([]);  // To store all employees
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newUser, setNewUser] = useState({ name: '', jobSchedule: '', username: '', password: '', skills: '' });
  const [updateStatus, setUpdateStatus] = useState(null);

  // Fetch attendance, recommendations, and employees when the component loads
  useEffect(() => {
    // Fetch attendance and recommendations
    fetch('http://localhost:5000/admin/dashboard')
      .then(response => response.json())
      .then(data => {
        setAttendance(data.attendance);
        setRecommendations(data.recommendations);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    // Fetch all employees
    fetch('http://localhost:5000/admin/employees')
      .then(response => response.json())
      .then(data => {
        const employeeList = Object.entries(data).map(([id, emp]) => ({
          id: parseInt(id),
          ...emp
        }));
        setEmployees(employeeList);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  // Handle adding a skill to an employee
  const handleSkillUpdate = () => {
    if (selectedEmployeeId && newSkill) {
      fetch(`http://localhost:5000/employee/${selectedEmployeeId}/add-skill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skill: newSkill }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Skill added:', data);
          setNewSkill(''); // Clear the input after adding skill
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    const response = await fetch('http://localhost:5000/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newUser.name,
        jobSchedule: newUser.jobSchedule,
        username: newUser.username,
        password: newUser.password,
        skills: newUser.skills.split(',')
      })
    });

    const data = await response.json();
    setUpdateStatus(data.message);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Current Attendance</h2>
      <ul>
        {attendance.map((employee, index) => (
          <li key={index}>
            {employee.name} - {employee.skill} - {employee.attendanceStatus}
          </li>
        ))}
      </ul>

      <h2>Recommendations</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>{rec.message}</li>
        ))}
      </ul>

      <h2>All Employees</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>
            {employee.name} - Skills: {employee.skills.join(', ')} - Schedule: {employee.jobSchedule}
          </li>
        ))}
      </ul>

      <h2>Add Skill to Employee</h2>
      <select onChange={(e) => setSelectedEmployeeId(e.target.value)}>
        <option value="">Select Employee</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
        placeholder="Enter new skill"
      />
      <button onClick={handleSkillUpdate}>Add Skill</button>

      <h2>Create New User</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Name" onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <input type="text" placeholder="Job Schedule" onChange={(e) => setNewUser({ ...newUser, jobSchedule: e.target.value })} />
        <input type="text" placeholder="Username" onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
        <input type="password" placeholder="Password" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <input type="text" placeholder="Skills (comma separated)" onChange={(e) => setNewUser({ ...newUser, skills: e.target.value })} />
        <button onClick={handleCreateUser}>Create User</button>
      </form>
      {updateStatus && <p>{updateStatus}</p>}
    </div>
  );
};

export default AdminDashboard;
