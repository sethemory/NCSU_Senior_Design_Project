import React, { useEffect, useState } from "react";
import { NavLink, Link} from "react-router-dom"
import './style/homePage.css';
function Home() {
    const [bucket, setBucket] = useState([]);
    const [rule, setRule] = useState([]);
    var count_active = 0;
    var count_inactive = 0;
    useEffect(() => {
        buckets()
        rules()
    }, [])
    const rules = async () => {
        const res = await fetch('http://localhost:8000/Rules/');
        setRule(await res.json());
    }
    const buckets = async () => {
        const res = await fetch('http://localhost:8000/Buckets/');
        setBucket(await res.json());
        
    }
    
    const count_active_rules = () => {
        for (let i = 0; i < rule.length; i++) {
            if (rule[i].status === 1) {
                count_active += 1;
            }
        }
    }

    const count_inactive_rules = () => {
        for (let i = 0; i < rule.length; i++) {
            if (rule[i].status === 0) {
                count_inactive += 1;
            }
        }
    }
    {/* ideas: create a way to track buckets and rules over time (multi line graph?), 
        make pie graph of active vs inactive rules overall make it an interesting data panel*/}
    return (
        <div className="home">     

            <h2>Data Bucket Configuration Manager</h2>

            <div className="grid">
                <p className="category"><a href='/Buckets'>Buckets:</a></p>
                {bucket.length === 0 ? <p><div className="spinner-border" role="status"><span className="sr-only"></span></div></p> : null}
                {bucket.length !== 0 ? <p>{bucket.length}</p> : null}
                <p className="category"><a href='/Rules'>Active Rules:</a></p>
                {rule.length === 0 ? <p><div className="spinner-border" role="status"><span className="sr-only"></span></div></p> : null}
                {rule.length !== 0 ? count_active_rules() : null}
                {rule.length !== 0 ? <p>{count_active}</p> : null}

                <p className="category"><a href='/Rules'>Inactive Rules:</a></p>
                {rule.length === 0 ? <p><div className="spinner-border" role="status"><span className="sr-only"></span></div></p> : null}
                {rule.length !== 0 ? count_inactive_rules() : null}
                {rule.length !== 0 ? <p>{count_inactive}</p> : null}

            </div>
        </div>
    );
}

export default Home;
