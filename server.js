const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

// Hardcode API key for development - REMOVE IN PRODUCTION
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZHJpY29tdWxpYTdAZ21haWwuY29tIiwiaWF0IjoxNzM4NTAxMDg1fQ.6AuM_RQwUIC4PZnu3e_8DiIrMAVIxU1bqUkpcZuLBkg';

const app = express();
const port = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(express.static('.'));

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10 // limit each IP to 10 requests per windowMs
});

app.post('/api/generate', limiter, async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log('Received prompt:', prompt);
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log('Making request to Hyperbolic API...');
        const response = await fetch('https://api.hyperbolic.xyz/v1/image/generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model_name: "SDXL1.0-base",
                prompt: prompt,
                steps: 30,
                cfg_scale: 5,
                width: 1024,
                height: 1024,
                enable_refiner: false,
                backend: "auto"
            })
        });

        const data = await response.json();
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            console.error('API Error:', data);
            return res.status(response.status).json({ 
                error: data.message || 'Failed to generate image',
                details: data
            });
        }

        res.json(data);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: error.message || 'Internal server error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
