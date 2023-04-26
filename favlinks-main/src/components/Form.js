import React, { Component } from "react";

class Form extends Component {
  render() {
    const { handleSubmit, setName, name, url, setLink } = this.props;
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        <div style={{ marginLeft: '210px' }}>
          <div style={{marginBottom:'12px' ,}}>
          <div style={{ fontSize: '16px' , fontWeight:500, marginBottom:'6px' }}> Name </div>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="name"
              name="task"
              style={{ width: '80%', padding: '10px',borderRadius:'3px' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '16px' , fontWeight:500 , marginBottom:'6px'}}> URL </div>
            <input
              value={url}
              onChange={(event) => setLink(event.target.value)}
              type="link"
              name="link"
              style={{ width: '80%', padding: '10px',borderRadius:'3px' }}
            />
          </div>
          <div style={{ width: '40px', height: '50px', marginTop: '6px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#318CE7',
                color: 'white',
                border: 'none',
                fontSize: '14px',
                fontWeight:'bold',
                width: '75px',
                height: '35px',
                cursor:'pointer',
                borderRadius:'3px'
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default Form;