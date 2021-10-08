import React, {useEffect, useState} from 'react';

const API_HOST = "http://localhost:3000";
const INVENTORY_API_URL = `${API_HOST}/inventory`;

function App() {
    const [data, setData] = useState([]);

    const fetchInventory = () => {
        fetch(`${INVENTORY_API_URL}`)
            .then(res => res.json())
            .then(json => setData(json));
    }

    useEffect(() => {
        fetchInventory();
    }, []);


    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowKey: null
    });

    const [unitPrice, setUnitPrice] = useState(null);

    /**
     *
     * 
     */
    const onEdit = ({id, currentUnitPrice}) => {
        setInEditMode({
            status: true,
            rowKey: id
        })
        setUnitPrice(currentUnitPrice);
    }

    /**
     *
     * @param id
     * @param newUnitPrice
     */
    const updateInventory = ({id, newUnitPrice}) => {
        fetch(`${INVENTORY_API_URL}/${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                unit_price: newUnitPrice
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                // reset inEditMode and unit price state values
                onCancel();

                // fetch the updated data
                fetchInventory();
            })
    }

    /**
     *
     * @param id -The id of the product
     * @param newUnitPrice - The new unit price of the product
     */
    const onSave = ({id, newUnitPrice}) => {
        updateInventory({id, newUnitPrice});
    }

    const onCancel = () => {
        // reset the inEditMode state value
        setInEditMode({
            status: false,
            rowKey: null
        })
        // reset the unit price state value
        setUnitPrice(null);
    }

    return (
        <div className="container">
            <h1>GET AND UPDATE</h1>
            <table border="1">
                <thead>
                <tr>
                    <th>Name </th>
                    <th>ID </th>
                    <th> Subject</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td>{item.product_category}</td>
                            <td>
                                {
                                    inEditMode.status && inEditMode.rowKey === item.id ? (
                                        <input value={unitPrice}
                                               onChange={(event) => setUnitPrice(event.target.value)}
                                        />
                                    ) : (
                                        item.unit_price
                                    )
                                }
                            </td>
                            <td>
                                {
                                    inEditMode.status && inEditMode.rowKey === item.id ? (
                                        <React.Fragment>
                                            <button
                                                className={"btn-success"}
                                                onClick={() => onSave({id: item.id, newUnitPrice: unitPrice})}
                                            >
                                                Save
                                            </button>

                                            <button
                                                className={"btn-secondary"}
                                                style={{marginLeft: 8}}
                                                onClick={() => onCancel()}
                                            >
                                                Cancel
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <button
                                            className={"btn-primary"}
                                            onClick={() => onEdit({id: item.id, currentUnitPrice: item.unit_price})}
                                        >
                                            Edit
                                        </button>
                                    )
                                }
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
        </div>
    );
}

export default App;