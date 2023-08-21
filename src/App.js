import logo from './logo.svg';
import './App.css';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { Row, Container, Button, Nav, Navbar } from 'react-bootstrap';
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
        <Navbar bg='light' expand='lg'>
          <Container>
            <Navbar.Collapse>
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
            </Navbar.Collapse>
            <Navbar.Collapse className='justify-content-end'>
              <Navbar.Text className='justify-content-end'>
                Signed In As: {
                  (_ => {
                    if (myuser?.authenticated) {
                      return myuser.identityId
                    } else {
                      return 'Not Signed In'
                    }
                  }
                  )()
                }
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container>
          <Row>          
            <Outlet />        
          </Row>
          <Row>
            <div>
              <div>{JSON.stringify(userdata?.Arn)}</div>
            </div>
          </Row>
        </Container>
      </Container>

    </div>
  );
}

export default App;
