import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [userType, setUserType] = useState('user'); // 'user' or 'admin'
  const [validated, setValidated] = useState(false);
  const { login, adminLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    let success = false;
    if (userType === 'admin') {
      success = await adminLogin(email, password);
      if (success) {
        navigate('/admin');
      }
    } else {
      success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>
              
              <Tabs
                defaultActiveKey="user"
                className="mb-3"
                onSelect={(k) => setUserType(k)}
              >
                <Tab eventKey="user" title="User">
                  <Form noValidate validated={validated} onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3">
                      Login as User
                    </Button>
                  </Form>

                  <div className="text-center mt-3">
                    <p>
                      Don't have an account?{' '}
                      <Link to="/register">Register here</Link>
                    </p>
                  </div>
                </Tab>

                <Tab eventKey="admin" title="Admin">
                  <Form noValidate validated={validated} onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="adminEmail">
                      <Form.Label>Admin Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="aihospital@gmail.com"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="adminPassword">
                      <Form.Label>Admin Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="ai12345@123"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6"
                      />
                      <Form.Control.Feedback type="invalid">
                        Password must be at least 6 characters.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="danger" type="submit" className="w-100 mt-3">
                      Login as Admin
                    </Button>
                  </Form>

                  <div className="text-center mt-3">
                    <small className="text-muted">
                      Admin credentials: aihospital@gmail.com / ai12345@123
                    </small>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
