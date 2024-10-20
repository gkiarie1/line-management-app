from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample employee data
employees = {
    1: {
        'name': 'John Doe',
        'clockInStatus': 'Not Clocked In',
        'jobSchedule': 'Machine Operator - Line A',
        'attendance': ['2024-10-19: Clocked In', '2024-10-18: Clocked Out'],
        'leaveDays': 5,
        'warnings': ['Verbal Warning: 2024-09-10'],
        'skills': ['Machine Operator', 'Quality Control'],
        'hasAccount': True,
        'username': 'john_doe',
        'password': 'password123'
    },
    2: {
        'name': 'Alice Smith',
        'clockInStatus': 'Clocked In',
        'jobSchedule': 'Packaging - Line B',
        'attendance': ['2024-10-19: Clocked In', '2024-10-18: Clocked In'],
        'leaveDays': 2,
        'warnings': [],
        'skills': ['Packaging'],
        'hasAccount': False
    }
}

@app.route('/admin/employees', methods=['GET'])
def get_all_employees():
    return jsonify(employees), 200

# Mark attendance and login using QR code
@app.route('/clock-in/<int:employee_id>', methods=['POST'])
def clock_in(employee_id):
    employee = employees.get(employee_id)
    data = request.get_json()

    if employee:
        if employee.get('hasAccount'):
            # Check if password matches
            if data['password'] == employee['password']:
                # Log attendance
                employee['attendance'].append(f"{data['date']}: Clocked In")
                employee['clockInStatus'] = 'Clocked In'
                return jsonify({'message': 'Successfully clocked in and logged in.', 'employee': employee}), 200
            else:
                return jsonify({'message': 'Invalid password'}), 401
        else:
            return jsonify({'message': 'User does not have an account'}), 404
    else:
        return jsonify({'message': 'Employee not found'}), 404
    
@app.route('/admin/dashboard', methods=['GET'])
def admin_dashboard():
    # Fetch attendance data
    attendance = [{'id': emp_id, 'name': emp['name'], 'skill': emp['skills'][0], 'attendanceStatus': emp['clockInStatus']} for emp_id, emp in employees.items()]
    
    # Add logic to generate recommendations (this is just a placeholder)
    recommendations = []
    for emp_id, emp in employees.items():
        if emp['clockInStatus'] == 'Not Clocked In':
            recommendations.append({'message': f'Suggest {emp["name"]} clock in for the shift.'})

    return jsonify({
        'attendance': attendance,
        'recommendations': recommendations
    }), 200


# Admin - Create new users and update profiles
@app.route('/admin/create-user', methods=['POST'])
def create_user():
    data = request.get_json()
    new_employee_id = max(employees.keys()) + 1
    new_employee = {
        'name': data['name'],
        'clockInStatus': 'Not Clocked In',
        'jobSchedule': data['jobSchedule'],
        'attendance': [],
        'leaveDays': data.get('leaveDays', 0),
        'warnings': [],
        'skills': data.get('skills', []),
        'hasAccount': True,
        'username': data['username'],
        'password': data['password']
    }
    employees[new_employee_id] = new_employee
    return jsonify({'message': f"User {data['name']} created successfully", 'employee': new_employee}), 201

@app.route('/admin/update-profile/<int:employee_id>', methods=['PUT'])
def update_profile(employee_id):
    data = request.get_json()
    employee = employees.get(employee_id)
    
    if employee:
        # Update employee details
        employee.update({
            'name': data.get('name', employee['name']),
            'jobSchedule': data.get('jobSchedule', employee['jobSchedule']),
            'leaveDays': data.get('leaveDays', employee['leaveDays']),
            'skills': data.get('skills', employee['skills']),
            'username': data.get('username', employee.get('username')),
            'password': data.get('password', employee.get('password'))
        })
        return jsonify({'message': f"Profile for {employee['name']} updated successfully", 'employee': employee}), 200
    else:
        return jsonify({'message': 'Employee not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
