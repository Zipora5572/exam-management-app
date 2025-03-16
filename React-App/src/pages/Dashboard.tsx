import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
import { StoreType } from '../store/store';
import { Container, Typography, Grid, Paper } from '@mui/material';

Chart.register(...registerables);

const Dashboard = () => {
    const user = useSelector((state: StoreType) => state.auth.user);
    
    const scores = [
        { examName: 'Math', value: 90 },
        { examName: 'Physics', value: 80 },
        { examName: 'Chemistry', value: 70 },
        { examName: 'Biology', value: 60 },
        { examName: 'History', value: 50 },
    ];

    const dataBar = {
        labels: scores.map(score => score.examName),
        datasets: [
            {
                label: 'Distribution of Scores',
                data: scores.map(score => score.value),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const dataPie = {
        labels: ['Pass', 'Fail'],
        datasets: [
            {
                label: 'Pass/Fail Distribution',
                data: [3, 2],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const dataLine = {
        labels: ['Semester 1', 'Semester 2', 'Semester 3'],
        datasets: [
            {
                label: 'Scores Over Time',
                data: [85, 90, 78],
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
        ],
    };

    return (
        <Container style={{ padding: '20px' }}>
            <Typography variant="h4">hello {user?.firstName}</Typography>
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                <Grid item xs={12} sm={4}>
                    <Paper style={{ padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6">Score Distribution</Typography>
                        <Bar data={dataBar} />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper style={{ padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6">Pass/Fail Distribution</Typography>
                        <Pie data={dataPie} />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper style={{ padding: '10px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <Typography variant="h6">Scores Over Time</Typography>
                        <Line data={dataLine} />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
