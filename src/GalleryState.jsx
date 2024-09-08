import { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Gallery } from 'react-grid-gallery';

function GalleryHandler() {
    const [galleryState, setGalleryState] = useState([])

    return {
        render() {
            if (galleryState === undefined || galleryState.length === 0)
                return <></>

            const imgArr = []
            for (let i = 0; i < galleryState.length; i++) {
                imgArr.push({
                    src: galleryState[i],
                    width: 2000,
                    height: 2000
                })
            }

            return <Card className='border p-3 my-3'>
                <Card.Title>
                    <h3 className='text-center'>Predictions</h3>
                    <h6 className='text-muted text-center'>Click on any image to view in full screen</h6>
                </Card.Title>
                <Gallery images={imgArr} enableImageSelection={false} onClick={ev => window.open(imgArr[ev].src)} />
            </Card>
        },
        addImages(images) {
            setGalleryState(images)
        }
    }
}

export default GalleryHandler