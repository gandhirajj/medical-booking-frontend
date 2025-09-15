import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
// import { FaVolumeUp, FaPlay, FaBell } from 'react-icons/fa';
import axios from 'axios';
import AuthContext from '../context/AuthContext';


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Voice notification state removed

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Only fetch appointments if user is logged in
        if (!user || !user._id) {
          setLoading(false);
          return;
        }

        const isAdmin = user?.role === 'admin';
        const query = isAdmin
          ? `/api/appointments?isAdmin=true`
          : `/api/appointments?userId=${user._id}`;
        const res = await axios.get(query);
        setAppointments(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching appointments');
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleCancelAppointment = async (id) => {
    try {
      await axios.put(`/api/appointments/${id}?userId=${user._id}`, { status: 'cancelled' });

      // Update appointments list
      setAppointments(
        appointments.map((app) =>
          app._id === id ? { ...app, status: 'cancelled' } : app
        )
      );

      toast.success('Appointment cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  // Voice notification logic removed

  // Only patient functionality is needed

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      case 'completed':
        return <Badge bg="info">Completed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Dashboard</h2>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Welcome, {user?.name}!</Card.Title>
              <Card.Text>
                Role: {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Patient'}
                <br />
                Email: {user?.email}
                <br />
                {user?.phone && `Phone: ${user.phone}`}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>My Appointments</Card.Title>
          {appointments.length === 0 ? (
            <Alert variant="info">
              You don't have any appointments yet.
              <div className="mt-3">
                <Button as={Link} to="/doctors" variant="primary">
                  Find Doctors
                </Button>
              </div>
            </Alert>
          ) : (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                  {/* Voice Notification column removed */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{format(new Date(appointment.date), 'MMM dd, yyyy')}</td>
                    <td>{
                      appointment.doctor?.user?.name
                        ? `${appointment.doctor.user.name} (${appointment.doctor.specialization || ''})`
                        : appointment.doctor?.name
                          ? `${appointment.doctor.name}${appointment.doctor.specialization ? ' (' + appointment.doctor.specialization + ')' : ''}`
                          : appointment.doctor?.specialization
                            ? appointment.doctor.specialization
                            : 'Unknown Doctor'
                    }</td>
                    <td>{appointment.time}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    {/* Voice Notification cell removed */}
                    <td>
                      {appointment.status === 'pending' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment._id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Voice Notification modal removed */}
    </Container>
  );
};

export default Dashboard;
