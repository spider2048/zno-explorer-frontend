import { useState } from 'react';
import { Card } from 'react-bootstrap';
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
                    width: 1200,
                    height: 1200
                })
            }

            return <Card className='border p-3 my-3'>
                <Card.Title>
                    <h3 className='text-center'>Predictions</h3>
                </Card.Title>
                <Gallery images={imgArr} />
            </Card>
        },
        addImages(images) {
            setGalleryState(images)
        }
    }
}

export default GalleryHandler