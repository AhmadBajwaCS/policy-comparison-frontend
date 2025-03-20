'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

export default function Home() {
    const [summary, setSummary] = useState('Use the dropdown buttons above to get started!');
    const [sources, setSources] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const checkSelections = () => {
        const policy = (document.getElementById('policy') as HTMLSelectElement).value;
        const state1 = (document.getElementById('state1') as HTMLSelectElement).value;
        const state2 = (document.getElementById('state2') as HTMLSelectElement).value;

        if (policy && state1 && state2) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    };

    const handleCompare = () => {
        const policy = (document.getElementById('policy') as HTMLSelectElement).value;
        const state1 = (document.getElementById('state1') as HTMLSelectElement).value;
        const state2 = (document.getElementById('state2') as HTMLSelectElement).value;

        const capitalizedPolicy = capitalizeWords(policy);
        const capitalizedState1 = capitalizeWords(state1);
        const capitalizedState2 = capitalizeWords(state2);

        const databaseResponse = `Summary text retrieved from the database for ${capitalizedPolicy} in ${capitalizedState1} and ${capitalizedState2}.`;

        setSummary(databaseResponse);

        const newSources = [
            `Source 1: www.samplesources.org`,
            `Source 2: www.samplesources.org`
        ];
        setSources(newSources);
    };

    useEffect(() => {
        checkSelections();
    }, []);

    return (
        <div>
            <section id="home">
                <h2 className="page-title">Policy Comparison Tool</h2>
                <div className="policy-comparison">
                    <div className="container">
                        <div className="section-header">
                            <h2>Policy & States</h2>
                            <p>Select a policy and two states to compare.</p>
                        </div>
                        <div className="selection">
                            <select id="policy" onChange={checkSelections}>
                                <option value="" disabled selected>Policy</option>
                                <option value="minimum wage">Minimum Wage</option>
                                <option value="medicaid expansion">Medicaid Expansion</option>
                                <option value="right-to-work laws">Right-To-Work Laws</option>
                                <option value="marijuana">Marijuana</option>
                                <option value="state income tax">State Income Tax</option>
                            </select>
                            <select id="state1" onChange={checkSelections}>
                                <option value="" disabled selected>State</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state.toLowerCase()}>{state}</option>
                                ))}
                            </select>
                            <select id="state2" onChange={checkSelections}>
                                <option value="" disabled selected>State</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state.toLowerCase()}>{state}</option>
                                ))}
                            </select>
                            <button id="compare" onClick={handleCompare} disabled={isButtonDisabled}>
                                Compare
                            </button>
                        </div>
                    </div>
                </div>
                <div className="results">
                    <div className="container">
                        <div className="section-header">
                            <h2>Results</h2>
                            <p>View a summary of the comparison and its sources.</p>
                        </div>
                        {/* return comparison summary */}
                        <div id="summary" className="summary-text">{summary}</div>
                        {sources.length > 0 && (
                            <ul id="sources" className="sources-list">
                                {sources.map((source, index) => {
                                    const urlMatch = source.match(/(https?:\/\/[^\s]+)/);
                                    const url = urlMatch ? urlMatch[0] : "#";
                                    return (
                                        <li key={index} className="source-item">
                                            <a href={url} target="_blank" rel="noopener noreferrer">
                                                <Image
                                                    src="/assets/images/link-icon.png"
                                                    alt="Link icon"
                                                    width={16}
                                                    height={16}
                                                />
                                                {source.replace(url, '')}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
                <div className="chatbot">
                    <div className="container">
                        <div className="section-header">
                            <h2>Chatbot</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
