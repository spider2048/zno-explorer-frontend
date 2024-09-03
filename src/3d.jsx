import { useState, useEffect } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Texture, StandardMaterial, Mesh } from '@babylonjs/core';
import { Card } from 'react-bootstrap';

function ViewHandler() {
    const [view, setView] = useState(null)

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
            const sourceImageTexture = new Texture(view.original, scene);

            var ground = Mesh.CreateGroundFromHeightMap("ground", view.depthMap, 100, 100, 300, 0, 50, scene, false);

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
    }, [view]);

    return {
        set(depthMap, original) {
            setView({
                depthMap: depthMap,
                original: original
            })
        },
        render() {
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
                </Card>
            )
        }
    }
}

export default ViewHandler