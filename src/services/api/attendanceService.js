import mockAttendance from '@/services/mockData/attendance.json'

class AttendanceService {
  constructor() {
    this.attendance = [...mockAttendance]
  }

  async getAll() {
    await this.delay(300)
    return [...this.attendance]
  }

  async getById(id) {
    await this.delay(200)
    const record = this.attendance.find(att => att.Id === parseInt(id))
    if (!record) {
      throw new Error('Attendance record not found')
    }
    return { ...record }
  }

  async create(attendanceData) {
    await this.delay(400)
    const newId = Math.max(...this.attendance.map(att => att.Id), 0) + 1
    const newRecord = {
      ...attendanceData,
      Id: newId
    }
    this.attendance.push(newRecord)
    return { ...newRecord }
  }

  async update(id, attendanceData) {
    await this.delay(400)
    const index = this.attendance.findIndex(att => att.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    this.attendance[index] = { ...attendanceData, Id: parseInt(id) }
    return { ...this.attendance[index] }
  }

  async delete(id) {
    await this.delay(300)
    const index = this.attendance.findIndex(att => att.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Attendance record not found')
    }
    this.attendance.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const attendanceService = new AttendanceService()