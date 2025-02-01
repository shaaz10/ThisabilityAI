import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaYoutube } from "react-icons/fa";
import { MdBlind } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";
import './Home.css';
import landingvideo from '../assets/landingvideo.mp4';
import { FaFilePdf } from "react-icons/fa";

function Home() {
  let navigate = useNavigate();
  return (
<div className="home-container">
  <video autoPlay loop muted className="background-video w-100">
    <source src={landingvideo} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  <div className="button-container">
    <button className='btn btn-dark mb-5 d-block fs-4 w-100' onClick={() => navigate('/youtubeprocessing')}>
      <FaYoutube className='fs-1 ' /> YouTube Learning
    </button>
    <button className='btn btn-dark mb-5 d-block fs-4 w-100 pe-5' onClick={() => navigate('/pdfupload')}>
      <FaFilePdf className='fs-1 ' /> PDF Learning
    </button>
    <button className='btn btn-dark mb-5   d-block fs-4 w-100 text-center pe-5' onClick={() => navigate('/thisability')}>
      <MdBlind className='fs-1 ' /> Thisability
    </button>
    <button className='btn btn-dark mb-5 d-block fs-4'>
      <GiPathDistance className='fs-1 me-2' /> Learning Roadmap
    </button>
  </div>
</div>

  );
}

export default Home;
