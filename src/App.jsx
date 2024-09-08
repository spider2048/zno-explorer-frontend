import 'bootstrap/dist/css/bootstrap.min.css';
import GalleryHandler from './GalleryState';
import StatsHandler from './Stats';
import ViewHandler from './3d';
import ImageHandler from './ImageUpload';
import { Container } from 'react-bootstrap';

// const BACKEND = `https://touched-separately-goat.ngrok-free.app/upload`;
const BACKEND = `http://localhost:8000/upload`

function App() {
    const galleryHandler = GalleryHandler();
    const statsHandler = StatsHandler();
    const viewHandler = ViewHandler()
    const imageHandler = ImageHandler(statsHandler, galleryHandler, viewHandler)

    return (
        <>
            <Container className='m-5 mx-auto w-100'>
                {imageHandler.displayAlert()}
                <h1 className='text-center'>
                    ZnO Nanostructure Explorer
                </h1>

                {imageHandler.render()}
                {galleryHandler.render()}
                {statsHandler.render()}
                {viewHandler.render()}

            </Container>
        </>
    )
}

export default App
