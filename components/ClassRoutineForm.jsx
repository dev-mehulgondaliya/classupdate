'use client';
import { useState, useEffect, useRef } from 'react';

const defaultSubjects = [
  'Gujarati', 'Hindi', 'English', 'Maths', 'Science', 'Social Science', 'Computer', 'Sanskrit'
];

export default function ClassRoutineForm() {
  const [medium, setMedium] = useState('');
  const [standard, setStandard] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [lectures, setLectures] = useState(
    Array(6).fill({ subject: '', classwork: '', homework: '' })
  );
  const [output, setOutput] = useState('');
  const [subjects, setSubjects] = useState(defaultSubjects);
  const [newSubject, setNewSubject] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [copied, setCopied] = useState(false);

  const outputRef = useRef(null);

  useEffect(() => {
    const savedSubjects = JSON.parse(localStorage.getItem('customSubjects')) || [];
    setSubjects([...defaultSubjects, ...savedSubjects]);
  }, []);

  const handleLectureChange = (index, field, value) => {
    const newLectures = [...lectures];
    newLectures[index] = { ...newLectures[index], [field]: value };
    setLectures(newLectures);
  };

const generateMessage = () => {
  const isGujarati = medium === 'gujarati';

  let msg = `*STD - ${standard} (${isGujarati ? 'ગુજરાતી માધ્યમ' : 'English Medium'})*\n\n`;
  msg += isGujarati
    ? `*તારીખ  :-  ${date}*\n*વાર*      :- *${day}*\n\n*🔗 Class Work 🔗* \n\n`
    : `*Date  :-  ${date}*\n*Day*      :- *${day}*\n\n*🔗 Class Work 🔗* \n\n`;

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

  setOutput(msg.trim());

  // Auto scroll to output (if using ref)
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
          <label>Date:</label>
          <input type="date" value={date} onChange={handleDateChange} className="w-full p-2 border" />
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
      <button
        onClick={generateMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Generate Message
      </button>

      {output && (
  <div className="mt-4">
    <h3 className="font-bold mb-2">Formatted Message:</h3>
    <textarea
    ref={outputRef}
      rows={12}
      className="w-full p-2 border"
      value={output}
      readOnly
    />

<button
  onClick={() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }}
  className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
>
  {copied ? "✅ Copied!" : "📋 Copy Message"}
</button>

  </div>
)}

    </div>
  );
}
