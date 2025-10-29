import React, { useEffect, useState } from "react";
import { getPortfolio } from "./api";
import Profile from "./components/Profile";
import Certificates from "./components/Certificates/Certificates";
import Resume from "./components/Resume";
// import Navbar from "./components/Navbar/Navbar";
import Container from '@mui/material/Container';
import About from "./components/About/About"
import Projects from "./components/Projects/Projects";
import { motion as Motion } from 'framer-motion'

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getPortfolio().then((res) => setData(res.data));
  }, []);

  if (!data) return <h2 className="text-center mt-10">Loading Portfolio...</h2>;

  return (
    <div>
      


   <Motion.div 
   initial = {{opacity:0,translateX:"1%"}}
   whileInView={{opacity:2,translateX:"100"}}
   transition={{duration:2,}}
   > 
    < Profile  />
    </Motion.div>
   
       {/* <Navbar/> */}
      <Motion.div
       
    initial={{opacity:0,translateX:"100%"}}
    whileInView={{opacity:2,translateX:"0"}}
    transition={{duration:1.5 , }}
      ><Projects/></Motion.div>
      
      <Certificates/>
  
    </div>
  );
}

export default App;
