import logo from './logo.svg';
import './App.css';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { Row, Container, Button, Nav } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';

function App({ user }) {

  const [myuser, setUser] = useState(null);
  const [userdata, setUserData] = useState(null);


  useEffect(() => {
    Auth.currentCredentials()
      .then(user => {
        setUser(user)
        console.log('user: ', user)
        const client = new STSClient({ region: 'us-east-1',  credentials: user })
        return client.send(new GetCallerIdentityCommand({ }))
      })
      .then(data => {
        setUserData(data)
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="App">
      <Container fluid>
        <Nav variant='tab'>
          <Nav.Item>
            <Nav.Link href='/'>Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href='/listings'>Listings</Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link href='/signin'>Sign In</Nav.Link>
          </Nav.Item>
        </Nav>
        <Container>
          <Row>          
            <Outlet />        
          </Row>
          <Row>
            <div>
              <div>{JSON.stringify(myuser)}</div>
              <div>{JSON.stringify(userdata)}</div>
            </div>
          </Row>
        </Container>
      </Container>

    </div>
  );
}

export default App;
