'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from "./context/ThemeContext";
import USMap from "../app/components/USMap";

const capitalizeWords = (str: string) => {
    return str
      .split(' ')
      .map(word => 
        word
          .split('-')
          .map(subword => subword.charAt(0).toUpperCase() + subword.slice(1))
          .join('-')
      )
      .join(' ');
};

const statesData = '/data/us-states.json/'; // Replace with the actual GeoJSON file path

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
    const [errorMessage, setErrorMessage] = useState('');
    const [hasInteracted, setHasInteracted] = useState(false);
    const [policy, setPolicy] = useState('');
    const [state1, setState1] = useState('');
    const [state2, setState2] = useState('');
    const [interactiveMode, setInteractiveMode] = useState(false);
    const [mapState1, setMapState1] = useState(null);
    const [mapState2, setMapState2] = useState(null);
    const { theme } = useTheme();

    const checkSelections = () => {
        const selectedPolicy = (document.getElementById('policy') as HTMLSelectElement).value;
        const selectedState1 = (document.getElementById('state1') as HTMLSelectElement).value;
        const selectedState2 = (document.getElementById('state2') as HTMLSelectElement).value;

        let error = '';
        if (!selectedPolicy) {
            error = 'Please select a policy.';
        } else if (!selectedState1 || !selectedState2) {
            error = 'Please select two states.';
        } else if (selectedState1 === selectedState2) {
            error = 'States must be different.';
        }

        setErrorMessage(error);
        setIsButtonDisabled(!!error);
    };

    const handleBlur = () => {
        setHasInteracted(true);
        checkSelections();
    };

    const handleCompare = () => {
        setHasInteracted(true); // Set interaction flag on button click
    
        const selectedPolicy = policy;
        const selectedState1 = interactiveMode ? mapState1 : state1;
        const selectedState2 = interactiveMode ? mapState2 : state2;
    
        let error = '';
        if (!selectedPolicy) {
            error = 'Please select a policy.';
        } else if (!selectedState1 || !selectedState2) {
            error = 'Please select two states.';
        } else if (selectedState1 === selectedState2) {
            error = 'States must be different.';
        }
    
        setErrorMessage(error);
    
        if (error) {
            return; // Stop execution if there is an error
        }
    
        setSummary(`Comparing ${capitalizeWords(selectedPolicy)} in ${capitalizeWords(selectedState1)} and ${capitalizeWords(selectedState2)}.`);
        setSources([`Source 1: www.samplesources.org`, `Source 2: www.samplesources.org`]);
    };
    

    const handleStateClick = (stateName: string) => {
        if (mapState1 === stateName) {
            setMapState1(null);
            setState1('');
        } else if (mapState2 === stateName) {
            setMapState2(null);
            setState2('');
        } else if (!mapState1) {
            setMapState1(stateName);
            setState1(stateName.toLowerCase());
        } else if (!mapState2 && stateName !== mapState1) {
            setMapState2(stateName);
            setState2(stateName.toLowerCase());
        }
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
                            <select id="policy" value={policy} onChange={(e) => setPolicy(e.target.value)} onBlur={handleBlur}>
                                <option value="" disabled>Policy</option>
                                <option value="minimum wage">Minimum Wage</option>
                                <option value="medicaid expansion">Medicaid Expansion</option>
                                <option value="right-to-work laws">Right-To-Work Laws</option>
                                <option value="marijuana">Marijuana</option>
                                <option value="state income tax">State Income Tax</option>
                            </select>
                            <select
                                id="state1"
                                value={state1}
                                onChange={(e) => setState1(e.target.value)}
                                disabled={interactiveMode}
                            >
                                <option value="" disabled>State</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state.toLowerCase()}>{state}</option>
                                ))}
                            </select>
                            <select
                                id="state2"
                                value={state2}
                                onChange={(e) => setState2(e.target.value)}
                                disabled={interactiveMode}
                            >
                                <option value="" disabled>State</option>
                                {states.map((state, index) => (
                                    <option key={index} value={state.toLowerCase()}>{state}</option>
                                ))}
                            </select>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button id="compare" onClick={handleCompare}>
                                        Compare
                                    </button>
                                    {hasInteracted && errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
                                </div>

                                <label className="interact">
                                    Interactive Mode
                                    <input 
                                        className="checkbox"
                                        type="checkbox" 
                                        checked={interactiveMode} 
                                        onChange={() => setInteractiveMode(prev => !prev)} 
                                    />
                                </label>
                            </div>
                        </div>

                        {interactiveMode && (
                            <USMap selectedStates={[mapState1, mapState2]} onStateClick={handleStateClick} />
                        )}


                    </div>
                </div>

                <div className="results">
                    <div className="container">
                        <div className="section-header">
                            <h2>Results</h2>
                            <p>View a summary of the comparison and its sources.</p>
                        </div>
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
                                                    src={`/assets/images/${theme === "light" ? "link-icon" : "link-icon-white"}.png`}
                                                    alt="Link icon"
                                                    width={16}
                                                    height={16}
                                                />
                                                {source.replace(url, '').trim()}
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
