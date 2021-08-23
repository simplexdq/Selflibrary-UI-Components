import React, { useState, useEffect } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const postData = {
    title: 'my title',
    body: 'hello'
  }
  useEffect(() => {
    axios.post('https://jsonplaceholder.typicode.com/posts', postData)
      .then(res => {
        console.log(res)
        setTitle(res.data.title)
      })
  })
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const uploadedFile = files[0];
      const formData = new FormData();//方便的适时以js的形式创建html form数据
      formData.append(uploadedFile.name, uploadedFile);
      axios.post("https://jsonplaceholder.typicode.com/posts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => [
        console.log(res)
      ])
    }
  }
  return (
    <div className="App" style={{ marginTop: '100px', marginLeft: '100px' }}>
      <input type="file" name="myFile" onChange={handleFileChange} />
    </div>
  )
}

export default App;