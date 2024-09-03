import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Card, Alert, Table } from 'react-bootstrap';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, Texture, StandardMaterial, Mesh, Material } from '@babylonjs/core';
import { useState, useEffect } from 'react'
import axios from 'axios';
import { Gallery } from 'react-grid-gallery';
import React from 'react';
import Plot from 'react-plotly.js';

const BACKEND = `https://touched-separately-goat.ngrok-free.app/upload`;

function App() {
    
}

export default App