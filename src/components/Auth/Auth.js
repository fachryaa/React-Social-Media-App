import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import { signin, signup } from '../../actions/auth';

import useStyles from './styles';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
  const handleShowConfirmPassword = () => setShowConfirmPassword((prevShowPassword) => !prevShowPassword);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup)
    handleShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const token = res.credential;
    const { name, picture: imageUrl, sub: googleId } = jwt_decode(token);
    console.log(jwt_decode(token));

    const data = {
      result: {
        name, imageUrl, googleId
      },
      token: token
    }
    try {
      dispatch({ type: 'AUTH', data: data });

      history.push('/');
    } catch (error) {
      console.log(error)
    }
  };

  const googleFailure = (error) => {
    console.log(error)
    console.log('Google Sign In was unsuccessful. Try again later');
  }


  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />

            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type={showConfirmPassword ? "text" : "password"}
                handleShowPassword={handleShowConfirmPassword}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </Button>

            <Grid className={classes.googleButton}>
              <GoogleOAuthProvider clientId="1014706766436-mbismn0ot6j1rhv7c9ifhontbpa4dp3j.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={googleSuccess}
                  onFailure={googleFailure}
                  ux_mode="popup"
                  theme="outline"
                  width="378"
                  useOneTap={true}
                />
              </GoogleOAuthProvider>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account ? Sign In"
                  : "Don't have an account ? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default Auth