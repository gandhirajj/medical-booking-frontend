import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, Alert, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPause, FaTrash } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';

const Admin = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  // Voice notification state removed
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDoctorModal, setShowDeleteDoctorModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [deletingDoctor, setDeletingDoctor] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingDoctor, setAddingDoctor] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    experience: '',
    fees: '',
    timings: '',
    isAvailable: true,
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      return;
    }

    fetchData();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (selectedDate) {
      const filtered = appointments.filter(apt => {
        const aptDate = new Date(apt.date).toISOString().split('T')[0];
        return aptDate === selectedDate;
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [selectedDate, appointments]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch doctors
      const doctorsRes = await api.get('/api/doctors');
      setDoctors(doctorsRes.data.data || []);
      
      // Fetch appointments for admin
      const appointmentsRes = await api.get('/api/appointments?isAdmin=true');
      setAppointments(appointmentsRes.data.data || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleNewDoctorChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setAddingDoctor(true);
    try {
      const payload = {
        name: newDoctor.name,
        specialization: newDoctor.specialization,
        experience: Number(newDoctor.experience) || 1,
        fees: Number(newDoctor.fees) || 0,
        timings: newDoctor.timings ? newDoctor.timings.split(',').map(t => t.trim()) : undefined,
        isAvailable: !!newDoctor.isAvailable,
        averageRating: 0,
      };

      const res = await api.post('/api/doctors', payload);
      if (res.data.success) {
        toast.success('Doctor added successfully');
        setShowAddModal(false);
        setNewDoctor({ name: '', specialization: '', experience: '', fees: '', timings: '', isAvailable: true });
        fetchData();
      } else {
        toast.error('Failed to add doctor');
      }
    } catch (error) {
      console.error('Add doctor error:', error.response?.data || error.message);
      const data = error.response?.data;
      if (data && data.details) {
        // show first validation message
        toast.error(`${data.message}: ${data.details.map(d=>d.message).join('; ')}`);
      } else {
        toast.error(data?.message || 'Failed to add doctor');
      }
    } finally {
      setAddingDoctor(false);
    }
  };

  // Voice notification logic removed

  // Play voice notification logic removed

  const handleDeleteAppointment = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleDeleteDoctor = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteDoctorModal(true);
  };

  const confirmDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
      setDeletingDoctor(true);
      const res = await api.delete(`/api/doctors/${doctorToDelete._id}`);
      if (res.data.success) {
        toast.success('Doctor deleted');
        setShowDeleteDoctorModal(false);
        setDoctorToDelete(null);
        fetchData();
      } else {
        toast.error('Failed to delete doctor');
      }
    } catch (error) {
      console.error('Error deleting doctor:', error.response?.data || error.message);
      toast.error('Failed to delete doctor');
    } finally {
      setDeletingDoctor(false);
    }
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;

    try {
      setDeleting(true);
      
      const response = await api.delete(`/api/appointments/${appointmentToDelete._id}?isAdmin=true&userId=${user?._id}`);
      
      if (response.data.success) {
        toast.success('Appointment deleted successfully!');
        // Refresh appointments list
        fetchData();
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
      } else {
        toast.error('Failed to delete appointment');
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    return `${formattedDate} at ${time}`;
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d._id === doctorId);
    return doctor ? doctor.name || 'Unknown Doctor' : 'Unknown Doctor';
  };

  const getPatientName = (patientId) => {
    // Find the appointment to get the populated patient data
    const appointment = appointments.find(apt => apt.patient._id === patientId);
    if (appointment && appointment.patient) {
      return appointment.patient.name || `Patient ${patientId.slice(-6)}`;
    }
    return `Patient ${patientId.slice(-6)}`;
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <Container>
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You need admin privileges to access this page.</p>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">Admin Dashboard</h2>
          <p className="text-muted">Welcome, {user?.name}</p>
          <div className="mt-2">
            <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Doctor</Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Total Doctors</h5>
              <h3 className="text-primary">{doctors.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Total Appointments</h5>
              <h3 className="text-success">{appointments.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Pending Appointments</h5>
              <h3 className="text-warning">
                {appointments.filter(apt => apt.status === 'pending').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h5 className="card-title">Confirmed Appointments</h5>
              <h3 className="text-info">
                {appointments.filter(apt => apt.status === 'confirmed').length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Date Filter */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
          <Button 
            variant="outline-secondary" 
            onClick={() => setSelectedDate('')}
            className="ms-2"
          >
            Clear Filter
          </Button>
        </Col>
      </Row>

      {/* Doctors List */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Doctors</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Fees</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td>{doctor.name || 'N/A'}</td>
                      <td>{doctor.specialization || 'N/A'}</td>
                      <td>{doctor.experience || 0} years</td>
                      <td>₹{doctor.fees || 0}</td>
                      <td>
                        <Badge bg={doctor.isAvailable ? 'success' : 'danger'}>
                          {doctor.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                      </td>
                      <td>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteDoctor(doctor)} title="Delete Doctor">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Appointments List */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                Appointments {selectedDate && `for ${selectedDate}`}
              </h5>
            </Card.Header>
            <Card.Body>
              {filteredAppointments.length === 0 ? (
                <Alert variant="info">
                  No appointments found {selectedDate && `for ${selectedDate}`}.
                </Alert>
              ) : (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Notes</th>
                      {/* Voice Actions column removed */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{appointment.patient?.name || `Patient ${appointment.patient?._id?.slice(-6) || 'Unknown'}`}</td>
                        <td>{appointment.doctor?.name || 'Unknown Doctor'}</td>
                        <td>{formatDateTime(appointment.date, appointment.time)}</td>
                        <td>{appointment.reason}</td>
                        <td>{getStatusBadge(appointment.status)}</td>
                        <td>{appointment.notes || 'N/A'}</td>
                        {/* Voice Actions cell removed */}
                        <td>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteAppointment(appointment)}
                            title="Delete Appointment"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Voice Modal removed */}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => !deleting && setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {appointmentToDelete && (
            <div>
              <p>Are you sure you want to delete this appointment?</p>
              <div className="bg-light p-3 rounded">
                <p><strong>Patient:</strong> {appointmentToDelete.patient?.name || 'Unknown'}</p>
                <p><strong>Doctor:</strong> {appointmentToDelete.doctor?.name || 'Unknown'}</p>
                <p><strong>Date:</strong> {formatDateTime(appointmentToDelete.date, appointmentToDelete.time)}</p>
                <p><strong>Reason:</strong> {appointmentToDelete.reason}</p>
              </div>
              <p className="text-danger mt-3">
                <strong>This action cannot be undone.</strong>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDeleteAppointment}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              'Delete Appointment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Doctor Modal */}
      <Modal show={showDeleteDoctorModal} onHide={() => !deletingDoctor && setShowDeleteDoctorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {doctorToDelete && (
            <div>
              <p>Are you sure you want to delete this doctor?</p>
              <div className="bg-light p-3 rounded">
                <p><strong>Name:</strong> {doctorToDelete.name || 'Unknown'}</p>
                <p><strong>Specialization:</strong> {doctorToDelete.specialization || 'N/A'}</p>
                <p><strong>Experience:</strong> {doctorToDelete.experience || 0} years</p>
              </div>
              <p className="text-danger mt-3"><strong>This action cannot be undone.</strong></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteDoctorModal(false)} disabled={deletingDoctor}>Cancel</Button>
          <Button variant="danger" onClick={confirmDeleteDoctor} disabled={deletingDoctor}>
            {deletingDoctor ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" />
                Deleting...
              </>
            ) : (
              'Delete Doctor'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Doctor Modal */}
      <Modal show={showAddModal} onHide={() => !addingDoctor && setShowAddModal(false)}>
        <Form onSubmit={handleAddDoctor}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Doctor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={newDoctor.name} onChange={handleNewDoctorChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Specialization</Form.Label>
              <Form.Control name="specialization" value={newDoctor.specialization} onChange={handleNewDoctorChange} placeholder="e.g., Cardiology" required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Experience (years)</Form.Label>
              <Form.Control type="number" min={0} name="experience" value={newDoctor.experience} onChange={handleNewDoctorChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Fees (₹)</Form.Label>
              <Form.Control type="number" min={0} name="fees" value={newDoctor.fees} onChange={handleNewDoctorChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Timings (comma separated)</Form.Label>
              <Form.Control name="timings" value={newDoctor.timings} onChange={handleNewDoctorChange} placeholder="09:00 AM - 12:00 PM, 02:00 PM - 05:00 PM" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Check type="checkbox" label="Available" name="isAvailable" checked={newDoctor.isAvailable} onChange={handleNewDoctorChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)} disabled={addingDoctor}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={addingDoctor}>
              {addingDoctor ? 'Adding...' : 'Add Doctor'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Admin; 