import { useState, useEffect } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Texture, StandardMaterial, Mesh } from '@babylonjs/core';
import { Button, Card } from 'react-bootstrap';

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';


function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

function ScrollToggle() {
    const [lock, setLock] = useState(false);
    const [buttonState, setButtonState] = useState({
        variant: "primary",
        text: "Scroll ON"
    })

    function toggleScroll() {
        setLock(!lock)

        if (lock === true) {
            enableScroll()
            setButtonState({
                variant: "primary",
                text: "Scroll ON"
            })
        } else {
            disableScroll()
            setButtonState({
                variant: "danger",
                text: "Scroll OFF"
            })
        }
    }

    return {
        render() {
            return (
                <div>
                    <span className='text-muted text-small text-left h6'>Click the button to disable scrolling</span>
                    <Button className='float-end' variant={buttonState.variant} onClick={toggleScroll}>{buttonState.text}</Button>
                </div>
            )
        }
    }
}

function ViewHandler() {
    const [view, setView] = useState(null)
    const scrollToggler = ScrollToggle()

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

            var ground = Mesh.CreateGroundFromHeightMap("ground", view.depthMap, 100, 100, 300, 0, 25, scene, false);

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
                        <h3 className='text-center mx-3'>3D View</h3>
                        {scrollToggler.render()}
                    </Card.Title>
                    <canvas id="babylon-canvas" width='1024px' height='768px'>
                    </canvas>
                </Card>
            )
        }
    }
}

export default ViewHandler