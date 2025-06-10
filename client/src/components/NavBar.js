import {NavLink, Link, useParams} from 'react-router-dom';
import {useState} from 'react';

export default function NavBar(props) {
    // params and states
    const {activeListId} = useParams()
    const [newListName, setNewListName] = useState("")

    // event handlers
    const handleChange = (e) => {
        setNewListName(e.target.value)
    }
    const handleAdd = () => {
        if (newListName !== "") {
            props.handleAdd(newListName)
            setNewListName("")
        }
    }
    const handleDelete = (e) => {
        props.handleDelete(e.target.id)
    }


    // helper functions
    const nextLink = (listId, activeListId) => {
        if (listId <= activeListId) {
            if (activeListId == 0) {
                return "/"
            }
            else return "/" + listId
        }
        else return "/" + activeListId // when > activeListId, or activeListId undef
    }

    return (
        <>
        <h3 className="text-center">Lists</h3>
        <ul className="nav flex-column nav-tabs">
            {props.lists.map(list => {
                return (
                    <li className="nav-item row" key={list.id}>
                        <div className="col-sm-auto">
                            <NavLink to={"/"+list.id} key={list.id} className={
                                (list.id == activeListId) ? "nav-link active" : "nav-link"
                            }>
                                {list.name}
                            </NavLink>
                        </div>
                        <div className="col-sm d-flex justify-content-end">
                            <Link to={nextLink(list.id, activeListId)}>
                                <button className="btn btn-close btn-sm" type="submit" value="delete" onClick={handleDelete} id={list.id}></button>
                            </Link>
                        </div>
                    </li>
                )
            })}
            <li className="nav-item" key="add-list">
                <form className="row g-1">
                    <div className="col-sm-8">
                        <input type="text" className="form-control" placeholder="New List" value={newListName} onChange={handleChange}/>
                    </div>
                    <div className="col-sm d-flex justify-content-end">
                        <button className="btn btn-sm btn-primary" type="button" value="add" onClick={handleAdd}>Add</button>
                    </div>
                </form>
            </li>
        </ul>
        </>
    )
}