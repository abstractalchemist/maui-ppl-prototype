import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';


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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>{JSON.stringify(myuser)}</div>
      <div>{JSON.stringify(userdata)}</div>

    </div>
  );
}

export default App;
//export default withAuthenticator(App)
