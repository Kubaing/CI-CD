import "./WorkingS.css";
import { useState, useEffect } from "react";
import axios from "axios";

function WorkingS() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false); 

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/data/getempinfoForworkDays");
        console.log(" DATA FROM API:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setEmployees(response.data.data);
          setFilteredEmployees(response.data.data);
        } else {
          console.error("Invalid response format");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [refresh]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = employees.filter((employee) =>
      employee.name?.toLowerCase().includes(searchValue)
    );
    setFilteredEmployees(filtered);
  };

  const handleExtendContract = async (id) => {
    try {
      const response = await axios.put(`http://localhost:9000/api/data/extendContract/${id}`);
      if (response.status === 200) {
        alert("ขยายสัญญาเรียบร้อยแล้ว");
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Error extending contract:", error);
      alert("ยังไม่หมดอายุสัญญา");
    }
  };

  const isContractExpiringSoon = (endDate) => {
    if (!endDate) return false;
    const today = new Date();
    const contractEnd = new Date(endDate);
    const diffDays = Math.ceil((contractEnd - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  return (
    <div className="WorkingS-container">
      <div className="daily-contract-container">
        <h1>สถานะการทำงาน</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="ค้นหาชื่อพนักงาน"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <table className="daily-contract-table">
          <thead>
            <tr>
              <th>ชื่อพนักงาน</th>
              <th>แผนก</th>
              <th>วันเริ่มสัญญา</th>
              <th>วันสิ้นสุดสัญญา</th>
              <th>วันทำงาน</th>
              <th>ชั่วโมงทำงาน</th>
              <th>รายได้</th>
              <th>ต่อสัญญา</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredEmployees) && filteredEmployees.length > 0 ? (
              filteredEmployees
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((employee) => {
                  const contractStart = employee.contractStartDate
                    ? new Date(employee.contractStartDate).toLocaleDateString("th-TH")
                    : "-";
                  const contractEnd = employee.contractEndDate
                    ? new Date(employee.contractEndDate).toLocaleDateString("th-TH")
                    : "-";

                  const isExpiring = isContractExpiringSoon(employee.contractEndDate);

                  return (
                    <tr
                      key={employee.username}
                      style={{ backgroundColor: isExpiring ? "#ffe4e1" : "inherit" }}
                    >
                      <td>{employee.name}</td>
                      <td>{employee.department || "-"}</td>
                      <td>{employee.contractStartDate}</td>
                      <td>{employee.contractEndDate}</td>
                      <td>{employee.workday || "-"}</td>
                      <td>{employee.hrs || "-"}</td>
                      <td>{employee.earnings !== "NaN" ? `${employee.earnings} บาท` : "-"}</td>
                      <td>
                          <button
                            className="extend-button"
                            onClick={() => handleExtendContract(employee._id)}
                          >
                            ต่อสัญญา
                          </button>
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="8">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkingS;
