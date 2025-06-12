'use client';
import { useState, useEffect, useRef } from 'react';

const defaultSubjects = [
  'Gujarati', 'Hindi', 'English', 'Maths', 'Science', 'Social Science', 'Computer', 'Sanskrit', 'Sports', 'EVS', 'Dance'
];

const defaultClassRoom = [
  'Pink', 'Purple', 'Blue', 'Green', 'A', 'B', 'C', 'D'
];

export default function ClassRoutineForm() {
  const [medium, setMedium] = useState('');
  const [standard, setStandard] = useState('');
  const [date, setDate] = useState('');
  const [classRoom, setClassRoom] = useState('')
  const [day, setDay] = useState('');
  const [lectures, setLectures] = useState(
    Array(6).fill({ subject: '', classwork: '', homework: '' })
  );
  const [Notes, setNotes] = useState('')
  const [output, setOutput] = useState('');
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [newSubject, setNewSubject] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [copied, setCopied] = useState(false);

  const outputRef = useRef(null);

useEffect(() => {
  const savedSubjects = JSON.parse(localStorage.getItem('customSubjects')) || [];
  setSubjects([...defaultSubjects, ...savedSubjects]);

  // Set today's date and day automatically
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const formatted = `${yyyy}-${mm}-${dd}`;
  setDate(formatted);

  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  setDay(dayName);
}, []);


  const handleLectureChange = (index, field, value) => {
    const newLectures = [...lectures];
    newLectures[index] = { ...newLectures[index], [field]: value };
    setLectures(newLectures);
  };

const generateMessage = () => {
  const isGujarati = medium === 'gujarati';

  const dateObj = new Date(date);
  const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}-${dateObj.getFullYear()}`;

  let msg = `*STD - ${standard} ${classRoom} (${isGujarati ? 'ગુજરાતી માધ્યમ' : 'English Medium'})*\n\n`;
  msg += isGujarati
    ? `*તારીખ  :-  ${formattedDate}*\n*વાર*      :- *${day}*\n\n*🔗 Class Work 🔗* \n\n`
    : `*Date  :-  ${formattedDate}*\n*Day*      :- *${day}*\n\n*🔗 Class Work 🔗* \n\n`;

  lectures.forEach((lec, i) => {
    if (lec.subject || lec.classwork) {
      msg += isGujarati
        ? `*લેક્ચર* - ${i + 1}️⃣ *વિષય - ${lec.subject}*\n     ${lec.classwork}\n\n`
        : `*Lecture* - ${i + 1}️⃣ *Subject - ${lec.subject}*\n     ${lec.classwork}\n\n`;
    }
  });

  msg += isGujarati ? `*🔗 Home Work 🔗*\n\n` : `*🔗 Homework 🔗*\n\n`;

  lectures.forEach((lec) => {
    if (lec.homework) {
      msg += isGujarati
        ? `*વિષય - ${lec.subject}*\n    ${lec.homework}\n\n`
        : `*Subject - ${lec.subject}*\n    ${lec.homework}\n\n`;
    }
  });

  if(Notes.trim()){
    msg += isGujarati ? `*🔗 નોટસ 🔗* \n ${Notes}` : `*🔗 Notes 🔗* \n ${Notes}`
  }

  setOutput(msg.trim());

  // Auto scroll to output
  setTimeout(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
};



  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    setDate(selectedDate);
    const dayName = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'long',
    });
    setDay(dayName);
  };

  const handleAddSubject = () => {
    if (newSubject && !subjects.includes(newSubject)) {
      const updatedSubjects = [...subjects, newSubject];
      const customSubjects = updatedSubjects.filter(sub => !defaultSubjects.includes(sub));
      localStorage.setItem('customSubjects', JSON.stringify(customSubjects));
      setSubjects(updatedSubjects);
      setNewSubject('');
      setShowAddSubject(false);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Class Update Generator</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label>Medium:</label>
          <select value={medium} onChange={(e) => setMedium(e.target.value)} className="w-full p-2 border">
            <option value="">Select Medium</option>
            <option value="gujarati">Gujarati</option>
            <option value="english">English</option>
          </select>
        </div>

        <div>
          <label>Standard:</label>
          <select value={standard} onChange={(e) => setStandard(e.target.value)} className="w-full p-2 border">
            <option value="">Select Standard</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={`${i + 1}th`}>{i + 1}th</option>
            ))}
          </select>
        </div>

        <div>
          <label>Class:</label>
          <select value={classRoom} onChange={(e) => setClassRoom(e.target.value)} className="w-full p-2 border">
            <option value="">Select Classroom</option>
            {defaultClassRoom.map((classNo, i) => (
              <option key={i + 1} value={classNo}>{classNo}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Date:</label>
          <input type="date" value={date}  onChange={handleDateChange} className="w-full p-2 border" />
        </div>

        <div>
          <label>Day:</label>
          <input type="text" value={day} readOnly className="w-full p-2 border bg-gray-100 text-gray-700" />
        </div>
      </div>

      <div className="flex items-center mb-2">
        <h3 className="text-lg font-semibold">Lectures</h3>
        <button
          onClick={() => setShowAddSubject(true)}
          className="ml-4 text-sm text-blue-600 underline"
        >
          + Add Subject
        </button>
      </div>

      {showAddSubject && (
        <div className="my-2 border p-2 bg-gray-50 rounded">
          <input
            type="text"
            placeholder="Enter new subject"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="p-1 border w-2/3"
          />
          <button
            onClick={handleAddSubject}
            className="ml-2 px-2 py-1 bg-green-600 text-white rounded"
          >
            Add
          </button>
          <button
            onClick={() => setShowAddSubject(false)}
            className="ml-2 text-red-500"
          >
            Cancel
          </button>
        </div>
      )}

<div className="overflow-x-auto">
<table className="w-full border mb-4 min-w-[600px]">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Lecture</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Classwork</th>
            <th className="p-2 border">Homework</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lec, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">
                <select
                  className="w-full p-1 border"
                  value={lec.subject}
                  onChange={(e) => handleLectureChange(index, 'subject', e.target.value)}
                >
                  <option value="">Select</option>
                  {subjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                  <textarea
                    rows={2}
                    className="w-full border p-1 resize-y"
                    value={lec.classwork}
                    onChange={(e) => handleLectureChange(index, 'classwork', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <textarea
                    rows={2}
                    className="w-full border p-1 resize-y"
                    value={lec.homework}
                    onChange={(e) => handleLectureChange(index, 'homework', e.target.value)}
                  />
                </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>


<div>
      <h3 className="text-lg font-semibold">Notes</h3>
<textarea
                    rows={2}
                    className="w-full border p-1 resize-y"
                    value={Notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
</div>
      <button
        onClick={generateMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Message
      </button>

      {output && (
  <div className="mt-4">
    <h3 className="font-bold mb-2">Formatted Message:</h3>
    <button
  onClick={() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }}
  className="mt-2 bg-green-600 text-white px-4 mb-2 py-1 rounded hover:bg-green-700"
>
  {copied ? "✅ Copied!" : "📋 Copy Message"}
</button>
    <textarea
    ref={outputRef}
      rows={12}
      className="w-full p-2 border"
      value={output}
      readOnly
    />



<a
      href={`https://wa.me/?text=${encodeURIComponent(output)}`}
      target="_blank"
      rel="noopener noreferrer"
      className=" inline-block bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 mt-2"
    >
      🟢 Share on WhatsApp
    </a>

{navigator.share && (
  <button
    onClick={() => {
      navigator.share({
        title: 'Class Update',
        text: output,
      });
    }}
    className="mt-2 bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 ml-2"
  >
    📤 Share to Other
  </button>
)}



  </div>
)}

    </div>
  );
}
