import QRCodeGenerator from './QRCodeGenerator';    

const EmployeePage = () => {
  const employeeId = 1;  // hardcoded

  return (
    <div>
      <h1>Employee Attendance</h1>
      <QRCodeGenerator employeeId={employeeId} />
    </div>
  );
};

export default EmployeePage;
