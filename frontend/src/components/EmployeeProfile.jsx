import React, { useEffect, useState } from 'react';

const EmployeeProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    clockInStatus: 'Not Clocked In',
    jobSchedule: '',
    attendance: [],
    leaveDays: 0,
    warnings: [],
    skills: []
  });

  useEffect(() => {
    fetch('http://localhost:5000/employee/profile')
      .then(response => response.json())
      .then(data => {
        setProfile({
          name: data.name,
          clockInStatus: data.clockInStatus,
          jobSchedule: data.jobSchedule,
          attendance: data.attendance,
          leaveDays: data.leaveDays,
          warnings: data.warnings,
          skills: data.skills
        });
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, []);

  return (
    <div>
      <h1>Employee Profile</h1>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Clock In Status:</strong> {profile.clockInStatus}</p>
      <p><strong>Job Schedule:</strong> {profile.jobSchedule}</p>

      <h2>Attendance</h2>
      <ul>
        {profile.attendance.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>

      <h2>Leave Days</h2>
      <p>{profile.leaveDays} days remaining</p>

      <h2>Warnings</h2>
      <ul>
        {profile.warnings.map((warning, index) => (
          <li key={index}>{warning}</li>
        ))}
      </ul>

      <h2>Skills</h2>
      <ul>
        {profile.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeProfile;
