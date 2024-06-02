import React, { useState, useEffect } from 'react';
import './Crud.css'

const Crud = () => {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [single, setSingle] = useState("");
  const [editId, setEditId] = useState("");
  const [mdelete, setMdelete] = useState([]);
  const [mstatus, setMstatus] = useState([]);

  const getRecord = () => {
    let data = JSON.parse(localStorage.getItem('users'));
    return data ? data : [];
  }

  const [record, setRecord] = useState(getRecord());

  const handleSubmit = (e) => {
    e.preventDefault();
    let obj = {
      id: Date.now(), name, phone, status: "Deactive"
    }

    if (editId) {
      let updateuser = record.map((val) => {
        if (val.id === editId) {
          val.name = name;
          val.phone = phone;
        }
        return val;
      });
      localStorage.setItem('users', JSON.stringify(updateuser));
      setRecord(updateuser);
      setEditId("");
      alert("Update");
    } else {
      let old = [...record, obj];
      localStorage.setItem('users', JSON.stringify(old));
      alert("Add");
      setRecord(old);
    }

    setName("");
    setPhone("");
  }

  const deleteUser = (id) => {
    let d = record.filter(val => val.id !== id);
    localStorage.setItem("users", JSON.stringify(d));
    setRecord(d);
    alert("Delete");
  }

  const editUser = (id) => {
    let s = record.find(val => val.id === id);
    setSingle(s);
    setEditId(id);
  }

  useEffect(() => {
    setName(single.name);
    setPhone(single.phone);
  }, [single]);

  const handleMultipleDeleteChange = (id, checked) => {
    let all = [...mdelete];
    if (checked) {
      all.push(id);
    } else {
      all = all.filter(val => val !== id);
    }
    setMdelete(all);
  }

  const handleMultipleDelete = () => {
    if (mdelete.length === 0) {
      alert("At least one row must be selected");
      return false;
    }

    let deleteAll = record.filter(val => !mdelete.includes(val.id));
    localStorage.setItem('users', JSON.stringify(deleteAll));
    setRecord(deleteAll);
    alert("Record Deleted");
  }

  const changeMultipleStatus = (id, checked) => {
    let all = [...mstatus];
    if (checked) {
      all.push(id);
    } else {
      all = all.filter(val => val !== id);
    }
    setMstatus(all);
  }

  const handleMultipleStatus = () => {
    if (mstatus.length === 0) {
      alert("At least one row must be selected");
      return false;
    }

    let up = record.map((val) => {
      if (mstatus.includes(val.id)) {
        val.status = val.status === "Active" ? "Deactive" : "Active";
      }
      return val;
    });
    localStorage.setItem("users", JSON.stringify(up));
    alert("Status changed");
    setRecord(up);
    setMstatus([]);
  }

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Name : </label>
                <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter Name" className="form-control" />
              </div>
              <br />
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Phone : </label>
                <input type="text" onChange={(e) => setPhone(e.target.value)} value={phone} placeholder="Enter Phone" className="form-control" />
              </div>
              <br />
              <button type="submit" className="btn btn-primary">{editId ? 'Edit' : 'Submit'}</button>
            </form>
          </div>
          <div className="container">
            <div>
              <table className="table table-striped" align='center'>
                <thead className='thead-dark'>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th>
                      <button onClick={handleMultipleDelete} className='btn btn-danger btn-sm'>Delete</button>
                    </th>
                    <th>
                      <button onClick={handleMultipleStatus} className='btn btn-info btn-sm'>Status</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    record.map((val) => {
                      const { id, name, phone, status } = val;
                      return (
                        <tr key={id}>
                          <td>{id}</td>
                          <td>{name}</td>
                          <td>{phone}</td>
                          <td>
                            <button onClick={() => changeMultipleStatus(id, status === 'Active' ? false : true)} className={`btn ${status === 'Active' ? 'btn-success' : 'btn-warning'} btn-sm`}>{status}</button>
                          </td>
                          <td>
                            <button onClick={() => deleteUser(id)} className='btn btn-danger btn-sm mx-2'>Delete</button>
                            <button onClick={() => editUser(id)} className='btn btn-primary btn-sm'>Edit</button>
                          </td>
                          <td>
                            <input type='checkbox' onChange={(e) => handleMultipleDeleteChange(id, e.target.checked)} />
                          </td>
                          <td>
                            <input type='checkbox' checked={mstatus.includes(val.id)} onChange={(e) => changeMultipleStatus(id, e.target.checked)} />
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Crud;
