import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Card, Alert} from 'react-bootstrap';
import { useState } from 'react'
import axios from 'axios';
import GalleryHandler from './GalleryState';
import StatsHandler from './Stats';
import ViewHandler from './3d';

const BACKEND = `https://touched-separately-goat.ngrok-free.app/upload`;
// const BACKEND = `http://localhost:8010/upload`

function App() {
    const galleryHandler = GalleryHandler();
    const statsHandler = StatsHandler();
    const viewHandler = ViewHandler()
    const [alertState, setAlertState] = useState('')
    
    function displayAlert() {
        if (!alertState) {
            return <></>
        } else {
            return <Alert className='alert alert-danger'>{alertState}</Alert>
        }
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
            if (!selectedFile) {
                console.log('No file selected');
                return;
            }

            const formData = new FormData();
            formData.append('image_file', selectedFile);

            try {
                setUploadState('Uploading')
                setUploadBtnCls('alert-disabled')
                const response = await axios.post(BACKEND, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                
                const data = response.data
                const images = data.predicted_images
                statsHandler.setHWA({
                    heights: data.heights,
                    widths: data.widths,
                    angles: data.angles
                });

                galleryHandler.addImages(images)

                statsHandler.set({
                    'Detections': data.detections,
                    'Total Images': images.length,
                    'Average Rod Length (nm)': data.avg_length,
                    'Average Rod Width (nm)': data.avg_width,
                })

                viewHandler.set(data.depth_map, data.original)

                setUploadState('Submit')
                setUploadBtnCls('primary')
            } catch (error) {
                console.error('Error uploading file', error);
                setAlertState(error.toString())
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

    return (
        <>
            <Container className='m-5 mx-auto w-100'>
                {displayAlert()}
                <h1 className='text-center'>
                    ZnO Nanostructure Explorer
                </h1>

                {ImageSubmit()}
                {statsHandler.render()}
                {galleryHandler.render()}
                {viewHandler.render()}

            </Container>
        </>
    )
}

export default App
