import { useState, useEffect } from "react";
import "./EmpSet.css";

function WorkSchedule() {
  const [workDate, setWorkDate] = useState(new Date().toISOString().split("T")[0]);
  const [department, setDepartment] = useState("");
  const [task, setTask] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [leaveDate, setLeaveDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveType, setLeaveType] = useState("");
  // const [leaveStatus, setLeaveStatus] = useState("Pending");
  const [leaveName, setLeaveName] = useState("");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [hours, setHours] = useState(0);
  
  const calculateHours = (start, end) => {
    if (!start || !end) return 0;
  
    const [startHour, startMin] = start.split(":").map(Number);
    const [endHour, endMin] = end.split(":").map(Number);
  
    const startTotal = startHour + startMin / 60;
    const endTotal = endHour + endMin / 60;
  
    const result = endTotal - startTotal;
    return result > 0 ? result.toFixed(2) : 0;
  };

  useEffect(() => {
    if (startTime && endTime) {
      const calculated = calculateHours(startTime, endTime);
      setHours(calculated);
    }
  }, [startTime, endTime]);
  


  useEffect(() => {
    const storedEmployee = JSON.parse(localStorage.getItem("user"));
    if (storedEmployee) {
      setEmployee(storedEmployee);
    }
  }, []);

  useEffect(() => {
    if (employee) {
      fetch(`http://localhost:9000/api/data/getChooseworkEmployee?username=${employee.username}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((item) => ({
            ...item,
            displayDate: new Date(item.date).toLocaleDateString('th-TH'), // สำหรับโชว์
          }));
          setScheduleList(formattedData);
        })
        .catch((error) => {
          console.error("Error fetching work schedules:", error);
        });
    }
  }, [employee]);
  

  const handleWorkSubmit = (event) => {
    event.preventDefault();
  
    if (!workDate || !department || !task || !startTime || !endTime || !employee) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
  
    const requestData = {
      userId: employee.userId,
      username: employee.username,
      name: employee.name,
      department,
      task,
      date: workDate,
      startTime,
      endTime,
      hours,
      status: "Pending", // หรือสถานะเริ่มต้นที่ต้องการ
    };
  
    fetch("http://localhost:9000/api/data/Choosework", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        setSubmitStatus("ลงงานสำเร็จ");
  
        // เพิ่มรายการใหม่ลงใน scheduleList โดยไม่ต้องรีเฟรชหน้า
        const newItem = {
          ...requestData,
          date: new Date(workDate).toLocaleDateString("th-TH"),  // แปลงวันที่
          displayDate: new Date(workDate).toLocaleDateString("th-TH"),  // สำหรับแสดงผล
        };
  
        setScheduleList((prev) => [...prev, newItem]);
  
        // รีเซ็ตฟอร์ม
        setDepartment("");
        setTask("");
        setStartTime("");
        setEndTime("");
        setHours("");
      })
      .catch((error) => {
        setSubmitStatus("เกิดข้อผิดพลาดในการลงงาน");
        console.error("Error submitting work schedule:", error);
      });
  };
  

  

  const handleLeaveSubmit = (event) => {
    event.preventDefault();

    if (!leaveDate || !leaveReason || !leaveName || !leaveType || !employee) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const leaveRequest = {
      username: leaveName,
      reason: leaveReason,
      date: leaveDate,
      type: leaveType,
      status: "Pending",
    };

    fetch("http://localhost:9000/api/data/createLeaveRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leaveRequest),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("คำขอลาได้รับการส่งแล้ว");
          setShowLeaveModal(false);
        } else {
          alert("เกิดข้อผิดพลาดในการส่งคำขอ");
        }
      })
      .catch((error) => {
        console.error("Error submitting leave request:", error);
      });
  };

const handleDeleteWork = (workItem) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) return;
  
    fetch("http://localhost:9000/api/data/deleteChooseWork", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: workItem.username,
        date: workItem.date, 
        task: workItem.task,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("ลบข้อมูลสำเร็จ");
          setScheduleList((prev) =>
            prev.filter((item) =>
              item.date !== workItem.date || item.task !== workItem.task
            )
          );
        } else {
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
      })
      .catch((err) => {
        console.error("Error deleting work:", err);
      });
  };
  


  return (
    <div className="work-schedule-container">
      <h1>แบบฟอร์มการลงงานและลางาน</h1>
      <div className="form-container">
        <div className="form-section">
          <h2>ฟอร์มลงงาน</h2>
          <form onSubmit={handleWorkSubmit}>
  <label>วันที่:</label>
  <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} required />
  <label>เวลาเริ่มงาน:</label>
  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
  <label>เวลาเลิกงาน:</label>
  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
  <label>ชั่วโมงที่ทำงาน:</label>
  <input type="number" value={hours} readOnly />
  <label>แผนก:</label>
  <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required />
  <label>งานที่ต้องทำ:</label>
  <input type="text" value={task} onChange={(e) => setTask(e.target.value)} required />
  <button type="submit">ลงงาน</button>
  <button onClick={() => setShowLeaveModal(true)} className="leave-request-btn">ลางาน</button>
  </form>
  </div>
  </div>
  {submitStatus && <p className="submit-status">{submitStatus}</p>}
  <h2 className="ngantchoose">ประวัติการลงงาน</h2>
  <table>
  <thead>
  <tr>
    <th>วันที่</th>
    <th>แผนก</th>
    <th>งาน</th>
    <th>สถานะ</th>
    <th>ชั่วโมง</th>
    <th>การดำเนินการ</th>
  </tr>
</thead>
<tbody>
  {scheduleList.length > 0 ? (
    scheduleList.map((item, index) => (
      <tr key={index}>
        <td>{item.displayDate}</td>
        <td>{item.department}</td>
        <td>{item.task}</td>
        <td>{item.status}</td>
        <td>{item.hours || "-"}</td>
        <td>
          <button onClick={() => handleDeleteWork(item)}>ลบ</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7">ยังไม่มีงานลงทะเบียน</td>
    </tr>
  )}

</tbody>
      </table>
      {showLeaveModal && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>ฟอร์มขอลางาน</h2>
            <form onSubmit={handleLeaveSubmit}>
  <label>ชื่อพนักงาน:</label>
  <input
    type="text"
    value={leaveName}
    onChange={(e) => setLeaveName(e.target.value)}
    required
    placeholder="กรุณากรอกชื่อของคุณ"
  />
  <label>วันที่ลา:</label>
  <input type="date" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} required />
  <label>เหตุผลการลา:</label>
  <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required />
  <label>ประเภทการลา:</label>
  <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
    <option value="">เลือกประเภทการลา</option>
    <option value="Sick">ลาป่วย</option>
    <option value="Vacation">ลากิจ</option>
    <option value="Other">อื่นๆ</option>
  </select>
  <div>
    <button className="leave-request-btn" type="submit">ขอลา</button>
    <button type="button" onClick={() => setShowLeaveModal(false)} className="close-modal-btn">ปิด</button>
  </div>
</form>

          </div>
        </div>
      )}
    </div>
  );
}

export default WorkSchedule;
