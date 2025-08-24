import React,{useState,useEffect} from 'react'
import {Form,Input,message,Button} from 'antd';
import {Link,useNavigate} from 'react-router-dom'
import axios from 'axios'
import Spinner from '../components/Spinner';
import "../styles/Loginpage.css";


const Login= () => {
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
     //from submit
    const submitHandler = async (values) => {
  try {
    setLoading(true);
    const { data } = await axios.post('/api/v1/users/login', values);
    setLoading(false);

    if (data.success) {
      message.success(data.message); 
      localStorage.setItem('user', JSON.stringify({...data.user,password:""}));
      navigate('/');
    } else {
      message.error(data.message || 'Invalid credentials');
    }
  } catch (error) {
    setLoading(false);
    message.error(error.response?.data?.message || 'Something went wrong');
  }
};

//prevent for login user
useEffect(()=>{
  if(localStorage.getItem("user")){
    navigate("/");
  }
},[navigate]);

   return (
  <>
    <div className="login-page">
      {loading && <Spinner />}

      {/* Page Heading */}
      <h1 className="app-title">Expense Management</h1>

      {/* Login Card */}
      <div className="login-form">
        <Form layout="vertical" onFinish={submitHandler}>
          <h2>Login Form</h2>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <div className="d-flex justify-content-between">
            <Link to="/register">Not a User ? Click Here to Register</Link>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </div>
        </Form>
      </div>
    </div>
  </>
);

}
export default  Login;