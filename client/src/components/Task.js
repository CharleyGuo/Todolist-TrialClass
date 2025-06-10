import {useParams} from 'react-router-dom'

export default function Task(props) {
    const {activeListId} = useParams()
    const includeListName = (activeListId === "0")

    return (
        <>
        <form className="row g-2">
            <div className="col-sm-auto">
                <input className="form-check-input" type="checkbox" checked={props.completion} onChange={() => props.handleCheck(props.id)}/>
            </div>
            <div className="col">
                <div className="row g-2">
                    <div className="col-sm-auto">
                        <p>{props.name}</p>
                    </div>
                    <div className="col-sm-auto">
                        <p>{props.priority}</p>
                    </div>
                    {
                        includeListName ? 
                            <div className="col-sm-auto">
                                <p>{props.list}</p>
                            </div>
                        :
                        <></>
                    }
                    <div className="col-sm d-flex justify-content-end">
                        <button className="btn btn-close btn-sm" type="button" value="delete" onClick={(e) => {props.handleDelete(props.id)}}></button>
                    </div>
                    <div className="col-sm-12">
                        <p>{props.description}</p>
                    </div>
                </div>
            </div>
        </form>
        </>
    )
}