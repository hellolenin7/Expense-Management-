import React ,{useState,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {message} from 'antd'
import "../../Styles/HeaderStyle.css";
import { UserOutlined } from '@ant-design/icons';


const Header= () => {
    const navigate = useNavigate();
    const [loginUser,setLoginUser] = useState('');
    useEffect(()=>{
      const user = JSON.parse(localStorage.getItem('user'))
      if(user){
        setLoginUser(user)
      }
    },[]);

    const logoutHandler =() =>{
      localStorage.removeItem("user");
      message.success("You are logout succesfully");
      navigate('/login')
    }
    const [menuOpen, setMenuOpen] = useState(false);
    return(
        <>
          <nav className="navbar navbar-expand-lg bg-light">
      <div className="container-fluid">
        {/* Brand - stays on the left always */}
        <Link className="navbar-brand" to="/">
          Income-Expense Management
        </Link>

        {/* Navbar toggler for small screens */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu items - username + logout */}
        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <h6 className="nav-link">
                <UserOutlined /> {loginUser && loginUser.name}
              </h6>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" onClick={logoutHandler}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
        </>
    )
}
export default  Header