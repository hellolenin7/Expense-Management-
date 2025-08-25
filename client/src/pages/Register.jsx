import React ,{useState,useEffect} from 'react';
import {Form, Input, message, Button} from 'antd';
import {Link,useNavigate} from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import "../Styles/RegisterPage.css";


const Register= () => {
    const APIUrl = "https://expense-management-xjkt.onrender.com"
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
  
    //from submit
    const submitHandler = async (values) => {
     try {
    setLoading(true);
    const { data } = await axios.post(`${APIUrl}/api/v1/users/register`, values);
    setLoading(false);

    if (data.success) {
      message.success(data.message); // "Registration successful"
      navigate('/login');
    } else {
      message.error(data.message || 'Registration failed');
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

    return(
        <div className= "register-page">
            {loading && <Spinner />}
           <Form  className="register-form" layout="vertical" onFinish={submitHandler}>
            <h2>Register Form</h2>
            <Form.Item label="Name" name="name">
                <Input type="text" required />
            </Form.Item>
             <Form.Item label="Email" name="email">
                <Input type="email" required/>
            </Form.Item>
             <Form.Item label="Password" name="password">
                <Input type="password" required/>
            </Form.Item>
            <div className='d-flex justify-content-between'>
                <Link to="/login">Already Register ? Click Here to login</Link>
                <Button type="primary" htmlType="submit">Register</Button>
               

            </div>
           </Form>

        </div>
    )
}
export default  Register