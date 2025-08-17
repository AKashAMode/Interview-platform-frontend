import "./MainHomePage.css"
import Card from "../../Components/Card/Card";
import {BrainCircuit, FileText, BarChart3, Calendar, Trophy, Video} from 'lucide-react';
import Header from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer"

function MainHomePage(){
    return(
        <>
        <div className="main-container">
           <Header/>
            <div className="hero-container">
              <div className="hero-content">
                <h2 className="hero-heading">Master Your Interview Skills</h2>   
                <p className="hero-description">AI-powered interview preparation platform that helps you practice, analyze, and improve your performance for your dream job.</p>
                <div className="hero-btn-container">
                  <button className="hero-btn-style start-free-btn">Start Free Trial</button>
                  <button className="hero-btn-style try-ai-btn">Try AI Interview</button>
                </div>
              </div>
            </div>

            <div className="features-section">
              <div className="feature-contain">
               <h3>Everything You Need to Succeed</h3> 
               <p>Comprehensive tools and analytics to prepare you for any interview scenario</p>
              </div>  
            
            <div className="card-container">
              <Card Icon={BrainCircuit}
                title="AI Mock Interviews"
                description="Practice with AI-generated questions tailored to your role and experience level."
                linkText="Get Started →"
                bgClass="bg-gradient-blue"
                />

                <Card Icon={FileText}
                title="Resume Analyzer"
                description="Get detailed feedback and optimization suggestions for your resume."
                linkText="Analyze Now →"
                bgClass="bg-gradient-green"
                />

                  <Card Icon={BarChart3}
                title="Performance Analytics"
                description="Track your progress with detailed charts and performance metrics."
                linkText="View Dashboard →"
                bgClass="bg-gradient-violet"
                />

                  <Card Icon={Calendar}
                title="Smart Scheduling"
                description="Schedule practice sessions and integrate with your calendar."
                linkText="Schedule Now →"
                bgClass="bg-gradient-orange"
                />

                  <Card Icon={Trophy}
                title="Report Cards"
                description="Share your achievements and progress on social media."
                linkText="View Profile →"
                bgClass="bg-gradient-red"
                />

               <Card Icon={Video}
                title="Video Recording"
                description="Record yourself during practice sessions and review your performance."
                linkText="Coming Soon →"
                bgClass="bg-gradient-darkgreen"
                />
            </div>
            </div>

            <div className="stats-container">
                <div className="stat-item">
                    <h4 className="text-gradient-blue">10K+</h4>
                    <p>Practice Sessions</p>
                </div>
                <div className="stat-item">
                    <h4 className="text-gradient-green">89%</h4>
                    <p>Success Rate</p>
                </div>
                <div className="stat-item">
                    <h4 className="text-gradient-violet">500+</h4>
                    <p>Companies Covered</p>
                </div>
                 <div className="stat-item">
                    <h4 className="text-gradient-orange">24/7</h4>
                    <p>AI Availability</p>
                </div>
            </div>

             <div className="join-footer-container">
              <div className="join-content">
                <h5>Ready to Ace Your Next Interview?</h5>
                <p>Join thousands of professionals who have improved their interview skills with PrepPath Pro.</p>
                <button className="join-btn">Start Your Journey Today</button>    
              </div>
             </div>
            <Footer/>
        </div>
        </>
    )
}

export default MainHomePage;