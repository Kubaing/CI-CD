import { useState, useEffect } from "react";
import axios from "axios";
import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    department: "",
    phone: "",
    email: "",
    userId: "",
    contractStartDate: "",
    contractEndDate: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initData(); // ดึงข้อมูลพนักงาน
  }, []);

  // ดึงข้อมูลพนักงานโชว์
  const initData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/data/getEmployee"
      );

      // อัปเดต state ด้วยข้อมูลพนักงานทั้งหมด (ไม่กรองแล้ว)
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleShow = () => setShowAddEmployee(true);
  const handleClose = () => {
    setShowAddEmployee(false);
    setNewEmployee({
      name: "",
      username: "",
      password: "",
      role: "",
      department: "",
      phone: "",
      email: "",
      userId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // ตรวจสอบให้เป็นตัวเลขและยาวไม่เกิน 10 ตัว
      if (/^\d*$/.test(value) && value.length <= 10) {
        setNewEmployee((prevState) => ({ ...prevState, [name]: value })); // เก็บค่า phone เป็น string
      }
      return; // ออกจากฟังก์ชันหาก field คือ phone
    }

    if (name === "userId") {
      // ตรวจสอบให้เป็นตัวเลขและยาวไม่เกิน 13 ตัว
      if (/^\d*$/.test(value) && value.length <= 13) {
        setNewEmployee((prevState) => ({ ...prevState, [name]: value }));
      }
      return;
    }

    // กรณีอื่นๆ
    setNewEmployee((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (
      !newEmployee.name ||
      !newEmployee.username ||
      !newEmployee.password ||
      !newEmployee.department ||
      !newEmployee.phone ||
      !newEmployee.email ||
      !newEmployee.userId
    ) {
      alert("กรอกข้อมูลพนักงานให้ครบถ้วน");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/api/data/addEmployee",
        {
          ...newEmployee,
          role: "Employee", // ใส่ role ถ้าไม่ได้ส่งจาก form
        }
      );

      if (response.status === 200) {
        alert("เพิ่มพนักงานสำเร็จ!");
        await initData(); // โหลดข้อมูลใหม่
        handleClose(); // ปิด popup และล้างฟอร์ม
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มพนักงาน");
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:9000/api/data/updateEmployee/${selectedEmployee._id}`,
        selectedEmployee
      );
      if (response.status === 200) {
        alert("อัพเดทข้อมูลสำเร็จ!");
      }
      setIsModalOpen(false); // ปิด modal
      await initData(); // โหลดข้อมูลใหม่จาก backend
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      console.error("Update Error:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const confirm = window.confirm("คุณต้องการเพิ่มพนักงานคนนี้หรือไม่?");
      if (!confirm) return;

      const response = await axios.post(
        "http://localhost:9000/api/data/addEmployee",
        {
          ...newEmployee,
          role: "Employee",
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("เพิ่มพนักงานเรียบร้อยแล้ว!");
        await initData();
        handleClose();
      }      
    } catch (error) {
      alert("กรอกข้อมูลพนักงานให้ครบถ้วน");
      console.error("Error adding employee:", error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("คุณต้องการลบพนักงานคนนี้หรือไม่?")) {
      try {
        await axios.delete(
          `http://localhost:9000/api/data/deleteEmployee/${employeeId}`
        );

        // เรียกฟังก์ชันเพื่อดึงข้อมูลใหม่จากฐานข้อมูล
        initData();
      } catch (error) {
        console.error("Error deleting employee:", error.message);
      }
    }
  };

  return (
    <div className="Employees">
      <h1 className="title">ข้อมูลพนักงาน</h1>
      <div className="menu">
        <button className="button-add" onClick={handleShow}>
          เพิ่มพนักงาน
        </button>
      </div>

      {showAddEmployee && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>เพิ่มพนักงานใหม่</h2>
            <form className="form" onSubmit={handleAddEmployee}>
              <div className="form-group">
                <label>ชื่อ</label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>ผู้ใช้</label>
                <input
                  type="text"
                  name="username"
                  value={newEmployee.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>รหัสผ่าน</label>
                <input
                  type="password"
                  name="password"
                  value={newEmployee.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>แผนก</label>
                <input
                  type="text"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  name="phone"
                  value={newEmployee.phone} // ใช้ค่า string ที่มาจาก state
                  onChange={handleInputChange}
                  maxLength="10" // จำกัดจำนวนตัวเลขสูงสุดเป็น 10
                  required
                />
              </div>

              <div className="form-group">
                <label>อีเมล์</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>เลขบัตรประจำตัว</label>
                <input
                  type="text"
                  name="userId"
                  value={newEmployee.userId}
                  onChange={handleInputChange}
                  maxLength="13"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleSubmit}>ยืนยัน</button>
                <button type="button" onClick={handleClose}>
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isModalOpen && selectedEmployee && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>แก้ไขข้อมูลพนักงาน</h2>
            <form className="form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label>ชื่อ</label>
                <input
                  type="text"
                  name="name"
                  value={selectedEmployee.name}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>ผู้ใช้</label>
                <input
                  type="text"
                  name="username"
                  value={selectedEmployee.username}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      username: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>รหัสผ่าน</label>
                <input
                  type="text"
                  name="Password"
                  value={selectedEmployee.password}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>แผนก</label>
                <input
                  type="text"
                  name="department"
                  value={selectedEmployee.department}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      department: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  name="phone"
                  value={selectedEmployee.phone}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      phone: e.target.value,
                    })
                  }
                  maxLength="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>อีเมล์</label>
                <input
                  type="email"
                  name="email"
                  value={selectedEmployee.email}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>เลขบัตรประจำตัว</label>
                <input
                  type="text"
                  name="userId"
                  value={selectedEmployee.userId}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      userId: e.target.value,
                    })
                  }
                  maxLength="13"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit">อัพเดทสมาชิก</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  ปิด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>ชื่อ</th>
            <th>ผู้ใช้</th>
            <th>รหัสผ่าน</th>
            <th>แผนก</th>
            <th>เบอร์โทรศัพท์</th>
            <th>อีเมล์</th>
            <th>ดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .sort((a, b) => a.name.localeCompare(b.name)) //เรียงชื่อ A-Z
            .map((employee) => (
              <tr key={employee._id} className="employee-row">
                <td className="employee-cell">{employee.name}</td>
                <td className="employee-cell">{employee.username}</td>
                <td className="employee-cell">{employee.password}</td>
                <td className="employee-cell">{employee.department}</td>
                <td className="employee-cell">{employee.phone}</td>
                <td className="employee-cell">{employee.email}</td>
                <td className="employee-cell">
                  <div className="action-buttons">
                    <button
                      className="action-button"
                      onClick={() => handleEditClick(employee)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleDeleteEmployee(employee._id)}
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Employees;
