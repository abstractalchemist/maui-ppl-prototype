
import  Form  from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { Auth } from 'aws-amplify'
import { useEffect, useState } from 'react'

function SigninUI({signin, setUserName, setPassword}) {
  return (
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" onChange={evt => setUserName(evt.currentTarget.value)}/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" onChange={evt => setPassword(evt.currentTarget.value)}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={signin}>
              Sign In
            </Button>
          </Form>
  )
}

function ChangePasswordUI({changePasswd}) {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [verify, setVerify] = useState('')

  function signin(evt) {
    evt.preventDefault()
    if(verify !== password) {
      alert('passwords do not match')
      return
    }
    console.log('signin')
    changePasswd(password)
  }
  return (
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" onChange={evt => setUserName(evt.currentTarget.value)}/>
            </Form.Group>
            <Form.Group controlId="formNewPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" onChange={evt => setPassword(evt.currentTarget.value)}/>
            </Form.Group>
            <Form.Group controlId="VerifyNewPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password again to verify" onChange={evt => setVerify(evt.currentTarget.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit" onClick={signin}>
              Sign In
            </Button>
          </Form>
  )

}

function Signin() {

  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [changePasswd, setChangePasswd] = useState(false)
  const [userObject, setUserObject] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    Auth.currentAuthenticatedUser()
    .then(user => {
      console.log(user)
      setAuthenticated(_ => true)
    })
    .catch(err => {
      console.log(err)
      setAuthenticated(_ => false)
    })
  }, [authenticated])

  function signin(evt) {
    evt.preventDefault()
    console.log('signin')
    Auth.signIn(
      
      username,
      password
    )
    .then(user => {
      console.log(user)
      if(user.challengeName) {
        if(user.challengeName === 'NEW_PASSWORD_REQUIRED') {
          setChangePasswd(_ => true)
          setUserObject(_ => user)
        }
      }
      else {
        setAuthenticated(_ => true)
      }
    })
    .catch(err => alert(err))
  }


  return (
    <Container>
      <Row>
        <Col>
          {(_ => {
            if(!authenticated) {
              return <SigninUI signin={signin} setUserName={setUserName} setPassword={setPassword}/>
            }
            else {
              if(changePasswd) {
                return <ChangePasswordUI changePasswd={(password) => {
                  Auth.completeNewPassword(
                    userObject,
                    password
                  )
                  .then(user => {
                    console.log(user)
                    setChangePasswd(_ => false)
                    setUserName(_ => '')
                    setPassword(_ => '')
                  })
                  .catch(err => alert(err))

                }} />
              }
              else {
                return <div>Already Signed In</div>
              }
            }
          })()
          }

        </Col>
      </Row>
    </Container>
  )
}

export default Signin
