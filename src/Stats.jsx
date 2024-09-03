import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Card, Table } from 'react-bootstrap';

function StatsHandler() {
    const [HWA, setHWA] = useState({});
    const [kv, setKV] = useState({});
    const SIZE = 50;

    function renderTable() {
        return <Table striped bordered hover className='w-75 mx-auto'>
            <tbody>
                {Object.keys(kv).map((key, index) => (
                    <tr key={index}>
                        <td>{key}</td>
                        <td>{kv[key]}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    }

    function plotHeights() {
        return <div className="w-75 mx-auto">
            <Plot
                data={[
                    {
                        x: HWA.heights,
                        type: 'histogram',
                        xbins: {
                            size: SIZE,
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
    }

    function plotWidths() {
        return <div className="w-75 mx-auto">
            <Plot
                data={[
                    {
                        x: HWA.widths,
                        type: 'histogram',
                        xbins: {
                            size: SIZE,
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
    }

    function plotAngles() {
        return <div className="w-75 mx-auto">
            <Plot
                data={[
                    {
                        x: HWA.angles,
                        type: 'histogram',
                        xbins: {
                            size: SIZE,
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
    }

    return {
        setHWA: setHWA,
        set: setKV,
        render() {
            if (Object.keys(HWA).length == 0 && HWA.heights == undefined) {
                return <></>
            }

            return (
                <Card className='mx-auto p-3 m-3'>
                    <h3 className='text-center'>Statistics</h3>
                    {renderTable()}
                    {plotHeights()}
                    {plotWidths()}
                    {plotAngles()}
                </Card>
            );
        },
    }
}

export default StatsHandler