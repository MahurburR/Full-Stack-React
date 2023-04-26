import { useEffect, useState } from 'react'
import Form from './Form';
import Table from './Table';
import axios from 'axios';

const LinkContainer = (props) => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState('')
  const [links , setLink] = useState('')

  const handleRemove = (index,id) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    deleteurl(id)
  }

  const handleSubmit = () => {
    if(name == '' && links == ''){
      alert('Please Fill All Fields')
    }
    if(name != '' && links != ''){
      const obj = {name:name , url:links}
      createurl(obj)
      setTasks([...tasks, obj]);
      setName('')
      setLink('')
    }
  }


const API_URL = 'http://localhost:8000'; // Replace with your API server URL

useEffect(()=>{
  getAllurls()
},[])
// Get all urls
 const getAllurls = async () => {
  try {
    const response = await axios.get(`${API_URL}/links`);
    console.log(response.data)
    if(response?.data?.length)
    setTasks([...response?.data])
  } catch (error) {
    console.error('Error fetching urls:', error);
    throw error;
  }
};

// Create a new url
 const createurl = async (urlData) => {
  try {
    const response = await axios.post(`${API_URL}/links`, urlData);
    return response.data;
  } catch (error) {
    console.error('Error creating url:', error);
    throw error;
  }
};

// Delete an url by ID
 const deleteurl = async (id) => {
  try {
    await axios.delete(`${API_URL}/links/${id}`);
    console.log(`url with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting url with ID ${id}:`, error);
    throw error;
  }
};

// Update an url by ID
 const updateurl = async (id, updatedurlData) => {
  try {
    const response = await axios.put(`${API_URL}/links/${id}`, updatedurlData);
    return response.data;
  } catch (error) {
    console.error(`Error updating url with ID ${id}:`, error);
    throw error;
  }
};


  return (
    <div className="container" style={{display:'block'}}>
      <h1 style={{marginLeft:'210px'}}>My Favorite Links</h1>
      <p style={{marginLeft:'210px'}}>Add a new url with a name and link to the table.</p>
          <Table removeLink={handleRemove} linkData={tasks}/>
      <br />
      <h3 style={{marginLeft:'210px'}}>Add New</h3>    
        <Form handleSubmit={handleSubmit} setName={setName} name={name} links={links} setLink={setLink}/>
    </div>
  )
}

export default LinkContainer
