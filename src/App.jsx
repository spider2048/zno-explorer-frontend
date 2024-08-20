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
    const [galleryState, setGalleryState] = useState([])
    const [alertState, setAlertState] = useState('')
    const [stats, setStats] = useState({})
    const [view, setView] = useState(null)
    const [heights, setHeights] = useState(null)
    const [widths, setWidths] = useState(null)
    const [angles, setAngles] = useState(null)

    useEffect(() => {
        if (view == null) {
            return
        }

        const canvas = document.getElementById('babylon-canvas');
        const engine = new Engine(canvas, true);

        const createScene = async () => {
            const scene = new Scene(engine);

            const camera = new ArcRotateCamera("Camera", 0, 0.8, 100, new Vector3(0, 10, 0), scene);
            camera.attachControl(canvas, true);

            const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene);

            const depthMapTexture = new Texture(view['depth_map'], scene);
            const sourceImageTexture = new Texture(view['original'], scene);

            var ground = Mesh.CreateGroundFromHeightMap("ground", view['depth_map'], 100, 100, 300, 0, 50, scene, false);

            var material = new StandardMaterial("material", scene);
            material.diffuseTexture = sourceImageTexture;

            ground.material = material;
            await scene.whenReadyAsync();
            engine.runRenderLoop(() => {
                if (scene) {
                    scene.render();
                }
            });
        };

        createScene();

        return () => {
            engine.dispose();
        };

        console.log("Running 3d View")
    }, [view]);

    function displayStats() {
        if (Object.keys(stats).length == 0 && heights == null) {
            return <></>
        }
        
        return (
            <Card className='mx-auto p-3 m-3'>
                <h3 className='text-center'>Statistics</h3>
                <Table striped bordered hover className='w-75 mx-auto'>
                    <tbody>
                        {Object.keys(stats).map((key, index) => (
                            <tr key={index}>
                                <td>{key}</td>
                                <td>{stats[key]}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                
                <div className="w-75 mx-auto">
                <Plot
                    data={[
                        {
                            x: heights,
                            type: 'histogram',
                            xbins: {
                                size: 50,
                            },
                        },
                    ]}
                    layout={{
                        title: 'Histogram of rod heights (in nanometers)',
                        xaxis: { title: 'Heights (nm)' },
                        yaxis: { title: 'Count' },
                    }}
                />
                </div>

                <div className="w-75 mx-auto">
                <Plot
                    data={[
                        {
                            x: widths,
                            type: 'histogram',
                            xbins: {
                                size: 50,
                            },
                        },
                    ]}
                    layout={{
                        title: 'Histogram of rod widths (in nanometers)',
                        xaxis: { title: 'Widths (nm)' },
                        yaxis: { title: 'Count' },
                    }}
                />
                </div>

                <div className="w-75 mx-auto">
                <Plot
                    data={[
                        {
                            x: angles,
                            type: 'histogram',
                            xbins: {
                                size: 1,
                            },
                        },
                    ]}
                    layout={{
                        title: 'Histogram of rod angles (0: close to plane, 90: along the axis)',
                        xaxis: { title: 'Angle' },
                        yaxis: { title: 'Count' },
                    }}
                />
                </div>
            </Card>
        );
    }

    function displayAlert() {
        if (!alertState) {
            return <></>
        } else {
            return <Alert className='alert alert-danger'>{alertState}</Alert>
        }
    }

    function displayImages() {
        if (galleryState === undefined || galleryState.length === 0)
            return <></>

        const imgArr = []
        for (let i = 0; i < galleryState.length; i++) {
            imgArr.push({
                src: galleryState[i],
                width: 800,
                height: 800
            })
        }

        return <Card className='border p-3 my-3'>
            <Card.Title>
                <h3 className='text-center'>Predictions</h3>
            </Card.Title>
            <Gallery images={imgArr} />
        </Card>
    }

    function ImageSubmit() {
        const [selectedFile, setSelectedFile] = useState(null);
        const [uploadState, setUploadState] = useState('Submit')
        const [uploadBtnCls, setUploadBtnCls] = useState('primary')

        const handleFileChange = (event) => {
            setSelectedFile(event.target.files[0]);
        };

        const handleSubmit = async (event) => {
            event.preventDefault();
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image_file', selectedFile);

                try {
                    console.log("Setting state - uploading")
                    setUploadState('Uploading')
                    setUploadBtnCls('alert-disabled')
                    const response = await axios.post(BACKEND, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    
                    const data = response.data
                    console.log(data)

                    const images = data['predicted_images']
                    setHeights(data['heights'])
                    setWidths(data['widths'])
                    setAngles(data['angles'])
                    setGalleryState(images)

                    setStats({
                        'Detections': data['detections'],
                        'Total Images': images.length,
                        'Average Rod Length (nm)': data['avg_length'],
                        'Average Rod Width (nm)': data['avg_width'],
                    })

                    setView({
                        depth_map: data['depth_map'],
                        original: data['original']
                    })

                    setUploadState('Submit')
                    setUploadBtnCls('primary')
                } catch (error) {
                    console.error('Error uploading file', error);
                    setAlertState(error.toString())
                }
            } else {
                console.log('No file selected');
            }
        };

        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={6}>
                        <Form onSubmit={handleSubmit} className='btn-toolbar'>
                            <Form.Group controlId="formFile" className="w-100">
                                <Form.Label className='text-center text-muted'>Upload uncropped SEM Image</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                                <Button variant={uploadBtnCls} type={uploadState} className='m-2 mx-auto w-100'>
                                    {uploadState}
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }

    const renderCanvas = () => {
        if (view == null) {
            return <></>
        }

        return (
            <Card className='border p-3 my-3'>
                <Card.Title>
                    <h3 className='text-center'>3D View</h3>
                </Card.Title>
                <canvas id="babylon-canvas" width='1024px' height='768px'>

                </canvas>
            </Card>)
    }

    return (
        <>
            <Container className='m-5 mx-auto w-100'>
                {displayAlert()}
                <h1 className='text-center'>
                    ZnO Nanostructure Explorer
                </h1>

                {ImageSubmit()}
                {displayStats()}
                {displayImages()}
                {renderCanvas()}

            </Container>
        </>
    )
}

export default App
