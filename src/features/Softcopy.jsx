import React, { useContext, useState } from 'react';
import ImgText from './ImgText';
import FileText from './FileText';
import { VariablesProvider, Variables } from '../components/variables';
import ExtractedText from './ExtractedText';
function Softcopy(){
  const [textdata, setTextdata] = useState('');
  const [submittedText, setSubmittedText] = useState(''); 
  const [image, setImage] = useState([]);
  const [docs, setDocs] = useState('');

  const handleSubmit = () => {
    setSubmittedText(textdata); 
    setTextdata('');            
    setImage([]);
    setDocs('');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) =>
      file instanceof Blob || file instanceof File ? URL.createObjectURL(file) : null
    ).filter((url) => url !== null);

    setImage(previewUrls);
    setDocs('');
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocs(file);
      setImage([]);
    } else {
      console.error('No file selected or file is invalid.');
    }
  };

    return(
        <VariablesProvider>
        <div>
        <div className="top-16 max-h-96 mx-11 container ">
          {/* Text Input Box */}
          <div className="flex items-center justify-start my-16">
            <input
              className="bg-black font-bold text-white px-3 py-3 rounded-md  w-screen max-w-screen-md h-20"
              type="text"
              placeholder="enter the text"
              value={textdata}
              onChange={(e) => setTextdata(e.target.value)}
            />
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-md h-20 hover:bg-blue-200 transition duration-300 md:py-3 md:px-6 lg:py-4 lg:px-8"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>

          {/* Image and Document Reader Box */}
          <div className="flex flex-row items-center justify-start gap-10">
            {/* Image Upload Section */}
            <div className="bg-red-300 rounded-xl px-3 py-3 flex flex-col items-center">
              <label htmlFor="image-upload" className="mb-2 font-bold text-center">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mb-4"
                id="image-upload"
              />
              <div className="flex flex-wrap gap-4 mt-4">
                {image.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-red-300 rounded-xl px-3 py-3 flex flex-col items-center">
              <label htmlFor="doc-upload" className="mb-2 font-bold text-center">Upload Document</label>
              <input
                type="file"
                accept=".pdf, .doc, .docx"
                onChange={handleDocumentUpload}
                className="mb-4"
                id="doc-upload"
              />
            </div>
          </div>
        </div>

        {/* Extracted text and Rendering feature components */}
      <div className='flex justify-start bg-transparent mx-5'>
      <div>
        {image.length > 0 && <ImgText image={image} />}
      </div>
      <div>
        {docs && <FileText file={docs} />}
      </div>
      <div>
        {/* Render ExtractedText only when submittedText has a value */}
        {submittedText && <ExtractedText extText={submittedText} />}
      </div>
      </div>
        </div>
        </VariablesProvider>

    )
}
export default Softcopy