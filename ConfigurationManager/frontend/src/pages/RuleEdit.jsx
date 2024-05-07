import React, { useEffect, useState } from "react";
import './style/rule.css';
import { useParams } from 'react-router-dom';

function Rule() {

    const [rule, setRule] = useState(0);

    const { id } = useParams();

    useEffect(() => {
        r()
    }, [])

    const r = async () => {
        const res = await fetch(`http://localhost:8000/Rules/${id}/`);
        setRule(await res.json());
    }

    var loaded = false;
    if (rule.buckets === undefined || rule.buckets === null){
        loaded = false;
    }  else {
        loaded = true;
    }

    return (
        
        <div className="home">
                <div className="title">
                    <h1>Rule {rule.id}</h1>
                </div>
                <div className="t1">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Type</th>
                                <th scope="col">Rule</th>
                                <th scope="col">Priority</th>
                                <th scope="col">Source</th>
                                <th scope="col">Status</th>
                                <th scope="col">Time since last updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">{rule.id}</th>
                                <th>{rule.type}</th>
                                <th>{rule.rule}</th>
                                <th>{rule.priority}</th>
                                <th>{rule.source}</th>
                                <th>{rule.status}</th>
                                <th>{rule.active_time}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h4>Change IP or Port:</h4>
                <i>submit empty port for IP-only</i>
                <div className="editrule">
                    <table>
                        <tr>
                            <td><b>New IP:</b></td>
                            <td>
                                <form onsubmit="return validate()">
                                    <input type="text"></input>
                                    <input type="submit" value="Submit"></input>
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td><b>New Port:</b></td>
                            <td><input type="text"></input> <input type="submit" value="Submit"></input></td>
                        </tr>
                    </table>
                </div>
                <div className="t2">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="row">Bucket IDs</th>
                                <th>Bucket Names</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loaded ? (
                                rule.buckets.map((buc) => {
                                    return (
                                        <tr>
                                            <th><a className="nav-link" href={'/rule/' + buc.id}>{buc.id}</a></th>
                                            <th>{buc.name}</th>
                                        </tr>
                                    )
                                })
                            ) : (
                                console.log("")
                            )}
                        </tbody>
                    </table>
                </div>
        </div>
    );
}

export default Rule;