import { useContext } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  // Debug: Log user data to see what might be causing NaN
  console.log('Profile component - user data:', user);

  // If no user is logged in, show a message
  if (!user) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm text-center">
              <Card.Body>
                <div className="mb-3">
                  <span role="img" aria-label="profile" style={{ fontSize: '4rem' }}>👤</span>
                </div>
                <Card.Title>Not Logged In</Card.Title>
                <Card.Text>
                  Please log in to view your profile.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Ensure all values are strings to prevent NaN
  const userName = user.name || 'User';
  const userRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
  const userEmail = user.email || 'Not provided';
  const userPhone = user.phone || 'Not provided';
  const userAddress = user.address || 'Not provided';

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <div className="mb-3">
                <span role="img" aria-label="profile" style={{ fontSize: '4rem' }}>👤</span>
              </div>
              <Card.Title>{userName}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{userRole}</Card.Subtitle>
              <Card.Text>
                <strong>Email:</strong> {userEmail}<br />
                <strong>Phone:</strong> {userPhone}<br />
                <strong>Address:</strong> {userAddress}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 