// // import React, { useState } from 'react'
// // import Signup from '../components/Signup';
// // import Login from '../components/Login';
// // import '../styles/LandingPage.css';

// // function LandingPage() {

// //   const [isSignupActive ,setIsSignupActive] = useState(true);
// //   // const [currentForm,setCurrentForm] = useState('signup')

// //   return (
// //     <div>
// //       <div className='container'>
      
// //       <div className='pageImage'>
// //         {/* <img src='/images/Landingimage.png'></img> */}
// //         {/* <img src="/images/logo.png" alt="Logo" class="logo"></img> */}
// //         <div className='logo'>
// //         <img src="src/images/cuvette.png" alt="Logo"></img>
// //         </div>
// //       </div>
     
// //       <div className='form-section'>
// //       <header className='header'>
// //       <div className='selectButton'>
// //         <button onClick={() => setIsSignupActive(true)}>
// //           Sign Up
// //         </button>
// //         <button onClick={() => setIsSignupActive(false)}>
// //           Login
// //         </button>
// //         {isSignupActive?<Signup/>:<Login/>}
// //       </div>
// //       </header>
// //       </div>
     
// //       {/* {currentForm === 'signup' ? <Signup switchForm={() => setCurrentForm('login')} /> : <Login switchForm={() => setCurrentForm('signup')} />} */}

// //       </div>
// //     </div>
// //   )
// // }

// // export default LandingPage
// import React, { useState } from "react";
// import Signup from "../components/Signup";
// import Login from "../components/Login";
// import "../styles/LandingPage.css";


// function LandingPage() {
//   const [isSignupActive, setIsSignupActive] = useState(true);
//   const [currentForm, setCurrentForm] = useState('login');

//   return (
//     <div>
//       <div className="container">
//         <div className="pageImage">
//           <div className="logo">
//             <img src="/assets/logo.png" alt="Logo" />
//           </div>
//         </div>

//         <div className="form-section">
//           <header className="header">
//             <div className="selectButton">
//               <button onClick={() => setIsSignupActive(true)}>Sign Up</button>
//               <button onClick={() => setIsSignupActive(false)}>Login</button>
//             </div>
//             <div className="components">
//             {isSignupActive ? <Signup /> : <Login />}
//             </div>
//           </header>
//           {currentForm === 'login' ? <Login switchForm={() => setCurrentForm('signup')} /> : <Signup switchForm={() => setCurrentForm('login')} />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LandingPage;
