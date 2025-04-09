"use client"; // 👈 MUST be at the very top of the file

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function About() {
    const { theme } = useTheme();

    return (
        <div>
            <section>
                <h1>About this Project</h1>
                <p>PolicyCompare is a user-friendly tool designed to help individuals, researchers, and policymakers compare public policies across different states.</p>
                <p>By providing <b>clear, side-by-side comparisons</b> of key issues—such as healthcare, gun laws, 
                    and minimum wage—our platform makes it easier to understand how policies vary nationwide. 
                    We source our data from official government records and reputable research institutions 
                    to ensure accuracy and reliability. Whether you're a student, journalist, or concerned 
                    citizen, PolicyCompare empowers you with the knowledge needed to make informed decisions.</p>                
                <p>Our goal is to promote transparency and accessibility in public policy discussions.</p>
            </section>

            <section style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div>
                    <div>
                        <h2>Why It Matters</h2>
                        <p>State policies directly impact people’s lives, yet finding clear comparisons can be difficult. 
                            PolicyCompare bridges this gap by making policy data accessible, helping users make informed 
                            decisions.</p>
                    </div>
                    <div>

                    </div>
                        <h2>Our Team</h2>
                        <p>Our team consists of developers at The University of Texas at Dallas whose goal is to increase
                            transparency in public policy. Read more about our project <a href="/About">here</a>.
                            </p>
                </div>
                <img 
                    src={`assets/images/robots-${theme === 'light' ? 'light' : 'dark'}.png`} 
                    alt="Robots conversing" 
                    style={{ width: '300px', height: 'auto', marginRight: '75px' }} 
                />
            </section>

        </div>
    );
}
