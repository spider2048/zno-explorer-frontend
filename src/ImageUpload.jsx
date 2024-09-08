import { useState } from "react";
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
const BACKEND = `http://localhost:8000/upload`

function ImageHandler(statsHandler, galleryHandler, viewHandler) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [tableData, setTableData] = useState(null)
    const [buttonState, setButtonState] = useState({
        text: "Submit",
        class: "primary"
    })
    const [alertState, setAlertState] = useState(null)

    const [brightness, setBrightness] = useState(125)
    const [contrast, setContrast] = useState(250)

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    function parseFloat_(text) {
        try {
            return parseFloat(text)
        } catch {
            setAlertState("Invalid floating point: " + text)
            return NaN
        }
    }

    function getConversion() {
        const scale = parseFloat_(document.getElementById("conversion-scale").value) || 1;
        const unit = document.getElementById("conversion-unit").value
        return scale, unit
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('image_file', selectedFile);
        formData.append('brightness', brightness / 100)
        formData.append('contrast', contrast / 100)
        const [scale, unit] = getConversion()
        formData.append('scale', scale)
        formData.append('unit', unit)

        try {
            setButtonState({
                text: "Uploading",
                class: "alert-disabled"
            })

            const response = await axios.post(BACKEND, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            console.log(response)

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

            setButtonState({
                text: "Submit",
                class: "primary"
            })
            
            setTableData(data.table)
        } catch (error) {
            console.error('Error uploading file', error);
            setAlertState(error.toString())
        }
    };

    function downloadTable() {
        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element);
        }

        if (!tableData) {
            return <></>
        }

        return (
            <Button className="btn btn-success w-100" onClick={() => download(selectedFile.name + ".csv", tableData)}>Download</Button>
        )
    }

    const render = () => {
        return (
            <Container>
                <Row className="justify-content-md-center border py-3">
                    <Col md={6}>
                        <Form onSubmit={handleSubmit} className='btn-toolbar'>
                            <Form.Group controlId="formFile" className="w-100">
                                <Form.Label className='text-center text-muted'>Upload uncropped SEM Image</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                                <Form.Label className='text-center text-muted'>Image Enhancement (Optional)</Form.Label>

                                <div>
                                    <span className="text-muted">Brightness {brightness} %</span>
                                    <Form.Range value={brightness} min={50} max={150} step={1} onChange={(ev) => setBrightness(ev.target.value)}></Form.Range>
                                </div>

                                <div className>
                                    <span className="text-muted">Contrast {contrast}%</span>
                                    <Form.Range value={contrast} min={50} max={400} step={10} onChange={(ev) => setContrast(ev.target.value)} disabled={false}></Form.Range>
                                </div>

                                <div className="d-flex">
                                    <Form.Label className="text-muted">Pixel to unit conversion</Form.Label>
                                    <Form.Control type="text" id='conversion-scale' placeholder="Conversion Scale (2.13)" className="my-1 w-50 mx-1"></Form.Control>
                                    <select className="form-select my-1 w-50 mx-1" id="conversion-unit">
                                        <option defaultValue={"nm"}>Nanometre (nm)</option>
                                        <option value="um">Micrometre (um)</option>
                                        <option value="mm">Millimetre (mm)</option>
                                        <option value="cm">Centimetre (cm)</option>
                                    </select>
                                </div>
                                <Button variant={buttonState.class} type={buttonState.class} className='m-2 mx-auto w-100'>
                                    {buttonState.text}
                                </Button>

                            </Form.Group>
                        </Form>
                        {downloadTable()}
                    </Col>
                </Row>
            </Container>
        )
    }

    return {
        render: render,
        displayAlert() {
            if (!alertState) {
                return <></>
            } else {
                return <Alert className='alert alert-danger'>{alertState}</Alert>
            }
        }
    }
}

export default ImageHandler